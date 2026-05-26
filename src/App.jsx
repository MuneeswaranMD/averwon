import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/Common/FloatingWidgets';
import Preloader from './components/Common/Preloader';

// Website Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Support from './pages/Support';

// Employee Portal Pages
import EmployeeLogin from './employee/Login';
import EmployeeLayout from './employee/EmployeeLayout';
import EmployeeDashboard from './employee/Dashboard';
import EmployeeProfile from './employee/Profile';
import EmployeeTasks from './employee/Tasks';
import EmployeeAttendance from './employee/Attendance';
import EmployeeLeaves from './employee/Leaves';
import EmployeeMeetings from './employee/Meetings';
import EmployeeCalendar from './employee/Calendar';
import EmployeeNotifications from './employee/Notifications';
import EmployeeDocuments from './employee/Documents';
import EmployeeSettings from './employee/Settings';
import EmployeeProjects from './employee/Projects';
import EmployeeActivities from './employee/ActivityLogs';
import EmployeeTools from './employee/Tools';
import EmployeeChat from './employee/Chat';

// New Sales & CRM + System Admin Pages
import SalesDashboard from './employee/SalesDashboard';
import Leads from './employee/Leads';
import Deals from './employee/Deals';
import Admins from './employee/Admins';
import SystemSettings from './employee/SystemSettings';

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

// Inner app (needs useLocation inside Router)
const AppInner = () => {
  const location = useLocation();
  const isEmployeeRoute = location.pathname.startsWith('/employee');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isEmployeeRoute && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Website Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/support" element={<PageTransition><Support /></PageTransition>} />

            {/* Employee Portal Routes */}
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route path="dashboard" element={<PageTransition><EmployeeDashboard /></PageTransition>} />
              <Route path="profile" element={<PageTransition><EmployeeProfile /></PageTransition>} />
              <Route path="projects" element={<PageTransition><EmployeeProjects /></PageTransition>} />
              <Route path="tasks" element={<PageTransition><EmployeeTasks /></PageTransition>} />
              <Route path="attendance" element={<PageTransition><EmployeeAttendance /></PageTransition>} />
              <Route path="leaves" element={<PageTransition><EmployeeLeaves /></PageTransition>} />
              <Route path="meetings" element={<PageTransition><EmployeeMeetings /></PageTransition>} />
              <Route path="activities" element={<PageTransition><EmployeeActivities /></PageTransition>} />
              <Route path="tools" element={<PageTransition><EmployeeTools /></PageTransition>} />
              <Route path="chat" element={<PageTransition><EmployeeChat /></PageTransition>} />
              <Route path="calendar" element={<PageTransition><EmployeeCalendar /></PageTransition>} />
              <Route path="notifications" element={<PageTransition><EmployeeNotifications /></PageTransition>} />
              <Route path="documents" element={<PageTransition><EmployeeDocuments /></PageTransition>} />
              <Route path="settings" element={<PageTransition><EmployeeSettings /></PageTransition>} />
              
              {/* Sales & CRM Nested Routes */}
              <Route path="sales/dashboard" element={<PageTransition><SalesDashboard /></PageTransition>} />
              <Route path="sales/leads" element={<PageTransition><Leads /></PageTransition>} />
              <Route path="sales/deals" element={<PageTransition><Deals /></PageTransition>} />
              
              {/* Admin Access & Global Settings System Routes */}
              <Route path="admin/admins" element={<PageTransition><Admins /></PageTransition>} />
              <Route path="admin/settings" element={<PageTransition><SystemSettings /></PageTransition>} />
              
              <Route index element={<EmployeeDashboard />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!isEmployeeRoute && <Footer />}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disabled preloader for better UX during development/portal testing
    // const timer = setTimeout(() => setLoading(false), 2000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <AppInner />
    </Router>
  );
}

export default App;
