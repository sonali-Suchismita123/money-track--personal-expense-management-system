import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savingsAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Savings.css';

export default function Savings() {
  const { currentUser } = useAuth();
  const currency = currentUser?.currency || 'INR';

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Add Deposit Modal State
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
    description: '',
  });

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await savingsAPI.getAll();
      setGoals(res.savings_goals || []);
    } catch (err) {
      setError(err.message || 'Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      target_amount: '',
      current_amount: '0',
      deadline: '',
      description: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deadline: goal.deadline || '',
      description: goal.description || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Goal title is required');
      return;
    }
    if (!formData.target_amount || isNaN(formData.target_amount) || parseFloat(formData.target_amount) <= 0) {
      setFormError('Target amount must be a positive number');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      const payload = {
        title: formData.title.trim(),
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount || 0),
        deadline: formData.deadline || null,
        description: formData.description.trim() || null,
      };

      if (editingGoal) {
        await savingsAPI.update(editingGoal.id, payload);
      } else {
        await savingsAPI.create(payload);
      }

      setIsModalOpen(false);
      loadGoals();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      setDepositError('Please enter a valid deposit amount');
      return;
    }

    setDepositLoading(true);
    setDepositError('');
    try {
      await savingsAPI.addAmount(depositGoal.id, parseFloat(depositAmount));
      setDepositGoal(null);
      setDepositAmount('');
      loadGoals();
    } catch (err) {
      setDepositError(err.message || 'Failed to deposit funds');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await savingsAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadGoals();
    } catch (err) {
      alert(err.message || 'Failed to delete goal');
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + (g.target_amount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.current_amount || 0), 0);
  const totalRemaining = totalTarget - totalSaved;

  return (
    <div className="savings-page">
      <div className="savings-header">
        <div>
          <h2>Savings Goals</h2>
          <p className="text-secondary">Turn your financial dreams and milestone wishes into reality.</p>
        </div>
        <Button variant="primary" icon="➕" onClick={handleOpenAdd}>
          New Savings Goal
        </Button>
      </div>

      {/* Aggregate Overview Card */}
      <Card className="savings-summary-card">
        <div className="savings-summary-grid">
          <div className="savings-summary-stat">
            <span className="stat-label">Total Saved</span>
            <span className="stat-value text-success">{formatCurrency(totalSaved, currency)}</span>
          </div>
          <div className="savings-summary-stat">
            <span className="stat-label">Total Target</span>
            <span className="stat-value">{formatCurrency(totalTarget, currency)}</span>
          </div>
          <div className="savings-summary-stat">
            <span className="stat-label">Remaining to Goal</span>
            <span className="stat-value">{formatCurrency(Math.max(0, totalRemaining), currency)}</span>
          </div>
          <div className="savings-summary-stat">
            <span className="stat-label">Active Goals</span>
            <span className="stat-value">{goals.length}</span>
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {loading ? (
        <div className="savings-loading">
          <LoadingSpinner size="md" text="Loading goals..." />
        </div>
      ) : error ? (
        <div className="savings-error">⚠️ {error}</div>
      ) : goals.length === 0 ? (
        <div className="savings-empty">
          <div className="empty-icon">💎</div>
          <h3>No Savings Goals Yet</h3>
          <p>Create a savings goal for a vacation, new gadget, emergency fund, or investment.</p>
          <Button variant="primary" icon="➕" onClick={handleOpenAdd} className="mt-3">
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="savings-grid">
          {goals.map(goal => {
            const isCompleted = goal.is_completed || goal.current_amount >= goal.target_amount;
            const pct = goal.progress_percentage || 0;

            return (
              <Card key={goal.id} className="goal-card">
                <div className="goal-card-header">
                  <div className="goal-title-wrap">
                    <span className="goal-icon">🎯</span>
                    <div>
                      <h4 className="goal-title">{goal.title}</h4>
                      {goal.deadline && (
                        <span className="goal-deadline">
                          Target: {formatDate(goal.deadline)}
                          {goal.days_remaining !== null && (
                            <span className="goal-days-pill">
                              {goal.days_remaining > 0
                                ? ` (${goal.days_remaining} days left)`
                                : ' (Deadline passed)'}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="goal-actions">
                    <button
                      className="action-icon-btn edit-btn"
                      onClick={() => handleOpenEdit(goal)}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-icon-btn delete-btn"
                      onClick={() => setDeleteTarget(goal)}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="goal-description">{goal.description}</p>
                )}

                <div className="goal-amounts-row">
                  <div>
                    <span className="goal-sub-label">Saved so far</span>
                    <span className="goal-saved-val">{formatCurrency(goal.current_amount, currency)}</span>
                  </div>
                  <div className="text-right">
                    <span className="goal-sub-label">Target</span>
                    <span className="goal-target-val">{formatCurrency(goal.target_amount, currency)}</span>
                  </div>
                </div>

                <div className="goal-progress-track">
                  <div
                    className="goal-progress-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--primary)',
                    }}
                  />
                </div>

                <div className="goal-status-row">
                  <span className="goal-pct">{pct}% Completed</span>
                  {isCompleted ? (
                    <span className="goal-badge goal-badge--completed">🎉 Goal Achieved!</span>
                  ) : (
                    <span className="goal-remaining-text">
                      {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount), currency)} to go
                    </span>
                  )}
                </div>

                <div className="goal-footer-action">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon="💵"
                    onClick={() => {
                      setDepositGoal(goal);
                      setDepositAmount('');
                      setDepositError('');
                    }}
                  >
                    Add Deposit Funds
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
      >
        <form onSubmit={handleFormSubmit} className="savings-modal-form">
          {formError && <div className="modal-error-alert">⚠️ {formError}</div>}

          <Input
            label="Goal Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Vacation in Goa, Laptop Fund"
            required
            autoFocus
          />

          <Input
            label="Target Amount"
            type="number"
            step="0.01"
            value={formData.target_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
            placeholder="50000"
            icon={currentUser?.currency === 'USD' ? '$' : '₹'}
            required
          />

          <Input
            label="Current Amount Saved"
            type="number"
            step="0.01"
            value={formData.current_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, current_amount: e.target.value }))}
            placeholder="0"
            icon={currentUser?.currency === 'USD' ? '$' : '₹'}
          />

          <Input
            label="Target Deadline (Optional)"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          />

          <Input
            as="textarea"
            label="Motivation / Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Why are you saving for this?"
            rows={2}
          />

          <div className="modal-form-actions">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Deposit Funds Modal */}
      <Modal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        title={`Add Deposit to "${depositGoal?.title}"`}
        size="sm"
      >
        <form onSubmit={handleDepositSubmit} className="deposit-modal-form">
          {depositError && <div className="modal-error-alert">⚠️ {depositError}</div>}

          <p className="text-secondary text-sm mb-3">
            Currently saved: <strong>{formatCurrency(depositGoal?.current_amount, currency)}</strong> of{' '}
            <strong>{formatCurrency(depositGoal?.target_amount, currency)}</strong>
          </p>

          <Input
            label="Deposit Amount"
            type="number"
            step="0.01"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount to add"
            icon={currentUser?.currency === 'USD' ? '$' : '₹'}
            required
            autoFocus
          />

          <div className="modal-form-actions mt-4">
            <Button variant="ghost" onClick={() => setDepositGoal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" loading={depositLoading}>
              Confirm Deposit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Goal"
        size="sm"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>?
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

