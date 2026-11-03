import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI } from '../../services/api';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import { MONTHS } from '../../utils/constants';
import Card from '../../components/Common/Card';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Reports.css';

const DEFAULT_COLORS = [
  '#6C63FF', '#FF6584', '#4CAF50', '#FF9800',
  '#2196F3', '#9C27B0', '#F44336', '#00BCD4',
  '#FF5722', '#8BC34A', '#607D8B', '#E91E63'
];

export default function Reports() {
  const { currentUser } = useAuth();
  const currency = currentUser?.currency || 'INR';

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [error, setError] = useState(null);

  const loadReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, catRes, monthlyRes] = await Promise.all([
        reportsAPI.getSummary(selectedMonth, selectedYear),
        reportsAPI.getCategory(selectedMonth, selectedYear),
        reportsAPI.getMonthly(),
      ]);

      setSummary(sumRes);
      setCategories(catRes.categories || []);
      setMonthlyTrends(monthlyRes.months || []);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const totalIncome = summary?.total_income || 0;
  const totalExpense = summary?.total_expense || 0;
  const balance = summary?.balance || 0;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h2>Financial Reports & Analytics</h2>
          <p className="text-secondary">Analyze your cash flow, categorical spending, and historical trends.</p>
        </div>

        {/* Period filter */}
        <div className="reports-period-selector">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="period-select"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="period-select"
          >
            {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="reports-error-banner">⚠️ {error}</div>}

      {/* Summary KPI Cards */}
      <div className="reports-kpi-grid">
        <div className="report-stat-card">
          <span className="report-stat-label">Total Income</span>
          <span className="report-stat-val text-success">+{formatCurrency(totalIncome, currency)}</span>
          <span className="report-stat-sub">For {formatMonth(selectedMonth, selectedYear)}</span>
        </div>

        <div className="report-stat-card">
          <span className="report-stat-label">Total Expense</span>
          <span className="report-stat-val text-danger">-{formatCurrency(totalExpense, currency)}</span>
          <span className="report-stat-sub">For {formatMonth(selectedMonth, selectedYear)}</span>
        </div>

        <div className="report-stat-card">
          <span className="report-stat-label">Net Savings</span>
          <span className={`report-stat-val ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(balance, currency)}
          </span>
          <span className="report-stat-sub">Income minus expenses</span>
        </div>

        <div className="report-stat-card">
          <span className="report-stat-label">Savings Rate</span>
          <span className="report-stat-val">{savingsRate}%</span>
          <span className="report-stat-sub">Of total earnings saved</span>
        </div>
      </div>

      {loading ? (
        <div className="reports-loading">
          <LoadingSpinner size="lg" text="Crunching financial figures..." />
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="reports-charts-row">
            {/* Category Pie Chart */}
            <Card
              title={`Expense Breakdown (${formatMonth(selectedMonth, selectedYear)})`}
              className="reports-chart-card"
            >
              {categories.length > 0 ? (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="amount"
                        nameKey="category_name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={3}
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => formatCurrency(val, currency)}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="reports-empty-chart">
                  No expense records logged for this month.
                </div>
              )}
            </Card>

            {/* 12-Month Cashflow Bar Chart */}
            <Card title="12-Month Income vs Expense Trend" className="reports-chart-card">
              {monthlyTrends.length > 0 ? (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month_name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(val) => formatCurrency(val, currency)}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                      />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#FF6584" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="reports-empty-chart">
                  No historical trend data available.
                </div>
              )}
            </Card>
          </div>

          {/* Detailed Category Table */}
          <Card title="Category Spending Details" className="reports-table-card">
            {categories.length > 0 ? (
              <div className="table-responsive">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Transaction Count</th>
                      <th>Share (%)</th>
                      <th className="text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.category_id || cat.category_name}>
                        <td>
                          <div className="report-cat-cell">
                            <span className="report-cat-icon">{cat.icon}</span>
                            <span className="report-cat-name">{cat.category_name}</span>
                          </div>
                        </td>
                        <td>{cat.transaction_count} transactions</td>
                        <td>
                          <div className="report-pct-bar-wrap">
                            <div className="report-pct-track">
                              <div
                                className="report-pct-fill"
                                style={{
                                  width: `${cat.percentage}%`,
                                  backgroundColor: cat.color || 'var(--primary)',
                                }}
                              />
                            </div>
                            <span className="report-pct-text">{cat.percentage}%</span>
                          </div>
                        </td>
                        <td className="text-right font-bold text-danger">
                          -{formatCurrency(cat.amount, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="reports-empty-chart">
                No categorical breakdown available for this period.
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

