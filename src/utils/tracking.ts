export const TRACKING_STAGES = [
  "Order Placed",
  "Design Approved",
  "Pending Baking",
  "Baking in Progress",
  "Cooling",
  "Ready for Decorating",
  "Decorating",
  "Decorated Complete",
  "Quality Check",
  "Ready for Pickup",
  "Picked Up"
] as const;

export function getCurrentStage(orderCreatedAt: string): number {
  const createdDate = new Date(orderCreatedAt);
  const now = new Date();
  
  const elapsedMs = now.getTime() - createdDate.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
  
  const intervalMinutes = 2;
  const stageIndex = Math.floor(elapsedMinutes / intervalMinutes) % 11;
  
  return stageIndex;
}
