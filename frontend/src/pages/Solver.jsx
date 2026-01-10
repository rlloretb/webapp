import React, { useState } from 'react';
import Modal from '../components/Modal';

function Solver({ onSolutionSaved }) {
  const [vessels, setVessels] = useState([
    { vessel_id: '', arrival_time: '', processing_time: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleVesselChange = (index, field, value) => {
    const newVessels = [...vessels];
    newVessels[index][field] = value;
    setVessels(newVessels);
  };

  const addVessel = () => {
    setVessels([...vessels, { vessel_id: '', arrival_time: '', processing_time: '' }]);
  };

  const removeVessel = (index) => {
    setVessels(vessels.filter((_, i) => i !== index));
  };

  const validateInput = () => {
    if (vessels.length === 0) {
      setError('At least one vessel is required');
      return false;
    }
    for (let v of vessels) {
      if (!v.vessel_id || v.arrival_time === '' || v.processing_time === '') {
        setError('All fields are required for each vessel');
        return false;
      }
      if (isNaN(v.arrival_time) || isNaN(v.processing_time)) {
        setError('Arrival time and processing time must be numbers');
        return false;
      }
    }
    return true;
  };

  const handleSolve = async () => {
    setError('');
    setSuccess('');
    
    if (!validateInput()) return;

    setLoading(true);
    try {
      const payload = {
        vessels: vessels.map(v => ({
          vessel_id: v.vessel_id,
          arrival_time: parseInt(v.arrival_time),
          processing_time: parseInt(v.processing_time)
        }))
      };

      const response = await fetch('/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to solve problem' }));
        throw new Error(errorData.detail || 'Failed to solve problem');
      }

      const data = await response.json();
      setResult(data);
      setSuccess('Problem solved successfully!');
      setShowResultModal(true);
      onSolutionSaved({
        problem_id: data.problem_id,
        timestamp: data.timestamp,
        makespan: data.makespan,
        solving_time: data.solving_time,
        num_vessels: vessels.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data.vessels)) {
          setError('Invalid JSON format. Expected { vessels: [...] }');
          return;
        }
        setVessels(data.vessels);
        setSuccess('File loaded successfully!');
      } catch (err) {
        setError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-bold text-primary-dark mb-2">Problem Solver</h2>
        <p className="text-secondary-600">Upload or manually enter vessel data to optimize berth schedules</p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-secondary-100 animate-fade-in-up">
        <div className="mb-6 border-b border-secondary-200 pb-4">
          <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <span>📁</span> Upload JSON File
          </h3>
        </div>
        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">Select a JSON file with vessel data</label>
          <div className="relative border-2 border-dashed border-secondary-300 rounded-xl p-8 hover:border-primary transition-colors cursor-pointer hover:bg-blue-50">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v8m0 0h8m-8 0L20 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-semibold text-secondary-700">Drag and drop your JSON file here</p>
              <p className="text-xs text-secondary-500">or click to select</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-secondary-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="mb-6 border-b border-secondary-200 pb-4">
          <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <span>✏️</span> Enter Vessel Data Manually
          </h3>
          <p className="text-secondary-600 text-sm mt-2">Define vessels and their characteristics</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <span className="text-red-600 text-lg">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <span className="text-green-600 text-lg">✅</span>
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary-300">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Vessel ID</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Arrival Time (hrs)</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Processing Time (hrs)</th>
                <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {vessels.map((vessel, index) => (
                <tr key={index} className="hover:bg-secondary-50 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={vessel.vessel_id}
                      onChange={(e) => handleVesselChange(index, 'vessel_id', e.target.value)}
                      placeholder="e.g., V001"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={vessel.arrival_time}
                      onChange={(e) => handleVesselChange(index, 'arrival_time', e.target.value)}
                      placeholder="0-72"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={vessel.processing_time}
                      onChange={(e) => handleVesselChange(index, 'processing_time', e.target.value)}
                      placeholder="1-72"
                      disabled={loading}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => removeVessel(index)}
                      disabled={loading || vessels.length === 1}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={addVessel}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-200 text-secondary-900 rounded-lg hover:bg-secondary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span>+</span> Add Vessel
          </button>
        </div>

        <div className="border-t border-secondary-200 pt-6">
          <button
            onClick={handleSolve}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} opacity="0.25" />
                  <path d="M4 12a8 8 0 018-8v0" strokeWidth={2} strokeLinecap="round" />
                </svg>
                Solving...
              </>
            ) : (
              <>
                <span>🚀</span> Solve Problem
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        title="🎯 Scheduling Solution"
        onClose={() => setShowResultModal(false)}
        footer={
          <button
            onClick={() => setShowResultModal(false)}
            className="btn-primary px-6 py-2"
          >
            Close
          </button>
        }
      >
        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Makespan</p>
                <p className="text-3xl font-bold">{result.makespan}</p>
                <p className="text-sm opacity-75">hours</p>
              </div>
              <div className="bg-gradient-to-br from-accent to-accent-light rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Solving Time</p>
                <p className="text-3xl font-bold">{(result.solving_time * 1000).toFixed(0)}</p>
                <p className="text-sm opacity-75">milliseconds</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Vessels</p>
                <p className="text-3xl font-bold">{Object.keys(result.schedule).length}</p>
                <p className="text-sm opacity-75">scheduled</p>
              </div>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
              <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wide mb-2">Problem ID</p>
              <code className="text-sm text-secondary-700 break-all font-mono">{result.problem_id}</code>
            </div>

            <div>
              <h4 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <span>⚓</span> Berth Schedule
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-secondary-300">
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Vessel</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Berth</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Start</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">End</th>
                      <th className="text-left py-2 px-3 font-semibold text-secondary-700 uppercase tracking-wide">Wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {Object.entries(result.schedule).map(([vesselId, schedule]) => {
                      const waitTime = schedule.start_time - schedule.arrival_time;
                      return (
                        <tr key={vesselId} className="hover:bg-blue-50 transition-colors">
                          <td className="py-2 px-3"><span className="font-bold text-primary">{vesselId}</span></td>
                          <td className="py-2 px-3 text-secondary-700">{schedule.berth}</td>
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

export default Solver;
