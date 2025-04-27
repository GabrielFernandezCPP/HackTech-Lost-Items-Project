import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import Register from './components/Register';

function App() {
    const APP_TITLE = "Title";
    
    return (
    <>
        <div className="flex h-screen">
            <Navbar title={APP_TITLE}></Navbar>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    </>
)
}

export default App
