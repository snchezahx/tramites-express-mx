import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin-gestor-seguro" element={<AdminLogin />} />
                <Route path="/admin-gestor-seguro/dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
