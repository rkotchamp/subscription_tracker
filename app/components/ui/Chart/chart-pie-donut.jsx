"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const subscriptionData = [
  {
    name: "Software & SaaS",
    value: 400,
    color: "hsl(var(--chart-1))", // Coral red
  },
  {
    name: "Media & Content",
    value: 300,
    color: "hsl(var(--chart-2))", // Teal
  },
  {
    name: "E-Commerce",
    value: 300,
    color: "hsl(var(--chart-3))", // Dark blue
  },
  {
    name: "IT Infrastructure",
    value: 200,
    color: "hsl(var(--chart-4))", // Gold
  },
];

const totalAmount = subscriptionData.reduce((sum, item) => sum + item.value, 0);

const miniChartData = subscriptionData.map((category) => ({
  ...category,
  percentage: ((category.value / totalAmount) * 100).toFixed(1),
}));

export function SubscriptionChart({ onCategoryClick, onTotalClick }) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Main Pie Chart - Full width on mobile */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Total Subscriptions</CardTitle>
          <CardDescription>Monthly subscription breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart width={300} height={300} className="w-full max-w-[300px]">
            <Pie
              data={subscriptionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              onClick={(_, __, e) => {
                if (!e?.payload?.name) {
                  onTotalClick();
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {subscriptionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(entry);
                  }}
                />
              ))}
              <Label
                content={({ viewBox: { cx, cy } }) => (
                  <text
                    x={cx}
                    y={cy}
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="cursor-pointer"
                    onClick={onTotalClick}
                  >
                    <tspan x={cx} dy="-0.5em" fontSize="24" fontWeight="bold">
                      ${totalAmount}
                    </tspan>
                    <tspan x={cx} dy="1.5em" fontSize="12">
                      Total
                    </tspan>
                  </text>
                )}
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Mini Charts - Grid on desktop, stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {miniChartData.map((category) => (
          <Card
            key={category.name}
            className="cursor-pointer transition-colors hover:bg-muted w-full"
            onClick={() => onCategoryClick(category)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PieChart
                  width={100}
                  height={100}
                  className="w-full max-w-[100px]"
                >
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    dataKey="value"
                    fill="var(--muted)"
                  />
                  <Pie
                    data={[
                      { value: parseFloat(category.percentage) },
                      { value: 100 - parseFloat(category.percentage) },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={category.color} />
                    <Cell fill="transparent" />
                    <Label
                      content={({ viewBox: { cx, cy } }) => (
                        <text
                          x={cx}
                          y={cy}
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          <tspan x={cx} fontSize="14" fontWeight="bold">
                            ${category.value}
                          </tspan>
                        </text>
                      )}
                    />
                  </Pie>
                </PieChart>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
