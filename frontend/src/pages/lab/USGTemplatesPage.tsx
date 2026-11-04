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

export interface USGTemplate {
  id: string;
  title: string;
  category: 'Abdomen' | 'Obstetric' | 'Urology' | 'Small Parts' | 'Doppler';
  tags: string;
  updated: string;
  indicationDefault: string;
  findings: {
    liver?: string;
    gallBladder?: string;
    spleen?: string;
    pancreas?: string;
    kidneys?: string;
    bladder?: string;
    pelvis?: string;
    generalText?: string;
  };
  impression: string;
  advice?: string;
}

export const USGTemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [templates, setTemplates] = useState<USGTemplate[]>([
    {
      id: '1',
      title: 'USG Whole Abdomen & Pelvis (Normal Male)',
      category: 'Abdomen',
      tags: 'Liver, GB, Spleen, Kidneys, Bladder, Prostate',
      updated: '18-Oct-2026',
      indicationDefault: 'Routine executive health checkup / Non-specific abdominal discomfort',
      findings: {
        liver: 'Normal in size (14.2 cm), smooth capsular margin, homogeneous parenchymal echotexture. No focal mass lesion or IHBR dilatation.',
        gallBladder: 'Physiologically distended, wall thickness normal (2.3 mm). No intraluminal calculus, mass or pericholecystic collection.',
        spleen: 'Normal in size (10.1 cm) with homogeneous echotexture. Splenic hilum is normal.',
        pancreas: 'Visualized portions show normal size and parenchymal echogenicity. MPD is not dilated.',
        kidneys: 'Both kidneys are normal in size, shape and position with intact corticomedullary differentiation. No calculus or hydronephrosis.',
        bladder: 'Well distended with thin, smooth walls. No calculus or intraluminal polyp. Insignificant post-void residual urine (~15 ml).',
        pelvis: 'Prostate is normal in size and echotexture (approx 20 cc). Median lobe is not enlarged.',
      },
      impression: 'NORMAL ULTRASONOGRAPHIC STUDY OF MALE WHOLE ABDOMEN & PELVIS.',
      advice: 'Clinical correlation recommended.',
    },
    {
      id: '2',
      title: 'USG Whole Abdomen & Pelvis (Normal Female)',
      category: 'Abdomen',
      tags: 'Liver, GB, Kidneys, Uterus, Bilateral Ovaries, POD',
      updated: '18-Oct-2026',
      indicationDefault: 'Routine health screening / Lower abdominal ache',
      findings: {
        liver: 'Normal in size and parenchymal echogenicity. No focal lesion.',
        gallBladder: 'Normal distension, thin wall. Lumen is clear.',
        spleen: 'Normal in size and echotexture.',
        pancreas: 'Normal appearance.',
        kidneys: 'Bilateral kidneys normal in size and position with preserved CMD. No calculi or hydronephrosis.',
        bladder: 'Normal distended urinary bladder with thin smooth wall.',
        pelvis: 'Uterus is anteverted, normal in size and myometrial echotexture. Endometrial thickness measures 7.2 mm. Both ovaries are normal in size and follicular pattern. No adnexal mass. No free fluid in Pouch of Douglas.',
      },
      impression: 'NORMAL ULTRASONOGRAPHIC STUDY OF FEMALE WHOLE ABDOMEN & PELVIS.',
      advice: 'Clinical correlation recommended.',
    },
    {
      id: '3',
      title: 'Hepatic Steatosis (Fatty Liver) & Cholelithiasis',
      category: 'Abdomen',
      tags: 'Grade-I/II Fatty liver, GB Calculus, Acoustic Shadow',
      updated: '16-Oct-2026',
      indicationDefault: 'Right upper quadrant pain, indigestion, post-prandial fullness',
      findings: {
        liver: 'Enlarged (15.5 cm) with diffusely increased parenchymal echogenicity, mild acoustic beam attenuation, and impaired visualization of peripheral portal venous walls, consistent with Grade-II Fatty Infiltration.',
        gallBladder: 'Distended. Single/multiple mobile hyperechoic intraluminal calculi seen, largest measuring ~8.5 mm casting distinct posterior acoustic shadows. Gallbladder wall is not thickened (2.4 mm). Murphy sign is negative.',
        spleen: 'Normal in size and echotexture.',
        pancreas: 'Normal.',
        kidneys: 'Both kidneys are normal.',
        bladder: 'Normal.',
        pelvis: 'Normal pelvic organs.',
      },
      impression: '1. CHOLELITHIASIS WITHOUT SONOGRAPHIC FEATURES OF ACUTE CHOLECYSTITIS. 2. GRADE-II HEPATIC STEATOSIS (FATTY LIVER).',
      advice: 'Surgical opinion for cholelithiasis. Dietary lifestyle modifications for hepatic steatosis.',
    },
    {
      id: '4',
      title: 'USG KUB & Prostate with Post-Void Residual (BPH)',
      category: 'Urology',
      tags: 'Renal Parenchyma, Bladder Trabeculation, Prostate Vol, PVR',
      updated: '14-Oct-2026',
      indicationDefault: 'Hesitancy, poor stream, nocturia, lower abdominal heaviness',
      findings: {
        kidneys: 'Right kidney measures 10.2 x 4.5 cm, Left kidney 10.5 x 4.7 cm. Cortical thickness preserved bilaterally. No calculus, hydronephrosis or perinephric collection.',
        bladder: 'Pre-void volume ~380 ml. Bladder wall shows mild thickening (4.4 mm) with fine trabeculation. Post-void residual urine volume is 68 ml (significant).',
        pelvis: 'Prostate gland is enlarged (volume approx 42 cc) with intravesical median lobe protrusion. Parenchyma shows mild inhomogeneous echotexture without focal suspicious lesion.',
      },
      impression: 'GRADE-II BENIGN PROSTATIC HYPERPLASIA (BPH) WITH SIGNIFICANT POST-VOID RESIDUAL URINE (~68 ML). NORMAL BILATERAL KIDNEYS.',
      advice: 'Urological consultation and serum PSA testing recommended.',
    },
    {
      id: '5',
      title: 'Obstetric II Trimester Anomaly Scan (Target Scan)',
      category: 'Obstetric',
      tags: 'Fetal Spine, 4-Chamber Heart, Brain, Stomach, Kidneys, Limbs',
      updated: '12-Oct-2026',
      indicationDefault: 'Routine second trimester anomaly evaluation (18-20 weeks)',
      findings: {
        generalText:
          'Single live intrauterine fetus in variable presentation. Fetal skull contour and brain parenchyma (ventricles, choroid plexus, posterior fossa) appear normal. Face profile, orbits, lips and palate intact. Fetal spine appears regular and intact throughout. 4-chamber cardiac view and outflow tracts normal. Stomach bubble, bilateral kidneys and urinary bladder visualized. Both upper and lower limb long bones visualized with normal morphology. Placenta is fundal posterior, Grade-I maturity. Amniotic fluid index is adequate (AFI 14.2 cm).',
      },
      impression: 'SINGLE LIVE INTRAUTERINE FETUS OF ~19 WEEKS GESTATION. NO MAJOR CONGENITAL STRUCTURAL ANOMALY DETECTED AT PRESENT SCAN.',
      advice: 'Routine antenatal care and follow up growth scan around 28-32 weeks.',
    },
    {
      id: '6',
      title: 'Obstetric Early Pregnancy / Viability (I Trimester)',
      category: 'Obstetric',
      tags: 'Gestational sac, Fetal pole, CRL, Cardiac activity, Yolk sac',
      updated: '10-Oct-2026',
      indicationDefault: 'Amenorrhea 7-8 weeks, confirmation of intrauterine pregnancy',
      findings: {
        generalText:
          'Single well-defined intrauterine gestational sac seen. Yolk sac is present and normal in size (4.2 mm). Single live fetal pole identified with CRL measuring 18.2 mm corresponding to 8 weeks 2 days. Regular cardiac pulsations visualized with FHR 158 bpm. Decidual reaction is healthy. Bilateral adnexa clear. No subchorionic hematoma.',
      },
      impression: 'SINGLE LIVE INTRAUTERINE PREGNANCY OF APPROXIMATELY 8 WEEKS 2 DAYS. HEALTHY CARDIAC ACTIVITY.',
      advice: 'Routine first trimester follow-up and NT scan around 11-13 weeks.',
    },
    {
      id: '7',
      title: 'High Resolution Thyroid & Neck Ultrasound',
      category: 'Small Parts',
      tags: 'Thyroid lobes, Isthmus, Echogenicity, Vascularity, Cervical nodes',
      updated: '08-Oct-2026',
      indicationDefault: 'Anterior neck swelling / Thyroid function abnormality',
      findings: {
        generalText:
          'Both thyroid lobes and isthmus are normal in size and parenchymal echogenicity. Right lobe: 4.2 x 1.6 x 1.5 cm; Left lobe: 4.0 x 1.5 x 1.4 cm; Isthmus: 3.0 mm. No focal solid or cystic lesion / nodule seen. Parenchymal vascularity on color Doppler is within normal limits. Bilateral jugulodigastric and deep cervical lymph node stations appear normal.',
      },
      impression: 'NORMAL HIGH RESOLUTION ULTRASONOGRAPHY OF THYROID GLAND AND BILATERAL NECK SPACES.',
      advice: 'Serum T3, T4, TSH correlation.',
    },
    {
      id: '8',
      title: 'Scrotal & Testicular Color Doppler Study',
      category: 'Small Parts',
      tags: 'Testes, Epididymis, Hydrocele, Varicocele, Color Doppler',
      updated: '06-Oct-2026',
      indicationDefault: 'Scrotal ache / Swelling / Infertility evaluation',
      findings: {
        generalText:
          'Both testes are descended into scrotal sac, normal in size, shape and homogeneous parenchymal echotexture. Right testis: 4.1 x 2.4 x 2.2 cm; Left testis: 4.0 x 2.3 x 2.1 cm. Both epididymal head, body and tail appear normal. No hydrocele or hematocele. Pampiniform plexus veins show normal caliber (<2 mm) without retrograde reflux on Valsalva maneuver. Intratesticular spectral Doppler wave flow is normal.',
      },
      impression: 'NORMAL SCROTAL ULTRASOUND AND TESTICULAR COLOR DOPPLER STUDY. NO VARICOCELE OR HYDROCELE.',
      advice: 'Clinical correlation recommended.',
    },
    {
      id: '9',
      title: 'Bilateral Breast Ultrasound (BIRADS Assessment)',
      category: 'Small Parts',
      tags: 'Fibroglandular tissue, Duct ectasia, BIRADS-1, Axillary nodes',
      updated: '04-Oct-2026',
      indicationDefault: 'Routine screening / Breast tenderness',
      findings: {
        generalText:
          'Bilateral breasts show normal fibroglandular parenchyma with normal retro-mammary fat. No discrete cystic or solid mass lesion, architectural distortion or microcalcifications identified in either breast. Cooper ligaments and skin line are intact. Bilateral axillae show normal fatty preserved lymph nodes.',
      },
      impression: 'NORMAL BILATERAL BREAST ULTRASOUND STUDY — BIRADS CATEGORY 1 (NEGATIVE).',
      advice: 'Annual clinical breast examination and screening as advised by physician.',
    },
  ]);

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'preview' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<USGTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<USGTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Abdomen' | 'Obstetric' | 'Urology' | 'Small Parts' | 'Doppler'>('Abdomen');
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
    setFormCategory('Abdomen');
    setFormTags('Liver, Kidneys, Bladder');
    setFormIndication('Routine clinical evaluation');
    setFormGeneralText('All evaluated organs demonstrate normal anatomical size, contour, and parenchymal echogenicity. No focal lesion identified.');
    setFormImpression('NORMAL ULTRASONOGRAPHIC STUDY.');
    setFormAdvice('Clinical correlation recommended.');
    setActiveModal('create');
  };

  const handleOpenEdit = (t: USGTemplate) => {
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

  const handleDuplicate = (t: USGTemplate) => {
    const clone: USGTemplate = {
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

    const newTpl: USGTemplate = {
      id: String(Date.now()),
      title: formTitle,
      category: formCategory,
      tags: formTags || 'Organs evaluated',
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
            USG Report Templates
          </h2>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Pre-configured clinical ultrasound report templates, organ descriptions, and standard normal finding templates.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenCreate}>
          + Add USG Template
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
            { key: 'Abdomen', label: 'Abdomen & Pelvis', count: templates.filter((t) => t.category === 'Abdomen').length },
            { key: 'Obstetric', label: 'Obstetrics & Gynae', count: templates.filter((t) => t.category === 'Obstetric').length },
            { key: 'Urology', label: 'Urology & KUB', count: templates.filter((t) => t.category === 'Urology').length },
            { key: 'Small Parts', label: 'Small Parts / Thyroid / Scrotum', count: templates.filter((t) => t.category === 'Small Parts').length },
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
                  backgroundColor: isActive ? '#2563eb' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? '#1d4ed8' : '#e2e8f0',
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
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tpl.category}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                <strong>Key Organs:</strong> {tpl.tags}
              </div>

              {/* Impression Snippet */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#1e40af',
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
          title={activeModal === 'create' ? 'Add New Sonography Template' : `Edit Template: ${formTitle}`}
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
                placeholder="e.g. Scrotal Ultrasound Doppler (Normal)"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />

              <Select
                label="Organ Category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                options={[
                  { label: 'Abdomen & Pelvis', value: 'Abdomen' },
                  { label: 'Obstetrics & Gynae', value: 'Obstetric' },
                  { label: 'Urology & KUB', value: 'Urology' },
                  { label: 'Small Parts (Thyroid/Scrotum)', value: 'Small Parts' },
                  { label: 'Vascular Doppler', value: 'Doppler' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Key Organs Included (Tags)"
                placeholder="e.g. Liver, Gallbladder, Kidneys, Prostate"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
              />
              <Input
                label="Default Clinical Indication"
                placeholder="e.g. Lower abdominal pain / Routine evaluation"
                value={formIndication}
                onChange={(e) => setFormIndication(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px' }}>
                Standard Organ Findings (Narrative / Structured)
              </label>
              <textarea
                className="form-input"
                rows={7}
                value={formGeneralText}
                onChange={(e) => setFormGeneralText(e.target.value)}
                placeholder="Enter standard organ findings text..."
                style={{ fontSize: '13px', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af' }}>
                Clinical Impression (UPPERCASE)
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={formImpression}
                onChange={(e) => setFormImpression(e.target.value)}
                placeholder="Enter clinical impression boilerplate..."
                style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '13px' }}
              />
            </div>

            <Input
              label="Default Clinical Recommendations / Advice"
              placeholder="e.g. Clinical correlation and follow-up scan as advised"
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
          title={`Clinical Template Preview: ${selectedTemplate.title}`}
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
                  <strong>Organs:</strong> {selectedTemplate.tags}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Default History: <em>{selectedTemplate.indicationDefault}</em>
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '6px', textTransform: 'uppercase', color: '#334155' }}>
                Standard Findings Text:
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
                backgroundColor: '#eff6ff',
                padding: '12px 14px',
                borderRadius: '6px',
                borderLeft: '4px solid #2563eb',
              }}
            >
              <strong style={{ color: '#1e40af', display: 'block', marginBottom: '2px' }}>
                IMPRESSION:
              </strong>
              <div style={{ color: '#1e3a8a', fontWeight: 600 }}>{selectedTemplate.impression}</div>
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
        title="Delete Sonography Template"
        message={`Are you sure you want to permanently delete the template "${templateToDelete?.title}"?`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
