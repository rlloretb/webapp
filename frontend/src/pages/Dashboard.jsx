import React from 'react';

function Dashboard({ solutions }) {
  const recentSolutions = solutions.slice(0, 5);
  const totalVessels = solutions.reduce((sum, sol) => sum + (sol.num_vessels || 0), 0);
  const avgMakespan = solutions.length > 0 
    ? (solutions.reduce((sum, sol) => sum + (sol.makespan || 0), 0) / solutions.length).toFixed(2)
    : 0;

  const stats = [
    { label: 'Total Solutions', value: solutions.length, icon: '📦', color: 'from-primary to-primary-light' },
    { label: 'Vessels Scheduled', value: totalVessels, icon: '🚢', color: 'from-accent to-accent-light' },
    { label: 'Avg Makespan', value: avgMakespan + ' hrs', icon: '⏱️', color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="p-8 pt-8 space-y-8 animate-fade-in">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={"bg-white rounded-xl shadow-soft p-6 border border-secondary-100 hover:shadow-lg-custom transition-shadow duration-200 cursor-pointer hover:border-primary-light bg-gradient-to-br " + stat.color}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white text-opacity-90 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="text-5xl opacity-20">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Solutions */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-secondary-100 animate-fade-in-up">
        <div className="mb-6 border-b border-secondary-200 pb-4">
          <h3 className="text-2xl font-bold text-secondary-900">Recent Solutions</h3>
          <p className="text-secondary-600 text-sm mt-1">Latest scheduling problems solved</p>
        </div>
        {recentSolutions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Problem ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Vessels</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Makespan</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Solve Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-700 text-sm uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {recentSolutions.map(sol => (
                  <tr key={sol.problem_id} className="hover:bg-secondary-50 transition-colors">
                    <td className="py-3 px-4"><code className="text-xs bg-secondary-100 px-2 py-1 rounded text-primary font-mono">{sol.problem_id.substring(0, 8)}...</code></td>
                    <td className="py-3 px-4 font-medium">{sol.num_vessels}</td>
                    <td className="py-3 px-4"><span className="font-bold text-primary text-lg">{sol.makespan}</span> <span className="text-secondary-600 text-sm">hrs</span></td>
                    <td className="py-3 px-4 text-secondary-600">{(parseFloat(sol.solving_time) * 1000).toFixed(0)} ms</td>
                    <td className="py-3 px-4 text-secondary-600">{new Date(sol.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-secondary-500 text-lg">No solutions yet. Start by uploading a problem instance!</p>
            <p className="text-secondary-400 text-sm mt-2">Go to the Solver tab to get started</p>
          </div>
        )}
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-secondary-100 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="mb-6 border-b border-secondary-200 pb-4">
          <h3 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <span className="text-2xl">🚀</span> Getting Started
          </h3>
        </div>
        <div className="space-y-4">
          <p className="text-secondary-700 font-medium">To begin solving berth scheduling problems:</p>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-secondary-700"><span className="font-semibold">Go to the Solver tab</span> to upload or input vessel data</li>
            <li className="text-secondary-700"><span className="font-semibold">Upload a JSON file</span> or manually enter vessel information</li>
            <li className="text-secondary-700"><span className="font-semibold">Click "Solve"</span> to run the optimization algorithm</li>
            <li className="text-secondary-700"><span className="font-semibold">View results</span> in a detailed schedule with visualization</li>
            <li className="text-secondary-700"><span className="font-semibold">Check History</span> to review past solutions and compare</li>
          </ol>
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-primary rounded">
            <p className="text-primary-dark text-sm font-medium">💡 <span className="font-semibold">Tip:</span> The greedy heuristic algorithm schedules vessels to minimize total port time (makespan)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
