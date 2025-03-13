
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileDown, FileText, Filter, PlusCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Data for productivity chart
const productivityData = [
  { name: 'Jan', completed: 30, inProgress: 20, notStarted: 10 },
  { name: 'Feb', completed: 25, inProgress: 30, notStarted: 15 },
  { name: 'Mar', completed: 40, inProgress: 25, notStarted: 10 },
  { name: 'Apr', completed: 45, inProgress: 20, notStarted: 5 },
  { name: 'May', completed: 50, inProgress: 15, notStarted: 5 },
  { name: 'Jun', completed: 60, inProgress: 10, notStarted: 5 },
];

// Data for workload chart
const workloadData = [
  { name: 'Alice', value: 12 },
  { name: 'Bob', value: 8 },
  { name: 'Charlie', value: 15 },
  { name: 'Diana', value: 10 },
  { name: 'Edward', value: 6 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Data for performance chart
const performanceData = [
  { name: 'Week 1', performance: 80 },
  { name: 'Week 2', performance: 75 },
  { name: 'Week 3', performance: 85 },
  { name: 'Week 4', performance: 90 },
  { name: 'Week 5', performance: 88 },
  { name: 'Week 6', performance: 95 },
];

// Sample reports list
const reportsList = [
  { id: 1, name: 'Q2 Project Summary', date: '2023-06-30', type: 'quarterly' },
  { id: 2, name: 'Marketing Campaign Results', date: '2023-05-15', type: 'campaign' },
  { id: 3, name: 'Team Performance Review', date: '2023-06-01', type: 'performance' },
  { id: 4, name: 'Resource Allocation Analysis', date: '2023-06-20', type: 'resource' },
  { id: 5, name: 'Budget Utilization Report', date: '2023-06-25', type: 'financial' },
];

const Reports = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [reportData, setReportData] = useState(reportsList);

  // Handle report generation
  const handleGenerateReport = () => {
    toast.success('Report generation started. It will be ready in a few moments.');
    
    // Simulate report generation with a delay
    setTimeout(() => {
      toast.success('Report generated successfully!');
    }, 2000);
  };

  // Handle report download
  const handleDownloadReport = (reportId: number) => {
    toast.success(`Downloading report #${reportId}...`);
    // In a real app, this would trigger a file download
  };

  // Handle report sharing
  const handleShareReport = (reportId: number) => {
    toast.success(`Share dialog opened for report #${reportId}`);
    // In a real app, this would open a sharing dialog
  };

  // Handle report filtering
  const handleFilterReports = (type: string) => {
    setSelectedReportType(type);
    
    if (type === 'all') {
      setReportData(reportsList);
    } else {
      const filtered = reportsList.filter(report => report.type === type);
      setReportData(filtered);
    }
  };

  // Handle creating a new report
  const handleCreateReport = () => {
    toast.success('New report creation started');
    // In a real app, this would open a form or dialog
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-1">
                View insights and generate reports about your projects
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={handleGenerateReport} className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="reports">Reports List</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Productivity Chart */}
                <Card className="col-span-full md:col-span-2">
                  <CardHeader>
                    <CardTitle>Project Productivity</CardTitle>
                    <CardDescription>Task completion by status over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productivityData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                          <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="In Progress" />
                          <Bar dataKey="notStarted" stackId="a" fill="#f97316" name="Not Started" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Team Workload Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Workload</CardTitle>
                    <CardDescription>Tasks assigned per team member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={workloadData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {workloadData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Performance Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Overall performance percentage over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={performanceData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="performance" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Reports List Tab */}
            <TabsContent value="reports" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Select 
                    value={selectedReportType} 
                    onValueChange={handleFilterReports}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleCreateReport} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Report
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>
                    {reportData.length} report{reportData.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.length > 0 ? (
                      reportData.map((report) => (
                        <div 
                          key={report.id} 
                          className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium">{report.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleShareReport(report.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReport(report.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileDown className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">No reports found</h3>
                        <p className="text-muted-foreground">
                          No reports match your current filter criteria
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline">Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;
