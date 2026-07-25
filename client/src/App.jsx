import { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AllLeads from './components/AllLeads';
import Settings from './components/Settings';
import Login from './components/Login';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/leads",
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

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard leads={leads} setLeads={setLeads} />} />
            <Route path="/leads" element={<AllLeads leads={leads} setLeads={setLeads} />} />
           <Route path="/settings" element={<Settings onLogout={() => setIsAuthenticated(false)} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;