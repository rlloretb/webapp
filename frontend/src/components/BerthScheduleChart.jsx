import React from 'react';
import Plot from 'react-plotly.js';

function BerthScheduleChart({ schedule, numBerths }) {
  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <div className="text-center py-8 text-secondary-600">
        No schedule data available
      </div>
    );
  }

  // Transform schedule data into Plotly traces
  const traces = Object.entries(schedule).map(([vesselId, data], index) => ({
    x: [data.end_time - data.start_time],  // Duration
    y: [`Berth ${data.berth}`],
    base: [data.start_time],  // Start position
    type: 'bar',
    orientation: 'h',
    name: vesselId,
    text: vesselId,
    textposition: 'inside',
    textfont: {
      color: 'white',
      size: 12,
      family: 'Inter, system-ui, sans-serif'
    },
    hovertemplate: 
      `<b>${vesselId}</b><br>` +
      `Berth: ${data.berth}<br>` +
      `Arrival: ${data.arrival_time}h<br>` +
      `Start: ${data.start_time}h<br>` +
      `End: ${data.end_time}h<br>` +
      `Service Time: ${data.processing_time}h<br>` +
      `Wait Time: ${data.start_time - data.arrival_time}h<extra></extra>`,
    marker: {
      color: `hsl(${(index * 360) / Object.keys(schedule).length}, 70%, 55%)`,
      line: {
        color: `hsl(${(index * 360) / Object.keys(schedule).length}, 70%, 45%)`,
        width: 2
      }
    }
  }));

  // Calculate max time for x-axis range
  const maxTime = Math.max(...Object.values(schedule).map(v => v.end_time));

  const layout = {
    title: {
      text: 'Berth Allocation Schedule',
      font: {
        size: 18,
        family: 'Inter, system-ui, sans-serif',
        color: '#1e3a8a'
      }
    },
    xaxis: {
      title: {
        text: 'Time (hours)',
        font: {
          size: 14,
          family: 'Inter, system-ui, sans-serif'
        }
      },
      range: [0, maxTime + 2],
      gridcolor: '#e5e7eb',
      zeroline: false
    },
    yaxis: {
      title: {
        text: 'Berth',
        font: {
          size: 14,
          family: 'Inter, system-ui, sans-serif'
        }
      },
      categoryorder: 'category ascending',
      gridcolor: '#e5e7eb'
    },
    barmode: 'overlay',
    height: 400,
    showlegend: true,
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.3,
      xanchor: 'center',
      x: 0.5,
      font: {
        size: 11,
        family: 'Inter, system-ui, sans-serif'
      }
    },
    hovermode: 'closest',
    plot_bgcolor: '#fafafa',
    paper_bgcolor: '#ffffff',
    margin: {
      l: 80,
      r: 40,
      t: 60,
      b: 100
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: 'berth_schedule',
      height: 600,
      width: 1200,
      scale: 2
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-soft border border-secondary-200 p-4">
      <Plot
        data={traces}
        layout={layout}
        config={config}
        className="w-full"
        useResizeHandler={true}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default BerthScheduleChart;
