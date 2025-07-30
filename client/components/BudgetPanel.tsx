import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { HelpTooltip, helpContent } from "@/components/ui/help-tooltip";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { JobData, ExpenseData } from "@/data/hardcoded-data";
import { useToast } from "@/hooks/use-toast";
import { RechartsWarningSuppress } from "./RechartsWarningSuppress";

interface BudgetPanelProps {
  job: JobData;
  onJobUpdate: (updatedJob: JobData) => void;
}

export default function BudgetPanel({ job, onJobUpdate }: BudgetPanelProps) {
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
    expectedOutcome: "",
    evaluationPeriod: "",
    effectiveness: "",
    notes: "",
  });
  const { toast } = useToast();

  const expenseCategories = [
    "Job Boards",
    "Recruitment Agency",
    "Events",
    "Tools",
    "Social Media Ads",
    "Referral Bonus",
    "Assessment Tools",
    "Interview Software",
    "Background Checks",
    "Other",
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
  ];

  // Prepare data for charts
  const expenseData = job.budget?.expenses || [];

  const pieData = useMemo(() => {
    return expenseCategories
      .map((category) => {
        const categoryExpenses = expenseData.filter(
          (expense) => expense.category === category,
        );
        const totalAmount = categoryExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0,
        );
        const avgEffectiveness =
          categoryExpenses.length > 0
            ? categoryExpenses.reduce(
                (sum, exp) => sum + (exp.effectiveness || 0),
                0,
              ) / categoryExpenses.length
            : 0;

        return {
          name: category,
          value: totalAmount,
          count: categoryExpenses.length,
          effectiveness: Math.round(avgEffectiveness),
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by amount descending
  }, [expenseData, expenseCategories]);

  // Generate dynamic monthly data based on actual expenses
  const monthlyData = React.useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const jobStartMonth = new Date(job.createdAt).getMonth();

    const data = [];
    const totalBudget = job.budget?.estimated || 0;
    const totalExpenses = expenseData.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    // Create realistic spending progression
    for (let i = 0; i <= Math.min(currentMonth - jobStartMonth + 1, 11); i++) {
      const monthIndex = (jobStartMonth + i) % 12;
      const monthName = months[monthIndex];

      // Calculate planned budget distribution (higher early, then tapering)
      const progressRatio = (i + 1) / (currentMonth - jobStartMonth + 2);
      const planned = Math.round(
        totalBudget * (progressRatio * 0.7 + 0.3 * Math.random()),
      );

      // Calculate actual spending based on real expenses with some distribution
      let spent = 0;
      if (i === currentMonth - jobStartMonth) {
        // Current month gets remaining expenses
        const previousSpent = data.reduce((sum, d) => sum + d.spent, 0);
        spent = Math.max(0, totalExpenses - previousSpent);
      } else {
        // Distribute expenses across previous months
        spent = Math.round(
          totalExpenses * (0.1 + 0.2 * Math.random()) * progressRatio,
        );
      }

      data.push({
        month: monthName,
        spent: Math.min(spent, planned + 1000), // Cap spending near planned
        planned: planned,
      });
    }

    return data.length > 0
      ? data
      : [
          {
            month: months[currentMonth],
            spent: totalExpenses,
            planned: totalBudget,
          },
        ];
  }, [job, expenseData]);

  const budgetUsedPercentage = job.budget
    ? (job.budget.actual / job.budget.estimated) * 100
    : 0;

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const expense: ExpenseData = {
      id: `exp_${Date.now()}`,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      expectedOutcome: newExpense.expectedOutcome,
      evaluationPeriod: newExpense.evaluationPeriod,
      effectiveness: newExpense.effectiveness
        ? parseFloat(newExpense.effectiveness)
        : undefined,
      notes: newExpense.notes || undefined,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };

    const updatedBudget = {
      ...job.budget,
      actual: (job.budget?.actual || 0) + expense.amount,
      expenses: [...(job.budget?.expenses || []), expense],
    };

    // In a real app, this would update the job budget
    const updatedJob = {
      ...job,
      budget: updatedBudget,
      actualCost: ((job.budget?.actual || 0) + expense.amount).toString(),
    };

    if (updatedJob) {
      onJobUpdate(updatedJob);
      setShowAddExpenseDialog(false);
      setNewExpense({
        amount: "",
        category: "",
        description: "",
        expectedOutcome: "",
        evaluationPeriod: "",
        effectiveness: "",
        notes: "",
      });

      toast({
        title: "Expense Added",
        description: `$${expense.amount} expense added to ${expense.category}`,
      });
    }
  };

  const getBudgetStatus = () => {
    if (budgetUsedPercentage > 100)
      return { color: "text-red-600", icon: AlertCircle, text: "Over Budget" };
    if (budgetUsedPercentage > 80)
      return { color: "text-yellow-600", icon: Clock, text: "Nearly Full" };
    return { color: "text-green-600", icon: CheckCircle, text: "On Track" };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Budget Overview
            <HelpTooltip content={helpContent.budget} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                ${job.budget?.estimated.toLocaleString() || 0}
              </div>
              <div className="text-sm text-slate-600">Estimated Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                ${job.budget?.actual.toLocaleString() || 0}
              </div>
              <div className="text-sm text-slate-600">Actual Spent</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${budgetStatus.color}`}>
                {budgetUsedPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <budgetStatus.icon className="w-4 h-4" />
                {budgetStatus.text}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Usage</span>
              <span>
                ${(job.budget?.actual || 0).toLocaleString()} / $
                {(job.budget?.estimated || 0).toLocaleString()}
              </span>
            </div>
            <Progress
              value={Math.min(budgetUsedPercentage, 100)}
              className={`h-3 ${budgetUsedPercentage > 100 ? "bg-red-100" : ""}`}
            />
          </div>

          <Button
            onClick={() => setShowAddExpenseDialog(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <RechartsWarningSuppress>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900 mb-2">
                                {data.name}
                              </p>
                              <div className="space-y-1">
                                <p className="text-blue-600 flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-medium">
                                    ${data.value.toLocaleString()}
                                  </span>
                                </p>
                                <p className="text-green-600 flex justify-between">
                                  <span>Expenses:</span>
                                  <span className="font-medium">
                                    {data.count}
                                  </span>
                                </p>
                                {data.effectiveness > 0 && (
                                  <p className="text-purple-600 flex justify-between">
                                    <span>Avg Effectiveness:</span>
                                    <span className="font-medium">
                                      {data.effectiveness}%
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </RechartsWarningSuppress>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Line Chart - Monthly Spending */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RechartsWarningSuppress>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    allowDuplicatedCategory={false}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [`$${value}`, ""]}
                    cursor={false}
                  />
                  <Legend iconType="line" />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#8884d8"
                    strokeDasharray="5 5"
                    name="Planned"
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#82ca9d"
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </RechartsWarningSuppress>
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseData.length > 0 ? (
              expenseData.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">
                        ${expense.amount.toLocaleString()}
                      </span>
                      <Badge variant="outline">{expense.category}</Badge>
                      {expense.effectiveness && (
                        <Badge
                          variant={
                            expense.effectiveness >= 80
                              ? "default"
                              : "secondary"
                          }
                        >
                          {expense.effectiveness}% Effective
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      {expense.description}
                    </p>
                    {expense.expectedOutcome && (
                      <p className="text-xs text-slate-500">
                        Expected: {expense.expectedOutcome}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      by {expense.createdBy}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No expenses recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog
        open={showAddExpenseDialog}
        onOpenChange={setShowAddExpenseDialog}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense for this job posting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Amount *
                </label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Category *
                </label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, category: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description *
              </label>
              <Input
                placeholder="LinkedIn Premium and Indeed postings"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Expected Outcome
                <HelpTooltip content={helpContent.expectedOutcome} />
              </label>
              <Input
                placeholder="Attract 50+ qualified candidates"
                value={newExpense.expectedOutcome}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    expectedOutcome: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Evaluation Period
                </label>
                <Select
                  value={newExpense.evaluationPeriod}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, evaluationPeriod: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="45 days">45 days</SelectItem>
                    <SelectItem value="60 days">60 days</SelectItem>
                    <SelectItem value="90 days">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Effectiveness (%)
                  <HelpTooltip content={helpContent.effectiveness} />
                </label>
                <Input
                  type="number"
                  placeholder="85"
                  min="0"
                  max="100"
                  value={newExpense.effectiveness}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      effectiveness: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Notes
              </label>
              <Textarea
                placeholder="Additional notes about this expense..."
                value={newExpense.notes}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, notes: e.target.value })
                }
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddExpenseDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
