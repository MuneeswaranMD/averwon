import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Layout — eagerly loaded (needed on every page)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/Common/FloatingWidgets';
import Preloader from './components/Common/Preloader';

// Website Core Pages — lazy loaded
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Support = lazy(() => import('./pages/Support'));
const ClientFeedback = lazy(() => import('./pages/ClientFeedback'));
const PosDemo = lazy(() => import('./pages/PosDemo'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Service Landing Pages — lazy loaded
const WebsiteDevelopment = lazy(() => import('./pages/services/WebsiteDevelopment'));
const SoftwareDevelopment = lazy(() => import('./pages/services/SoftwareDevelopment'));
const WebApplicationDevelopment = lazy(() => import('./pages/services/WebApplicationDevelopment'));
const EcommerceDevelopment = lazy(() => import('./pages/services/EcommerceDevelopment'));
const DigitalMarketing = lazy(() => import('./pages/services/DigitalMarketing'));
const SeoServices = lazy(() => import('./pages/services/SeoServices'));
const MobileAppDevelopment = lazy(() => import('./pages/services/MobileAppDevelopment'));
const AiDevelopment = lazy(() => import('./pages/services/AiDevelopment'));
const CloudDevops = lazy(() => import('./pages/services/CloudDevops'));
const UiUxDesign = lazy(() => import('./pages/services/UiUxDesign'));
const CustomErpDevelopment = lazy(() => import('./pages/services/CustomErpDevelopment'));

// Product Landing Pages — lazy loaded
const Products = lazy(() => import('./pages/Products'));
const CrackersPos = lazy(() => import('./pages/CrackersPos'));
const RestaurantPos = lazy(() => import('./pages/products/RestaurantPos'));
const AverqonErp = lazy(() => import('./pages/products/AverqonErp'));
const BillingSoftware = lazy(() => import('./pages/products/BillingSoftware'));
const BusinessManagementSoftware = lazy(() => import('./pages/products/BusinessManagementSoftware'));
const InventoryManagement = lazy(() => import('./pages/products/InventoryManagement'));
const PosSoftware = lazy(() => import('./pages/products/PosSoftware'));

// Blog Pages — lazy loaded
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

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

// Minimal fallback spinner
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
            {/* Core Website Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
            <Route path="/demo/retail-pos" element={<PosDemo />} />
            <Route path="/feedback/:token" element={<PageTransition><ClientFeedback /></PageTransition>} />

            {/* 11 Service Landing Pages */}
            <Route path="/website-development" element={<PageTransition><WebsiteDevelopment /></PageTransition>} />
            <Route path="/software-development" element={<PageTransition><SoftwareDevelopment /></PageTransition>} />
            <Route path="/web-application-development" element={<PageTransition><WebApplicationDevelopment /></PageTransition>} />
            <Route path="/ecommerce-development" element={<PageTransition><EcommerceDevelopment /></PageTransition>} />
            <Route path="/digital-marketing" element={<PageTransition><DigitalMarketing /></PageTransition>} />
            <Route path="/seo-services" element={<PageTransition><SeoServices /></PageTransition>} />
            <Route path="/mobile-app-development" element={<PageTransition><MobileAppDevelopment /></PageTransition>} />
            <Route path="/ai-development" element={<PageTransition><AiDevelopment /></PageTransition>} />
            <Route path="/cloud-devops" element={<PageTransition><CloudDevops /></PageTransition>} />
            <Route path="/ui-ux-design" element={<PageTransition><UiUxDesign /></PageTransition>} />
            <Route path="/custom-erp-development" element={<PageTransition><CustomErpDevelopment /></PageTransition>} />

            {/* Legacy /services/ aliases -> 301-style client redirects */}
            <Route path="/services/software-development" element={<Navigate to="/software-development" replace />} />
            <Route path="/services/saas-development" element={<Navigate to="/software-development" replace />} />
            <Route path="/services/web-application-development" element={<Navigate to="/web-application-development" replace />} />
            <Route path="/services/ai-development" element={<Navigate to="/ai-development" replace />} />
            <Route path="/services/cloud-services" element={<Navigate to="/cloud-devops" replace />} />
            <Route path="/services/ui-ux-design" element={<Navigate to="/ui-ux-design" replace />} />

            {/* Product Directory & Landing Pages */}
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/products/crackers-pos" element={<PageTransition><CrackersPos /></PageTransition>} />
            <Route path="/products/restaurant-pos" element={<PageTransition><RestaurantPos /></PageTransition>} />
            <Route path="/products/averqon-erp" element={<PageTransition><AverqonErp /></PageTransition>} />
            <Route path="/products/billing-software" element={<PageTransition><BillingSoftware /></PageTransition>} />
            <Route path="/products/business-management-software" element={<PageTransition><BusinessManagementSoftware /></PageTransition>} />
            <Route path="/products/inventory-management" element={<PageTransition><InventoryManagement /></PageTransition>} />
            <Route path="/products/pos-software" element={<PageTransition><PosSoftware /></PageTransition>} />

            {/* Blog & Content Marketing Routes */}
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />

            {/* Direct blog slug aliases if linked directly */}
            <Route path="/how-to-choose-best-pos-software" element={<Navigate to="/blog/how-to-choose-best-pos-software" replace />} />
            <Route path="/benefits-of-restaurant-billing-software" element={<Navigate to="/blog/benefits-of-restaurant-billing-software" replace />} />
            <Route path="/why-schools-need-school-erp-software" element={<Navigate to="/blog/why-schools-need-school-erp-software" replace />} />
            <Route path="/custom-software-development-small-business" element={<Navigate to="/blog/custom-software-development-small-business" replace />} />
            <Route path="/how-seo-helps-businesses-grow-india" element={<Navigate to="/blog/how-seo-helps-businesses-grow-india" replace />} />
            <Route path="/ecommerce-website-development-guide" element={<Navigate to="/blog/ecommerce-website-development-guide" replace />} />
            <Route path="/inventory-management-software-retail" element={<Navigate to="/blog/inventory-management-software-retail" replace />} />
            <Route path="/ai-automation-improve-business-operations" element={<Navigate to="/blog/ai-automation-improve-business-operations" replace />} />

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

            {/* 404 Catch-All Route */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
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
    // Disabled preloader for fast UX
  }, []);

  return (
    <Router>
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <AppInner />
    </Router>
  );
}

export default App;
