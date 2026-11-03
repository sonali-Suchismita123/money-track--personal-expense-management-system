import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { budgetAPI, categoryAPI } from '../../services/api';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import { MONTHS } from '../../utils/constants';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Budgets.css';

export default function Budgets() {
  const { currentUser } = useAuth();
  const currency = currentUser?.currency || 'INR';

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [budRes, catRes] = await Promise.all([
        budgetAPI.getAll({ month: selectedMonth, year: selectedYear }),
        categoryAPI.getAll({ type: 'expense' }),
      ]);
      setBudgets(budRes.budgets || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormData({
      category_id: categories[0]?.id || '',
      amount: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBudget(b);
    setFormData({
      category_id: b.category_id,
      amount: b.amount,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid budget amount');
      return;
    }
    if (!formData.category_id) {
      setFormError('Please select a category');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      const payload = {
        category_id: parseInt(formData.category_id, 10),
        amount: parseFloat(formData.amount),
        month: selectedMonth,
        year: selectedYear,
      };

      if (editingBudget) {
        await budgetAPI.update(editingBudget.id, payload);
      } else {
        await budgetAPI.create(payload);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await budgetAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete budget');
    }
  };

  // Aggregated totals
  const totalAllocated = budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div className="budgets-page">
      {/* Page Header */}
      <div className="budgets-header">
        <div>
          <h2>Monthly Budgets</h2>
          <p className="text-secondary">Keep your spending in check by setting monthly limits.</p>
        </div>

        <div className="budgets-header-actions">
          {/* Month / Year picker */}
          <div className="budgets-period-picker">
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

          <Button variant="primary" icon="➕" onClick={handleOpenAdd}>
            Set Budget
          </Button>
        </div>
      </div>

      {/* Aggregate Overview Card */}
      <Card className="budget-summary-card">
        <div className="budget-summary-grid">
          <div className="budget-summary-stat">
            <span className="stat-label">Total Allocated</span>
            <span className="stat-value">{formatCurrency(totalAllocated, currency)}</span>
          </div>
          <div className="budget-summary-stat">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value text-danger">{formatCurrency(totalSpent, currency)}</span>
          </div>
          <div className="budget-summary-stat">
            <span className="stat-label">Remaining Buffer</span>
            <span className={`stat-value ${totalRemaining >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(totalRemaining, currency)}
            </span>
          </div>
          <div className="budget-summary-stat">
            <span className="stat-label">Overall Progress</span>
            <span className="stat-value">{overallPercentage}%</span>
          </div>
        </div>

        <div className="overall-progress-bar">
          <div
            className="overall-progress-fill"
            style={{
              width: `${Math.min(overallPercentage, 100)}%`,
              backgroundColor: overallPercentage > 100 ? 'var(--danger)' : overallPercentage >= 80 ? 'var(--warning)' : 'var(--primary)',
            }}
          />
        </div>
      </Card>

      {/* Budgets Grid */}
      {loading ? (
        <div className="budgets-loading">
          <LoadingSpinner size="md" text="Loading budgets..." />
        </div>
      ) : error ? (
        <div className="budgets-error">⚠️ {error}</div>
      ) : budgets.length === 0 ? (
        <div className="budgets-empty">
          <div className="empty-icon">🎯</div>
          <h3>No Budgets For {formatMonth(selectedMonth, selectedYear)}</h3>
          <p>Start tracking your monthly spending limits to prevent overspending.</p>
          <Button variant="primary" icon="➕" onClick={handleOpenAdd} className="mt-3">
            Create First Budget
          </Button>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.map(b => {
            const pct = b.percentage || 0;
            const isOver = pct > 100;
            const isWarning = pct >= 80 && pct <= 100;
            const statusColor = isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)';

            return (
              <Card key={b.id} className="budget-card">
                <div className="budget-card-header">
                  <div className="budget-category-info">
                    <span className="budget-category-icon">{b.category?.icon || '📂'}</span>
                    <div>
                      <h4 className="budget-category-name">{b.category?.name || 'Category'}</h4>
                      <span className="budget-period">{formatMonth(b.month, b.year)}</span>
                    </div>
                  </div>

                  <div className="budget-card-actions">
                    <button
                      className="action-icon-btn edit-btn"
                      onClick={() => handleOpenEdit(b)}
                      title="Edit limit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-icon-btn delete-btn"
                      onClick={() => setDeleteTarget(b)}
                      title="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="budget-amounts-row">
                  <div>
                    <span className="budget-sub-label">Spent</span>
                    <span className="budget-spent-val">{formatCurrency(b.spent, currency)}</span>
                  </div>
                  <div className="text-right">
                    <span className="budget-sub-label">Budget Limit</span>
                    <span className="budget-limit-val">{formatCurrency(b.amount, currency)}</span>
                  </div>
                </div>

                <div className="budget-progress-track">
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: statusColor,
                    }}
                  />
                </div>

                <div className="budget-status-row">
                  <span className="budget-percentage" style={{ color: statusColor }}>
                    {pct}% Used
                  </span>
                  <span className="budget-remaining-text" style={{ color: statusColor }}>
                    {isOver
                      ? `Exceeded by ${formatCurrency(Math.abs(b.remaining), currency)}`
                      : `${formatCurrency(b.remaining, currency)} remaining`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? 'Edit Budget Limit' : `Set Budget for ${formatMonth(selectedMonth, selectedYear)}`}
      >
        <form onSubmit={handleFormSubmit} className="budget-modal-form">
          {formError && (
            <div className="modal-error-alert">⚠️ {formError}</div>
          )}

          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="input-field"
              disabled={!!editingBudget}
            >
              <option value="">Select Expense Category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Monthly Limit Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="e.g. 5000"
            icon={currentUser?.currency === 'USD' ? '$' : '₹'}
            required
            autoFocus
          />

          <div className="modal-form-actions">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingBudget ? 'Update Limit' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Budget"
        size="sm"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to remove the budget for{' '}
            <strong>"{deleteTarget?.category?.name}"</strong>?
          </p>
          <div className="modal-form-actions mt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

