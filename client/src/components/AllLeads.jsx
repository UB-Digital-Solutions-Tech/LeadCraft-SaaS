
import { useState } from 'react';

const AllLeads = ({ leads, setLeads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingLead, setEditingLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastLead = currentPage * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleSaveEdit = () => {
  if (
    !editingLead.name.trim() ||
    !editingLead.company.trim()
  ) {
    alert("Name and Company cannot be empty.");
    return;
  }

  setLeads(
    leads.map((lead) =>
      lead.id === editingLead.id ? editingLead : lead
    )
  );

  setEditingLead(null);
};

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ["ID,Name,Company,Status\n"];
    const rows = filteredLeads.map(lead => `${lead.id},"${lead.name}","${lead.company}",${lead.status}\n`);
    const blob = new Blob(headers.concat(rows), { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leadcraft_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lead Management</h1>
        <button 
          onClick={handleExportCSV}
          disabled={filteredLeads.length === 0}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <input 
          type="text" 
          placeholder="Search name or company..." 
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="relative inline-block w-full sm:w-48">
          <select 
            className="w-full appearance-none py-2 pl-4 pr-10 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-colors"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700 text-sm">Name</th>
              <th className="p-4 font-semibold text-slate-700 text-sm">Company</th>
              <th className="p-4 font-semibold text-slate-700 text-sm">Status</th>
              <th className="p-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500 italic">
                  No leads found matching your filters.
                </td>
              </tr>
            ) : (
              currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-medium whitespace-nowrap">{lead.name}</td>
                  <td className="p-4 text-slate-600 whitespace-nowrap">{lead.company}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                      lead.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingLead(lead)} 
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors border border-blue-300 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)} 
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors border border-red-300 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{indexOfFirstLead + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(indexOfLastLead, filteredLeads.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{filteredLeads.length}</span> leads
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Lead</h2>
            <input 
              className="w-full p-2 border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400" 
              value={editingLead.name}
              onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
            />
            <input 
              className="w-full p-2 border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-400" 
              value={editingLead.company}
              onChange={(e) => setEditingLead({...editingLead, company: e.target.value})}
            />
            <select 
              className="w-full p-2 border border-slate-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={editingLead.status}
              onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
            </select>
            
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingLead(null)} className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllLeads;