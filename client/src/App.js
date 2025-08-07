import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThreeDots } from 'react-loader-spinner';

// Layout Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

// Page Components
import Home from './pages/Home';
import Builder from './pages/Builder';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import { PaymentProvider } from './context/PaymentContext';

const theme = createTheme({
  palette: {
    primary: { main: '#3e6bff' },
    secondary: { main: '#ff3e3e' },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '3rem' },
    h2: { fontWeight: 700, fontSize: '2.5rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdTokenResult();
        setIsAdmin(!!token.claims.admin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#f8fafc'
      }}>
        <ThreeDots height="80" width="80" radius="9" color="#3e6bff" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider value={{ user, isAdmin }}>
        <ResumeProvider>
          <PaymentProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
                    <Route path="/otp-verify" element={<OtpVerification />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/builder" element={<Builder />} />
                      <Route path="/builder/:resumeId" element={<Builder />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    <Route element={<AdminProtectedRoute />}>
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/users" element={<Admin tab="users" />} />
                      <Route path="/admin/resumes" element={<Admin tab="resumes" />} />
                      <Route path="/admin/payments" element={<Admin tab="payments" />} />
                      <Route path="/admin/templates" element={<Admin tab="templates" />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </PaymentProvider>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
