import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

interface DashboardProps {
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

const mockChartData = [
  { category: "Practice", score: 76 },
  { category: "Mock Exam", score: 68 },
  { category: "Flashcards", score: 90 },
];

const activityData = [
  { day: "Mon", questions: 30 },
  { day: "Tue", questions: 50 },
  { day: "Wed", questions: 40 },
  { day: "Thu", questions: 70 },
  { day: "Fri", questions: 20 },
  { day: "Sat", questions: 90 },
  { day: "Sun", questions: 60 },
];

export default function UserDashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">
        Hi, {user?.name || "Future Cloud Practitioner"}! 👋
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/practice">
          <Button className="cursor-pointer w-full text-lg py-6">
            🧠 Start Practice Quiz
          </Button>
        </Link>
        <Link href="/mock-exam">
          <Button className="cursor-pointer w-full text-lg py-6">
            📝 Take Full Mock Exam
          </Button>
        </Link>
        <Link href="/flashcards">
          <Button className="cursor-pointer w-full text-lg py-6">
            💡 Browse Flashcards
          </Button>
        </Link>
        <Link href="/cheatsheets">
          <Button className="cursor-pointer w-full text-lg py-6">
            📚 View Cheatsheets
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Last Practice Score</p>
            <p className="text-2xl font-semibold">76%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Questions Answered</p>
            <p className="text-2xl font-semibold">1,238</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Mock Exams Taken</p>
            <p className="text-2xl font-semibold">4</p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-white dark:bg-muted rounded-xl p-4 shadow-md">
        <h2 className="text-lg font-semibold mb-4">🎓 Certificate Tracker</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Practice Completion
            </span>
            <span className="text-sm font-medium">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>

          <div className="flex justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Mock Exams Completion
            </span>
            <span className="text-sm font-medium">60%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-indigo-400 h-2.5 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>

          <div className="flex justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Flashcards Reviewed
            </span>
            <span className="text-sm font-medium">90%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "90%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="bg-white dark:bg-muted rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            📊 Performance Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-muted rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">📈 Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
