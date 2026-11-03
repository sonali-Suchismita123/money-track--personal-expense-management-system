import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionAPI, categoryAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Transactions.css';

export default function Transactions() {
  const { currentUser } = useAuth();
  const currency = currentUser?.currency || 'INR';

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    type: 'expense',
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([
        transactionAPI.getAll({
          type: filterType || undefined,
          category_id: filterCategory || undefined,
        }),
        categoryAPI.getAll(),
      ]);

      setTransactions(txRes.transactions || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      category_id: categories.find(c => c.type === 'expense')?.id || '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setFormData({
      type: tx.type,
      category_id: tx.category_id || '',
      amount: tx.amount,
      description: tx.description,
      date: tx.date,
      notes: tx.notes || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'type') {
        const defaultCat = categories.find(c => c.type === value);
        updated.category_id = defaultCat ? defaultCat.id : '';
      }
      return updated;
    });
    if (formError) setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid positive amount');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please enter a description');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      const payload = {
        type: formData.type,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        notes: formData.notes.trim() || null,
      };

      if (editingTransaction) {
        await transactionAPI.update(editingTransaction.id, payload);
      } else {
        await transactionAPI.create(payload);
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
      await transactionAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete transaction');
    }
  };

  // Filter by search query client-side
  const filteredTransactions = transactions.filter(tx => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.description?.toLowerCase().includes(q) ||
      tx.notes?.toLowerCase().includes(q) ||
      tx.category?.name?.toLowerCase().includes(q)
    );
  });

  const availableCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="transactions-page">
      {/* Header Bar */}
      <div className="transactions-header">
        <div>
          <h2>Transactions</h2>
          <p className="text-secondary">Track every income and expense in one unified journal.</p>
        </div>
        <Button variant="primary" icon="➕" onClick={handleOpenAdd}>
          Add Transaction
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="transactions-filter-card">
        <div className="transactions-filters">
          <div className="filter-item search-bar">
            <Input
              type="text"
              placeholder="Search by description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon="🔍"
            />
          </div>

          <div className="filter-item">
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types (Income & Expense)</option>
              <option value="income">Income Only (+)</option>
              <option value="expense">Expense Only (-)</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {(filterType || filterCategory || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterType('');
                setFilterCategory('');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Transactions List */}
      <Card noPadding className="transactions-table-card">
        {loading ? (
          <div className="transactions-loading">
            <LoadingSpinner size="md" text="Loading transactions..." />
          </div>
        ) : error ? (
          <div className="transactions-error">⚠️ {error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="transactions-empty">
            <div className="empty-icon">💸</div>
            <h3>No Transactions Found</h3>
            <p>Try adjusting your search filters or record a new transaction.</p>
            <Button variant="primary" icon="➕" onClick={handleOpenAdd} className="mt-3">
              Add First Transaction
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="tx-date">{formatDate(tx.date)}</td>
                    <td>
                      <span className="tx-category-badge" style={{ backgroundColor: `${tx.category?.color || '#888'}15`, color: tx.category?.color || '#333' }}>
                        {tx.category?.icon || '📦'} {tx.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <div className="tx-desc-cell">
                        <span className="tx-desc-title">{tx.description}</span>
                        {tx.notes && <span className="tx-desc-notes">{tx.notes}</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`tx-type-pill tx-type-pill--${tx.type}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`text-right tx-amount-cell ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="text-center">
                      <div className="tx-actions">
                        <button
                          className="action-icon-btn edit-btn"
                          onClick={() => handleOpenEdit(tx)}
                          title="Edit transaction"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-icon-btn delete-btn"
                          onClick={() => setDeleteTarget(tx)}
                          title="Delete transaction"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
      >
        <form onSubmit={handleFormSubmit} className="tx-modal-form">
          {formError && (
            <div className="modal-error-alert">
              ⚠️ {formError}
            </div>
          )}

          {/* Type Toggle Tabs */}
          <div className="tx-type-selector">
            <button
              type="button"
              className={`tx-type-btn ${formData.type === 'expense' ? 'tx-type-btn--expense-active' : ''}`}
              onClick={() => handleFormChange({ target: { name: 'type', value: 'expense' } })}
            >
              📉 Expense
            </button>
            <button
              type="button"
              className={`tx-type-btn ${formData.type === 'income' ? 'tx-type-btn--income-active' : ''}`}
              onClick={() => handleFormChange({ target: { name: 'type', value: 'income' } })}
            >
              📈 Income
            </button>
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleFormChange}
            placeholder="0.00"
            icon={currentUser?.currency === 'USD' ? '$' : '₹'}
            required
            autoFocus
          />

          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleFormChange}
              className="input-field"
            >
              <option value="">Select Category...</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="e.g. Grocery shopping, Freelance project"
            icon="📝"
            required
          />

          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            required
          />

          <Input
            as="textarea"
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="Additional context or remarks..."
            rows={2}
          />

          <div className="modal-form-actions">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete this transaction:
            <strong> "{deleteTarget?.description}"</strong> for{' '}
            <strong>{formatCurrency(deleteTarget?.amount, currency)}</strong>?
          </p>
          <p className="text-muted text-sm mt-2">This action cannot be undone.</p>
          <div className="modal-form-actions mt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

