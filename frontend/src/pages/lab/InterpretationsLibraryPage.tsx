import React, { useState, useMemo } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Modal } from '../../components/atoms/Modal';
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  Table as TableIcon,
  HelpCircle,
  X,
} from 'lucide-react';

export interface LibraryItem {
  id: string;
  sNo: number;
  name: string;
  type: 'test' | 'panel';
  category?: string;
  rawText: string;
  htmlContent: string;
}

interface InterpretationsLibraryPageProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
  onSelectInterpretation?: (text: string, title: string) => void;
}

export const PANELS_LIBRARY_DATA: LibraryItem[] = [
  {
    id: 'p-1',
    sNo: 1,
    name: 'Complete Blood Count (CBC)',
    type: 'panel',
    category: 'Haematology',
    rawText: `Clinical Notes:
A complete blood count (CBC) is used to evaluate overall health and detect a wide range of disorders, including anemia, infection, and leukemia. There have been some reports of WBC and platelet counts being lower in venous blood than in capillary blood samples, although still within these reference ranges.

Possible causes of abnormal parameters:
• RBC, Hb, or HCT:
  - High: Dehydration, polycythemia, shock, chronic hypoxia
  - Low: Anemia, thalassemia, and other hemoglobinopathies
• MCV:
  - High: Macrocytic anemia, liver disease
  - Low: Microcytic anemia
• WBC:
  - High: Acute stress, infection, malignancies
  - Low: Sepsis, marrow hypoplasia
• Platelets:
  - High: Risk of thrombosis
  - Low: Risk of bleeding`,
    htmlContent: `<div>
      <p><strong>Clinical Notes:</strong><br />A complete blood count (CBC) is used to evaluate overall health and detect a wide range of disorders, including anemia, infection, and leukemia. There have been some reports of WBC and platelet counts being lower in venous blood than in capillary blood samples, although still within these reference ranges.</p>
      <p style="margin-top: 12px;"><strong>Possible causes of abnormal parameters:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th style="text-align: left; padding: 6px 10px;">Parameter</th>
            <th style="text-align: left; padding: 6px 10px; color: #b91c1c;">High</th>
            <th style="text-align: left; padding: 6px 10px; color: #1d4ed8;">Low</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>RBC, Hb, or HCT</strong></td>
            <td>Dehydration, polycythemia, shock, chronic hypoxia</td>
            <td>Anemia, thalassemia, and other hemoglobinopathies</td>
          </tr>
          <tr>
            <td><strong>MCV</strong></td>
            <td>Macrocytic anemia, liver disease</td>
            <td>Microcytic anemia</td>
          </tr>
          <tr>
            <td><strong>WBC</strong></td>
            <td>Acute stress, infection, malignancies</td>
            <td>Sepsis, marrow hypoplasia</td>
          </tr>
          <tr>
            <td><strong>Platelets</strong></td>
            <td>Risk of thrombosis</td>
            <td>Risk of bleeding</td>
          </tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 'p-2',
    sNo: 2,
    name: 'BT & CT',
    type: 'panel',
    category: 'Haematology',
    rawText: `The bleeding time test assesses primary hemostasis (vascular and platelet components) and is dependent on adequate functioning of platelets and blood vessels.

Causes of prolongation of bleeding time:
1. Thrombocytopenia
2. Disorders of platelet function
3. Von Willebrand disease
4. Disorders of blood vessels

Clotting time measures the time required for the blood to clot in a glass test tube kept at 37°C. Prolongation of clotting time only occurs in severe deficiency of a clotting factor and is normal in mild or moderate deficiency.
Note: Recommended test is Prothrombin Time (PT) and Activated Partial Thromboplastin time (APTT).`,
    htmlContent: `<div>
      <p>The <strong>bleeding time</strong> test assesses primary hemostasis (vascular and platelet components) and is dependent on adequate functioning of platelets and blood vessels.</p>
      <p style="margin-top: 8px;"><strong>Causes of prolongation of bleeding time:</strong><br />
      1. Thrombocytopenia<br />
      2. Disorders of platelet function<br />
      3. Von Willebrand disease<br />
      4. Disorders of blood vessels</p>
      <p style="margin-top: 10px;"><strong>Clotting time</strong> measures the time required for the blood to clot in a glass test tube kept at 37°C. Prolongation of clotting time only occurs in severe deficiency of a clotting factor and is normal in mild or moderate deficiency.</p>
      <p style="margin-top: 8px; color: #475569; font-style: italic;">Note: Recommended test is Prothrombin Time (PT) and Activated Partial Thromboplastin time (APTT).</p>
    </div>`,
  },
  {
    id: 'p-3',
    sNo: 3,
    name: 'Blood Sugar Fasting & PP',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Clinical Notes:
Elevated glucose levels (hyperglycemia) are most often encountered clinically in the setting of diabetes mellitus, but they may also occur with pancreatic neoplasms, hyperthyroidism, and adrenocortical dysfunction. Decreased glucose levels (hypoglycemia) may result from endogenous or exogenous insulin excess, prolonged starvation, or liver disease.

Diagnostic Criteria:
• Normal: Fasting < 100 mg/dL | 2 hrs PP < 140 mg/dL
• Pre Diabetes: Fasting 100 to 125 mg/dL | 2 hrs PP 140 to 199 mg/dL
• Diabetes: Fasting > 126 mg/dL | 2 hrs PP > 200 mg/dL

A fasting glucose of 126 mg/dL or above, confirmed by repeating on another day, means diabetes.
IGT (2 hrs Post meal) means increased risk of developing type 2 diabetes.
A 2-hour glucose level of 200 mg/dL or above confirms diabetes.`,
    htmlContent: `<div>
      <p><strong>Clinical Notes:</strong><br />Elevated glucose levels (hyperglycemia) are most often encountered clinically in the setting of diabetes mellitus, but they may also occur with pancreatic neoplasms, hyperthyroidism, and adrenocortical dysfunction. Decreased glucose levels (hypoglycemia) may result from endogenous or exogenous insulin excess, prolonged starvation, or liver disease.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th>Fasting Glucose (mg/dL)</th>
            <th>2 hours PP Glucose (mg/dL)</th>
            <th>Diagnosis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>&lt; 100</td>
            <td>&lt; 140</td>
            <td><strong style="color: #16a34a;">Normal</strong></td>
          </tr>
          <tr>
            <td>100 to 125</td>
            <td>140 to 199</td>
            <td><strong style="color: #ea580c;">Pre Diabetes</strong></td>
          </tr>
          <tr>
            <td>&ge; 126</td>
            <td>&ge; 200</td>
            <td><strong style="color: #dc2626;">Diabetes</strong></td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 10px; font-size: 12px; color: #475569;">
        • A fasting level of &ge;126 mg/dL, confirmed by repeating on another day, indicates diabetes.<br />
        • IGT (2 hrs Post meal) indicates increased risk of developing type 2 diabetes.<br />
        • A 2-hour glucose &ge;200 mg/dL confirmed by repeat test indicates diabetes.
      </p>
    </div>`,
  },
  {
    id: 'p-4',
    sNo: 4,
    name: 'Liver Function Test (LFT)',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `LFT Interpretation:
Liver Function Blood Test gives insight into liver health and helps identify conditions like hepatitis, cirrhosis, and fatty liver disease.

Test Significance:
Besides diagnosing liver problems, LFTs monitor overall liver functioning during pharmacotherapy.
Increased in: Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice, congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders, hepatotoxic drugs.`,
    htmlContent: `<div>
      <p><strong>LFT Interpretation:</strong><br />Liver Function Blood Test gives insight into liver health and helps identify conditions like hepatitis, cirrhosis, and fatty liver disease, which may cause similar symptoms but require different treatments to recover.</p>
      <p style="margin-top: 8px;"><strong>Test Significance:</strong><br />Besides diagnosing liver problems, LFTs monitor overall liver functioning. Monitoring helps patients with liver disease or those taking hepatotoxic medication. It screens whether treatment works or requires dose adjustments.</p>
      <p style="margin-top: 8px;"><strong>Increased in:</strong> Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders, hepatotoxic medications.</p>
    </div>`,
  },
  {
    id: 'p-5',
    sNo: 5,
    name: 'Bilirubin Total, Direct & Indirect',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Physiological basis:
Bilirubin is the orange-yellow pigment derived from the breakdown of hemoglobin (heme). The majority comes from senescent red cells. It is biotransformed in the liver and excreted in bile and urine.
The conjugated form is water soluble and reacts directly with diazo dyes (direct bilirubin). The unconjugated form is fat-soluble and reacts only in the presence of an accelerator (indirect bilirubin).

Increased in: Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice, congenital liver enzyme abnormalities, hemolysis.
Comments: Only conjugated bilirubin appears in urine and indicates liver disease or biliary obstruction. Hemolysis is associated with increased unconjugated bilirubin.`,
    htmlContent: `<div>
      <p><strong>Physiological basis:</strong><br />Bilirubin is the orange-yellow pigment derived from the breakdown of hemoglobin (heme). The majority of bilirubin comes from senescent red cells. It is biotransformed in the liver and excreted in bile and urine.<br />
      The conjugated form is water soluble (direct bilirubin), whereas the unconjugated form is fat-soluble (indirect bilirubin).</p>
      <p style="margin-top: 8px;"><strong>Increased in:</strong> Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal hyperbilirubinemia, congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert syndromes), hemolytic disorders.</p>
      <p style="margin-top: 8px;"><strong>Comments:</strong> Assay of total bilirubin includes conjugated and unconjugated fractions. Only conjugated bilirubin appears in urine, indicating hepatobiliary obstruction. Hemolysis is typically associated with isolated indirect hyperbilirubinemia.</p>
    </div>`,
  },
  {
    id: 'p-6',
    sNo: 6,
    name: 'Kidney Function Test (KFT)',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Creatinine is a nitrogenous waste product formed in muscle from creatine phosphate. Endogenous production is proportional to muscle mass and body weight.

Causes of Increased Serum Creatinine:
1. Pre-renal, renal, and post-renal azotemia
2. High dietary meat intake
3. Active acromegaly and gigantism

Causes of Decreased Serum Creatinine:
1. Pregnancy
2. Increasing age (reduction in muscle mass)

GFR is measured to detect incipient kidney disease, monitor progression, plan renal replacement therapy, and adjust nephrotoxic drug dosages.
BUN/creatinine ratio discriminates pre-renal and post-renal azotemia from intrinsic renal disease.`,
    htmlContent: `<div>
      <p><strong>Creatinine</strong> is a nitrogenous waste product formed in muscle from creatine phosphate. Endogenous production is proportional to muscle mass and body weight.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th style="width: 50%;">Causes of Increased Serum Creatinine</th>
            <th style="width: 50%;">Causes of Decreased Serum Creatinine</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Pre-renal, renal, and post-renal azotemia<br />2. Large dietary meat intake<br />3. Active acromegaly</td>
            <td>1. Pregnancy<br />2. Decreased muscle mass (aging, cachexia)</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 10px;"><strong>eGFR</strong> is evaluated to stage chronic kidney disease (CKD Stages 1-5) and guide medication dosing.</p>
    </div>`,
  },
  {
    id: 'p-7',
    sNo: 7,
    name: 'KFT without eGFR',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Creatinine and BUN physiological evaluation.
BUN/Serum Creatinine Ratio:
Normal ratio is 12:1 to 20:1.
Increased ratio (> 20:1):
1. Pre-renal azotemia, dehydration, congestive heart failure.
2. High protein diet, upper GI hemorrhage.
3. Post-renal obstruction.
Decreased ratio (< 10:1):
1. Acute tubular necrosis.
2. Low protein diet, starvation.
3. Severe liver disease.`,
    htmlContent: `<div>
      <p><strong>BUN / Serum Creatinine Ratio:</strong><br />Discriminates pre-renal and post-renal azotemia from intrinsic renal parenchymal disease. Normal ratio is 12:1 to 20:1.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th>Causes of Increased Ratio (&gt;20:1)</th>
            <th>Causes of Decreased Ratio (&lt;10:1)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pre-renal azotemia, dehydration, high protein diet, gastrointestinal hemorrhage, urinary tract obstruction.</td>
            <td>Acute tubular necrosis, low protein diet, malnutrition, severe hepatic disease.</td>
          </tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 'p-8',
    sNo: 8,
    name: 'Lipid Profile',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Lipid Profile Interpretation:
Lipid abnormalities increase the risk of coronary artery disease (CAD). The typical atherogenic triad in type 2 diabetes includes elevated triglycerides, low HDL cholesterol, and elevated small dense LDL particles.

Treatment Goals (Lipid Association of India 2020):
• Extreme Risk: LDL-C < 50 mg/dL (optional <= 30) | Non-HDL < 80 mg/dL
• Very High Risk: LDL-C < 50 mg/dL | Non-HDL < 80 mg/dL
• High Risk: LDL-C < 70 mg/dL | Non-HDL < 100 mg/dL
• Moderate Risk: LDL-C < 100 mg/dL | Non-HDL < 130 mg/dL
• Low Risk: LDL-C < 100 mg/dL | Non-HDL < 130 mg/dL`,
    htmlContent: `<div>
      <p>Abnormalities of lipids are associated with increased risk of coronary artery disease (CAD). Intensive treatment of dyslipidemia significantly reduces cardiovascular events.</p>
      <p style="margin-top: 8px;"><strong>Treatment goals according to Lipid Association of India guidelines:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;" border="1" cellpadding="6">
        <thead style="background-color: #f8fafc;">
          <tr>
            <th>Risk Category</th>
            <th>LDL-C Goal (mg/dL)</th>
            <th>Non-HDL Goal (mg/dL)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Extreme Risk</td><td>&lt; 50 (optional &le; 30)</td><td>&lt; 80</td></tr>
          <tr><td>Very High Risk</td><td>&lt; 50</td><td>&lt; 80</td></tr>
          <tr><td>High Risk</td><td>&lt; 70</td><td>&lt; 100</td></tr>
          <tr><td>Moderate Risk</td><td>&lt; 100</td><td>&lt; 130</td></tr>
          <tr><td>Low Risk</td><td>&lt; 100</td><td>&lt; 130</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 'p-9',
    sNo: 9,
    name: 'Iron Studies',
    type: 'panel',
    category: 'Biochemistry',
    rawText: `Iron Studies Interpretation:
Plasma iron concentration reflects balance between intestinal absorption, tissue storage (bone marrow, spleen, liver), breakdown of senescent RBCs, and erythropoiesis.
• Serum Iron:
  - Increased: Multiple transfusions, hemochromatosis, acute iron poisoning, hemolytic anemia, lead poisoning.
  - Decreased: Iron deficiency anemia, chronic blood loss, active infection/inflammation, nephrotic syndrome.
• TIBC:
  - Increased in iron deficiency anemia, late pregnancy.
  - Decreased in hypoproteinemia, chronic liver disease, hemochromatosis.
• Transferrin Saturation:
  - < 16% strongly indicates iron deficiency.
  - > 50% indicates iron overload or hemochromatosis.`,
    htmlContent: `<div>
      <p><strong>Physiological basis:</strong> Plasma iron concentration is governed by intestinal absorption, bone marrow turnover, and reticuloendothelial storage.</p>
      <p style="margin-top: 8px;"><strong>Key Patterns:</strong><br />
      • <strong>Iron Deficiency:</strong> Low serum iron, elevated TIBC, transferrin saturation &lt; 16%, low serum ferritin.<br />
      • <strong>Anemia of Chronic Disease:</strong> Low serum iron, normal/low TIBC, normal or elevated ferritin.<br />
      • <strong>Hemochromatosis:</strong> High serum iron, decreased TIBC, transferrin saturation &gt; 50%, elevated ferritin.</p>
    </div>`,
  },
  {
    id: 'p-10',
    sNo: 10,
    name: 'Viral Marker',
    type: 'panel',
    category: 'Serology',
    rawText: `Viral Marker Screen Interpretation:
• HBsAg: First serologic marker appearing 6-16 weeks after hepatitis B infection. Persistence > 6 months indicates chronic HBV carrier state or chronic hepatitis.
• Anti-HCV: Reactive result indicates HCV exposure. Active viral replication must be confirmed by HCV RNA quantitative PCR.
• HIV 1 & 2: Non-reactive result indicates no antibodies detected. Reactive tests must be confirmed with Western Blot or HIV-1/2 proviral DNA/RNA PCR.
• VDRL: Non-treponemal antibody screening for syphilis. Reactive results require clinical correlation and confirmation with TPHA/FTA-ABS.`,
    htmlContent: `<div>
      <p><strong>HBsAg:</strong> Earliest marker for Hepatitis B virus. Detection indicates active acute or chronic infection. Persistence beyond 6 months signifies chronic carrier status.</p>
      <p style="margin-top: 8px;"><strong>Anti HCV:</strong> Reactive antibody indicates exposure to Hepatitis C. Quantitative HCV RNA PCR is advised to establish active replication.</p>
      <p style="margin-top: 8px;"><strong>HIV 1 & 2:</strong> Screening test. All reactive samples require confirmatory Western Blot or PCR assay.</p>
      <p style="margin-top: 8px;"><strong>VDRL:</strong> Screening test for syphilis; reactive titers require treponemal confirmation (TPHA).</p>
    </div>`,
  },
  {
    id: 'p-11',
    sNo: 11,
    name: 'Thyroid Function Test (TFT)',
    type: 'panel',
    category: 'Endocrinology',
    rawText: `Thyroid Function Test (TFT) Interpretation:
TSH is an anterior pituitary hormone that regulates thyroid synthesis. Negative feedback exists between free circulating thyroid hormones and TSH.

Diagnostic Patterns:
• Conventional Hyperthyroidism: T4 Raised | T3 Raised | TSH Undetectable (<0.01)
• T3 Hyperthyroidism: T4 Normal | T3 Raised | TSH Undetectable
• Subclinical Hyperthyroidism: T4 Normal | T3 Normal | TSH Suppressed
• Primary Hypothyroidism: T4 Low | T3 Normal/Low | TSH Raised (> 5.5)
• Subclinical Hypothyroidism: T4 Normal | T3 Normal | TSH Raised
• Secondary Hypothyroidism (Pituitary): T4 Low | T3 Normal/Low | TSH Low/Normal`,
    htmlContent: `<div>
      <p><strong>Physiologic Basis:</strong> TSH stimulates thyroid synthesis; circulating hormones exert negative feedback on pituitary TSH secretion.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th>Condition</th>
            <th>Total T4</th>
            <th>Total T3</th>
            <th>TSH</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Primary Hyperthyroidism</td><td>Raised</td><td>Raised</td><td>Undetectable</td></tr>
          <tr><td>Subclinical Hyperthyroidism</td><td>Normal</td><td>Normal</td><td>Low / Undetectable</td></tr>
          <tr><td>Primary Hypothyroidism</td><td>Low</td><td>Low / Normal</td><td>Raised</td></tr>
          <tr><td>Subclinical Hypothyroidism</td><td>Normal</td><td>Normal</td><td>Raised</td></tr>
          <tr><td>Secondary Hypothyroidism</td><td>Low</td><td>Low</td><td>Low / Inappropriately normal</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 'p-12',
    sNo: 12,
    name: 'Free Thyroid Function Test (FTFT)',
    type: 'panel',
    category: 'Endocrinology',
    rawText: `Free Thyroid Hormones (FT3 & FT4) represent the unbound, biologically active fractions unaffected by variations in serum binding proteins (TBG).
Elevated Free T3 & Free T4 with suppressed TSH indicates hyperthyroidism.
Decreased Free T4 with elevated TSH indicates primary hypothyroidism.
Elevated TSH with normal Free T4 indicates subclinical hypothyroidism.`,
    htmlContent: `<div>
      <p><strong>Free T4 & Free T3</strong> directly quantify the unbound hormones available to target tissues, independent of protein-binding fluctuations (pregnancy, oral contraceptives, liver illness).</p>
      <p style="margin-top: 8px;"><strong>Clinical Correlation:</strong><br />
      • <strong>Hyperthyroidism:</strong> Elevated FT3/FT4 with suppressed TSH (&lt; 0.05 &mu;IU/mL).<br />
      • <strong>Primary Hypothyroidism:</strong> Low FT4 with elevated TSH (&gt; 5.0 &mu;IU/mL).<br />
      • <strong>Subclinical Hypothyroidism:</strong> Normal FT4 with elevated TSH.</p>
    </div>`,
  },
  {
    id: 'p-13',
    sNo: 13,
    name: 'CMV Antibody',
    type: 'panel',
    category: 'Serology',
    rawText: `Cytomegalovirus (CMV) IgG & IgM Antibodies:
CMV is an opportunistic herpesvirus. By adulthood, 40-90% of the population carries CMV antibodies.
• CMV IgM: Presence suggests primary or recent infection. Can also occur with reactivation.
• CMV IgG: Indicates past exposure and immune status. Fourfold rise between acute and convalescent sera confirms recent active infection.
Universal relevance: Pre-transplant donor/recipient matching and congenital infection workup in pregnancy.`,
    htmlContent: `<div>
      <p><strong>Physiological Basis:</strong> Detects IgG and IgM antibodies to cytomegalovirus.</p>
      <p style="margin-top: 8px;"><strong>Interpretation:</strong><br />
      • <strong>Positive CMV IgM:</strong> Suggestive of recent or active primary infection, reactivation, or reinfection.<br />
      • <strong>Positive CMV IgG:</strong> Indicates past exposure and immune memory. Seronegative blood components are recommended for immunocompromised recipients.</p>
    </div>`,
  },
];

export const TESTS_LIBRARY_DATA: LibraryItem[] = [
  {
    id: 't-1',
    sNo: 1,
    name: 'Hemoglobin',
    type: 'test',
    category: 'Haematology',
    rawText: `Hemoglobin is the major protein of erythrocytes that transports oxygen from the lungs to peripheral tissues. It is measured spectrophotometrically after lysis and conversion to cyanmethemoglobin.

Increased in:
1. Hemoconcentration (dehydration, burns, severe vomiting)
2. Polycythemia vera and secondary erythrocytosis (chronic hypoxia, COPD, high altitude)
3. Heavy smoking, extreme physical exercise

Decreased in:
1. Microcytic anemia (iron deficiency, thalassemia minor/major)
2. Normocytic anemia (anemia of chronic disease, acute hemorrhage, hemolysis, marrow infiltration)
3. Macrocytic anemia (vitamin B12 or folate deficiency, liver disease, hypothyroidism)
4. Hemodilution (pregnancy, fluid overload)

Comments:
The cyanmethemoglobin technique measures all hemoglobin derivatives except sulfhemoglobin. Hypertriglyceridemia and extreme leukocytosis can cause false elevations.`,
    htmlContent: `<div>
      <p>Hemoglobin is the major protein of erythrocytes that transports oxygen from the lungs to peripheral tissues. Measured by spectrophotometry on automated hematology analyzers after lysis of red cells.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th style="width: 50%; color: #b91c1c;">Increased in:</th>
            <th style="width: 50%; color: #1d4ed8;">Decreased in:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              1. Hemoconcentration (dehydration, burns, vomiting)<br />
              2. Polycythemia (primary or secondary)<br />
              3. Chronic hypoxia (COPD, cyanotic heart disease)
            </td>
            <td>
              1. Iron deficiency anemia, thalassemia<br />
              2. Anemia of chronic disease, acute blood loss<br />
              3. Vitamin B12 / Folate deficiency<br />
              4. Pregnancy (physiologic hemodilution)
            </td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 10px; font-size: 12px; color: #475569;">
        <strong>Comments:</strong> Hypertriglyceridemia or profound leukocytosis (>50,000/&mu;L) can cause falsely elevated photometric absorbance.
      </p>
    </div>`,
  },
  {
    id: 't-2',
    sNo: 2,
    name: 'Total Leukocyte Count',
    type: 'test',
    category: 'Haematology',
    rawText: `Physiological basis:
The WBC count determines the total number of circulating white blood cells.

Increased in: Acute bacterial infections, inflammatory disorders, acute and chronic leukemias, tissue necrosis, severe burns, corticosteroids, physical stress.
Decreased in: Viral infections, bone marrow hypoplasia, chemotherapy/radiation, sepsis, systemic lupus erythematosus (SLE), megaloblastic anemia.`,
    htmlContent: `<div>
      <p><strong>Physiological basis:</strong> The WBC count and differential evaluate the immune response and cellular blood production.</p>
      <p style="margin-top: 8px;"><strong>Leukocytosis (Increased in):</strong> Acute bacterial infections, inflammatory tissue necrosis, acute and chronic leukemias, myeloproliferative disorders, corticosteroids, pregnancy, strenuous exercise.</p>
      <p style="margin-top: 8px;"><strong>Leukopenia (Decreased in):</strong> Viral infections, sepsis, aplastic anemia, cytotoxic chemotherapy, autoimmune cytopenias, splenomegaly, vitamin B12/folate deficiency.</p>
    </div>`,
  },
  {
    id: 't-3',
    sNo: 3,
    name: 'Differential Leucocyte Count',
    type: 'test',
    category: 'Haematology',
    rawText: `Differential Leucocyte Count (DLC) breakdown:
• Neutrophils: Increased in bacterial infection, acute inflammation, tissue infarction. Decreased in viral infections, marrow suppression, severe sepsis.
• Lymphocytes: Increased in viral infections (infectious mononucleosis, CMV, hepatitis), CLL. Decreased in HIV/AIDS, steroid therapy, severe stress.
• Eosinophils: Increased in allergic diseases, asthma, parasitic infections, drug reactions.
• Monocytes: Increased in tuberculosis, subacute bacterial endocarditis, recovery phase of acute infections.
• Basophils: Increased in CML, allergic reactions.`,
    htmlContent: `<div>
      <p>Differential count breaks down neutrophils, lymphocytes, monocytes, eosinophils, and basophils.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th>Cell Type</th>
            <th>Increased In</th>
            <th>Decreased In</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Neutrophils</td><td>Bacterial infection, stress, steroids</td><td>Chemotherapy, sepsis, B12 deficiency</td></tr>
          <tr><td>Lymphocytes</td><td>Viral illness, CLL, pertussis</td><td>HIV infection, severe malnutrition, steroids</td></tr>
          <tr><td>Eosinophils</td><td>Allergy, asthma, parasitic worm infection</td><td>Stress, acute bacterial infection</td></tr>
          <tr><td>Monocytes</td><td>Tuberculosis, chronic inflammation</td><td>Hairy cell leukemia, severe endotoxemia</td></tr>
          <tr><td>Basophils</td><td>Myeloproliferative disorders, CML</td><td>Acute phase reactions</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 't-4',
    sNo: 4,
    name: 'Erythrocyte sedimentation rate (Westergren)',
    type: 'test',
    category: 'Haematology',
    rawText: `ESR measures the distance red blood cells fall in anticoagulated whole blood in 1 hour.
Raised ESR (> 20-30 mm/hr):
1. Connective tissue disorders (rheumatoid arthritis, SLE, temporal arteritis)
2. Chronic infections (tuberculosis, osteomyelitis)
3. Multiple myeloma and paraproteinemias
4. Malignancy (lymphoma, renal, colon)
5. Pregnancy and anemia

Very high ESR (> 100 mm/hr):
Strongly indicative of multiple myeloma, giant cell arteritis, polymyalgia rheumatica, tuberculosis, or visceral metastases.

Low ESR: Polycythemia, sickle cell disease, spherocytosis, congestive heart failure.`,
    htmlContent: `<div>
      <p><strong>ESR (Westergren)</strong> reflects acute phase reactants (fibrinogen, immunoglobulins) causing rouleaux formation.</p>
      <p style="margin-top: 8px;"><strong>Raised ESR:</strong> Connective tissue disorders (RA, SLE, temporal arteritis), chronic infections (tuberculosis), multiple myeloma, malignancy, pregnancy.</p>
      <p style="margin-top: 8px;"><strong>Markedly High ESR (&gt;100 mm/hr):</strong> Multiple myeloma, polymyalgia rheumatica, giant cell arteritis, occult abscesses.</p>
      <p style="margin-top: 8px;"><strong>Low ESR:</strong> Polycythemia vera, sickle cell anemia, hypofibrinogenemia, congestive cardiac failure.</p>
    </div>`,
  },
  {
    id: 't-5',
    sNo: 5,
    name: 'Erythrocyte Sedimentation Rate (Wintrobe)',
    type: 'test',
    category: 'Haematology',
    rawText: `Wintrobe ESR utilizes a 100 mm tube without dilution.
Higher sensitivity for mild elevations but subject to tube length limitations compared to the ICSH gold-standard Westergren method.
Clinical interpretation mirrors Westergren method.`,
    htmlContent: `<div>
      <p>The Wintrobe method uses undiluted EDTA whole blood in a shorter 100 mm tube. The Westergren method remains the international standard reference.</p>
    </div>`,
  },
  {
    id: 't-6',
    sNo: 6,
    name: 'Platelet Count',
    type: 'test',
    category: 'Haematology',
    rawText: `Platelets are essential for primary hemostasis and clot retraction.
Thrombocytosis (> 450,000/mcL):
• Primary: Essential thrombocythemia, polycythemia vera.
• Reactive (Secondary): Iron deficiency anemia, acute/chronic infection, post-splenectomy, malignancy.

Thrombocytopenia (< 150,000/mcL):
• Decreased production: Bone marrow suppression, aplastic anemia, leukemia, chemotherapy, alcohol.
• Increased destruction: Immune thrombocytopenic purpura (ITP), drug-induced, DIC, TTP, viral infections (Dengue, HIV).
• Sequestration: Hypersplenism.
Spontaneous bleeding risk rises steeply below 20,000/mcL.`,
    htmlContent: `<div>
      <p><strong>Platelets</strong> initiate primary plug formation at sites of endothelial injury.</p>
      <p style="margin-top: 8px;"><strong>Thrombocytosis:</strong> Reactive (iron deficiency, infection, post-splenectomy, chronic inflammation) or Clonal (essential thrombocythemia, myeloproliferative neoplasms).</p>
      <p style="margin-top: 8px;"><strong>Thrombocytopenia:</strong> Immune destruction (ITP, Dengue), splenic sequestration, consumption (DIC, TTP), or bone marrow failure.</p>
    </div>`,
  },
  {
    id: 't-7',
    sNo: 7,
    name: 'Absolute Eosinophil Count',
    type: 'test',
    category: 'Haematology',
    rawText: `Absolute Eosinophil Count (AEC) normal reference: 40 - 450 /mcL.
Increased in: Allergic diseases (asthma, allergic rhinitis), parasitic infections, drug reactions, eosinophilic granulomatosis, Addison's disease.
Decreased in: Glucocorticoid administration, Cushing syndrome, acute bacterial infections.`,
    htmlContent: `<div>
      <p>AEC measures circulating eosinophils directly. Elevated levels correlate strongly with allergic diathesis and parasitic helminthic infections.</p>
    </div>`,
  },
  {
    id: 't-8',
    sNo: 8,
    name: 'Blood Group & Rh.',
    type: 'test',
    category: 'Haematology',
    rawText: `ABO and Rh (D) blood typing determines red blood cell surface antigens and corresponding reciprocal plasma isoagglutinins.
• Universal RBC Donor: O Negative
• Universal RBC Recipient: AB Positive
• Universal Plasma Donor: AB Positive
• Universal Plasma Recipient: O Negative
Crucial for pre-transfusion cross-matching and Rh incompatibility screening in obstetric care.`,
    htmlContent: `<div>
      <p>Determines ABO antigens and Rh(D) status via forward and reverse grouping.</p>
      <p style="margin-top: 6px;">Universal red cell donor is O Rh-negative; universal plasma donor is AB.</p>
    </div>`,
  },
  {
    id: 't-18',
    sNo: 18,
    name: 'Serum Creatinine',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Serum Creatinine reflects muscle mass and glomerular filtration rate (GFR).
Elevated in: Acute kidney injury (AKI), chronic kidney disease (CKD), urinary tract obstruction, severe dehydration, rhabdomyolysis, shock.
Decreased in: Advanced age, muscle wasting diseases, malnutrition, pregnancy (due to hyperfiltration).`,
    htmlContent: `<div>
      <p>Creatinine is cleared almost entirely by glomerular filtration. Serum levels double with roughly each 50% loss of functional nephron mass.</p>
      <p style="margin-top: 8px;"><strong>Elevations:</strong> Renal failure, hypovolemia, urinary tract obstruction, nephrotoxic agents (NSAIDs, aminoglycosides, contrast dye).</p>
    </div>`,
  },
  {
    id: 't-19',
    sNo: 19,
    name: 'Serum Urea',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Urea is the major end-product of protein metabolism synthesized in the liver and excreted by the kidneys.
Increased in:
• Pre-renal: Dehydration, congestive heart failure, GI bleeding, high protein intake.
• Renal: Acute and chronic renal parenchymal disease.
• Post-renal: Bladder outflow obstruction, ureteral calculi.
Decreased in: Severe liver disease, low protein diet, pregnancy.`,
    htmlContent: `<div>
      <p>Serum Urea reflects balance between protein catabolism and renal excretion.</p>
      <p style="margin-top: 6px;">Pre-renal causes (dehydration, upper GI bleed) elevate urea disproportionately to creatinine.</p>
    </div>`,
  },
  {
    id: 't-20',
    sNo: 20,
    name: 'Fasting Blood Sugar',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Fasting Blood Sugar (FBS) reference ranges:
• Normal: 70 - 99 mg/dL
• Impaired Fasting Glucose (Pre-diabetes): 100 - 125 mg/dL
• Diabetes Mellitus: >= 126 mg/dL (on 2 separate occasions)
Requires at least 8 to 12 hours of overnight fasting.`,
    htmlContent: `<div>
      <p>Primary screening test for diabetes and metabolic dysregulation.</p>
      <p style="margin-top: 6px;">Values &ge; 126 mg/dL after 8+ hour fast on two distinct occasions establish diabetes mellitus diagnosis.</p>
    </div>`,
  },
  {
    id: 't-21',
    sNo: 21,
    name: 'Blood Sugar PP',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Postprandial Blood Sugar (PPBS) measured 2 hours following a meal.
• Normal: < 140 mg/dL
• Impaired Glucose Tolerance (Pre-diabetes): 140 - 199 mg/dL
• Diabetes: >= 200 mg/dL`,
    htmlContent: `<div>
      <p>Assesses glycemic handling following meal ingestion. A 2-hour value &ge;200 mg/dL signifies diabetes.</p>
    </div>`,
  },
  {
    id: 't-22',
    sNo: 22,
    name: 'Serum Bilirubin (Total)',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Total Bilirubin reflects combined conjugated and unconjugated bile pigment concentrations.
Clinical jaundice becomes apparent when total bilirubin exceeds 2.5 - 3.0 mg/dL.
Increased in: Hemolytic anemias, acute hepatitis, biliary cirrhosis, choledocholithiasis, Gilbert syndrome.`,
    htmlContent: `<div>
      <p>Clinical jaundice develops when serum levels exceed 2.5 to 3.0 mg/dL. Differentiates pre-hepatic, intra-hepatic, and post-hepatic jaundice when partitioned with direct fraction.</p>
    </div>`,
  },
  {
    id: 't-26',
    sNo: 26,
    name: 'SGPT (ALT)',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Alanine Aminotransferase (ALT/SGPT) is a hepatocellular enzyme specific to the liver.
Marked Elevation (> 1000 U/L): Acute viral hepatitis (A, B, E), ischemic hepatitis (shock liver), acute toxic or acetaminophen necrosis.
Moderate Elevation (100 - 500 U/L): Chronic viral hepatitis, non-alcoholic fatty liver disease (NAFLD/NASH), acute biliary obstruction.
Mild Elevation: Alcohol-related liver injury, statin use, obesity.`,
    htmlContent: `<div>
      <p>ALT is the most specific biomarker for hepatocellular injury.</p>
      <p style="margin-top: 6px;">Levels exceeding 1,000 U/L indicate acute viral hepatitis, ischemic necrosis, or drug/toxin induced hepatic injury.</p>
    </div>`,
  },
  {
    id: 't-27',
    sNo: 27,
    name: 'SGOT (AST)',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Aspartate Aminotransferase (AST/SGOT) is present in liver, heart, skeletal muscle, kidney, and brain.
AST > ALT ratio > 2:1 is characteristic of alcoholic liver disease.
Also elevated in acute myocardial infarction, rhabdomyolysis, and strenuous exercise.`,
    htmlContent: `<div>
      <p>Present in hepatocytes and muscle tissue. An AST/ALT ratio &gt; 2 strongly suggests alcoholic hepatitis.</p>
    </div>`,
  },
  {
    id: 't-31',
    sNo: 31,
    name: 'Total Cholesterol',
    type: 'test',
    category: 'Lipids',
    rawText: `Total Cholesterol is an essential component of cell membranes and steroid hormones.
• Desirable: < 200 mg/dL
• Borderline High: 200 - 239 mg/dL
• High: >= 240 mg/dL`,
    htmlContent: `<div>
      <p>Core indicator for atherosclerotic cardiovascular disease (ASCVD) risk estimation.</p>
    </div>`,
  },
  {
    id: 't-43',
    sNo: 43,
    name: 'HbA1c (Glycosylated Hemoglobin)',
    type: 'test',
    category: 'Biochemistry',
    rawText: `HbA1c reflects mean glycemic control over the preceding 2 to 3 months (erythrocyte lifespan).
• Normal: < 5.7%
• Pre-diabetes: 5.7% - 6.4%
• Diabetes: >= 6.5%
• Therapeutic Target for non-pregnant adults with diabetes: < 7.0%
Note: Conditions with altered red cell turnover (hemolytic anemia, chronic blood loss, pregnancy, hemoglobinopathies) may affect HbA1c reliability.`,
    htmlContent: `<div>
      <p>Reflects chronic glycemic exposure over preceding 8-12 weeks.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;" border="1" cellpadding="6">
        <thead style="background-color: #f1f5f9;">
          <tr><th>HbA1c %</th><th>Category</th><th>Estimated Avg Glucose (eAG)</th></tr>
        </thead>
        <tbody>
          <tr><td>&lt; 5.7%</td><td>Normal</td><td>&lt; 117 mg/dL</td></tr>
          <tr><td>5.7% - 6.4%</td><td>Pre-diabetes</td><td>117 - 137 mg/dL</td></tr>
          <tr><td>&ge; 6.5%</td><td>Diabetes</td><td>&ge; 140 mg/dL</td></tr>
        </tbody>
      </table>
    </div>`,
  },
  {
    id: 't-48',
    sNo: 48,
    name: '25 Hydroxy (OH) Vitamin D',
    type: 'test',
    category: 'Endocrinology',
    rawText: `25-Hydroxy Vitamin D is the primary circulating form and best indicator of total body vitamin D stores.
• Deficiency: < 20 ng/mL
• Insufficiency: 20 - 29 ng/mL
• Sufficiency: 30 - 100 ng/mL
• Toxicity: > 100 ng/mL
Deficiency is associated with rickets, osteomalacia, increased fracture risk, muscle weakness, and altered immune function.`,
    htmlContent: `<div>
      <p>Primary biomarker for vitamin D nutritional status and calcium-phosphate homeostasis.</p>
      <p style="margin-top: 6px;">Levels &lt; 20 ng/mL define deficiency requiring therapeutic supplementation.</p>
    </div>`,
  },
  {
    id: 't-49',
    sNo: 49,
    name: 'Vitamin B12',
    type: 'test',
    category: 'Biochemistry',
    rawText: `Vitamin B12 (Cobalamin) is crucial for erythropoiesis and neurological function.
• Normal: 200 - 900 pg/mL
• Borderline: 150 - 200 pg/mL
• Deficient: < 150 pg/mL
Deficiency causes megaloblastic macrocytic anemia, subacute combined degeneration of the spinal cord, and peripheral neuropathy.`,
    htmlContent: `<div>
      <p>Crucial cofactor for DNA synthesis and myelin integrity. Deficiency produces megaloblastic anemia and irreversible sensory/motor neuropathy.</p>
    </div>`,
  },
  {
    id: 't-70',
    sNo: 70,
    name: 'Widal Test (Slide Method)',
    type: 'test',
    category: 'Microbiology',
    rawText: `Widal test detects agglutinating antibodies against Salmonella enterica serotypes Typhi (TO, TH) and Paratyphi (AH, BH).
Titer of 1:80 or 1:160 of TO and TH antigens is considered clinically significant in endemic areas.
Paired sera demonstrating fourfold rising titers 7-10 days apart confirms diagnosis of enteric fever.`,
    htmlContent: `<div>
      <p>Agglutination serology for enteric typhoid fever. A fourfold increase in paired acute/convalescent titers provides definitive confirmation.</p>
    </div>`,
  },
  {
    id: 't-103',
    sNo: 103,
    name: 'Urine Routine Examination',
    type: 'test',
    category: 'Clinical Pathology',
    rawText: `Routine and Microscopic Urinalysis:
• Protein: Normally absent or trace. Persistent proteinuria signifies glomerular or tubular pathology.
• Glucose: Presence indicates hyperglycemia exceeding renal threshold (~180 mg/dL) or renal glycosuria.
• Ketones: Present in diabetic ketoacidosis, prolonged starvation, pregnancy vomiting.
• Pus Cells (Leukocytes): > 5 /HPF suggests urinary tract infection (pyuria).
• RBCs: > 2-3 /HPF indicates hematuria (calculi, glomerulonephritis, malignancy).
• Casts: Hyaline (normal/exercise), Granular/Cellular (intrinsic renal disease).`,
    htmlContent: `<div>
      <p>Comprehensive physical, chemical, and microscopic screen for nephrological, urological, and systemic disorders.</p>
      <p style="margin-top: 6px;">Evaluates proteinuria, hematuria, leukocyturia, casts, and crystalluria.</p>
    </div>`,
  },
  {
    id: 't-107',
    sNo: 107,
    name: 'Thyroid-Stimulating Hormone, TSH',
    type: 'test',
    category: 'Endocrinology',
    rawText: `TSH is the premier first-line screening test for suspected thyroid disorders.
• Normal Adult Reference: 0.4 - 4.5 &mu;IU/mL
• Elevated TSH: Primary hypothyroidism, Hashimoto thyroiditis, subclinical hypothyroidism, inadequate levothyroxine replacement.
• Decreased TSH: Primary hyperthyroidism, Graves disease, toxic adenoma/multinodular goiter, excess exogenous thyroid hormone, central hypothyroidism (rare).`,
    htmlContent: `<div>
      <p>Premier first-line laboratory parameter for assessing thyroid status. High sensitivity immunoassays detect subclinical changes before peripheral hormone alterations emerge.</p>
    </div>`,
  },
];

export const InterpretationsLibraryPage: React.FC<InterpretationsLibraryPageProps> = ({
  onNavigate,
  onBack,
  onSelectInterpretation,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'panels'>('panels');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Filter items based on active tab and search query
  const displayedItems = useMemo(() => {
    const list = activeTab === 'panels' ? PANELS_LIBRARY_DATA : TESTS_LIBRARY_DATA;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        item.rawText.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2200);
  };

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Breadcrumb Navigation matching Labsmart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: '#64748b',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('interpretations');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0,
            fontSize: '13px',
          }}
        >
          Interpretations
        </button>
        <ChevronRight size={14} color="#94a3b8" />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Interpretations Library</span>
      </div>

      {/* Header and BETA badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Interpretations Library
        </h1>
        <span
          style={{
            backgroundColor: '#fce7f3',
            color: '#be185d',
            border: '1px solid #fbcfe8',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '12px',
          }}
        >
          BETA
        </span>
      </div>

      {/* Labsmart feedback banner */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '13px',
          color: '#1e40af',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Sparkles size={16} color="#2563eb" />
        <span>
          Please provide your valuable feedback to the support team. Any feedback is appreciated.
        </span>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('tests')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: activeTab === 'tests' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'tests' ? '#2563eb' : '#ffffff',
              color: activeTab === 'tests' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={15} />
            <span>Test ({TESTS_LIBRARY_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('panels')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: activeTab === 'panels' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'panels' ? '#2563eb' : '#ffffff',
              color: activeTab === 'panels' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={15} />
            <span>Panels ({PANELS_LIBRARY_DATA.length})</span>
          </button>
        </div>

        {/* Search Input matching Labsmart "Search in page" */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 32px 8px 36px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', width: '80px' }}>
                S. NO.
              </th>
              <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569' }}>NAME</th>
              {activeTab === 'panels' && (
                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', width: '160px' }}>
                  CATEGORY
                </th>
              )}
              <th
                style={{
                  padding: '12px 20px',
                  fontWeight: 600,
                  color: '#475569',
                  textAlign: 'right',
                  width: '160px',
                }}
              >
                VIEW AND COPY
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  No matching interpretations found for "{searchQuery}".
                </td>
              </tr>
            ) : (
              displayedItems.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f7ff')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa')
                  }
                >
                  <td style={{ padding: '12px 20px', color: '#64748b', fontWeight: 500 }}>
                    {idx + 1}.
                  </td>
                  <td style={{ padding: '12px 20px', color: '#0f172a', fontWeight: 600 }}>
                    {item.name}
                  </td>
                  {activeTab === 'panels' && (
                    <td style={{ padding: '12px 20px', color: '#64748b' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: '#475569',
                        }}
                      >
                        {item.category || 'General'}
                      </span>
                    </td>
                  )}
                  <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setViewMode('formatted');
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      <span>View and copy</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Copy interpretation Modal matching Labsmart live modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '780px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Copy interpretation
                </h2>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  {selectedItem.type === 'panel' ? 'Panel' : 'Test'}:{' '}
                  <strong style={{ color: '#1e293b' }}>{selectedItem.name}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-toolbar with COPY button matching Labsmart */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(selectedItem.rawText)}
                  style={{
                    backgroundColor: copiedSuccess ? '#16a34a' : '#bfdbfe',
                    color: copiedSuccess ? '#ffffff' : '#1e40af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedSuccess ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSuccess ? 'COPIED!' : 'COPY'}</span>
                </button>

                {copiedSuccess && (
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                    Copied to clipboard!
                  </span>
                )}
              </div>

              {/* View mode toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                <button
                  onClick={() => setViewMode('formatted')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: viewMode === 'formatted' ? '#2563eb' : '#cbd5e1',
                    backgroundColor: viewMode === 'formatted' ? '#eff6ff' : '#ffffff',
                    color: viewMode === 'formatted' ? '#2563eb' : '#64748b',
                    cursor: 'pointer',
                    fontWeight: viewMode === 'formatted' ? 600 : 400,
                  }}
                >
                  Formatted Preview
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: viewMode === 'raw' ? '#2563eb' : '#cbd5e1',
                    backgroundColor: viewMode === 'raw' ? '#eff6ff' : '#ffffff',
                    color: viewMode === 'raw' ? '#2563eb' : '#64748b',
                    cursor: 'pointer',
                    fontWeight: viewMode === 'raw' ? 600 : 400,
                  }}
                >
                  Plain Text
                </button>
              </div>
            </div>

            {/* TinyMCE-styled Mockup Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 20px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '11px',
                color: '#64748b',
              }}
            >
              <Bold size={13} style={{ cursor: 'pointer' }} />
              <Italic size={13} style={{ cursor: 'pointer' }} />
              <Underline size={13} style={{ cursor: 'pointer' }} />
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }} />
              <List size={13} style={{ cursor: 'pointer' }} />
              <AlignLeft size={13} style={{ cursor: 'pointer' }} />
              <TableIcon size={13} style={{ cursor: 'pointer' }} />
              <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }} />
              <span>System Font • 12pt</span>
            </div>

            {/* Content Body */}
            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                flex: 1,
                backgroundColor: '#ffffff',
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#1e293b',
              }}
            >
              {viewMode === 'formatted' ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedItem.htmlContent }}
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                />
              ) : (
                <textarea
                  readOnly
                  value={selectedItem.rawText}
                  rows={14}
                  style={{
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    resize: 'none',
                    lineHeight: 1.5,
                  }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Tip: Click <strong>COPY</strong> to put text on clipboard, or copy specific sections above.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {onSelectInterpretation && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      onSelectInterpretation(selectedItem.rawText, selectedItem.name);
                      setSelectedItem(null);
                    }}
                  >
                    Use in Active Form
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterpretationsLibraryPage;
