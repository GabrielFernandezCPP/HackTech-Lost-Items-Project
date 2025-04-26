import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard';
import AuthProvider from './components/AuthProvider';
import LostItemPage from './components/LostItemPage';

function App() {
    const APP_TITLE = "Title";
    return (
    <>
        <div className="flex h-screen">
            <Navbar title={APP_TITLE}></Navbar>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/lost/:uuid" element={<LostItemPage />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </div>
    </>
)
}

export default App
