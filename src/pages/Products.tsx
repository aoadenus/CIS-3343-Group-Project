import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Edit } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { motion } from 'motion/react';
import shopData, { ICING_COLORS, DEFAULT_PRODUCTS, FLAVOR_IMAGES } from '../data/shopData';

const flavors = Object.keys(FLAVOR_IMAGES).map((k) => ({ name: k, price: 'Base Price', description: `${k} flavor` }));
const fillings = Object.keys(FLAVOR_IMAGES).map((k) => ({ name: `${k} Filling`, price: 'Base Price' }));

export function Products() {
  const { showToast } = useToast();
  
  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1>Product Catalog & Pricing</h1>
        <p className="tagline" style={{ marginTop: '8px' }}>
          Handcrafted with premium ingredients
        </p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm" onClick={() => window.location.assign('/admin/products?gui=james')}>
            Open James GUI
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.assign('/admin/products?gui=emily')}>
            Open Emily GUI
          </Button>
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {DEFAULT_PRODUCTS.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card 
              className="card hover:shadow-hover cursor-pointer transition-all"
              style={{ padding: '24px' }}
              onClick={() => showToast('info', `View complete details and customization options for ${product.name}.`, 'Product Details')}
            >
              <div className="space-y-4">
                {/* Product Image Placeholder */}
                <div 
                  className="w-full rounded-lg mb-4 flex items-center justify-center"
                  style={{ 
                    height: '160px',
                    background: 'linear-gradient(135deg, rgba(196, 69, 105, 0.08) 0%, rgba(248, 235, 215, 0.3) 100%)',
                    border: '2px dashed rgba(196, 69, 105, 0.2)'
                  }}
                >
                  <Plus size={48} color="#C44569" style={{ opacity: 0.4 }} />
                </div>

                {/* Product Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 style={{ marginBottom: '8px' }}>
                      {product.name}
                    </h4>
                    <p>
                      {product.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast('info', 'Opening product editor...', 'Edit Product');
                    }}
                  >
                    <Edit size={16} color="#C44569" />
                  </Button>
                </div>

                {/* Price */}
                <div className="pt-4" style={{ borderTop: '1px solid #E0E0E0' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(43, 43, 43, 0.65)', marginBottom: '4px' }}>Price</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '20px', color: '#C44569', lineHeight: 1.3 }}>
                    ${(product.priceCents / 100).toFixed(2)}
                  </p>
                </div>

                {/* Add to Order Button */}
                <Button 
                  className="btn-primary w-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('success', `${product.name} added to your current order.`, 'Added to Order');
                  }}
                >
                  Add to Order
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Customization Options */}
      <Card className="card" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>
          Customization Options
        </h2>

        <Tabs defaultValue="flavors">
          <TabsList className="mb-6 p-1 rounded-lg" style={{ background: '#F8EBD7' }}>
            <TabsTrigger 
              value="flavors" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#C44569]"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#2B2B2B' }}
            >
              Flavors
            </TabsTrigger>
            <TabsTrigger 
              value="fillings"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#C44569]"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#2B2B2B' }}
            >
              Fillings
            </TabsTrigger>
            <TabsTrigger 
              value="icings"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#C44569]"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, color: '#2B2B2B' }}
            >
              Icings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flavors">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flavors.map((flavor, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-hover"
                  style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #E0E0E0'
                  }}
                  onClick={() => showToast('info', `${flavor.name} flavor selected for customization.`, 'Flavor Selected')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                      {flavor.name}
                    </h5>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: '#C44569' }}>
                      {flavor.price}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(43, 43, 43, 0.65)', lineHeight: 1.6 }}>
                    {flavor.description}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fillings">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fillings.map((filling, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-hover"
                  style={{ 
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #E0E0E0'
                  }}
                  onClick={() => showToast('info', `${filling.name} filling selected for customization.`, 'Filling Selected')}
                >
                  <div className="flex items-start justify-between">
                    <h5 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '16px', color: '#2B2B2B' }}>
                      {filling.name}
                    </h5>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', color: '#C44569' }}>
                      {filling.price}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="icings">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {ICING_COLORS.map((c, idx) => (
                <Card key={idx} className="cursor-pointer transition-all hover:shadow-hover" style={{ padding: '12px', textAlign: 'center' }} onClick={() => showToast('info', `${c.name} selected`, 'Icing Selected')}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <img src={c.image} alt={c.name} style={{ width: 96, height: 64, objectFit: 'contain', borderRadius: 8, border: '1px solid #EEE' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2B2B2B' }}>{c.name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{c.hex}</div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
