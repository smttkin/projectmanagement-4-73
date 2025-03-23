
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Team from './pages/Team';
import ProjectDetail from './pages/ProjectDetail';
import Calendar from './pages/Calendar';
import Timeline from './pages/Timeline';
import DatabaseSchema from './pages/DatabaseSchema';
import Reports from './pages/Reports';
import Index from './pages/Index';
import Projects from './pages/Projects';

// Initialize QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/team" element={<Team />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/database-schema" element={<DatabaseSchema />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
