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

export function SubscriptionChart({ data, onCategoryClick, onTotalClick }) {
  const router = useRouter();
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

  // Merge existing data with default categories
  const mergedCategories = React.useMemo(() => {
    if (!data?.categories || data.categories.length === 0) {
      return defaultCategories;
    }

    // Create a map of existing categories
    const existingCategoriesMap = data.categories.reduce((acc, cat) => {
      acc[cat.name] = cat;
      return acc;
    }, {});

    // Merge with defaults, keeping existing values where available
    return defaultCategories.map(defaultCat => ({
      ...defaultCat,
      ...existingCategoriesMap[defaultCat.name],
    }));
  }, [data?.categories]);

  if (!mounted) {
    return null;
  }

  const totalAmount = mergedCategories.reduce((sum, item) => sum + item.value, 0);

  const miniChartData = mergedCategories.map((category) => ({
    ...category,
    percentage: totalAmount > 0 ? ((category.value / totalAmount) * 100).toFixed(1) : "0.0",
    color: getCategoryColor(category.name),
  }));

  return (
    <div className="flex flex-col w-full">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Total Subscriptions</CardTitle>
          <CardDescription>
            {totalAmount === 0 
              ? "Start tracking your subscriptions"
              : "Monthly subscription breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart width={300} height={300} className="w-full max-w-[300px]">
            <Pie
              data={mergedCategories}
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
              {mergedCategories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getCategoryColor(entry.name)}
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
                      ${totalAmount.toFixed(2)}
                    </tspan>
                    <tspan x={cx} dy="1.5em" fontSize="12">
                      {totalAmount === 0 ? "No data yet" : "Total"}
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
