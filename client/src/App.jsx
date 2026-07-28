import { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AllLeads from './components/AllLeads';
import Settings from './components/Settings';
import Login from './components/Login';

function AppContent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://leadcraft-saas.onrender.com/api/leads",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/'); // always land on Dashboard after login
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate('/'); // reset the url so next login starts clean
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard leads={leads} setLeads={setLeads} />} />
          <Route path="/leads" element={<AllLeads leads={leads} setLeads={setLeads} />} />
          <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;