/**
 * App.tsx
 * Main application component
 */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { ThemeProvider } from './context/ThemeContext';

// Auth components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard components
import Dashboard from './pages/dashboard/Dashboard';
import SiteList from './pages/dashboard/SiteList';
import SiteCreate from './pages/dashboard/SiteCreate';
import SiteEdit from './pages/dashboard/SiteEdit';

// Builder components
import PageEditor from './pages/builder/PageEditor';
import ThemeEditor from './pages/builder/ThemeEditor';
import SitePreview from './pages/builder/SitePreview';
import PageList from './pages/builder/PageList';
// Public site
import PublicSite from './pages/public/PublicSite';

// Layout components
import DashboardLayout from './components/layouts/DashboardLayout';
import BuilderLayout from './components/layouts/BuilderLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Routes
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

// Default theme
const defaultTheme = {
  primaryColor: 'blue-600',
  secondaryColor: 'purple-600',
  fontFamily: 'sans',
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <PublicRoute>
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <AuthLayout>
                  <Register />
                </AuthLayout>
              </PublicRoute>
            } />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/sites" element={
              <PrivateRoute>
                <DashboardLayout>
                  <SiteList />
                </DashboardLayout>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/sites/create" element={
              <PrivateRoute>
                <DashboardLayout>
                  <SiteCreate />
                </DashboardLayout>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/sites/:siteId" element={
              <PrivateRoute>
                <DashboardLayout>
                  <SiteEdit />
                </DashboardLayout>
              </PrivateRoute>
            } />
            
            {/* Builder Routes */}
            {/* <Route path="/builder/:siteId/pages/:pageId" element={
              <PrivateRoute>
                <BuilderLayout>
                  <PageEditor />
                </BuilderLayout>
              </PrivateRoute>
            } /> */}

            <Route path="/builder/:siteId/pages" element={
              <PrivateRoute>
                <BuilderLayout>
                  <PageList />
                </BuilderLayout>
              </PrivateRoute>
            } />
            
            {/* <Route path="/builder/:siteId/pages" element={
              <PrivateRoute>
                <BuilderLayout>
                </BuilderLayout>
              </PrivateRoute>
            } /> */}

            
            
            <Route path="/builder/:siteId/theme" element={
              <PrivateRoute>
                <BuilderLayout>
                  <ThemeEditor />
                </BuilderLayout>
              </PrivateRoute>
            } />
            
            {/* Public Site - Catch-all for custom domains */}
            <Route path="/" element={<PublicSite />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;