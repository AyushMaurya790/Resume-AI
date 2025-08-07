import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/Analytics.css';

const Analytics = ({ user }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [resumeScore, setResumeScore] = useState(0);
  const [jobMatchScore, setJobMatchScore] = useState(0);

  // Sample data - replace with actual API calls
  const sampleData = {
    resumeStats: [
      { name: 'Mon', views: 12, downloads: 4 },
      { name: 'Tue', views: 19, downloads: 7 },
      { name: 'Wed', views: 15, downloads: 5 },
      { name: 'Thu', views: 24, downloads: 8 },
      { name: 'Fri', views: 18, downloads: 6 },
      { name: 'Sat', views: 10, downloads: 3 },
      { name: 'Sun', views: 8, downloads: 2 },
    ],
    templateUsage: [
      { name: 'Modern', value: 35 },
      { name: 'Classic', value: 25 },
      { name: 'ATS', value: 40 },
    ],
    aiUsage: {
      suggestions: 42,
      improvements: 18,
      generations: 7,
    }
  };

  const COLORS = ['#ff3e3e', '#3e6bff', '#ff7e3e'];

  useEffect(() => {
    // Simulate API fetch
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalyticsData(sampleData);
        setResumeScore(calculateResumeScore());
        setJobMatchScore(calculateJobMatchScore());
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const calculateResumeScore = () => {
    // TODO: Implement actual resume scoring logic
    return Math.floor(Math.random() * 30) + 70; // Random score between 70-100
  };

  const calculateJobMatchScore = () => {
    // TODO: Implement actual job match scoring logic
    return Math.floor(Math.random() * 40) + 60; // Random score between 60-100
  };

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>
          <span className="text-blue">Resume</span>
          <span className="text-red">Analytics</span>
        </h2>
        <div className="time-range-selector">
          <button
            className={timeRange === 'week' ? 'active btn-red' : 'btn-red'}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={timeRange === 'month' ? 'active btn-blue' : 'btn-blue'}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={timeRange === 'year' ? 'active btn-red' : 'btn-red'}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="score-cards">
        <motion.div 
          className="score-card blue-bg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Resume Score</h3>
          <div className="score-value">{resumeScore}</div>
          <div className="score-description">
            {resumeScore >= 85 ? 'Excellent!' : 
             resumeScore >= 70 ? 'Good' : 'Needs improvement'}
          </div>
          <button className="btn-red">Improve with AI</button>
        </motion.div>

        <motion.div 
          className="score-card red-bg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>Job Match Score</h3>
          <div className="score-value">{jobMatchScore}</div>
          <div className="score-description">
            {jobMatchScore >= 85 ? 'Perfect match!' : 
             jobMatchScore >= 70 ? 'Good match' : 'Could be better'}
          </div>
          <button className="btn-blue">Find Better Matches</button>
        </motion.div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Resume Views & Downloads</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.resumeStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3e6bff" name="Views" />
                <Bar dataKey="downloads" fill="#ff3e3e" name="Downloads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Template Usage</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.templateUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.templateUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="ai-usage-stats">
        <h3>AI Usage Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{analyticsData.aiUsage.suggestions}</div>
            <div className="stat-label">AI Suggestions Used</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analyticsData.aiUsage.improvements}</div>
            <div className="stat-label">AI Improvements</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analyticsData.aiUsage.generations}</div>
            <div className="stat-label">AI Generations</div>
          </div>
        </div>
      </div>

      <div className="ats-optimization">
        <h3>ATS Optimization Tips</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-badge blue-bg">1</span>
            <p>Include more industry-specific keywords in your skills section</p>
          </div>
          <div className="tip-item">
            <span className="tip-badge red-bg">2</span>
            <p>Quantify your achievements with numbers and metrics</p>
          </div>
          <div className="tip-item">
            <span className="tip-badge blue-bg">3</span>
            <p>Keep your resume to 1-2 pages maximum</p>
          </div>
        </div>
        <button className="btn-blue run-ats-check">Run Full ATS Check</button>
      </div>
    </div>
  );
};

export default Analytics;