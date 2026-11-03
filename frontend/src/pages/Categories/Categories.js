import React, { useState, useEffect, useCallback } from 'react';
import { categoryAPI } from '../../services/api';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/constants';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('expense');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: '🍔',
    color: '#6C63FF',
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: activeTab,
      icon: activeTab === 'income' ? '💰' : '🍔',
      color: '#6C63FF',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      type: cat.type,
      icon: cat.icon || '📦',
      color: cat.color || '#6C63FF',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon,
        color: formData.color,
      };

      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, payload);
      } else {
        await categoryAPI.create(payload);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      setFormError(err.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await categoryAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const currentTabCategories = categories.filter(c => c.type === activeTab);

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h2>Categories</h2>
          <p className="text-secondary">Manage and customize your income and expense categories.</p>
        </div>
        <Button variant="primary" icon="➕" onClick={handleOpenAdd}>
          Add Custom Category
        </Button>
      </div>

      {/* Tabs */}
      <div className="categories-tabs">
        <button
          className={`tab-btn ${activeTab === 'expense' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          📉 Expense Categories ({categories.filter(c => c.type === 'expense').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'income' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('income')}
        >
          📈 Income Categories ({categories.filter(c => c.type === 'income').length})
        </button>
      </div>

      {loading ? (
        <div className="categories-loading">
          <LoadingSpinner size="md" text="Loading categories..." />
        </div>
      ) : error ? (
        <div className="categories-error">⚠️ {error}</div>
      ) : (
        <div className="categories-grid">
          {currentTabCategories.map(cat => {
            const isSystem = cat.user_id === null;
            return (
              <Card key={cat.id} className="category-card">
                <div className="category-card-inner">
                  <div
                    className="category-icon-bubble"
                    style={{ backgroundColor: `${cat.color}20`, borderColor: cat.color }}
                  >
                    <span>{cat.icon || '📂'}</span>
                  </div>

                  <div className="category-details">
                    <h4 className="category-name">{cat.name}</h4>
                    <span className="category-badge">
                      {isSystem ? 'System Default' : 'Custom'}
                    </span>
                  </div>

                  {!isSystem && (
                    <div className="category-actions">
                      <button
                        className="action-icon-btn edit-btn"
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit category"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-icon-btn delete-btn"
                        onClick={() => setDeleteTarget(cat)}
                        title="Delete category"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleFormSubmit} className="cat-modal-form">
          {formError && (
            <div className="modal-error-alert">⚠️ {formError}</div>
          )}

          <div className="input-group">
            <label className="input-label">Type</label>
            <div className="tx-type-selector">
              <button
                type="button"
                className={`tx-type-btn ${formData.type === 'expense' ? 'tx-type-btn--expense-active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              >
                Expense
              </button>
              <button
                type="button"
                className={`tx-type-btn ${formData.type === 'income' ? 'tx-type-btn--income-active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              >
                Income
              </button>
            </div>
          </div>

          <Input
            label="Category Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Gym & Fitness, Online Courses"
            required
            autoFocus
          />

          <div className="input-group">
            <label className="input-label">Select Icon</label>
            <div className="icon-picker-grid">
              {CATEGORY_ICONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`icon-picker-item ${formData.icon === emoji ? 'icon-picker-item--active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Select Color Theme</label>
            <div className="color-picker-grid">
              {CATEGORY_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-picker-item ${formData.color === c ? 'color-picker-item--active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                />
              ))}
            </div>
          </div>

          <div className="modal-form-actions">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete category <strong>"{deleteTarget?.name}"</strong>?
          </p>
          <p className="text-muted text-sm mt-2">
            Transactions associated with this category will become uncategorized.
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

