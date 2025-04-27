import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import Register from './components/Register';
import { useAuth } from './components/AuthProvider';
import LostItemPage from './components/LostItemPage';

function App() {
    const APP_TITLE = "Title";
    const { user } = useAuth();
    
    return (
    <>
        <div className="flex h-screen w-screen">
            <BrowserRouter>
                <Navbar></Navbar>
                <Routes>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/lost/:uuid" element={<LostItemPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    </>
)
}

export default App
