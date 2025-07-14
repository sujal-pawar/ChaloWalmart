import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import './LiveGraphs.css';

const FEATURES = [
  "cpu",
  "memory",
  "disk",
  "temperature",
  "errors",
  "response_time",
  "network",
  "uptime",
  "processes",
  "threads",
];
const FEATURE_LABELS = {
  cpu: 'CPU',
  memory: 'Memory',
  disk: 'Disk',
  temperature: 'Temperature',
  errors: 'Errors',
  response_time: 'Response Time',
  network: 'Network',
  uptime: 'Uptime',
  processes: 'Processes',
  threads: 'Threads',
};

export default function LiveGraphs({ history }) {
  // Map history (array of arrays) to recharts-friendly array of objects
  const chartHistory = history.map((arr, idx) => {
    const obj = { timestamp: `${idx + 1}` };
    FEATURES.forEach((f, i) => {
      obj[f] = arr[i] ?? 0;
    });
    return obj;
  });

  // Compute normalized history for combined graph
  const normalizedHistory = chartHistory.map(entry => {
    const normEntry = { timestamp: entry.timestamp };
    FEATURES.forEach(f => {
      const values = chartHistory.map(e => e[f]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (max !== min) {
        normEntry[f] = (entry[f] - min) / (max - min);
      } else {
        normEntry[f] = 0.5;
      }
    });
    return normEntry;
  });

  // Compute normalized history for spike graph (sum of all normalized values)
  const spikeHistory = chartHistory.map(entry => {
    let sum = 0;
    FEATURES.forEach(f => {
      const values = chartHistory.map(e => e[f]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      let norm = 0.5;
      if (max !== min) {
        norm = (entry[f] - min) / (max - min);
      }
      sum += norm;
    });
    return { timestamp: entry.timestamp, spike: sum };
  });

  // Compute 5-point moving average for spike graph
  const movingAvgHistory = spikeHistory.map((point, idx, arr) => {
    const window = arr.slice(Math.max(0, idx - 4), idx + 1);
    const avg = window.reduce((sum, p) => sum + p.spike, 0) / window.length;
    return { ...point, movingAvg: avg };
  });

  return (
    <section id="graphs" className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <br/>
        <h2 className="text-3xl font-bold mb-2">Live Server Parameter Graphs</h2>
        <p className="text-gray-400 mb-8">Real-time visualization of server metrics. Spikes indicate sudden changes.</p>
        {/* Spike Graph (System Stress) */}
        <div className={`bg-[#141414] rounded-lg border border-[#2A2A2A] p-4 mb-8 ${movingAvgHistory.some(e => e.spike >= 7) ? 'spike-glow' : ''}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-200">System Stress (Spike Graph)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={movingAvgHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="timestamp" tick={{ fill: '#aaa', fontSize: 10 }} minTickGap={20} />
              <YAxis tick={{ fill: '#aaa', fontSize: 10 }} domain={[0, FEATURES.length]} />
              <Tooltip contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
              <Legend />
              <ReferenceLine y={7} stroke="#FFA500" strokeWidth={2} strokeDasharray="6 3" label={{ value: 'Danger Threshold', position: 'right', fill: '#FFA500', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="spike"
                stroke="#FF8800"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                strokeDasharray={"3 0"}
                connectNulls
              />
              {/* Area fill for spike line */}
              <defs>
                <linearGradient id="spikeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFA500" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FFA500" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="spikeFillDanger" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3333" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FF3333" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="spike"
                stroke={false}
                fill={
                  movingAvgHistory.some(e => e.spike >= 7)
                    ? "url(#spikeFillDanger)"
                    : "url(#spikeFill)"
                }
                fillOpacity={1}
                isAnimationActive={false}
                connectNulls
                legendType="none"
              />
              <Line type="monotone" dataKey="movingAvg" stroke="#3399FF" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="bg-[#141414] rounded-lg border border-[#2A2A2A] p-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {FEATURE_LABELS[feature]}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={chartHistory}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: "#aaa", fontSize: 10 }}
                    minTickGap={20}
                  />
                  <YAxis
                    tick={{ fill: "#aaa", fontSize: 10 }}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#222",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={feature}
                    stroke="#FFC220"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
