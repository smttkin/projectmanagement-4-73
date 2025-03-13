
import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  RefreshCw, 
  Plus, 
  Filter, 
  ListChecks, 
  ClipboardList
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock performance data for chart
const performanceData = [
  { name: 'Jan', completed: 45, pending: 15, cancelled: 5 },
  { name: 'Feb', completed: 50, pending: 10, cancelled: 3 },
  { name: 'Mar', completed: 40, pending: 20, cancelled: 7 },
  { name: 'Apr', completed: 65, pending: 12, cancelled: 2 },
  { name: 'May', completed: 55, pending: 18, cancelled: 4 },
  { name: 'Jun', completed: 70, pending: 8, cancelled: 2 },
];

// Mock reports list
const reportsList = [
  {
    id: 1,
    title: 'Q2 Project Performance',
    description: 'Overview of all projects in Q2 2023',
    type: 'Performance',
    createdAt: '2023-07-01',
    author: 'Alex Johnson',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Team Productivity Analysis',
    description: 'Analysis of team performance and productivity',
    type: 'Team',
    createdAt: '2023-06-15',
    author: 'Sarah Miller',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Resource Allocation Report',
    description: 'Current resource allocation across projects',
    type: 'Resources',
    createdAt: '2023-06-10',
    author: 'Michael Chen',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Upcoming Deadlines',
    description: 'Summary of upcoming project deadlines',
    type: 'Timeline',
    createdAt: '2023-06-05',
    author: 'Jessica Taylor',
    status: 'completed',
  },
  {
    id: 5,
    title: 'Budget Tracking Q2',
    description: 'Financial overview of all current projects',
    type: 'Financial',
    createdAt: '2023-06-01',
    author: 'David Wilson',
    status: 'pending',
  },
];

// Mock project stats
const projectStats = [
  { name: 'Total Projects', value: 42, icon: <ClipboardList className="h-4 w-4" />, change: '+8%' },
  { name: 'Completed', value: 28, icon: <ListChecks className="h-4 w-4" />, change: '+12%' },
  { name: 'In Progress', value: 10, icon: <RefreshCw className="h-4 w-4" />, change: '-5%' },
  { name: 'Delayed', value: 4, icon: <Calendar className="h-4 w-4" />, change: '-15%' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">Track project performance and team productivity</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>

        {/* Project stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {projectStats.map((stat) => (
            <Card key={stat.name} className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <div className="text-muted-foreground">{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports tabs */}
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="all-reports">All Reports</TabsTrigger>
            </TabsList>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Overview tab content */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
                <CardDescription>
                  Overview of project completion status for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                    <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex justify-between">
                <span>Updated: Today at 9:30 AM</span>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>
                    The most recently generated reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {reportsList.slice(0, 3).map((report) => (
                      <li key={report.id} className="flex justify-between items-start pb-3 border-b last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground">{report.createdAt}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Report Types</CardTitle>
                  <CardDescription>
                    Distribution of report types
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Performance', value: 12 },
                        { name: 'Team', value: 8 },
                        { name: 'Resources', value: 5 },
                        { name: 'Timeline', value: 9 },
                        { name: 'Financial', value: 7 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance tab content */}
          <TabsContent value="performance">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed project performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section contains detailed performance metrics and would display
                  comprehensive charts and analytics about project performance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Reports tab content */}
          <TabsContent value="all-reports">
            <Card className="border shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <CardTitle>All Reports</CardTitle>
                    <CardDescription>
                      Complete list of all generated reports
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm">
                      <Filter className="h-3.5 w-3.5 mr-1" />
                      Filter
                    </Button>
                    <Button variant="secondary" size="sm">
                      <BarChart3 className="h-3.5 w-3.5 mr-1" />
                      Sort
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsList.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground">{report.description}</div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell>{report.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'completed' ? 'default' : 'outline'}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
