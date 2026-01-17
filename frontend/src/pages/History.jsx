import React, { useState } from 'react';
import Modal from '../components/Modal';
import BerthScheduleChart from '../components/BerthScheduleChart';

function History({ solutions }) {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState(new Set());
  const [chartData, setChartData] = useState({});

  const handleViewDetails = async (problemId) => {
    try {
      const response = await fetch('/solution/' + problemId);
      const data = await response.json();
      setSelectedSolution(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching solution details:', error);
    }
  };

  const handleDelete = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this solution?')) return;

    try {
      const response = await fetch('/solution/' + problemId, { method: 'DELETE' });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting solution:', error);
    }
  };

  const toggleChart = async (problemId) => {
    const newExpanded = new Set(expandedCharts);
    
    if (newExpanded.has(problemId)) {
      // Collapse chart
      newExpanded.delete(problemId);
    } else {
      // Expand chart - fetch solution data if not already cached
      if (!chartData[problemId]) {
        try {
          const response = await fetch('/solution/' + problemId);
          const data = await response.json();
          setChartData(prev => ({ ...prev, [problemId]: data }));
        } catch (error) {
          console.error('Error fetching solution details:', error);
          return;
        }
      }
      newExpanded.add(problemId);
    }
    
    setExpandedCharts(newExpanded);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 mx-8 mt-8 mb-8 bg-white rounded-xl shadow-soft p-6 border border-secondary-100 animate-fade-in-up flex flex-col overflow-hidden">
        <div className="mb-6 border-b border-secondary-200 pb-4">
          <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <span>📋</span> Saved Solutions
          </h3>
        </div>

        {solutions.length > 0 ? (
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-secondary-300">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Problem ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Vessels</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Makespan</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Solve Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutions.map(sol => (
                  <React.Fragment key={sol.problem_id}>
                    <tr className="hover:bg-secondary-50 transition-colors border-b border-secondary-100">
                      <td className="py-3 px-4"><code className="text-xs bg-secondary-100 px-2 py-1 rounded text-primary font-mono">{sol.problem_id.substring(0, 12)}...</code></td>
                      <td className="py-3 px-4"><span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">{sol.num_vessels}</span></td>
                      <td className="py-3 px-4"><span className="font-bold text-primary text-lg">{sol.makespan}</span> <span className="text-secondary-600 text-sm">hrs</span></td>
                      <td className="py-3 px-4 text-secondary-600">{(parseFloat(sol.solving_time) * 1000).toFixed(0)} ms</td>
                      <td className="py-3 px-4 text-secondary-600 text-sm">{new Date(sol.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => toggleChart(sol.problem_id)}
                          className="px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-1"
                          title="Show Gantt Chart"
                        >
                          <span>{expandedCharts.has(sol.problem_id) ? '📊' : '📈'}</span>
                          {expandedCharts.has(sol.problem_id) ? 'Hide' : 'Chart'}
                        </button>
                        <button
                          onClick={() => handleViewDetails(sol.problem_id)}
                          className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(sol.problem_id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedCharts.has(sol.problem_id) && chartData[sol.problem_id] && (
                      <tr>
                        <td colSpan="6" className="p-6 bg-secondary-50 border-b border-secondary-200">
                          <BerthScheduleChart 
                            schedule={chartData[sol.problem_id].schedule}
                            numBerths={chartData[sol.problem_id].num_berths || 2}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-secondary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-secondary-600 text-lg font-medium">No solutions saved yet</p>
            <p className="text-secondary-400 text-sm mt-2">Create one from the Solver tab to get started!</p>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showModal}
        title="📊 Solution Details"
        onClose={() => setShowModal(false)}
        footer={
          <button
            onClick={() => setShowModal(false)}
            className="btn-secondary px-6 py-2"
          >
            Close
          </button>
        }
      >
        {selectedSolution && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Makespan</p>
                <p className="text-2xl font-bold text-primary">{selectedSolution.makespan} <span className="text-sm text-secondary-600">hours</span></p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Solve Time</p>
                <p className="text-2xl font-bold text-accent">{(parseFloat(selectedSolution.solving_time) * 1000).toFixed(0)} <span className="text-sm text-secondary-600">ms</span></p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Problem ID</p>
                <code className="text-xs text-secondary-700 break-all font-mono">{selectedSolution.problem_id}</code>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Solved At</p>
                <p className="text-sm text-secondary-700">{new Date(selectedSolution.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <span>⚓</span> Schedule Details
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-secondary-300">
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Vessel</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Berth</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Arrives</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Starts</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Ends</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {selectedSolution.schedule && Object.entries(selectedSolution.schedule).map(([vesselId, schedule]) => {
                      const waitTime = schedule.start_time - schedule.arrival_time;
                      return (
                        <tr key={vesselId} className="hover:bg-blue-50 transition-colors">
                          <td className="py-2 px-3"><span className="font-bold text-primary">{vesselId}</span></td>
                          <td className="py-2 px-3 text-secondary-700">{schedule.berth}</td>
                          <td className="py-2 px-3 text-secondary-700">{schedule.arrival_time}h</td>
                          <td className="py-2 px-3 text-secondary-700">{schedule.start_time}h</td>
                          <td className="py-2 px-3 text-secondary-700">{schedule.end_time}h</td>
                          <td className="py-2 px-3"><span className="font-semibold text-secondary-700">{waitTime}h</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default History;
