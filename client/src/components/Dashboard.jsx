import { useState } from 'react';

const Dashboard = ({ leads, setLeads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', status: 'New' });
  const [error, setError] = useState('');

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLeads = leads.length;
  const activeLeads = leads.filter(lead => lead.status === 'New' || lead.status === 'Contacted').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'Qualified').length;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Lead Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium">Total Leads</h3>
          <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium">Active</h3>
          <p className="text-2xl font-bold text-blue-600">{activeLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium">Conversion</h3>
          <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input 
          type="text" 
          placeholder="Search leads by name..." 
          className="px-4 py-2 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          + Add New Lead
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
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
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            
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
                onClick={() => { 
                  if (!newLead.name.trim() || !newLead.company.trim()) {
                    setError('Both Name and Company are required.');
                    return; 
                  }

                  const leadToAdd = { ...newLead, id: Date.now() };
                  setLeads([...leads, leadToAdd]);
                  setNewLead({ name: '', company: '', status: 'New' });
                  setError(''); 
                  setIsModalOpen(false); 
                }} 
                className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;