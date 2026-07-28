import { useState,useEffect } from 'react';
import KanbanBoard from "../components/KanbanBoard";
import axios from "axios";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const Dashboard = ({ leads, setLeads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("table");
  const [editingLead, setEditingLead] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
 const [newLead, setNewLead] = useState({
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'New'
});

   useEffect(() => {
  if (editingLead) {
    setNewLead({
      name: editingLead.name,
      company: editingLead.company,
      email: editingLead.email,
      phone: editingLead.phone,
      status: editingLead.status,
    });
  }
}, [editingLead]);
  const [error, setError] = useState('');

  const handleAddLead = async () => {
  if (
    !newLead.name.trim() ||
    !newLead.company.trim() ||
    !newLead.email.trim() ||
    !newLead.phone.trim()
  ) {
    setError("All fields are required.");
    return;
  }

  if (!/^\d{10}$/.test(newLead.phone)) {
  setError("Phone number must contain exactly 10 digits.");
  return;
}

if (!/\S+@\S+\.\S+/.test(newLead.email)) {
  setError("Enter a valid email address.");
  return;
}
setLoading(true);
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/leads",
      newLead,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   setLeads([...leads, response.data.lead]);
   toast.success("Lead created successfully!");
    setNewLead({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "New",
    });

    setError("");
    setIsModalOpen(false);
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Unable to connect to server");
    }
  }
  finally {
  setLoading(false);
}
};

const handleUpdateLead = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/leads/${editingLead._id}`,
      newLead,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLeads(
      leads.map((lead) =>
        lead._id === editingLead._id ? response.data.lead : lead
      )
    );
    toast.success("Lead updated successfully!");

    setEditingLead(null);

    setNewLead({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "New",
    });

    setIsModalOpen(false);
  } catch (err) {
    console.log(err);
  }
  finally {
   setLoading(false);
}
};

  const handleDeleteLead = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/leads/${selectedLead._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLeads(
      leads.filter((lead) => lead._id !== selectedLead._id)
    );

    toast.success("Lead deleted successfully!");

    setSelectedLead(null);
  } catch (err) {
    console.log(err);
  }
  finally {
   setLoading(false);
}
};

  const filteredLeads = leads.filter((lead) => {
  const matchesSearch = lead.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || lead.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  const totalLeads = leads.length;
  const activeLeads = leads.filter(lead => lead.status === 'New' || lead.status === 'Contacted').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'Qualified').length;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  const chartData = [
    { name: "New", value: leads.filter((lead) => lead.status === "New").length },
    { name: "Contacted", value: leads.filter((lead) => lead.status === "Contacted").length },
    { name: "Qualified", value: leads.filter((lead) => lead.status === "Qualified").length },
  ].filter((entry) => entry.value > 0);

  const COLORS = { New: "#2563eb", Contacted: "#eab308", Qualified: "#16a34a" };

  const buildWeeklyTrend = () => {
    const buckets = {};

    leads.forEach((lead) => {
      if (!lead.createdAt) return;
      const date = new Date(lead.createdAt);
      const day = date.getDay() || 7;
      const monday = new Date(date);
      monday.setDate(date.getDate() - day + 1);
      const key = monday.toISOString().slice(0, 10);
      buckets[key] = (buckets[key] || 0) + 1;
    });

    return Object.entries(buckets)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([week, count]) => ({
        week: new Date(week).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        count,
      }));
  };

  const trendData = buildWeeklyTrend();
console.log(selectedLead);
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">

      {/* Header row: title + primary action together */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Lead Dashboard</h1>
          {role !== "Sales Executive" && (
         <button
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium whitespace-nowrap"
       >
       + Add New Lead
      </button>
     )}
      </div>

      {/* Search + filters + view toggle, all together */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <input
            type="text"
            placeholder="Search leads by name..."
            className="px-4 py-2 border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {["All", "New", "Contacted", "Qualified"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              view === "table"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              view === "kanban"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-300"
            }`}
          >
            Kanban View
          </button>
        </div>
      </div>

      {/* MAIN FEATURE: table or kanban, front and center */}
      {view === "table" ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-10">
          <table className="min-w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700">Name</th>
                <th className="p-4 font-semibold text-slate-700">Company</th>
                <th className="p-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 italic">
                    No leads found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
    key={lead._id}
    onClick={() => setSelectedLead(lead)}
    className="hover:bg-slate-50 transition-colors cursor-pointer"
       >
                    <td className="p-4 text-slate-800 font-medium">{lead.name}</td>
                    <td className="p-4 text-slate-600">{lead.company}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                        lead.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                        'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mb-10">
          <KanbanBoard
    leads={filteredLeads}
    setLeads={setLeads}
     />
        </div>
      )}

       {role !== "Sales Executive" && (
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Analytics</h2>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 grid grid-cols-3 divide-x divide-slate-200 mb-6">
          <div className="p-4 text-center">
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Leads</h3>
            <p className="text-xl font-bold text-slate-900 mt-1">{totalLeads}</p>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">Active</h3>
            <p className="text-xl font-bold text-blue-600 mt-1">{activeLeads}</p>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">Conversion</h3>
            <p className="text-xl font-bold text-green-600 mt-1">{conversionRate}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
            <div className="h-64">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  No leads yet — add one to see the breakdown.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4">Leads Added Over Time</h3>
            <div className="h-64">
              {trendData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-6">
                  Add leads over multiple days to see a trend line here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
           <h2 className="text-xl font-bold mb-4">
             {editingLead ? "Edit Lead" : "Add New Lead"}
          </h2>
            
            {error && <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>}

            <input 
              className={`w-full p-2 border ${error && !newLead.name ? 'border-red-500' : 'border-slate-300'} rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400`} 
              placeholder="Name" 
              value={newLead.name}
              onChange={(e) => setNewLead({...newLead, name: e.target.value})}
            />
            <input 
              className={`w-full p-2 border ${error && !newLead.company ? 'border-red-500' : 'border-slate-300'} rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400`} 
              placeholder="Company" 
              value={newLead.company}
              onChange={(e) => setNewLead({...newLead, company: e.target.value})}
            />

       <input
      className="w-full p-2 border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
        placeholder="Email"
        type="email"
        value={newLead.email}
        onChange={(e) =>
         setNewLead({ ...newLead, email: e.target.value })
          }
         />

         <input
           className="w-full p-2 border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
           placeholder="Phone Number"
             value={newLead.phone}
             onChange={(e) =>
               setNewLead({ ...newLead, phone: e.target.value })
             }
           />
            
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => { 
                  setIsModalOpen(false);
                  setError(''); 
                }} 
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
             <button
               onClick={editingLead ? handleUpdateLead : handleAddLead}
              disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
             >
           {loading ? "Saving..." : "Save"}
         </button>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[450px] shadow-xl">

      <h2 className="text-2xl font-bold text-slate-800 mb-6">
      👤 Lead Details
     </h2>
      <div className="space-y-4">

  <div>
    <p className="text-sm text-slate-500">Name</p>
    <p className="text-lg font-semibold">{selectedLead.name}</p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Company</p>
    <p className="font-medium">{selectedLead.company}</p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Email</p>
    <p>{selectedLead.email}</p>
  </div>

  <div>
    <p className="text-sm text-slate-500">Phone</p>
    <p>{selectedLead.phone}</p>
  </div>

  <div>
    <p className="text-sm text-slate-500 mb-1">Status</p>

    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        selectedLead.status === "New"
          ? "bg-blue-100 text-blue-700"
          : selectedLead.status === "Contacted"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {selectedLead.status}
    </span>

  </div>

</div>

     <div className="flex justify-between items-center mt-8">

  <div className="space-x-2">

    {role !== "Sales Executive" && (
  <button
    onClick={() => {
      setEditingLead(selectedLead);
      setSelectedLead(null);
      setIsModalOpen(true);
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
  >
    Edit
  </button>
)}

    {role === "Admin" && (
  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
  >
    Delete
  </button>
)}

  </div>

  <button
    onClick={() => setSelectedLead(null)}
    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg"
  >
    Close
  </button>

   </div>

    </div>
  </div>
)}

   {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">

      <h2 className="text-xl font-bold text-red-600 mb-3">
        Delete Lead
      </h2>

      <p className="text-slate-600 mb-6">
        Are you sure you want to delete
        <span className="font-semibold">
          {" "}
          {selectedLead?.name}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleDeleteLead();
            setShowDeleteConfirm(false);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;