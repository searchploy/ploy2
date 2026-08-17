/**
 * Lightweight mock time-series generator used to power dashboard charts.
 * In production this is replaced by aggregate queries against the
 * `analytics` and `orders` tables (or a materialized view).
 */
export function getMonthlySeries(seedRevenue: number, months = 6) {
  const monthNames = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  let revenue = seedRevenue * 0.6;
  let views = 800;
  return monthNames.slice(0, months).map((month, i) => {
    revenue = revenue * (1 + 0.08 + (i % 2 === 0 ? 0.04 : -0.01));
    views = views * (1 + 0.12);
    return {
      month,
      revenue: Math.round(revenue),
      views: Math.round(views),
    };
  });
}

export function getCategoryBreakdown(employees: { department?: string; purchase_count: number }[]) {
  const map = new Map<string, number>();
  for (const emp of employees) {
    const dept = emp.department || "Other";
    map.set(dept, (map.get(dept) ?? 0) + emp.purchase_count);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
