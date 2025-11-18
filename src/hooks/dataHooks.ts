import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

const DEFAULT_PAGE_SIZE = 20;

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface OrdersFilter extends PaginationOptions {
  status?: string[];
  priority?: string[];
  search?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  paymentStatus?: string[];
  customerType?: string[];
  assignedStaffId?: string;
}

export interface CustomersFilter extends PaginationOptions {
  customerType?: "retail" | "corporate" | "all";
  preferredOnly?: boolean;
  atRiskOnly?: boolean;
  search?: string;
}

export interface ProductsFilter extends PaginationOptions {
  isActive?: boolean | null;
  search?: string;
  sortBy?: "name" | "base_price" | "created_at";
  sortDirection?: "asc" | "desc";
}

export interface PaymentsFilter extends PaginationOptions {
  paymentStatus?: string[];
  paymentType?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  orderId?: string;
}

function buildPaginationRange(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const offset = (page - 1) * pageSize;
  const to = offset + pageSize - 1;
  return { from: offset, to };
}

export function useOrdersQuery(filters: OrdersFilter = {}) {
  const queryKey = useMemo(() => ["orders", filters], [filters]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
      const range = buildPaginationRange(page, pageSize);

      let query = supabase
        .from("orders")
        .select(
          `
          *,
          customers:customer_id (
            id,
            full_name,
            email,
            phone,
            customer_type,
            is_preferred
          ),
          products:product_id (
            id,
            name,
            base_price
          ),
          baker:assigned_baker_id (
            id,
            full_name,
            role
          ),
          decorator:assigned_decorator_id (
            id,
            full_name,
            role
          )
        `,
          { count: "exact" },
        )
        .order("pickup_date", { ascending: true })
        .range(range.from, range.to);

      if (filters.status?.length) {
        query = query.in("status", filters.status);
      }

      if (filters.priority?.length) {
        query = query.in("priority", filters.priority);
      }

      if (filters.paymentStatus?.length) {
        query = query.in("payment_status", filters.paymentStatus);
      }

      if (filters.assignedStaffId) {
        query = query.or(
          `assigned_baker_id.eq.${filters.assignedStaffId},assigned_decorator_id.eq.${filters.assignedStaffId},created_by.eq.${filters.assignedStaffId}`,
        );
      }

      if (filters.dateRange?.from) {
        query = query.gte("pickup_date", filters.dateRange.from);
      }

      if (filters.dateRange?.to) {
        query = query.lte("pickup_date", filters.dateRange.to);
      }

      if (filters.search?.trim()) {
        const searchValue = filters.search.trim();
        query = query.or(
          `order_number.ilike.%${searchValue}%,writing_text.ilike.%${searchValue}%`,
        );
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: count ?? data?.length ?? 0,
        },
      };
    },
  });
}

export function useCustomersQuery(filters: CustomersFilter = {}) {
  const queryKey = useMemo(() => ["customers", filters], [filters]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
      const range = buildPaginationRange(page, pageSize);

      let query = supabase
        .from("customers")
        .select(
          `
          *,
          orders:orders(count)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .range(range.from, range.to);

      if (filters.customerType && filters.customerType !== "all") {
        query = query.eq("customer_type", filters.customerType);
      }

      if (filters.preferredOnly) {
        query = query.eq("is_preferred", true);
      }

      if (filters.atRiskOnly) {
        const warningDate = new Date();
        warningDate.setDate(warningDate.getDate() - 180);
        query = query.lte("updated_at", warningDate.toISOString());
      }

      if (filters.search?.trim()) {
        const searchValue = filters.search.trim();
        query = query.or(
          `full_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,phone.ilike.%${searchValue}%`,
        );
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: count ?? data?.length ?? 0,
        },
      };
    },
  });
}

export function useProductsQuery(filters: ProductsFilter = {}) {
  const queryKey = useMemo(() => ["products", filters], [filters]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
      const range = buildPaginationRange(page, pageSize);

      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .range(range.from, range.to);

      if (filters.isActive !== null && filters.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      }

      if (filters.search?.trim()) {
        const value = filters.search.trim();
        query = query.or(
          `name.ilike.%${value}%,description.ilike.%${value}%`,
        );
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, {
          ascending: filters.sortDirection !== "desc",
        });
      } else {
        query = query.order("name", { ascending: true });
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: count ?? data?.length ?? 0,
        },
      };
    },
  });
}

export function usePaymentsQuery(filters: PaymentsFilter = {}) {
  const queryKey = useMemo(() => ["payments", filters], [filters]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
      const range = buildPaginationRange(page, pageSize);

      let query = supabase
        .from("payments")
        .select(
          `
          *,
          orders:order_id (
            id,
            order_number,
            customer_id,
            pickup_date,
            total_amount,
            balance_due
          )
        `,
          { count: "exact" },
        )
        .order("paid_at", { ascending: false })
        .range(range.from, range.to);

      if (filters.orderId) {
        query = query.eq("order_id", filters.orderId);
      }

      if (filters.paymentStatus?.length) {
        query = query.in("payment_status", filters.paymentStatus);
      }

      if (filters.paymentType?.length) {
        query = query.in("payment_type", filters.paymentType);
      }

      if (filters.dateRange?.from) {
        query = query.gte("paid_at", filters.dateRange.from);
      }

      if (filters.dateRange?.to) {
        query = query.lte("paid_at", filters.dateRange.to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data,
        pagination: {
          page,
          pageSize,
          total: count ?? data?.length ?? 0,
        },
      };
    },
  });
}
