import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

/* Layout */
import Layout from './components/Layout/Layout';

/* Auth Pages */
import Login    from './pages/Auth/Login';
import Register from './pages/Auth/Register';

/* App Pages */
import Dashboard   from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import Categories  from './pages/Categories/Categories';
import Budgets     from './pages/Budgets/Budgets';
import Savings     from './pages/Savings/Savings';
import Reports     from './pages/Reports/Reports';
import Profile     from './pages/Profile/Profile';

/* Global loading spinner */
import LoadingSpinner from './components/Common/LoadingSpinner';

/* =============================================
   ProtectedRoute – redirects to /login if not auth'd
   ============================================= */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg)'
      }}>
        <LoadingSpinner size="lg" text="Loading MoneyTrack..." />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/* =============================================
   PublicRoute – redirects to /dashboard if logged in
   ============================================= */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg)'
      }}>
        <LoadingSpinner size="lg" text="Loading MoneyTrack..." />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

/* =============================================
   App Routes
   ============================================= */
function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public / auth routes */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes – all wrapped inside Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Transactions">
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Categories">
              <Categories />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Budgets">
              <Budgets />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Savings Goals">
              <Savings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout pageTitle="Reports & Analytics">
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout pageTitle="My Profile">
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

/* =============================================
   Root App Component
   ============================================= */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
