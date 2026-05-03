import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from './store/authStore';

// Page Wrapper for Animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';

// Dashboard Layout
import DashboardLayout from './components/DashboardLayout';
import InstallPWA from './components/InstallPWA';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import ProductGenerator from './pages/dashboard/ProductGenerator';
import SEOGenerator from './pages/dashboard/SEOGenerator';
import AdsGenerator from './pages/dashboard/AdsGenerator';
import BusinessIdeas from './pages/dashboard/BusinessIdeas';
import SocialContent from './pages/dashboard/SocialContent';
import CompetitorAnalysis from './pages/dashboard/CompetitorAnalysis';
import MarketingCampaign from './pages/dashboard/MarketingCampaign';
import History from './pages/dashboard/History';
import Billing from './pages/dashboard/Billing';
import AffiliateDashboard from './pages/dashboard/AffiliateDashboard';
import Settings from './pages/dashboard/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAIRequests from './pages/admin/AdminAIRequests';
import AdminAffiliates from './pages/admin/AdminAffiliates';
import AdminLogs from './pages/admin/AdminLogs';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      <InstallPWA />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <PageWrapper><Login /></PageWrapper>}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <PageWrapper><Register /></PageWrapper>}
          />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PageWrapper><DashboardHome /></PageWrapper>} />
            <Route path="product" element={<PageWrapper><ProductGenerator /></PageWrapper>} />
            <Route path="seo" element={<PageWrapper><SEOGenerator /></PageWrapper>} />
            <Route path="ads" element={<PageWrapper><AdsGenerator /></PageWrapper>} />
            <Route path="business-ideas" element={<PageWrapper><BusinessIdeas /></PageWrapper>} />
            <Route path="social" element={<PageWrapper><SocialContent /></PageWrapper>} />
            <Route path="competitor" element={<PageWrapper><CompetitorAnalysis /></PageWrapper>} />
            <Route path="campaign" element={<PageWrapper><MarketingCampaign /></PageWrapper>} />
            <Route path="history" element={<PageWrapper><History /></PageWrapper>} />
            <Route path="billing" element={<PageWrapper><Billing /></PageWrapper>} />
            <Route path="affiliate" element={<PageWrapper><AffiliateDashboard /></PageWrapper>} />
            <Route path="settings" element={<PageWrapper><Settings /></PageWrapper>} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
            <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
            <Route path="payments" element={<PageWrapper><AdminPayments /></PageWrapper>} />
            <Route path="ai-requests" element={<PageWrapper><AdminAIRequests /></PageWrapper>} />
            <Route path="affiliates" element={<PageWrapper><AdminAffiliates /></PageWrapper>} />
            <Route path="logs" element={<PageWrapper><AdminLogs /></PageWrapper>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
