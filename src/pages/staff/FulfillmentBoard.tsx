import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ToastContext";
import { useOrdersQuery } from "../../hooks/dataHooks";
import { supabase } from "../../lib/supabaseClient";
import { Loader2, RefreshCcw, Search } from "lucide-react";

const BOARD_COLUMNS = [
  { id: "pending", label: "Pending", status: "pending", accent: "#94A3B8" },
  { id: "in_prep", label: "In Baking", status: "in_prep", accent: "#3B82F6" },
  {
    id: "in_decoration",
    label: "In Decoration",
    status: "in_decoration",
    accent: "#8B5CF6",
  },
  {
    id: "ready",
    label: "Pending Approval",
    status: "ready",
    accent: "#F97316",
  },
  {
    id: "completed",
    label: "Ready for Pickup",
    status: "completed",
    accent: "#10B981",
  },
  {
    id: "picked_up",
    label: "Completed",
    status: "picked_up",
    accent: "#14B8A6",
  },
] as const;

type BoardColumnId = (typeof BOARD_COLUMNS)[number]["id"];

interface FulfillmentFilters {
  search: string;
}

export function FulfillmentBoard() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<FulfillmentFilters>({ search: "" });
  const { data, isLoading, refetch, isFetching } = useOrdersQuery({
    page: 1,
    pageSize: 250,
    search: filters.search,
  });

  const ordersByColumn = useMemo(() => {
    const grouped: Record<BoardColumnId, any[]> = {
      pending: [],
      in_prep: [],
      in_decoration: [],
      ready: [],
      completed: [],
      picked_up: [],
    };

    (data?.data ?? []).forEach((order) => {
      const key = (order.status as BoardColumnId) ?? "pending";
      if (grouped[key]) {
        grouped[key].push(order);
      } else {
        grouped.pending.push(order);
      }
    });

    return grouped;
  }, [data]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromColumn = findColumnIdByOrderId(active.id);
    const toColumn = over.id as BoardColumnId;

    if (!fromColumn || !toColumn || fromColumn === toColumn) {
      return;
    }

    const targetStatus = BOARD_COLUMNS.find(
      (column) => column.id === toColumn,
    )?.status;

    if (!targetStatus) {
      return;
    }

    await updateOrderStatus(active.id, targetStatus);
  };

  const findColumnIdByOrderId = (orderId: UniqueIdentifier) => {
    return BOARD_COLUMNS.find((column) =>
      ordersByColumn[column.id as BoardColumnId]?.some(
        (order) => order.id === orderId,
      ),
    )?.id as BoardColumnId | undefined;
  };

  const updateOrderStatus = async (orderId: UniqueIdentifier, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      showToast(
        "success",
        `Order updated to ${status.replace("_", " ")}`,
        "Status Updated",
      );
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
      showToast(
        "error",
        "Unable to update order status. Please try again.",
        "Update Failed",
      );
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#C44569]">
            Fulfillment Board
          </h1>
          <p className="text-sm text-muted-foreground">
            Drag and drop cards to update production status in real time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search order # or message"
              className="pl-9"
              value={filters.search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#C44569]" />
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {BOARD_COLUMNS.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                orders={ordersByColumn[column.id as BoardColumnId] ?? []}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}

interface BoardColumnProps {
  column: (typeof BOARD_COLUMNS)[number];
  orders: any[];
}

function BoardColumn({ column, orders }: BoardColumnProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: `4px solid ${column.accent}` }}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            {column.label}
          </p>
          <p className="text-xs text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <Badge
          variant="outline"
          style={{
            borderColor: column.accent,
            color: column.accent,
          }}
        >
          {orders.length}
        </Badge>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-2">
        <SortableContext
          id={column.id}
          items={orders.map((order) => order.id)}
          strategy={verticalListSortingStrategy}
        >
          {orders.length === 0 ? (
            <Card className="border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-muted-foreground">
              Nothing here yet
            </Card>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const pickupDate = order.pickup_date
    ? new Date(order.pickup_date).toLocaleDateString()
    : "TBD";

  const pickupTime = order.pickup_time;

  const customerName = order.customers?.full_name ?? "Walk-in Customer";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab border-slate-100 p-4 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-slate-800">
          {order.order_number ?? "Unassigned #"}
        </p>
        {order.priority === "rush" && (
          <Badge className="bg-red-600 text-white">Rush</Badge>
        )}
      </div>
      <p className="text-sm font-medium text-slate-700">{customerName}</p>
      {order.customers?.phone && (
        <p className="text-xs text-muted-foreground">
          📱 {order.customers.phone}
        </p>
      )}
      {order.products?.name && (
        <p className="text-xs text-muted-foreground">
          🎂 {order.products.name}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          📅 {pickupDate} {pickupTime && `• ${pickupTime}`}
        </span>
        <span>💵 ${Number(order.total_amount ?? 0).toFixed(2)}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
        {order.baker?.full_name && (
          <Badge variant="outline">👨‍🍳 {order.baker.full_name}</Badge>
        )}
        {order.decorator?.full_name && (
          <Badge variant="outline">🎨 {order.decorator.full_name}</Badge>
        )}
      </div>
    </Card>
  );
}
