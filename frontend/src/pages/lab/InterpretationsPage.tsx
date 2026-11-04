import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Plus,
  BookOpen,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit2,
  MoreVertical,
} from 'lucide-react';

interface InterpretationItem {
  id: string;
  sNo: number;
  name: string;
  type: 'test' | 'panel';
  physiologicalBasis: string;
  increasedIn?: string;
  decreasedIn?: string;
  comments: string;
}

interface InterpretationsPageProps {
  onNavigate?: (screen: string) => void;
}

export const InterpretationsPage: React.FC<InterpretationsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'test' | 'panel'>('test');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [items, setItems] = useState<InterpretationItem[]>([
    {
      id: '1',
      sNo: 1,
      name: '25 Hydroxy (OH) Vitamin D',
      type: 'test',
      physiologicalBasis:
        'The vitamin D system functions to maintain serum calcium levels. Vitamin D is a fat-soluble steroid hormone. Two sequential hydroxylations occur: in the liver to 25(OH)D and then, in the kidney, to 1,25[OH]2D. Besides consequences for bone health, vitamin D deficiency reportedly is associated with a number of cardiovascular and autoimmune conditions.',
      increasedIn: 'Heavy milk drinkers, vitamin D intoxication, excessive sun exposure.',
      decreasedIn:
        'Dietary deficiency, malabsorption, rickets, osteomalacia, biliary and portal cirrhosis, nephrotic syndrome, renal failure, inadequate sun exposure, advanced age (> 70).',
      comments:
        'A 25(OH)D level of 20–30 ng/mL is generally sufficient for bone and general health in 97.5% of the general population. Routine screening without risk factors is not indicated.',
    },
    {
      id: '2',
      sNo: 2,
      name: 'Absolute Eosinophil Count',
      type: 'test',
      physiologicalBasis:
        'The Absolute Eosinophil Count (AEC) is a measure of the number of eosinophils, a type of white blood cell, in a given volume of blood. AEC is calculated by multiplying the percentage of eosinophils by the total white blood cell count.',
      increasedIn: 'Allergic reactions, bronchial asthma, parasitic worm infections, eosinophilic granulomatosis, drug hypersensitivity.',
      decreasedIn: 'Acute bacterial infections, severe stress, Cushing syndrome, corticosteroid administration.',
      comments:
        'AEC is typically evaluated alongside Complete Blood Count (CBC) with differential. Persistent eosinophilia warrants evaluation for helminthic infections or atopic disorders.',
    },
    {
      id: '3',
      sNo: 3,
      name: 'Acid - Fast Bacilli',
      type: 'test',
      physiologicalBasis:
        'A positive Acid-Fast Bacillus (AFB) smear provides rapid presumptive evidence of a Mycobacterial infection. The positivity and grade correlate with the clinical bacillary burden.',
      increasedIn: 'Mycobacterium tuberculosis, atypical mycobacterial pulmonary or extrapulmonary disease.',
      decreasedIn: 'Non-infected individuals or paucibacillary state below the microscopic limit of detection (5000-10,000 bacilli/mL).',
      comments:
        'Microscopy does not differentiate between viable and non-viable organisms, nor between M. tuberculosis and non-tuberculous mycobacteria (NTM). GeneXpert / culture advised.',
    },
    {
      id: '4',
      sNo: 4,
      name: 'Activated partial thromboplastin time, APTT',
      type: 'test',
      physiologicalBasis:
        'APTT evaluates the intrinsic and common coagulation pathways and adequacy of all coagulation factors except VII and XIII. APTT is commonly used to monitor unfractionated heparin therapy.',
      increasedIn:
        'Deficiency of coagulation factors (VIII, IX, XI, XII), presence of lupus anticoagulant, specific factor inhibitors, von Willebrand disease, DIC, and heparin therapy.',
      decreasedIn: 'Hypercoagulable states, extensive acute phase reaction with elevated factor VIII levels.',
      comments:
        'Heparin contamination is the most common cause of unexplained isolated prolonged APTT. Pre-analytical tube filling to the mark is mandatory.',
    },
    {
      id: '5',
      sNo: 5,
      name: 'Lipid Profile Panel',
      type: 'panel',
      physiologicalBasis:
        'Comprehensive assessment of serum atherogenic lipoproteins and cardioprotective high-density lipoproteins. Crucial for 10-year atherosclerotic cardiovascular disease (ASCVD) risk stratification.',
      increasedIn: 'Hypercholesterolemia, familial combined hyperlipidemia, metabolic syndrome, hypothyroidism, uncontrolled diabetes.',
      decreasedIn: 'Severe malnutrition, chronic liver parenchymal damage, abetalipoproteinemia, hyperthyroidism.',
      comments:
        '10-12 hours overnight fasting recommended. Target LDL-C should be guided by individual baseline cardiovascular risk category.',
    },
    {
      id: '6',
      sNo: 6,
      name: 'Complete Blood Count (CBC) Panel',
      type: 'panel',
      physiologicalBasis:
        'Evaluates bone marrow hematopoietic function across all three cellular lineages: erythroid, myeloid, and megakaryocytic.',
      increasedIn: 'Polycythemia, reactive leukocytosis, myeloproliferative neoplasms, thrombocytosis.',
      decreasedIn: 'Anemia, cytopenias, marrow hypoplasia, nutritional B12/folate deficiency, hypersplenism.',
      comments:
        'Peripheral blood smear examination recommended if flag alarms or significant abnormal numerical deviations occur.',
    },
  ]);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InterpretationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'test' | 'panel'>('test');
  const [formPhysiology, setFormPhysiology] = useState('');
  const [formIncreased, setFormIncreased] = useState('');
  const [formDecreased, setFormDecreased] = useState('');
  const [formComments, setFormComments] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormType(activeTab);
    setFormPhysiology('');
    setFormIncreased('');
    setFormDecreased('');
    setFormComments('');
    setModalMode('create');
  };

  const handleOpenEdit = (item: InterpretationItem) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormPhysiology(item.physiologicalBasis);
    setFormIncreased(item.increasedIn || '');
    setFormDecreased(item.decreasedIn || '');
    setFormComments(item.comments);
    setModalMode('edit');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newItem: InterpretationItem = {
        id: String(Date.now()),
        sNo: items.length + 1,
        name: formName,
        type: formType,
        physiologicalBasis: formPhysiology || 'Standard diagnostic guidance.',
        increasedIn: formIncreased,
        decreasedIn: formDecreased,
        comments: formComments,
      };
      setItems([...items, newItem]);
      showToast(`Added interpretation for "${newItem.name}".`);
    } else if (modalMode === 'edit' && selectedItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id
            ? {
                ...i,
                name: formName,
                type: formType,
                physiologicalBasis: formPhysiology,
                increasedIn: formIncreased,
                decreasedIn: formDecreased,
                comments: formComments,
              }
            : i
        )
      );
      showToast(`Updated interpretation for "${formName}".`);
    }
    setModalMode(null);
  };

  const testCount = items.filter((i) => i.type === 'test').length;
  const panelCount = items.filter((i) => i.type === 'panel').length;

  const filteredItems = items.filter((i) => {
    const matchesTab = i.type === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      i.name.toLowerCase().includes(q) ||
      i.physiologicalBasis.toLowerCase().includes(q) ||
      (i.increasedIn && i.increasedIn.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Interpretations
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      {/* Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          fontSize: '13px',
          marginBottom: '16px',
        }}
      >
        <span>You can now copy interpretations from</span>
        <a
          href="#interpretations_library"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) {
              onNavigate('interpretations_library');
            } else {
              showToast('Opening clinical interpretations reference library...');
            }
          }}
          style={{ color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
        >
          Library <ExternalLink size={12} />
        </a>
        <span>to update.</span>
        <span
          style={{
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '4px',
            marginLeft: '4px',
          }}
        >
          NEW
        </span>
      </div>

      {/* Tabs & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('test')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'test' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'test' ? '#0284c7' : '#ffffff',
              color: activeTab === 'test' ? '#ffffff' : '#475569',
            }}
          >
            Test {testCount}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('panel')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'panel' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'panel' ? '#0284c7' : '#ffffff',
              color: activeTab === 'panel' ? '#ffffff' : '#475569',
            }}
          >
            Panels {panelCount}
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Interpretations Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '70px' }}>S. NO.</th>
              <th style={{ width: '260px' }}>NAME</th>
              <th>INTERPRETATION</th>
              <th style={{ width: '100px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No interpretations found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => {
                const isExpanded = expandedId === item.id;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>{idx + 1}.</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                        {item.name}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Physiological Basis:</div>
                        <p style={{ margin: '2px 0 6px', color: '#475569' }}>
                          {item.physiologicalBasis}
                        </p>

                        {isExpanded && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                            {item.increasedIn && (
                              <div style={{ marginBottom: '4px' }}>
                                <strong style={{ color: '#b91c1c' }}>Increased in: </strong>
                                <span style={{ color: '#475569' }}>{item.increasedIn}</span>
                              </div>
                            )}
                            {item.decreasedIn && (
                              <div style={{ marginBottom: '4px' }}>
                                <strong style={{ color: '#0369a1' }}>Decreased in: </strong>
                                <span style={{ color: '#475569' }}>{item.decreasedIn}</span>
                              </div>
                            )}
                            {item.comments && (
                              <div style={{ marginTop: '6px' }}>
                                <strong>Comments: </strong>
                                <span style={{ color: '#475569' }}>{item.comments}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284c7',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '2px 0',
                            marginTop: '2px',
                          }}
                        >
                          {isExpanded ? 'Show less' : 'View all'}
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add Clinical Interpretation' : `Edit: ${selectedItem?.name}`}
          size="md"
        >
          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Investigation / Panel Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 25 Hydroxy (OH) Vitamin D"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-control"
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Type
              </label>
              <select
                className="select-control"
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
              >
                <option value="test">Single Test</option>
                <option value="panel">Panel Group</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Physiological Basis
              </label>
              <textarea
                className="input-control"
                rows={3}
                value={formPhysiology}
                onChange={(e) => setFormPhysiology(e.target.value)}
                placeholder="Describe physiological significance and hormonal pathways..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Increased In
                </label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={formIncreased}
                  onChange={(e) => setFormIncreased(e.target.value)}
                  placeholder="Clinical conditions causing elevation..."
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Decreased In
                </label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={formDecreased}
                  onChange={(e) => setFormDecreased(e.target.value)}
                  placeholder="Clinical conditions causing low values..."
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Clinical Comments / Guidance
              </label>
              <textarea
                className="input-control"
                rows={2}
                value={formComments}
                onChange={(e) => setFormComments(e.target.value)}
                placeholder="Follow-up advice, diagnostic thresholds, or assay limitations..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalMode(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalMode === 'create' ? 'Save Interpretation' : 'Update'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
