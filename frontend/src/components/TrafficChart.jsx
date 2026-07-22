import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6'];

function Chart({ data, nameKey, chartType }) {
  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(p) => p[nameKey] + ' ' + Math.round(p.percent * 100) + '%'}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={nameKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3366cc" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#3366cc" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function TrafficChart({ title, data, nameKey, defaultType = 'bar' }) {
  const [chartType, setChartType] = useState(defaultType);

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h2>{title}</h2>
        <div className="chart-types">
          <button
            type="button"
            className={chartType === 'bar' ? 'chart-type active' : 'chart-type'}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
          <button
            type="button"
            className={chartType === 'line' ? 'chart-type active' : 'chart-type'}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button
            type="button"
            className={chartType === 'pie' ? 'chart-type active' : 'chart-type'}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
        </div>
      </div>
      <Chart data={data} nameKey={nameKey} chartType={chartType} />
    </div>
  );
}
