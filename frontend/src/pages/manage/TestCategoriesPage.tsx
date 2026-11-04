import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Plus,
  HelpCircle,
  CheckCircle2,
  FolderTree,
  ExternalLink,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  order: number;
  name: string;
}

interface TestCategoriesPageProps {
  onNavigateTestDatabaseWithCategory?: (catName: string) => void;
}

export const TestCategoriesPage: React.FC<TestCategoriesPageProps> = ({
  onNavigateTestDatabaseWithCategory,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: '355219', order: 1, name: 'Haematology' },
    { id: '355220', order: 2, name: 'Biochemistry' },
    { id: '355221', order: 3, name: 'Serology & Immunology' },
    { id: '355222', order: 4, name: 'Clinical Pathology' },
    { id: '355223', order: 5, name: 'Cytology' },
    { id: '355224', order: 6, name: 'Microbiology' },
    { id: '355225', order: 7, name: 'Endocrinology' },
    { id: '355226', order: 8, name: 'Histopathology' },
    { id: '355227', order: 9, name: 'Others' },
    { id: '355228', order: 10, name: 'Miscellaneous' },
  ]);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedCat, setSelectedCat] = useState<CategoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formOrder, setFormOrder] = useState<number>(11);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormOrder(categories.length + 1);
    setModalMode('create');
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCat(cat);
    setFormName(cat.name);
    setFormOrder(cat.order);
    setModalMode('edit');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newCat: CategoryItem = {
        id: String(Date.now()),
        order: Number(formOrder) || categories.length + 1,
        name: formName,
      };
      setCategories([...categories, newCat]);
      showToast(`Category "${newCat.name}" added successfully.`);
    } else if (modalMode === 'edit' && selectedCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCat.id
            ? { ...c, name: formName, order: Number(formOrder) }
            : c
        )
      );
      showToast(`Category "${formName}" updated.`);
    }
    setModalMode(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test categories
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => showToast('Categories determine report order. Drag or set integer order.')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HelpCircle size={15} color="#0284c7" />
            <span>How to reorder?</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '90px' }}>ORDER</th>
              <th>NAME</th>
              <th style={{ width: '180px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{c.order}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                    {c.name}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(c)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateTestDatabaseWithCategory) {
                          onNavigateTestDatabaseWithCategory(c.name);
                        } else {
                          showToast(`Viewing tests in category: ${c.name}`);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>View tests</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add Test Category' : `Edit Category: ${selectedCat?.name}`}
          size="sm"
        >
          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Category Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Molecular Biology"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-control"
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Display Order
              </label>
              <input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(Number(e.target.value))}
                className="input-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalMode(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalMode === 'create' ? 'Add Category' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
