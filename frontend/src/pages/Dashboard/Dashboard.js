import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { reportsAPI, transactionAPI, budgetAPI, savingsAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/Common/Card';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Button from '../../components/Common/Button';
import './Dashboard.css';

const CHART_COLORS = [
  '#6C63FF', '#FF6584', '#4CAF50', '#FF9800',
  '#2196F3', '#9C27B0', '#F44336', '#00BCD4',
  '#FF5722', '#8BC34A', '#607D8B', '#E91E63'
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [error, setError] = useState(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [sumRes, txRes, monthlyRes, catRes, budRes, savRes] = await Promise.all([
          reportsAPI.getSummary(currentMonth, currentYear).catch(() => ({
            total_income: 0,
            total_expense: 0,
            balance: 0,
            transaction_count: 0,
          })),
          transactionAPI.getAll({ limit: 5 }).catch(() => ({ transactions: [] })),
          reportsAPI.getMonthly().catch(() => ({ months: [] })),
          reportsAPI.getCategory(currentMonth, currentYear).catch(() => ({ categories: [] })),
          budgetAPI.getAll({ month: currentMonth, year: currentYear }).catch(() => ({ budgets: [] })),
          savingsAPI.getAll().catch(() => ({ savings_goals: [] })),
        ]);

        setSummary(sumRes);
        setRecentTransactions((txRes.transactions || []).slice(0, 5));
        setMonthlyData(monthlyRes.months || []);
        setCategoryData(catRes.categories || []);
        setBudgets(budRes.budgets || []);
        setSavingsGoals(savRes.savings_goals || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentMonth, currentYear]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading financial overview..." />
      </div>
    );
  }

  const currency = currentUser?.currency || 'INR';

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome__text">
          <h2>Welcome back, {currentUser?.full_name || currentUser?.username}! 👋</h2>
          <p>Here is your financial summary for this month.</p>
        </div>
        <div className="dashboard-welcome__actions">
          <Link to="/transactions">
            <Button variant="primary" icon="➕">Add Transaction</Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" icon="📊">Detailed Reports</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="dashboard-error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card stat-card--balance">
          <div className="stat-card__icon">💳</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Net Balance</span>
            <span className="stat-card__value">
              {formatCurrency(summary?.balance || 0, currency)}
            </span>
            <span className="stat-card__subtext">Current month net savings</span>
          </div>
        </div>

        <div className="stat-card stat-card--income">
          <div className="stat-card__icon">📈</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Income</span>
            <span className="stat-card__value text-success">
              +{formatCurrency(summary?.total_income || 0, currency)}
            </span>
            <span className="stat-card__subtext">Earned this month</span>
          </div>
        </div>

        <div className="stat-card stat-card--expense">
          <div className="stat-card__icon">📉</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Expense</span>
            <span className="stat-card__value text-danger">
              -{formatCurrency(summary?.total_expense || 0, currency)}
            </span>
            <span className="stat-card__subtext">Spent this month</span>
          </div>
        </div>

        <div className="stat-card stat-card--count">
          <div className="stat-card__icon">🧾</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Transactions</span>
            <span className="stat-card__value">
              {summary?.transaction_count || 0}
            </span>
            <span className="stat-card__subtext">Entries recorded this month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts-grid">
        {/* Monthly Cashflow Bar Chart */}
        <Card title="Cash Flow Overview (Last 12 Months)" className="dashboard-chart-card">
          {monthlyData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
            <div className="dashboard-empty-state">No monthly transaction data available yet.</div>
          )}
        </Card>

        {/* Category Expense Distribution Pie Chart */}
        <Card title="Expenses by Category (This Month)" className="dashboard-chart-card">
          {categoryData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
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
            <div className="dashboard-empty-state">No expense category data for this month.</div>
          )}
        </Card>
      </div>

      {/* Lists Row: Recent Transactions, Budgets, Savings */}
      <div className="dashboard-bottom-grid">
        {/* Recent Transactions */}
        <Card
          title="Recent Transactions"
          action={<Link to="/transactions" className="card-header-link">View All →</Link>}
          className="dashboard-card-column"
        >
          {recentTransactions.length > 0 ? (
            <div className="recent-tx-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="recent-tx-item">
                  <div className="recent-tx-left">
                    <span className="recent-tx-icon">
                      {tx.category?.icon || (tx.type === 'income' ? '💰' : '💸')}
                    </span>
                    <div className="recent-tx-info">
                      <span className="recent-tx-desc">{tx.description}</span>
                      <span className="recent-tx-date">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                  <div className={`recent-tx-amount ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>No transactions yet.</p>
              <Link to="/transactions" className="text-link">Add your first transaction</Link>
            </div>
          )}
        </Card>

        {/* Budgets Progress */}
        <Card
          title="Budget Tracking"
          action={<Link to="/budgets" className="card-header-link">Manage →</Link>}
          className="dashboard-card-column"
        >
          {budgets.length > 0 ? (
            <div className="dashboard-budgets-list">
              {budgets.slice(0, 4).map((b) => {
                const pct = Math.min(b.percentage || 0, 100);
                const statusColor =
                  b.percentage > 100 ? 'var(--danger)' :
                  b.percentage >= 80 ? 'var(--warning)' : 'var(--success)';

                return (
                  <div key={b.id} className="dashboard-budget-item">
                    <div className="dashboard-budget-header">
                      <span className="dashboard-budget-name">
                        {b.category?.icon} {b.category?.name || 'General'}
                      </span>
                      <span className="dashboard-budget-values">
                        {formatCurrency(b.spent, currency)} / {formatCurrency(b.amount, currency)}
                      </span>
                    </div>
                    <div className="dashboard-progress-track">
                      <div
                        className="dashboard-progress-fill"
                        style={{ width: `${pct}%`, backgroundColor: statusColor }}
                      />
                    </div>
                    <div className="dashboard-budget-sub">
                      <span>{b.percentage}% used</span>
                      <span style={{ color: statusColor }}>
                        {b.remaining >= 0 ? `${formatCurrency(b.remaining, currency)} left` : 'Over budget!'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>No budgets configured for this month.</p>
              <Link to="/budgets" className="text-link">Set up a budget</Link>
            </div>
          )}
        </Card>

        {/* Savings Goals */}
        <Card
          title="Savings Goals"
          action={<Link to="/savings" className="card-header-link">All Goals →</Link>}
          className="dashboard-card-column"
        >
          {savingsGoals.length > 0 ? (
            <div className="dashboard-savings-list">
              {savingsGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="dashboard-savings-item">
                  <div className="dashboard-savings-header">
                    <span className="dashboard-savings-title">🎯 {goal.title}</span>
                    <span className="dashboard-savings-pct">{goal.progress_percentage}%</span>
                  </div>
                  <div className="dashboard-progress-track">
                    <div
                      className="dashboard-progress-fill"
                      style={{ width: `${goal.progress_percentage}%`, backgroundColor: 'var(--primary)' }}
                    />
                  </div>
                  <div className="dashboard-savings-sub">
                    <span>{formatCurrency(goal.current_amount, currency)}</span>
                    <span className="text-muted">Target: {formatCurrency(goal.target_amount, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>No active savings goals.</p>
              <Link to="/savings" className="text-link">Create a savings goal</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

