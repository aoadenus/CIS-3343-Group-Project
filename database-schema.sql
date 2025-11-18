-- Emily Bakes Cakes Supabase Schema
-- Generated for CIS 3343 project - Phase 1 backend deliverable

BEGIN;

-- Extensions ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supporting sequence for friendly order numbers ---------------------------
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Utility Functions -------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_seq BIGINT;
    year_part TEXT := to_char(CURRENT_DATE, 'YYYY');
BEGIN
    SELECT nextval('order_number_seq') INTO next_seq;
    RETURN format('ORD-%s-%04d', year_part, next_seq);
END;
$$;

CREATE OR REPLACE FUNCTION calculate_balance_due(total_amount NUMERIC, deposit_amount NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN GREATEST(COALESCE(total_amount, 0) - COALESCE(deposit_amount, 0), 0);
END;
$$;

CREATE OR REPLACE FUNCTION set_timestamp_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION orders_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') AND (NEW.order_number IS NULL OR btrim(NEW.order_number) = '') THEN
        NEW.order_number = generate_order_number();
    END IF;

    IF NEW.deposit_amount IS NULL THEN
        RAISE EXCEPTION 'deposit_amount must be provided';
    END IF;

    IF NEW.total_amount IS NULL THEN
        RAISE EXCEPTION 'total_amount must be provided';
    END IF;

    IF NEW.deposit_amount > NEW.total_amount THEN
        RAISE EXCEPTION 'deposit_amount (%) cannot exceed total_amount (%)', NEW.deposit_amount, NEW.total_amount;
    END IF;

    NEW.balance_due = calculate_balance_due(NEW.total_amount, NEW.deposit_amount);

    RETURN NEW;
END;
$$;

-- Tables ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'accountant', 'sales', 'baker', 'decorator')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    customer_type TEXT CHECK (customer_type IN ('retail', 'corporate')),
    is_preferred BOOLEAN DEFAULT FALSE,
    allergies TEXT,
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    product_id UUID REFERENCES products(id),
    size TEXT NOT NULL,
    layers JSONB,
    icing_flavor TEXT,
    icing_color TEXT,
    writing_text TEXT,
    writing_color TEXT,
    decorations TEXT[],
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    balance_due DECIMAL(10,2),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    priority TEXT DEFAULT 'standard' CHECK (priority IN ('standard', 'rush')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_prep', 'in_decoration', 'ready', 'completed', 'picked_up', 'cancelled')),
    special_instructions TEXT,
    assigned_baker_id UUID REFERENCES staff_users(id),
    assigned_decorator_id UUID REFERENCES staff_users(id),
    created_by UUID REFERENCES staff_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card')),
    payment_type TEXT CHECK (payment_type IN ('deposit', 'balance')),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    received_by UUID REFERENCES staff_users(id)
);

-- Indexes -----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_preference ON customers(is_preferred);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_date ON orders(pickup_date);
CREATE INDEX IF NOT EXISTS idx_orders_priority ON orders(priority);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_baker ON orders(assigned_baker_id);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_decorator ON orders(assigned_decorator_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_received_by ON payments(received_by);

-- Triggers ----------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_orders_before_write ON orders;
CREATE TRIGGER trg_orders_before_write
BEFORE INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION orders_before_write();

-- Sample Data -------------------------------------------------------------
INSERT INTO staff_users (id, email, password_hash, full_name, role)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'emily@emilybakescakes.com', '$2b$10$ownerhashownerhashownerhashown', 'Emily Baker', 'owner'),
    ('22222222-2222-2222-2222-222222222222', 'noah@emilybakescakes.com', '$2b$10$managerhashmanagerhashmanagerha', 'Noah Collins', 'manager')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, full_name, email, phone, address, customer_type, is_preferred, allergies, special_notes)
VALUES
    ('aaaa1111-0000-0000-0000-000000000001', 'Lena Marsh', 'lena.marsh@example.com', '610-555-1020', '142 Pine St, Philadelphia, PA', 'retail', TRUE, 'Almonds', 'Loves floral piping'),
    ('aaaa1111-0000-0000-0000-000000000002', 'Carver Agency', 'events@carveragency.com', '215-555-8820', '48 Market St, Philadelphia, PA', 'corporate', TRUE, NULL, 'Monthly corporate orders'),
    ('aaaa1111-0000-0000-0000-000000000003', 'Jamal Stone', 'jamal.stone@example.com', '484-555-3188', '87 Willow Ave, Ardmore, PA', 'retail', FALSE, 'Peanuts', 'Prefers low-sugar frosting'),
    ('aaaa1111-0000-0000-0000-000000000004', 'Maya & Co', 'orders@mayaandco.com', '267-555-7712', '233 Chestnut St, Philadelphia, PA', 'corporate', FALSE, NULL, 'Needs invoices with PO numbers'),
    ('aaaa1111-0000-0000-0000-000000000005', 'Olivia Chen', 'olivia.chen@example.com', '856-555-4401', '19 Brook Ln, Cherry Hill, NJ', 'retail', TRUE, 'Strawberries', 'Frequent celebration cakes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, description, base_price, image_path)
VALUES
    ('bbbb2222-0000-0000-0000-000000000001', 'Classic Vanilla Bean', 'Madagascar vanilla sponge with vanilla buttercream', 45.00, '/images/products/vanilla-bean.jpg'),
    ('bbbb2222-0000-0000-0000-000000000002', 'Chocolate Truffle', 'Triple chocolate layers with ganache filling', 48.00, '/images/products/choc-truffle.jpg'),
    ('bbbb2222-0000-0000-0000-000000000003', 'Salted Caramel Crunch', 'Caramel buttercream with praline crunch', 52.00, '/images/products/caramel-crunch.jpg'),
    ('bbbb2222-0000-0000-0000-000000000004', 'Lemon Elderflower', 'Citrus sponge with elderflower syrup', 50.00, '/images/products/lemon-elderflower.jpg'),
    ('bbbb2222-0000-0000-0000-000000000005', 'Strawberries & Cream', 'Vanilla cake layered with macerated berries', 47.00, '/images/products/strawberries-cream.jpg'),
    ('bbbb2222-0000-0000-0000-000000000006', 'Cookies & Cream Dream', 'Chocolate cake with crushed cookie buttercream', 49.00, '/images/products/cookies-cream.jpg'),
    ('bbbb2222-0000-0000-0000-000000000007', 'Matcha Raspberry Velvet', 'Matcha sponge with raspberry mousse', 55.00, '/images/products/matcha-raspberry.jpg'),
    ('bbbb2222-0000-0000-0000-000000000008', 'Hazelnut Praline', 'Nutella-inspired praline cream and sponge', 54.00, '/images/products/hazelnut-praline.jpg'),
    ('bbbb2222-0000-0000-0000-000000000009', 'Red Velvet Signature', 'Classic red velvet with cream cheese frosting', 46.00, '/images/products/red-velvet.jpg'),
    ('bbbb2222-0000-0000-0000-000000000010', 'Black Forest Cherry', 'Kirsch-soaked chocolate cake with cherries', 53.00, '/images/products/black-forest.jpg'),
    ('bbbb2222-0000-0000-0000-000000000011', 'Pistachio Rosewater', 'Pistachio cake with rosewater buttercream', 56.00, '/images/products/pistachio-rose.jpg'),
    ('bbbb2222-0000-0000-0000-000000000012', 'Coconut Pineapple Breeze', 'Toasted coconut cake with pineapple curd', 51.00, '/images/products/coconut-pineapple.jpg'),
    ('bbbb2222-0000-0000-0000-000000000013', 'Espresso Almond Crunch', 'Mocha sponge with almond crunch', 55.00, '/images/products/espresso-almond.jpg'),
    ('bbbb2222-0000-0000-0000-000000000014', 'Seasonal Floral Special', 'Chef’s seasonal flavor with edible florals', 60.00, '/images/products/seasonal-floral.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (
    id, order_number, customer_id, product_id, size, layers, icing_flavor, icing_color, writing_text,
    writing_color, decorations, total_amount, deposit_amount, deposit_paid, pickup_date, pickup_time,
    priority, status, special_instructions, assigned_baker_id, assigned_decorator_id, created_by
) VALUES
    (
        'cccc3333-0000-0000-0000-000000000001',
        NULL,
        'aaaa1111-0000-0000-0000-000000000001',
        'bbbb2222-0000-0000-0000-000000000002',
        '8-inch round',
        '[{"layer":"cake","flavor":"chocolate"},{"layer":"filling","flavor":"dark chocolate mousse"}]'::jsonb,
        'dark chocolate',
        'rich brown',
        'Happy Birthday Lena',
        'gold',
        ARRAY['gold leaf', 'chocolate shards'],
        95.00,
        30.00,
        TRUE,
        DATE '2025-11-20',
        TIME '15:00',
        'standard',
        'in_prep',
        'Add subtle shimmer spray',
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222'
    ),
    (
        'cccc3333-0000-0000-0000-000000000002',
        NULL,
        'aaaa1111-0000-0000-0000-000000000002',
        'bbbb2222-0000-0000-0000-000000000014',
        '2-tier 6/8 inch',
        '[{"tier":1,"flavor":"vanilla bean"},{"tier":2,"flavor":"lemon elderflower"}]'::jsonb,
        'vanilla bean',
        'soft blush',
        'Congrats Carver Team',
        'white',
        ARRAY['fresh florals', 'sugar logo plaque'],
        320.00,
        160.00,
        TRUE,
        DATE '2025-11-22',
        TIME '11:00',
        'rush',
        'in_decoration',
        'Include edible printed logo, deliver box with ribbon',
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'cccc3333-0000-0000-0000-000000000003',
        NULL,
        'aaaa1111-0000-0000-0000-000000000005',
        'bbbb2222-0000-0000-0000-000000000007',
        '6-inch round',
        '[{"layer":"cake","flavor":"matcha"},{"layer":"filling","flavor":"raspberry buttercream"}]'::jsonb,
        'vanilla bean',
        'sage green',
        'Happy Anniversary',
        'cream',
        ARRAY['pressed flowers', 'pearl accents'],
        110.00,
        40.00,
        FALSE,
        DATE '2025-11-25',
        TIME '17:30',
        'standard',
        'pending',
        'Client will provide topper at pickup',
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (id, order_id, amount, payment_method, payment_type, received_by)
VALUES
    ('dddd4444-0000-0000-0000-000000000001', 'cccc3333-0000-0000-0000-000000000001', 30.00, 'card', 'deposit', '22222222-2222-2222-2222-222222222222'),
    ('dddd4444-0000-0000-0000-000000000002', 'cccc3333-0000-0000-0000-000000000002', 160.00, 'card', 'deposit', '11111111-1111-1111-1111-111111111111'),
    ('dddd4444-0000-0000-0000-000000000003', 'cccc3333-0000-0000-0000-000000000001', 65.00, 'cash', 'balance', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

COMMIT;

