import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Search,
  Copy,
  Layers,
  Sparkles,
  FileText,
} from 'lucide-react';

export interface XRayTemplate {
  id: string;
  title: string;
  category: 'Chest' | 'Spine' | 'Extremities' | 'Skull' | 'Pelvis';
  tags: string;
  updated: string;
  indicationDefault: string;
  findings: {
    technical?: string;
    bonyCage?: string;
    softTissues?: string;
    generalText?: string;
  };
  impression: string;
  advice?: string;
}

export const XRayTemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [templates, setTemplates] = useState<XRayTemplate[]>([
    {
      id: '1',
      title: 'Chest PA View (Normal Adult)',
      category: 'Chest',
      tags: 'Lung fields clear, Costophrenic sharp, CTR normal, Bony thorax intact',
      updated: '18-Oct-2026',
      indicationDefault: 'Routine executive medical checkup / Pre-operative fitness',
      findings: {
        technical: 'Posteroanterior radiograph of the chest shows adequate inspiratory effort. Trachea is midline.',
        bonyCage: 'Both lung fields are normally aerated and clear. No focal parenchymal consolidation, nodule, cavitation or active Koch lesion. Both CP angles and diaphragmatic domes are sharp.',
        softTissues: 'Cardiothoracic ratio (CTR) is within normal limits (< 0.50). Aortic knob and mediastinal contours are normal. Thoracic cage and soft tissues are unremarkable.',
      },
      impression: 'NORMAL CHEST RADIOGRAPH (PA VIEW). NO ACTIVE CARDIOPULMONARY LESION.',
      advice: 'Clinical correlation recommended.',
    },
    {
      id: '2',
      title: 'Chest AP View (Pneumonic Consolidation)',
      category: 'Chest',
      tags: 'Parenchymal opacity, Air bronchogram, Silhouette sign',
      updated: '16-Oct-2026',
      indicationDefault: 'High fever with chills, productive cough, pleuritic chest pain',
      findings: {
        technical: 'Anteroposterior projection of chest.',
        bonyCage: 'Non-homogeneous patchy alveolar opacity with distinct air bronchograms noted in the right mid and lower lung zones, obscuring the right heart border (positive silhouette sign). Left lung field is clear. Costophrenic angles are clear.',
        softTissues: 'Cardiac size is normal. Bony thorax is intact.',
      },
      impression: 'RIGHT MIDDLE AND LOWER LOBE PNEUMONIC CONSOLIDATION. NO PLEURAL EFFUSION.',
      advice: 'Clinical and microbiological correlation. Follow-up radiograph post antibiotic therapy.',
    },
    {
      id: '3',
      title: 'Cervical Spine AP & Lateral (Normal)',
      category: 'Spine',
      tags: 'Lordosis intact, Intervertebral spaces, Prevertebral soft tissue',
      updated: '15-Oct-2026',
      indicationDefault: 'Neck stiffness, occipital headache, postural strain',
      findings: {
        technical: 'Standard AP and Lateral digital projections of the cervical spine.',
        bonyCage: 'Normal cervical lordosis is preserved. Vertebral body heights and intervertebral disc spaces are maintained at all levels (C2 to C7). No anterior or posterior marginal osteophytes. Pedicles and posterior neural elements intact.',
        softTissues: 'Prevertebral soft tissue thickness is normal throughout.',
      },
      impression: 'NORMAL DIGITAL RADIOGRAPH OF CERVICAL SPINE (AP & LATERAL). NO SPONDYLOSIS.',
      advice: 'Ergonomic neck exercises.',
    },
    {
      id: '4',
      title: 'Lumbosacral Spine AP & Lateral (Lumbar Spondylosis)',
      category: 'Spine',
      tags: 'Osteophytes, L4-L5 disc space, Sacroiliac joints, Lordosis',
      updated: '14-Oct-2026',
      indicationDefault: 'Chronic lower back pain, morning stiffness, sciatica',
      findings: {
        technical: 'Digital radiographs of lumbosacral spine in standing position.',
        bonyCage: 'Straightening of normal lumbar lordosis noted, likely due to muscle spasm. Anterior marginal osteophytes seen at L4 and L5 vertebral bodies. Intervertebral disc space is mildly reduced at L4-L5 level. Facet joints show mild arthrosis. No spondylolisthesis.',
        softTissues: 'Psoas muscle outlines and sacroiliac joints appear normal.',
      },
      impression: 'LUMBAR SPONDYLOSIS WITH L4-L5 INTERVERTEBRAL DISC SPACE NARROWING AND OSTEOPHYTOSIS. NO LISTHESIS.',
      advice: 'Physiotherapy and core strengthening. MRI lumbosacral spine if radiculopathy persists.',
    },
    {
      id: '5',
      title: 'Knee Joint AP & Lateral (Primary Osteoarthritis)',
      category: 'Extremities',
      tags: 'Medial joint space, Tibial spines, Subchondral sclerosis',
      updated: '12-Oct-2026',
      indicationDefault: 'Bilateral knee pain, crepitus, difficulty descending stairs',
      findings: {
        technical: 'Weight-bearing AP and Lateral digital radiographs of the knee joint.',
        bonyCage: 'Asymmetric joint space narrowing predominantly involving the medial tibiofemoral compartment. Subchondral sclerosis and sharpening of the medial and lateral intercondylar tibial spines. Patellofemoral joint space is preserved. No loose body.',
        softTissues: 'No significant soft tissue swelling or suprapatellar effusion.',
      },
      impression: 'PRIMARY OSTEOARTHRITIS OF THE KNEE JOINT (GRADE-II KELLGREN-LAWRENCE CLASSIFICATION).',
      advice: 'Orthopedic consultation, quadriceps rehabilitation exercises.',
    },
    {
      id: '6',
      title: 'Paranasal Sinuses (Water\'s View - Sinusitis)',
      category: 'Skull',
      tags: 'Maxillary sinus, Air-fluid level, Frontal sinuses, DNS',
      updated: '10-Oct-2026',
      indicationDefault: 'Facial heaviness, nasal obstruction, chronic purulent discharge',
      findings: {
        technical: 'Occipitomental (Water\'s) projection with mouth open.',
        bonyCage: 'Unilateral/bilateral maxillary antra show prominent mucosal thickening with diffuse haziness and an air-fluid level. Frontal and ethmoidal sinuses appear clear without mucosal thickening. Orbital margins and zygomatic arches intact.',
        softTissues: 'Nasal septum shows deviation with hypertrophied inferior turbinates.',
      },
      impression: 'MAXILLARY SINUSITIS WITH AIR-FLUID LEVEL. MILD DEVIATED NASAL SEPTUM (DNS).',
      advice: 'ENT consultation and steam inhalation.',
    },
    {
      id: '7',
      title: 'Pelvis with Both Hips AP View (Normal)',
      category: 'Pelvis',
      tags: 'Femoral heads, Shenton line, Acetabulum, Sacroiliac joints',
      updated: '08-Oct-2026',
      indicationDefault: 'Hip discomfort / Screening / Trauma',
      findings: {
        technical: 'Anteroposterior projection of pelvis including both hip joints.',
        bonyCage: 'Both femoral heads show normal sphericity and congruity within the acetabular cavities. Joint spaces are preserved bilaterally. Shenton lines are smooth and unbroken. Iliac bones, pubic rami and ischial tuberosities are intact. Bilateral sacroiliac joints are normal.',
        softTissues: 'Pelvic soft tissue shadows and bladder outline are unremarkable.',
      },
      impression: 'NORMAL RADIOGRAPH OF PELVIS WITH BOTH HIP JOINTS (AP VIEW). NO FRACTURE OR AVN.',
      advice: 'Clinical correlation recommended.',
    },
    {
      id: '8',
      title: 'Shoulder Joint AP & Axial / Y-View (Normal)',
      category: 'Extremities',
      tags: 'Glenohumeral joint, Acromion, Clavicle, Greater tuberosity',
      updated: '06-Oct-2026',
      indicationDefault: 'Shoulder pain following sports activity / Restricted abduction',
      findings: {
        technical: 'AP in internal and external rotation and Scapular Y-view.',
        bonyCage: 'Glenohumeral and acromioclavicular joints are well aligned and congruent. Greater tuberosity and humeral head cortex are smooth and intact. Subacromial space is maintained. No calcific tendinitis, fracture or glenoid Bankart defect.',
        softTissues: 'Deltoid and rotator cuff soft tissue shadows are normal.',
      },
      impression: 'NORMAL DIGITAL RADIOGRAPH OF SHOULDER JOINT. NO FRACTURE OR DISLOCATION.',
      advice: 'Rotator cuff ultrasound if impingement symptoms persist.',
    },
    {
      id: '9',
      title: 'Right Wrist AP & Lateral (Colles\' Fracture)',
      category: 'Extremities',
      tags: 'Distal radius, Cortical breach, Dorsal tilt, DRUJ',
      updated: '04-Oct-2026',
      indicationDefault: 'Fall on outstretched hand, dinner-fork deformity, pain',
      findings: {
        technical: 'Anteroposterior and Lateral views of the wrist and distal forearm.',
        bonyCage: 'Extra-articular transverse/oblique fracture through the metaphysis of the distal radius ~1.5 cm proximal to the radiocarpal joint. Dorsal displacement and angulation (~8 degrees) of the distal fracture fragment noted. Associated styloid process fracture of the ulna seen. Distal radioulnar joint (DRUJ) is congruent.',
        softTissues: 'Pronator fat stripe obscured with marked dorsal soft tissue swelling.',
      },
      impression: 'CLASSIC COLLES\' FRACTURE OF THE DISTAL RADIUS WITH ULNAR STYLOID AVULSION.',
      advice: 'Immediate orthopedic reduction, casting, and post-reduction radiograph.',
    },
    {
      id: '10',
      title: 'Abdomen Erect & Supine (KUB / Obstruction)',
      category: 'Pelvis',
      tags: 'Psoas shadow, Gas pattern, Air-fluid levels, Free air under diaphragm',
      updated: '02-Oct-2026',
      indicationDefault: 'Acute abdominal pain, distension, obstipation, vomiting',
      findings: {
        technical: 'Erect and Supine plain radiographs of abdomen and pelvis.',
        bonyCage: 'Normal bowel gas pattern seen in large and small bowels. No pathologically dilated bowel loops or multiple air-fluid levels. No radio-opaque calculus noted along the anatomical course of bilateral kidneys, ureters or bladder. Both psoas muscle outlines are sharp.',
        softTissues: 'No pneumoperitoneum (no free crescentic gas under bilateral diaphragmatic domes).',
      },
      impression: 'NORMAL PLAIN ABDOMINAL RADIOGRAPH. NO RADIO-OPAQUE RENAL CALCULUS OR INTESTINAL OBSTRUCTION.',
      advice: 'Ultrasound whole abdomen recommended for further visceral evaluation.',
    },
  ]);

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'preview' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<XRayTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<XRayTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Chest' | 'Spine' | 'Extremities' | 'Skull' | 'Pelvis'>('Chest');
  const [formTags, setFormTags] = useState('');
  const [formIndication, setFormIndication] = useState('');
  const [formGeneralText, setFormGeneralText] = useState('');
  const [formImpression, setFormImpression] = useState('');
  const [formAdvice, setFormAdvice] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormCategory('Chest');
    setFormTags('Bony architecture, Joint spaces, Soft tissues');
    setFormIndication('Routine screening / Trauma / Pain');
    setFormGeneralText('Digital radiography projections demonstrate normal bony contours and joint alignment. Surrounding soft tissue shadows are unremarkable. No fracture, dislocation, or active disease.');
    setFormImpression('NORMAL RADIOGRAPHIC STUDY.');
    setFormAdvice('Clinical correlation recommended.');
    setActiveModal('create');
  };

  const handleOpenEdit = (t: XRayTemplate) => {
    setSelectedTemplate(t);
    setFormTitle(t.title);
    setFormCategory(t.category);
    setFormTags(t.tags);
    setFormIndication(t.indicationDefault);
    const combinedFindings =
      t.findings.generalText ||
      Object.entries(t.findings)
        .filter(([k, v]) => Boolean(v))
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join('\n\n');
    setFormGeneralText(combinedFindings);
    setFormImpression(t.impression);
    setFormAdvice(t.advice || '');
    setActiveModal('edit');
  };

  const handleDuplicate = (t: XRayTemplate) => {
    const clone: XRayTemplate = {
      ...t,
      id: String(Date.now()),
      title: `${t.title} (Copy)`,
      updated: 'Today',
    };
    setTemplates([clone, ...templates]);
    showToast(`Duplicated template: "${clone.title}"`);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTpl: XRayTemplate = {
      id: String(Date.now()),
      title: formTitle,
      category: formCategory,
      tags: formTags || 'Radiography template',
      updated: 'Today',
      indicationDefault: formIndication,
      findings: {
        generalText: formGeneralText,
      },
      impression: formImpression || 'NORMAL STUDY.',
      advice: formAdvice,
    };

    setTemplates([newTpl, ...templates]);
    setActiveModal(null);
    showToast(`Template "${newTpl.title}" created successfully.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !formTitle.trim()) return;

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              title: formTitle,
              category: formCategory,
              tags: formTags,
              indicationDefault: formIndication,
              findings: { generalText: formGeneralText },
              impression: formImpression,
              advice: formAdvice,
              updated: 'Just now',
            }
          : t
      )
    );
    setActiveModal(null);
    showToast(`Template "${formTitle}" updated.`);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
    showToast(`Template "${templateToDelete.title}" deleted.`);
    setTemplateToDelete(null);
  };

  const filteredTemplates = templates.filter((t) => {
    if (activeCategory !== 'ALL' && t.category !== activeCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.tags.toLowerCase().includes(q) ||
        t.impression.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
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
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="h1-title" style={{ margin: 0 }}>
            Digital X-ray Report Templates
          </h2>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Standardized radiological report boilerplate, anatomical checklists, and normal finding templates.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenCreate}>
          + Add X-Ray Template
        </Button>
      </div>

      {/* Category Pills & Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'All Templates', count: templates.length },
            { key: 'Chest', label: 'Chest & Thorax', count: templates.filter((t) => t.category === 'Chest').length },
            { key: 'Spine', label: 'Spine (Cervical/LS)', count: templates.filter((t) => t.category === 'Spine').length },
            { key: 'Extremities', label: 'Extremities & Joints', count: templates.filter((t) => t.category === 'Extremities').length },
            { key: 'Skull', label: 'Skull & Facial Bones', count: templates.filter((t) => t.category === 'Skull').length },
            { key: 'Pelvis', label: 'Pelvis & Abdomen', count: templates.filter((t) => t.category === 'Pelvis').length },
          ].map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? '#0369a1' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#475569',
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Filter templates..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Templates Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredTemplates.map((tpl) => (
          <Card key={tpl.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {tpl.title}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tpl.category}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                <strong>Key Findings:</strong> {tpl.tags}
              </div>

              {/* Impression Snippet */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#0369a1',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  marginBottom: '14px',
                }}
              >
                {tpl.impression}
              </div>
            </div>

            {/* Footer with actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                marginTop: 'auto',
              }}
            >
              <span className="text-caption" style={{ color: '#94a3b8' }}>
                Updated {tpl.updated}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={13} />}
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setActiveModal('preview');
                  }}
                  title="Preview Full Template"
                >
                  Preview
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Copy size={13} />}
                  onClick={() => handleDuplicate(tpl)}
                  title="Duplicate Template"
                >
                  Copy
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Edit3 size={13} />}
                  onClick={() => handleOpenEdit(tpl)}
                  title="Edit Template"
                >
                  Edit
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  style={{ color: '#dc2626' }}
                  icon={<Trash2 size={13} />}
                  onClick={() => setTemplateToDelete(tpl)}
                  title="Delete Template"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL 1: Create or Edit Template Modal */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'create' ? 'Add New Radiography Template' : `Edit Template: ${formTitle}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={activeModal === 'create' ? handleSaveCreate : handleSaveEdit}>
                {activeModal === 'create' ? 'Save New Template' : 'Update Template'}
              </Button>
            </div>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Input
                label="Template Title"
                placeholder="e.g. Chest PA View (Normal Adult)"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />

              <Select
                label="Anatomical Category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                options={[
                  { label: 'Chest & Thorax', value: 'Chest' },
                  { label: 'Spine (Cervical / LS)', value: 'Spine' },
                  { label: 'Extremities & Joints', value: 'Extremities' },
                  { label: 'Skull & Facial Bones', value: 'Skull' },
                  { label: 'Pelvis & Abdomen', value: 'Pelvis' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Included Views & Keywords (Tags)"
                placeholder="e.g. Lung fields, CTR, Costophrenic angles"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
              <Input
                label="Default Clinical Indication"
                placeholder="e.g. Persistent cough / Pre-op fitness"
                value={formIndication}
                onChange={(e) => setFormIndication(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
                Standard Radiographic Findings (Technical, Bony elements, Soft tissues)
              </label>
              <textarea
                className="form-input"
                rows={7}
                value={formGeneralText}
                onChange={(e) => setFormGeneralText(e.target.value)}
                placeholder="Enter standard radiological findings text..."
                style={{ fontSize: '13px', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#0369a1' }}>
                Radiological Impression (UPPERCASE)
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={formImpression}
                onChange={(e) => setFormImpression(e.target.value)}
                placeholder="Enter clinical impression boilerplate..."
                style={{ fontWeight: 600, color: '#0c4a6e', fontSize: '13px' }}
              />
            </div>

            <Input
              label="Default Clinical Recommendations / Advice"
              placeholder="e.g. Clinical correlation and follow-up radiograph as advised"
              value={formAdvice}
              onChange={(e) => setFormAdvice(e.target.value)}
            />
          </form>
        </Modal>
      )}

      {/* MODAL 2: Template Preview Modal */}
      {activeModal === 'preview' && selectedTemplate && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Radiography Template Preview: ${selectedTemplate.title}`}
          size="lg"
          footer={
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Done
            </Button>
          }
        >
          <div style={{ fontSize: '13px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong>Category:</strong> {selectedTemplate.category}
                <div style={{ color: '#64748b', fontSize: '12px' }}>
                  <strong>Key Tags:</strong> {selectedTemplate.tags}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Default History: <em>{selectedTemplate.indicationDefault}</em>
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '6px', textTransform: 'uppercase', color: '#334155' }}>
                Standard Radiological Findings Text:
              </strong>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedTemplate.findings.generalText ||
                  Object.entries(selectedTemplate.findings)
                    .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                    .join('\n\n')}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f0f9ff',
                padding: '12px 14px',
                borderRadius: '6px',
                borderLeft: '4px solid #0284c7',
              }}
            >
              <strong style={{ color: '#0369a1', display: 'block', marginBottom: '2px' }}>
                IMPRESSION:
              </strong>
              <div style={{ color: '#0c4a6e', fontWeight: 600 }}>{selectedTemplate.impression}</div>
              {selectedTemplate.advice && (
                <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px' }}>
                  <strong>Advice:</strong> {selectedTemplate.advice}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Radiography Template"
        message={`Are you sure you want to permanently delete the template "${templateToDelete?.title}"?`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
