'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/requests');
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          throw new Error(json.error || 'API returned invalid data format');
        }
      } catch (error: any) {
        console.error('Failed to fetch data', error);
        setError(error.message || '获取数据失败，请重试');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Top 5 Projects
  const topProjectsData = useMemo(() => {
    const counts = data.reduce((acc: any, curr) => {
      acc[curr.projectName] = (acc[curr.projectName] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data]);

  // Location Distribution (Pie Chart)
  const locationData = useMemo(() => {
    const counts = data.reduce((acc: any, curr) => {
      acc[curr.location] = (acc[curr.location] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Trend over time (Line Chart) grouped by month-year
  const trendData = useMemo(() => {
    const counts = data.reduce((acc: any, curr) => {
      const date = new Date(curr.applicationTime);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .sort()
      .map(key => ({ date: key, count: counts[key] }));
  }, [data]);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="title">正在加载数据...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="title" style={{ color: 'var(--error-color)' }}>哎呀，出错了</h2>
        <p className="subtitle">{error}</p>
        <Link href="/" className="btn btn-primary">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content" style={{ maxWidth: '1400px' }}>
        <div className="top-nav">
          <Link href="/" className="btn btn-secondary">
            ← 返回申请表单
          </Link>
        </div>

        <h1 className="title" style={{ marginBottom: '2rem' }}>数据统计看板</h1>

        {/* Overview Stats */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <span className="stat-title">总申请数量</span>
            <span className="stat-value">{data.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-title">涉及项目数</span>
            <span className="stat-value">{new Set(data.map(d => d.projectName)).size}</span>
          </div>
          <div className="stat-card">
            <span className="stat-title">损坏部件类型</span>
            <span className="stat-value">{new Set(data.map(d => d.location)).size}</span>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-container">
            <h3 className="chart-title">Top 5 报修项目</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProjectsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">损坏部件位置占比</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container" style={{ gridColumn: '1 / -1' }}>
            <h3 className="chart-title">申请时间变化趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>申请人</th>
                <th>部件序列号</th>
                <th>损坏位置</th>
                <th>申请时间</th>
                <th>项目名称</th>
                <th>期待返回时间</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((req, i) => (
                <tr key={i}>
                  <td>{req.applicant}</td>
                  <td>{req.serialNumber}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      opacity: 0.9
                    }}>
                      {req.location}
                    </span>
                  </td>
                  <td>{new Date(req.applicationTime).toLocaleDateString()}</td>
                  <td>{req.projectName}</td>
                  <td>{new Date(req.expectedReturn).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            显示最近 20 条记录，共 {data.length} 条。
          </div>
        </div>
      </div>
    </div>
  );
}
