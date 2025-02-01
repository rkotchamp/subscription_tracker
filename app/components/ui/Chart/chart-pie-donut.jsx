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

export function SubscriptionChart({ data, onCategoryClick, onTotalClick }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Default categories with zero values
  const defaultCategories = [
    { name: "Software & SaaS", value: 0, items: [] },
    { name: "Media & Content", value: 0, items: [] },
    { name: "E-Commerce", value: 0, items: [] },
    { name: "IT Infrastructure", value: 0, items: [] },
  ];

  const mergedCategories = React.useMemo(() => {
    if (!data?.categories || data.categories.length === 0) {
      return defaultCategories;
    }

    const existingCategoriesMap = data.categories.reduce((acc, cat) => {
      acc[cat.name] = cat;
      return acc;
    }, {});

    return defaultCategories.map((defaultCat) => ({
      ...defaultCat,
      ...existingCategoriesMap[defaultCat.name],
    }));
  }, [data?.categories]);

  if (!mounted) return null;

  const totalAmount = mergedCategories.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // Create data for the total subscription chart
  const totalSubscriptionData = mergedCategories.map(category => ({
    name: category.name,
    value: category.value,
    percentage: totalAmount > 0 ? (category.value / totalAmount) * 100 : 0
  }));

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full items-center space-y-8">
      {/* Total Subscription Chart */}
      <div className="relative">
        <PieChart width={400} height={400} className="w-full max-w-[400px]">
          <Pie
            data={totalSubscriptionData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={4}
            dataKey="value"
            onClick={onTotalClick}
            style={{ cursor: "pointer" }}
          >
            {totalSubscriptionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getCategoryColor(entry.name)}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryClick(mergedCategories[index]);
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
                  <tspan x={cx} dy="-0.5em" fontSize="32" fontWeight="bold">
                    ${totalAmount.toFixed(2)}
                  </tspan>
                  <tspan x={cx} dy="1.5em" fontSize="16">
                    Total
                  </tspan>
                </text>
              )}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </div>

      {/* Mini Category Charts Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {mergedCategories.map((category) => (
          <Card
            key={category.name}
            className="cursor-pointer transition-colors hover:bg-muted"
            onClick={() => onCategoryClick(category)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
              {category.value === 0 && (
                <CardDescription className="text-xs">
                  No subscriptions tracked yet
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PieChart width={100} height={100} className="w-full max-w-[100px]">
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
                      { value: category.value > 0 ? (category.value / totalAmount) * 100 : 0 },
                      { value: category.value > 0 ? 100 - (category.value / totalAmount) * 100 : 100 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={getCategoryColor(category.name)} />
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
                            ${category.value.toFixed(2)}
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

// Helper function to get consistent colors for categories
function getCategoryColor(categoryName) {
  const colorMap = {
    "Software & SaaS": "hsl(var(--chart-1))",
    "Media & Content": "hsl(var(--chart-2))",
    "E-Commerce": "hsl(var(--chart-3))",
    "IT Infrastructure": "hsl(var(--chart-4))",
    Unknown: "hsl(var(--chart-5))",
  };
  return colorMap[categoryName] || "hsl(var(--chart-5))";
}
