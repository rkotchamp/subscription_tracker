"use client";

import * as React from "react";
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

export function SubscriptionChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Total Subscriptions</CardTitle>
          <CardDescription>Monthly subscription breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={subscriptionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {subscriptionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox: { cx, cy } }) => (
                  <text
                    x={cx}
                    y={cy}
                    fill="var(--foreground)"
                    textAnchor="middle"
                    dominantBaseline="central"
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
            <Tooltip
              content={({ payload }) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-medium">{data.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${data.value} (
                        {((data.value / totalAmount) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </CardContent>
      </Card>
      {miniChartData.map((category, index) => (
        <Card key={category.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={100} height={100}>
              <Pie
                data={[{ value: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={35}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
