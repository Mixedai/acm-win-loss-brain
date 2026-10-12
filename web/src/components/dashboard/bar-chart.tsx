"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NamedValue } from "@/components/dashboard/queries";
import { formatCompactCurrency, formatCount, formatCurrency } from "@/components/dashboard/format";

type ValueKind = "currency" | "count";

type DashboardBarChartProps = {
  data: NamedValue[];
  valueKind: ValueKind;
  valueLabel: string;
  // "horizontal" lays bars left-to-right so long category labels never overlap.
  orientation?: "vertical" | "horizontal";
};

// Single-series chart: one neutral blue, no legend (the card title names the series).
const BAR_FILL = "#2a78d6";
const GRID_STROKE = "#e2e8f0";
const AXIS_INK = "#64748b";

function formatAxisValue(kind: ValueKind, value: number): string {
  return kind === "currency" ? formatCompactCurrency(value) : formatCount(value);
}

function formatTooltipValue(kind: ValueKind, value: number): string {
  return kind === "currency" ? formatCurrency(value) : formatCount(value);
}

const ROW_HEIGHT = 28;

export function DashboardBarChart({
  data,
  valueKind,
  valueLabel,
  orientation = "vertical",
}: DashboardBarChartProps) {
  const horizontal = orientation === "horizontal";
  const height = horizontal ? Math.max(256, data.length * ROW_HEIGHT + 32) : 256;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 16, bottom: 4, left: 4 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            vertical={horizontal}
            horizontal={!horizontal}
            stroke={GRID_STROKE}
            strokeDasharray="3 3"
          />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fill: AXIS_INK, fontSize: 12 }}
                tickFormatter={(value: number) => formatAxisValue(valueKind, value)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                width={120}
                interval={0}
                tick={{ fill: AXIS_INK, fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: GRID_STROKE }}
                tick={{ fill: AXIS_INK, fontSize: 12 }}
                interval={0}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={56}
                tick={{ fill: AXIS_INK, fontSize: 12 }}
                tickFormatter={(value: number) => formatAxisValue(valueKind, value)}
              />
            </>
          )}
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 2px rgb(15 23 42 / 0.08)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            itemStyle={{ color: "#334155" }}
            formatter={(value) => [
              typeof value === "number" ? formatTooltipValue(valueKind, value) : String(value),
              valueLabel,
            ]}
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            fill={BAR_FILL}
            maxBarSize={24}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
