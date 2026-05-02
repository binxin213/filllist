'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    applicant: '',
    serialNumber: '',
    location: 'SBMU',
    applicationTime: new Date().toISOString().slice(0, 16),
    projectName: '',
    description: '',
    expectedReturn: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: String } | null>(null);

  const LOCATIONS = ['SBMU', 'Current Sensor', 'CSC', 'ETH', 'Module', 'MBMU'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('提交失败');

      setMessage({ type: 'success', text: '申请提交成功！' });
      // Reset form
      setFormData({
        applicant: '',
        serialNumber: '',
        location: 'SBMU',
        applicationTime: new Date().toISOString().slice(0, 16),
        projectName: '',
        description: '',
        expectedReturn: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: '提交申请时发生错误，请稍后重试。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="top-nav">
          <Link href="/dashboard" className="btn btn-secondary">
            查看统计报表 →
          </Link>
        </div>

        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="title">损坏部件维修申请</h1>
          <p className="subtitle">请详细填写以下维修申请信息，标有 * 的为必填项。</p>

          {message && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="applicant">申请人 *</label>
                <input
                  type="text"
                  id="applicant"
                  name="applicant"
                  className="form-input"
                  required
                  value={formData.applicant}
                  onChange={handleChange}
                  placeholder="请输入您的姓名"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="serialNumber">部件序列号 *</label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  className="form-input"
                  required
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="例如: BMS-SN-01000"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">损坏部件位置 *</label>
                <select
                  id="location"
                  name="location"
                  className="form-select"
                  required
                  value={formData.location}
                  onChange={handleChange}
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="applicationTime">申请时间 *</label>
                <input
                  type="datetime-local"
                  id="applicationTime"
                  name="applicationTime"
                  className="form-input"
                  required
                  value={formData.applicationTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="projectName">项目名称 *</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  className="form-input"
                  required
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="请输入相关联的项目名称"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="description">问题描述 *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请详细描述损坏情况或故障表现..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expectedReturn">期待返回时间 *</label>
                <input
                  type="date"
                  id="expectedReturn"
                  name="expectedReturn"
                  className="form-input"
                  required
                  value={formData.expectedReturn}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
                {loading ? '提交中...' : '提交申请'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
