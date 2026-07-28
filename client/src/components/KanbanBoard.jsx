import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const COLUMNS = [
  { id: 'New', title: 'New', color: 'text-blue-600' },
  { id: 'Contacted', title: 'Contacted', color: 'text-yellow-600' },
  { id: 'Qualified', title: 'Qualified', color: 'text-green-600' },
];

const LeadCard = ({ lead, index }) => (
  <Draggable draggableId={lead._id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white rounded-lg shadow p-4 mb-4 border border-slate-200 cursor-grab active:cursor-grabbing ${
          snapshot.isDragging ? 'ring-2 ring-slate-400 shadow-md' : ''
        }`}
      >
        <h4 className="font-semibold text-slate-800">{lead.name}</h4>
        <p className="text-sm text-slate-600">{lead.company}</p>
        <p className="text-xs text-slate-500 mt-2">{lead.email}</p>
        <p className="text-xs text-slate-500">{lead.phone}</p>
      </div>
    )}
  </Draggable>
);

const KanbanBoard = ({ leads, setLeads }) => {
  const leadsByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = leads.filter((lead) => lead.status === col.id);
    return acc;
  }, {});

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside any column, or dropped back in the same spot: do nothing
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const previousLeads = leads;

    // Optimistic update: move the card immediately so the UI feels instant
    setLeads((current) =>
      current.map((lead) =>
        lead._id === draggableId ? { ...lead, status: newStatus } : lead
      )
    );

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/leads/${draggableId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reconcile with the actual server response
      setLeads((current) =>
        current.map((lead) => (lead._id === draggableId ? response.data.lead : lead))
      );
    } catch (error) {
      // Roll back if the request failed, so UI and DB never silently drift apart
      setLeads(previousLeads);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Unable to connect to server');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-2xl font-bold mb-6">Kanban Board</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="bg-slate-100 rounded-lg p-4 min-h-[450px]">
              <h3 className={`${col.color} font-bold text-lg mb-4`}>
                {col.title} ({leadsByStatus[col.id].length})
              </h3>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[380px] rounded-md transition-colors ${
                      snapshot.isDraggingOver ? 'bg-slate-200/70' : ''
                    }`}
                  >
                    {leadsByStatus[col.id].length === 0 && (
                      <p className="text-sm text-slate-400 italic text-center py-10">
                        No leads here
                      </p>
                    )}
                    {leadsByStatus[col.id].map((lead, index) => (
                      <LeadCard key={lead._id} lead={lead} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;