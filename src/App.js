// FINAL CLEANED APP.JS CODE
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Login/AuthContext';
import LoginPage from './components/Login/LoginPage';
import SignUpPage from './components/Login/SignUpPage';
import ForgotPasswordPage from './components/Login/ForgotPasswordPage';
import CustomerApp from './CustomerApp';
import TechnicianApp from './TechnicianApp';
import AdminApp from './AdminApp';
import Header from './components/Header';
import Footer from './components/Footer';


const AppContent = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }
    
    const isUserLoggedIn = !!user;
    const currentPathIsPublic = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
    
    // Determine the user's intended base app component
    let AppRouter;
    if (user?.role === 'customer') AppRouter = CustomerApp;
    else if (user?.role === 'technician') AppRouter = TechnicianApp;
    else if (user?.role === 'admin') AppRouter = AdminApp;
    else AppRouter = LoginPage;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header user={user} />
            
            <main style={{ flexGrow: 1 }}>
                <Routes>
                    {/* 1. Static Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* 2. Logged-in/Role Routes - Catch all subpaths */}
                    {isUserLoggedIn && (
                        <Route path="/*" element={<AppRouter />} />
                    )}

                    {/* 3. Logged-out Catch-all */}
                    {!isUserLoggedIn && !currentPathIsPublic && (
                        // If not logged in and not on a public path, redirect to login
                        <Route path="/*" element={<Navigate to="/login" replace />} />
                    )}

                    {/* 4. Final Fallback (Render app/login if no specific path is matched) */}
                    {isUserLoggedIn && <Route path="/" element={<AppRouter />} />}
                    {!isUserLoggedIn && <Route path="/" element={<LoginPage />} />}
                </Routes>
            </main>
            
            <Footer />
        </div>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;