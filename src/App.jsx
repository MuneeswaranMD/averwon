import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Layout — eagerly loaded (needed on every page)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/Common/FloatingWidgets';
import Preloader from './components/Common/Preloader';

// Website Pages — lazy loaded
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Support = lazy(() => import('./pages/Support'));
const ClientFeedback = lazy(() => import('./pages/ClientFeedback'));
const Products = lazy(() => import('./pages/Products'));
const CrackersPos = lazy(() => import('./pages/CrackersPos'));
const PosDemo = lazy(() => import('./pages/PosDemo'));

// Employee Portal Pages — lazy loaded (separate chunk group)
const EmployeeLogin = lazy(() => import('./employee/Login'));
const EmployeeLayout = lazy(() => import('./employee/EmployeeLayout'));
const EmployeeDashboard = lazy(() => import('./employee/Dashboard'));
const EmployeeProfile = lazy(() => import('./employee/Profile'));
const EmployeeTasks = lazy(() => import('./employee/Tasks'));
const EmployeeAttendance = lazy(() => import('./employee/Attendance'));
const EmployeeLeaves = lazy(() => import('./employee/Leaves'));
const EmployeeMeetings = lazy(() => import('./employee/Meetings'));
const EmployeeCalendar = lazy(() => import('./employee/Calendar'));
const EmployeeNotifications = lazy(() => import('./employee/Notifications'));
const EmployeeDocuments = lazy(() => import('./employee/Documents'));
const EmployeeSettings = lazy(() => import('./employee/Settings'));
const EmployeeProjects = lazy(() => import('./employee/Projects'));
const EmployeeActivities = lazy(() => import('./employee/ActivityLogs'));
const EmployeeTools = lazy(() => import('./employee/Tools'));
const EmployeeChat = lazy(() => import('./employee/Chat'));

// Sales & CRM + System Admin Pages — lazy loaded
const SalesDashboard = lazy(() => import('./employee/SalesDashboard'));
const Leads = lazy(() => import('./employee/Leads'));
const Deals = lazy(() => import('./employee/Deals'));
const Admins = lazy(() => import('./employee/Admins'));
const SystemSettings = lazy(() => import('./employee/SystemSettings'));

// Minimal fallback spinner (no dependencies)
const PageFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#003366', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
);

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
  const isDemoRoute = location.pathname.startsWith('/demo');
  const hideStandardNav = isEmployeeRoute || isDemoRoute;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideStandardNav && <Navbar />}
      <main className="flex-grow">
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Website Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/products/crackers-pos" element={<PageTransition><CrackersPos /></PageTransition>} />
            <Route path="/demo/retail-pos" element={<PosDemo />} />
            <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
            <Route path="/feedback/:token" element={<PageTransition><ClientFeedback /></PageTransition>} />

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
      </Suspense>

      </main>
      {!hideStandardNav && <Footer />}
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
