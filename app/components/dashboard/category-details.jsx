import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock data for category expenses
const getCategoryExpenses = (category) =>
  ({
    "Software & SaaS": [
      {
        name: "Adobe Creative Cloud",
        date: "2024-02-15",
        statement: "Annual Subscription Renewal",
        email: "billing@adobe.com",
        amount: 599.88,
      },
      {
        name: "GitHub Team",
        date: "2024-02-10",
        statement: "Monthly Team License",
        email: "billing@github.com",
        amount: 44.0,
      },
    ],
    "Media & Content": [
      {
        name: "Netflix Premium",
        date: "2024-02-01",
        statement: "Monthly Streaming Subscription",
        email: "info@netflix.com",
        amount: 19.99,
      },
      {
        name: "Spotify Family",
        date: "2024-02-05",
        statement: "Monthly Family Plan",
        email: "billing@spotify.com",
        amount: 14.99,
      },
    ],
    "E-Commerce": [
      {
        name: "Amazon Prime",
        date: "2024-02-20",
        statement: "Annual Membership Renewal",
        email: "billing@amazon.com",
        amount: 139.0,
      },
      {
        name: "Shopify Basic",
        date: "2024-02-15",
        statement: "Monthly Store Subscription",
        email: "billing@shopify.com",
        amount: 29.0,
      },
    ],
    "IT Infrastructure": [
      {
        name: "AWS Cloud Services",
        date: "2024-02-28",
        statement: "Monthly Cloud Computing Resources",
        email: "billing@aws.amazon.com",
        amount: 245.5,
      },
      {
        name: "Digital Ocean",
        date: "2024-02-25",
        statement: "Monthly Server Hosting",
        email: "billing@digitalocean.com",
        amount: 40.0,
      },
    ],
  }[category.name] || []);

export function CategoryDetails({ category, onBack }) {
  const expenses = getCategoryExpenses(category);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{category.name} Expenses</CardTitle>
          </div>
          <CardDescription>
            Total Monthly Expenses: ${totalExpenses.toFixed(2)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statement</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{expense.name}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.statement}</TableCell>
                <TableCell className="text-muted-foreground">
                  {expense.email}
                </TableCell>
                <TableCell className="text-right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
