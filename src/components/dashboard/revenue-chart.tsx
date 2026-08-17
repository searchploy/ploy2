"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueChart({ data }: { data: { month: string; revenue: number; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 15% 18%)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: "hsl(220 9% 65%)" }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={{ fill: "hsl(220 9% 65%)" }}
          tickFormatter={(v) => `$${v / 100}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${(value / 100).toLocaleString()}`, "Revenue"]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(222 15% 18%)",
            background: "hsl(222 18% 9%)",
            color: "hsl(0 0% 98%)",
          }}
          labelStyle={{ color: "hsl(0 0% 98%)" }}
          itemStyle={{ color: "hsl(0 0% 98%)" }}
        />
        <Area type="monotone" dataKey="revenue" stroke="hsl(217 91% 60%)" strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
