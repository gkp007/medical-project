export interface LabPanelDetail {
  id: string;
  order: number;
  name: string;
  category: string;
  hideInterpretation?: boolean;
  hideMethodInstrument?: boolean;
  tests: string[];
  testsCount: number;
  noteHtml?: string;
  ratelistEntries: Array<{ sNo: number; name: string; fee: number }>;
}

export const ALL_LABSMART_PANELS: LabPanelDetail[] = [
  {
    "id": "587511",
    "order": 1,
    "name": "Complete Blood Count (CBC)",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Hemoglobin",
      "Total Leukocyte Count",
      "Differential Leucocyte Count",
      "Platelet Count",
      "Total RBC Count",
      "Hematocrit Value, Hct",
      "Mean Corpuscular Volume, MCV",
      "Mean Cell Haemoglobin, MCH",
      "Mean Cell Haemoglobin CON, MCHC",
      "Mean Platelet Volume, MPV",
      "R.D.W. - SD",
      "R.D.W. - CV",
      "PCT",
      "P-LCR",
      "plcc",
      "P.D.W."
    ],
    "testsCount": 16,
    "noteHtml": "<p><strong>Clinical Notes:<br /></strong>A complete blood count (CBC) is used to evaluate overall health and detect a wide range of disorders, including anemia, infection, and leukemia. There have been some reports of WBC and platelet counts being lower in venous blood than in capillary blood samples, although still within these reference ranges.</p>\r\n<p><strong>Possible causes of abnormal parameters:<br /></strong></p>\r\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\r\n<tbody>\r\n<tr>\r\n<td style=\"width: 32.0298%;\">&nbsp;</td>\r\n<td style=\"width: 32.0298%;\"><strong>High</strong></td>\r\n<td style=\"width: 32.0298%;\"><strong>Low</strong></td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 32.0298%;\"><strong><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">RBC, Hb, or HCT</span></strong></td>\r\n<td style=\"width: 32.0298%;\"><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">Dehydration, polycythemia, shock, chronic hypoxia</span></td>\r\n<td style=\"width: 32.0298%;\"><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">Anemia, thalassemia, and other hemoglobinopathies</span></td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 32.0298%;\"><strong>MCV</strong></td>\r\n<td style=\"width: 32.0298%;\">Macrocytic anemia, liver disease</td>\r\n<td style=\"width: 32.0298%;\">Microcytic anemia</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 32.0298%;\"><strong>WBC</strong></td>\r\n<td style=\"width: 32.0298%;\">Acute stress, infection, malignancies</td>\r\n<td style=\"width: 32.0298%;\">Sepsis, marrow hypoplasia</td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 32.0298%;\"><strong>Platelets</strong></td>\r\n<td style=\"width: 32.0298%;\">Risk of thrombosis</td>\r\n<td style=\"width: 32.0298%;\">Risk of bleeding</td>\r\n</tr>\r\n</tbody>\r\n</table>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Complete Blood Count (CBC)",
        "fee": 200
      },
      {
        "sNo": 2,
        "name": "CBC with GBP",
        "fee": 100
      }
    ]
  },
  {
    "id": "587512",
    "order": 2,
    "name": "CBC (with absolute counts)",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Hemoglobin",
      "Total Leukocyte Count",
      "Differential Leucocyte Count",
      "Differential Leukocyte Count (Absolute count)",
      "Neutrophil Lymphocyte Ratio",
      "Platelet Count",
      "Total RBC Count",
      "Hematocrit Value, Hct",
      "Mean Corpuscular Volume, MCV",
      "Mean Cell Haemoglobin, MCH",
      "Mean Cell Haemoglobin CON, MCHC",
      "Mean Platelet Volume, MPV",
      "R.D.W. - CV",
      "R.D.W. - SD"
    ],
    "testsCount": 14,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "CBC (with absolute counts)",
        "fee": 250
      },
      {
        "sNo": 2,
        "name": "Antenatal Package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Cardiac package",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Dialysis package",
        "fee": 100
      },
      {
        "sNo": 5,
        "name": "Fitness Package",
        "fee": 100
      },
      {
        "sNo": 6,
        "name": "Full body checkup (Female)",
        "fee": 100
      },
      {
        "sNo": 7,
        "name": "Full body checkup (Male)",
        "fee": 100
      },
      {
        "sNo": 8,
        "name": "Preoperative",
        "fee": 100
      },
      {
        "sNo": 9,
        "name": "Thyroid package",
        "fee": 450
      }
    ]
  },
  {
    "id": "587513",
    "order": 3,
    "name": "CBC with ESR",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Hemoglobin",
      "Total Leukocyte Count",
      "Differential Leucocyte Count",
      "Platelet Count",
      "Total RBC Count",
      "Hematocrit Value, Hct",
      "Mean Corpuscular Volume, MCV",
      "Mean Cell Haemoglobin, MCH",
      "Mean Cell Haemoglobin CON, MCHC",
      "Mean Platelet Volume, MPV",
      "R.D.W. - SD",
      "R.D.W. - CV",
      "P-LCR",
      "P.D.W.",
      "Erythrocyte Sedimentation Rate (Wintrobe)"
    ],
    "testsCount": 15,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "CBC with ESR",
        "fee": 280
      },
      {
        "sNo": 2,
        "name": "Anemia package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Arthritis Package",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Fever package",
        "fee": 100
      }
    ]
  },
  {
    "id": "587514",
    "order": 4,
    "name": "BT & CT",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Bleeding Time",
      "Clotting Time"
    ],
    "testsCount": 2,
    "noteHtml": "<p>The <strong>bleeding time</strong> test assesses primary hemostasis (vascular and platelet components) and is dependent on adequate functioning of platelets and blood vessels.<br /><br />Causes of prolongation of bleeding time:<br />1. Thrombocytopenia <br />2. Disorders of platelet function <br />3. Von Willebrand disease <br />4. Disorders of blood vessels<br /><br /><strong>Clotting time</strong> measures the time required for the blood to clot in a glass test tube kept at 37&deg;C. Prolongation of clotting time only occurs in severe deficiency of a clotting factor and is normal in mild or moderate deficiency.<br />Note: Recommended test is Prothrombin Time (PT) and Activated Partial Thromboplastin time (APTT)</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "BT &amp; CT",
        "fee": 100
      }
    ]
  },
  {
    "id": "587515",
    "order": 5,
    "name": "Coagulation Profile",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Bleeding Time",
      "Clotting Time",
      "Prothrombin time, PT/INR",
      "Activated partial thromboplastin time, APTT"
    ],
    "testsCount": 4,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Coagulation Profile",
        "fee": 100
      }
    ]
  },
  {
    "id": "587516",
    "order": 6,
    "name": "Blood Sugar Fasting & PP",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Fasting Blood Sugar",
      "Blood Sugar PP"
    ],
    "testsCount": 2,
    "noteHtml": "<p><strong>Clinical Notes&nbsp;<br /></strong>Elevated glucose levels (hyperglycemia) are most often encountered clinically in the setting of diabetes mellitus, but they may also occur with pancreatic neoplasms, hyperthyroidism, and adrenocortical dysfunction. Decreased glucose levels (hypoglycemia) may result from endogenous or exogenous insulin excess, prolonged starvation, or liver disease.<br /><br /></p>\n<table>\n<tbody>\n<tr>\n<td>\n<p><strong>Fasting Glucose</strong></p>\n</td>\n<td>\n<p><strong>2 hours PP Glucose</strong></p>\n</td>\n<td>\n<p><strong>Diagnosis</strong></p>\n</td>\n</tr>\n<tr>\n<td>\n<p>&lt;100</p>\n</td>\n<td>\n<p>&lt;140</p>\n</td>\n<td>\n<p>Normal</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>100 to 125</p>\n</td>\n<td>\n<p>140 to 199</p>\n</td>\n<td>\n<p>Pre Diabetes</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>&gt;126</p>\n</td>\n<td>\n<p>&gt;200</p>\n</td>\n<td>\n<p>Diabetes</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">A level of 126 mg/dL or above, confirmed by repeating the test on another day, means a person has diabetes.<br /></span><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">IGT (2 hrs Post meal), means a person has an increased risk of developing type 2 diabetes but does not have it yet. <br /></span><span style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\">A 2-hour glucose level of 200 mg/dL or above, confirmed by repeating the test on another day, means a person has diabetes</span></p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Blood Sugar Fasting &amp; PP",
        "fee": 100
      },
      {
        "sNo": 2,
        "name": "Diabetic package",
        "fee": 100
      }
    ]
  },
  {
    "id": "587517",
    "order": 7,
    "name": "Liver Function Test (LFT)",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Bilirubin (Total)",
      "Serum Bilirubin (Direct)",
      "Serum Bilirubin (Indirect)",
      "SGOT (AST)",
      "SGPT (ALT)",
      "SGOT/SGPT",
      "Serum Alkaline Phosphatase",
      "Serum Protein",
      "Serum Albumin",
      "Globulin",
      "A/G Ratio"
    ],
    "testsCount": 11,
    "noteHtml": "<p><strong>LFT Interpretation<br /></strong>Liver Function Blood Test gives an insight into your liver health and helps identify problems like hepatitis, cirrhosis, and fatty liver disease, which may cause similar symptoms but require different treatments to recover.<br /><br /><strong>Test Significance<br /></strong>Besides diagnosing liver problems, LFT&rsquo;s also monitor overall liver functioning. Monitoring helps people with liver disease or taking medication, as it helps screen whether the treatment works fine or requires adjustments. Moreover, Liver Function Tests help determine if someone is at risk of developing liver diseases. Apart from assessing your chances, this test also checks the severity of the liver damage to help the doctor plan and prescribe appropriate treatment.<br /><br /><strong>Increased in:</strong> Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (neonatal hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders. Hepatotoxic drugs.</p>\n<p>&nbsp;</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Liver Function Test (LFT)",
        "fee": 450
      },
      {
        "sNo": 2,
        "name": "Fitness Package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Full body checkup (Female)",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Full body checkup (Male)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587518",
    "order": 8,
    "name": "Bilirubin Total, Direct & Indirect",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Bilirubin (Total)",
      "Serum Bilirubin (Direct)",
      "Serum Bilirubin (Indirect)"
    ],
    "testsCount": 3,
    "noteHtml": "<p><strong>Physiological basis</strong>&nbsp;<br />Bilirubin is the orange-yellow pigment derived from the breakdown of hemoglobin (heme). The majority of bilirubin comes from senescent red cells. It is biotransformed in the liver and excreted in bile and urine.<br />The conjugated form is water soluble and reacts directly with diazo dyes in the absence of reaction accelerator, and is therefore called direct bilirubin. The unconjugated form is fat-soluble and reacts with diazo dyes only in the presence of accelerator; so it is called indirect.<br />Some conjugated bilirubin is bound to serum albumin, so-called D (delta) bilirubin.<br /><br /><strong>Increased in:</strong> Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (neonatal hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders. Hepatotoxic drugs.<br /><br /><strong>Comments</strong>&nbsp;<br />Assay of total bilirubin includes conjugated (direct) and unconjugated (indirect) bilirubin. The unconjugated (indirect) form is the difference between total bilirubin (with reaction accelerator) and the direct bilirubin fraction. Delta bilirubin is determined together with conjugated bilirubin. Delta bilirubin (half-life is about 17 days) accounts for relatively slow regression of jaundice.<br />Only conjugated bilirubin appears in the urine, and it is indicative of liver disease and biliary tract obstruction.<br />Hemolysis is associated with increased unconjugated bilirubin. Unbound (free) serum or plasma bilirubin level correlates better than total bilirubin with CNS bilirubin concentrations and bilirubin encephalopathy (kernicterus) in newborn jaundice.</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Bilirubin Total, Direct &amp; Indirect",
        "fee": 130
      }
    ]
  },
  {
    "id": "587519",
    "order": 9,
    "name": "Kidney Function Test (KFT)",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Urea",
      "Serum Creatinine",
      "BUN",
      "eGFR",
      "Serum Chloride",
      "eGFR Category",
      "Serum Calcium",
      "Urea / Creatinine Ratio",
      "Serum Potassium",
      "Serum Sodium",
      "Serum Uric Acid",
      "BUN / Creatinine Ratio"
    ],
    "testsCount": 12,
    "noteHtml": "<p><strong>Creatinine</strong> is a nitrogenous waste product formed in muscle from creatine phosphate. Endogenous production of creatinine is proportional to muscle mass and body weight.</p>\r\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\r\n<tbody>\r\n<tr>\r\n<td style=\"width: 48.6811%;\"><span style=\"font-weight: 400;\">Causes of Increased Serum Creatinine Level</span></td>\r\n<td style=\"width: 48.6811%;\"><span style=\"font-weight: 400;\">Causes of Decreased Serum Creatinine Level</span></td>\r\n</tr>\r\n<tr>\r\n<td style=\"width: 48.6811%;\">1. <span style=\"font-weight: 400;\">Pre-renal, renal, and post-renal azotemia<br /></span>2. <span style=\"font-weight: 400;\">Large amount of dietary meat</span><br />3. <span style=\"font-weight: 400;\">Active acromegaly and gigantism</span></td>\r\n<td style=\"width: 48.6811%;\">1. Pregnancy <br />2. Increasing age (reduction in muscle mass)</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>GFR</strong> is measured to (i) detect suspected incipient kidney disease (i.e. early detection), (ii)monitor the course of established kidney disease, (iii) plan renal replacement therapy in advanced renal disease, and (iv) adjust the dosage of certain drugs which are nephrotoxic.<br /><br /><strong>BUN/creatinine ratio</strong> is to discriminate pre-renal and post-renal azotemia from renal azotemia.&nbsp;</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Kidney Function Test (KFT)",
        "fee": 550
      },
      {
        "sNo": 2,
        "name": "Fitness Package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Full body checkup (Female)",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Full body checkup (Male)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587520",
    "order": 10,
    "name": "KFT without eGFR",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "BUN",
      "Serum Urea",
      "Serum Creatinine",
      "Serum Calcium",
      "Serum Potassium",
      "Serum Sodium",
      "Serum Uric Acid",
      "Urea / Creatinine Ratio",
      "BUN / Creatinine Ratio"
    ],
    "testsCount": 9,
    "noteHtml": "<p><strong>Creatinine</strong> is a nitrogenous waste product formed in muscle from creatine phosphate. Endogenous production of creatinine is proportional to muscle mass and body weight.</p>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 48.6811%;\"><span style=\"font-weight: 400;\">Causes of Increased Serum Creatinine Level</span></td>\n<td style=\"width: 48.6811%;\"><span style=\"font-weight: 400;\">Causes of Decreased Serum Creatinine Level</span></td>\n</tr>\n<tr>\n<td style=\"width: 48.6811%;\">1. <span style=\"font-weight: 400;\">Pre-renal, renal, and post-renal azotemia<br /></span>2. <span style=\"font-weight: 400;\">Large amount of dietary meat</span><br />3. <span style=\"font-weight: 400;\">Active acromegaly and gigantism</span></td>\n<td style=\"width: 48.6811%;\">1. Pregnancy <br />2. Increasing age (reduction in muscle mass)</td>\n</tr>\n</tbody>\n</table>\n<p><strong><br />BUN/Serum Creatinine Ratio</strong><br />BUN/creatinine ratio is to discriminate pre-renal and post-renal azotemia from renal azotemia. Normal ratio is 12:1 to 20:1.</p>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 44.1608%;\">Causes of Increased BUN/Creatinine Ratio (&gt;20:1)</td>\n<td style=\"width: 53.2014%;\">Causes of Decreased BUN/Creatinine Ratio (&lt;10:1)</td>\n</tr>\n<tr>\n<td style=\"width: 44.1608%;\">1. Increased BUN with normal serum creatinine: <br />&nbsp; &nbsp; a) Pre-renal azotemia&nbsp; &nbsp; b) High protein diet&nbsp; &nbsp;c) Increased protein catabolism&nbsp; &nbsp;d) Gastrointestinal hemorrhage <br /><br />2. Increase of both BUN and serum creatinine with a disproportionately greater increase of BUN: <br />&nbsp; &nbsp;a) Post-renal azotemia (Obstruction to the outflow of urine).</td>\n<td style=\"width: 53.2014%;\">1. Acute tubular necrosis <br />2. Low protein diet, starvation <br />3. Severe liver disease</td>\n</tr>\n</tbody>\n</table>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "KFT without eGFR",
        "fee": 550
      }
    ]
  },
  {
    "id": "587521",
    "order": 11,
    "name": "Lipid Profile",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Total Cholesterol",
      "Triglycerides",
      "HDL Cholesterol",
      "LDL Cholesterol",
      "VLDL Cholesterol",
      "LDL / HDL",
      "Total Cholesterol / HDL",
      "TG / HDL",
      "Non-HDL cholesterol"
    ],
    "testsCount": 9,
    "noteHtml": "<p>Abnormalities of lipids are associated with increased risk of coronary artery disease (CAD) in patients with DM. This risk can be reduced by intensive treatment of lipid abnormalities. The usual pattern of lipid abnormalities in type 2 DM is elevated triglycerides, decreased HDL cholesterol and higher proportion of small, dense LDL particles. Cholesterol is a lipid found in all cell membranes and in blood plasma. It is an essential component of the cell membranes, and is necessary for synthesis of steroid hormones, and for the formation of bile acids. Cholesterol is synthesized by the liver and many other organs, and is also ingested in the diet. Triglycerides are lipids in which three long-chain fatty acids are attached to glycerol. They are present in dietary fat and also synthesized by liver and adipose tissue.<br /><br />Newer treatment goals and statin initiation thresholds based on the risk categories proposed by Lipid Association of India in 2020.</p>\n<table style=\"border-collapse: collapse; border-style: solid;\">\n<tbody>\n<tr>\n<td>\n<p><strong>Risk Category&nbsp;</strong></p>\n</td>\n<td colspan=\"2\">\n<p><strong>Treatment Goal</strong></p>\n</td>\n<td colspan=\"2\">\n<p><strong>Consider Therapy</strong></p>\n</td>\n</tr>\n<tr>\n<td>&nbsp;</td>\n<td>\n<p><strong>LDL Cholesterol</strong></p>\n<p><strong>(LDL-C) (Mg/dl)</strong></p>\n</td>\n<td>\n<p><strong>Non-HDL Cholesterol</strong></p>\n<p><strong>(Non HDL-C) (Mg/dl)</strong></p>\n</td>\n<td>\n<p><strong>LDL cholesterol</strong></p>\n<p><strong>(LDL-C) (Mg/dl)</strong></p>\n</td>\n<td>\n<p><strong>Non- HDL Cholesterol</strong></p>\n<p><strong>(Non HDL-C) (Mg/dl)</strong></p>\n</td>\n</tr>\n<tr>\n<td>\n<p>Extreme Risk Group Category A</p>\n</td>\n<td>\n<p>&lt; 50</p>\n<p>(Optional Goal&lt;=30)</p>\n</td>\n<td>\n<p>&lt;80</p>\n<p>(Optional Goal&lt;=60)</p>\n</td>\n<td>\n<p>&gt;=50</p>\n</td>\n<td>\n<p>&gt;=80</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>Extreme Risk Group Category A</p>\n</td>\n<td>\n<p>&lt;=30</p>\n</td>\n<td>\n<p>&lt;=60</p>\n</td>\n<td>\n<p>&gt;30</p>\n</td>\n<td>\n<p>&gt;60</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>Very High</p>\n</td>\n<td>\n<p>&lt;50</p>\n</td>\n<td>\n<p>&lt;80</p>\n</td>\n<td>\n<p>&gt;=50</p>\n</td>\n<td>\n<p>&gt;=80</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>High</p>\n</td>\n<td>\n<p>&lt;70</p>\n</td>\n<td>\n<p>&lt;100</p>\n</td>\n<td>\n<p>&gt;=70</p>\n</td>\n<td>\n<p>&gt;=100</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>Moderate</p>\n</td>\n<td>\n<p>&lt;100</p>\n</td>\n<td>\n<p>&lt;130</p>\n</td>\n<td>\n<p>&gt;=100</p>\n</td>\n<td>\n<p>&gt;=130</p>\n</td>\n</tr>\n<tr>\n<td>\n<p>Low</p>\n</td>\n<td>\n<p>&lt;100</p>\n</td>\n<td>\n<p>&lt;130</p>\n</td>\n<td>\n<p>&gt;=130*</p>\n</td>\n<td>\n<p>&gt;=160*</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p>*In low risk patient, consider therapy after an initial non-pharmacological intervention for at least 3 months.</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Lipid Profile",
        "fee": 450
      },
      {
        "sNo": 2,
        "name": "Cardiac package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Diabetic package",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Fitness Package",
        "fee": 100
      },
      {
        "sNo": 5,
        "name": "Full body checkup (Female)",
        "fee": 100
      },
      {
        "sNo": 6,
        "name": "Full body checkup (Male)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587522",
    "order": 12,
    "name": "Electrolytes Panel",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Sodium",
      "Serum Potassium",
      "Serum Chloride",
      "Serum Calcium",
      "iCalcium"
    ],
    "testsCount": 5,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Electrolytes Panel",
        "fee": 450
      }
    ]
  },
  {
    "id": "587523",
    "order": 13,
    "name": "Arthritis Profile",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Uric Acid",
      "Rheumatoid Factor, RA (Quantitative)",
      "C-Reactive Protein, CRP (Quantitative)",
      "Antistreptolysin O, ASO Titer",
      "iCalcium",
      "Total Calcium",
      "Serum Phosphorus"
    ],
    "testsCount": 7,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Arthritis Profile",
        "fee": 100
      }
    ]
  },
  {
    "id": "587524",
    "order": 14,
    "name": "Protein Fraction",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Protein",
      "Serum Albumin",
      "Globulin",
      "A/G Ratio"
    ],
    "testsCount": 4,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Protein Fraction",
        "fee": 100
      }
    ]
  },
  {
    "id": "587525",
    "order": 15,
    "name": "Torch Profile",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Toxo IgG",
      "Toxo IgM",
      "Rubella IgG",
      "Rubella IgM",
      "CMV IgG",
      "CMV IgM",
      "HSV-1/2 IgG",
      "HSV-1/2 IgM",
      "HSV-2 IgG"
    ],
    "testsCount": 9,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Torch Profile",
        "fee": 100
      },
      {
        "sNo": 2,
        "name": "Bad Obstetric History (BOH) Package",
        "fee": 100
      }
    ]
  },
  {
    "id": "587526",
    "order": 16,
    "name": "Iron Studies",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Iron",
      "UIBC",
      "Total Iron Binding Capacity (TIBC)",
      "Transferrin Saturation"
    ],
    "testsCount": 4,
    "noteHtml": "<p><strong>Physiological basis<br /></strong>Plasma iron concentration is determined by absorption from the intestine; storage in the intestine, liver, spleen, bone marrow, rate of breakdown or loss of hemoglobin, and rate of synthesis of new hemoglobin.<br /><br /><strong>Interpretation for Iron (Fe), serum or plasma</strong></p>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 48.0522%;\">Increased</td>\n<td style=\"width: 48.0522%;\">Decreased</td>\n</tr>\n<tr>\n<td style=\"width: 48.0522%; text-align: left;\">Hemosiderosis (eg, multiple transfusions, excess iron administration), acute Fe poisoning (children), hemolytic anemia, pernicious anemia, aplastic or hypoplastic anemia, viral hepatitis, lead poisoning, thalassemia, hemochromatosis. Drugs: estrogens, ethanol, oral contraceptives.</td>\n<td style=\"width: 48.0522%;\">Iron deficiency, nephrotic syndrome, chronic renal failure, many infections, active hematopoiesis, remission of pernicious anemia, hypothyroidism, malignancy (carcinoma), postoperative state, kwashiorkor.</td>\n</tr>\n</tbody>\n</table>\n<p><strong>TIBC</strong> correlates with serum transferrin, but the relationship is not linear over a wide range of transferrin values and is disrupted in diseases affecting transferrin-binding capacity or other iron-binding proteins.<br /><span style=\"text-decoration: underline;\">Increased in</span>: Iron deficiency anemia, late pregnancy, infancy, acute hepatitis. Drugs: oral contraceptives.<br /><span style=\"text-decoration: underline;\">Decreased in</span>: Hypoproteinemic states (eg, nephrotic syndrome, starvation, malnutrition, cancer), hemochromatosis, thalassemia, hyperthyroidism, chronic infections, chronic inflammatory disorders, chronic liver disease, and other chronic diseases.<br /><br /><strong>Increased % transferrin saturation</strong> with iron is seen in iron overload (iron poisoning, hemolytic anemia, sideroblastic anemia, thalassemia, hemochromatosis, pyridoxine deficiency, aplastic anemia, RBC transfusions).<br /><strong>Decreased % transferrin saturation</strong> with iron is seen in iron deficiency (usually saturation &lt; 16%). It can also be used to assess nutritional status.</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Iron Studies",
        "fee": 100
      },
      {
        "sNo": 2,
        "name": "Fitness Package",
        "fee": 100
      }
    ]
  },
  {
    "id": "587527",
    "order": 17,
    "name": "AMH Panel",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "ANTI MULLERIAN HORMONE",
      "Serum thyroxine, T4",
      "Thyroid-Stimulating Hormone, TSH",
      "Prolactin",
      "Luteinising Hormone, LH",
      "Follicle Stimulating Hormone, FSH",
      "Estradiol"
    ],
    "testsCount": 7,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "AMH Panel",
        "fee": 100
      }
    ]
  },
  {
    "id": "587528",
    "order": 18,
    "name": "Viral Marker",
    "category": "Serology & Immunology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "HIV (Card Test)",
      "VDRL",
      "Hepatitis C Virus, HCV",
      "HBsAg"
    ],
    "testsCount": 4,
    "noteHtml": "<p><strong>HbsAg</strong> is the first serologic marker appearing in the serum 6-16 weeks following hepatitis B viral infection. In typical HBV infection, HBsAg will be detected 2-4 weeks before the liver enzyme levels (ALT) become abnormal and 3-5 weeks before the patient develops jaundice. In acute cases HbsAg usually disappears 1-2 months after the onset of symptoms. Persistence of HbsAg for more than 6 months indicates development of either a chronic carrier state or chronic liver disease. The presence of HbsAg is frequently associated with infectivity. HbsAg when accompanied by Hepatitis Be antigen and/or hepatitis B viral DNA almost always indicates infectivity. <br /><br /><strong>Anti HCV card test interpretation</strong> <br />Reactive test result indicates presence of Hepatitis C virus infection. Active infection to be confirmed by HCV RNA PCR test. It cannot differentiate between the stages of Hepatitis C viral infection nor used to monitor the efficacy of treatment. Non-Reactive test result indicates Hepatitis C virus infection is unlikely. <br /><br /><strong>HIV Interpretation</strong> <br />A negative result implies that no Anti HIV-1 &amp; HIV-2 antibodies have been detected in the sample by this method. This means that either the patient has not been exposed to HIV-1 or HIV-2 infection or the sample has been tested during the &ldquo;WINDOW PHASE&rdquo; (before the development of detectable levels of antibodies). A positive result suggests the possibilities of HIV-I and / or HIV-II infection. However these results must be verified by a confirmatory test (IFA / WESTERN BLOT I-II) before pronouncing the patient positive for HIV-1 and / or HIV-2 infection. All reactive samples should be confirmed by using HIV Western Blot/PCR.<br /><br /><strong>VDRL Interpretation</strong></p>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 48.6435%;\">Result</td>\n<td style=\"width: 48.6435%;\">Remarks</td>\n</tr>\n<tr>\n<td style=\"width: 48.6435%;\">Reactive</td>\n<td style=\"width: 48.6435%;\">Indicates the presence of IgM &amp; IgG antibodies against non-treponemal antigens</td>\n</tr>\n<tr>\n<td style=\"width: 48.6435%;\">Non-Reactive</td>\n<td style=\"width: 48.6435%;\">Indicates absence of IgM &amp; IgG antibodies against non-treponemal antigens</td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Viral Marker",
        "fee": 100
      },
      {
        "sNo": 2,
        "name": "Antenatal Package",
        "fee": 100
      }
    ]
  },
  {
    "id": "587529",
    "order": 19,
    "name": "Thyroid Function Test (TFT)",
    "category": "Endocrinology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Triiodothyronine, T3",
      "Serum thyroxine, T4",
      "Thyroid-Stimulating Hormone, TSH"
    ],
    "testsCount": 3,
    "noteHtml": "<p><strong>Physiologic Basis</strong> <br /><strong>Total T4</strong> is a measure of thyroid gland secretion of T4, bound and free, and thus is influenced by levels of thyroid hormone binding proteins. Only free T4 is biologically active. <br /><strong>TSH</strong> is an anterior pituitary hormone that stimulates the thyroid gland to produce thyroid hormones. Secretion is stimulated by thyrotropin releasing hormones from the hypothalamus. There is negative feedback on TSH secretion by circulating thyroid hormone. <br /><strong>T3</strong> is the primary active thyroid hormone. Approximately 80% of T3 is produced by extrathyroidal deiodination of T4 and the rest by thyroid gland. Total T3 is influenced by levels of thyroxine binding proteins.<br /><br /><strong>Patterns of Thyroid Function Tests in Patients with Thyroid Disease<br /></strong></p>\n<table style=\"border-collapse: collapse; width: 100%; height: 154px;\" border=\"1\">\n<tbody>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\"><strong>Type of disease</strong></td>\n<td style=\"width: 23.7042%; height: 22px;\"><strong>T4</strong></td>\n<td style=\"width: 23.7042%; height: 22px;\"><strong>T3</strong></td>\n<td style=\"width: 23.7042%; height: 22px;\"><strong>TSH</strong></td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">Conventional hyperthyroidism (95%)&nbsp;</td>\n<td style=\"width: 23.7042%; height: 22px;\">Raised</td>\n<td style=\"width: 23.7042%; height: 22px;\">Raised</td>\n<td style=\"width: 23.7042%; height: 22px;\">Undetectable</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">T3 hyperthyroidism (5%)</td>\n<td style=\"width: 23.7042%; height: 22px;\">Normal</td>\n<td style=\"width: 23.7042%; height: 22px;\">Raised</td>\n<td style=\"width: 23.7042%; height: 22px;\">Undetectable</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">Subclinical hyperthyroidism</td>\n<td style=\"width: 23.7042%; height: 22px;\">Normal</td>\n<td style=\"width: 23.7042%; height: 22px;\">Normal</td>\n<td style=\"width: 23.7042%; height: 22px;\">Undetectable</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">Primary hypothyroidism</td>\n<td style=\"width: 23.7042%; height: 22px;\">Low</td>\n<td style=\"width: 23.7042%; height: 22px;\">Not indicated</td>\n<td style=\"width: 23.7042%; height: 22px;\">Raised</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">Subclinical hypothyroidism</td>\n<td style=\"width: 23.7042%; height: 22px;\">Normal</td>\n<td style=\"width: 23.7042%; height: 22px;\">Not indicated</td>\n<td style=\"width: 23.7042%; height: 22px;\">Raised</td>\n</tr>\n<tr style=\"height: 22px;\">\n<td style=\"width: 23.7042%; height: 22px;\">Secondary hypothyroidism</td>\n<td style=\"width: 23.7042%; height: 22px;\">Low</td>\n<td style=\"width: 23.7042%; height: 22px;\">Not indicated</td>\n<td style=\"width: 23.7042%; height: 22px;\">Undetectable</td>\n</tr>\n</tbody>\n</table>\n<p>&nbsp;</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Thyroid Function Test (TFT)",
        "fee": 450
      },
      {
        "sNo": 2,
        "name": "Fitness Package",
        "fee": 100
      },
      {
        "sNo": 3,
        "name": "Full body checkup (Female)",
        "fee": 100
      },
      {
        "sNo": 4,
        "name": "Full body checkup (Male)",
        "fee": 100
      },
      {
        "sNo": 5,
        "name": "Thyroid package",
        "fee": 450
      }
    ]
  },
  {
    "id": "587530",
    "order": 20,
    "name": "Free Thyroid Function Test (FTFT)",
    "category": "Endocrinology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Free Triiodothyronine l, FT3",
      "Free Thyroxine, FT4",
      "Thyroid-Stimulating Hormone, TSH"
    ],
    "testsCount": 3,
    "noteHtml": "<p>FT4 is a direct measure of the free T4 hormone concentration (biologically available hormone).</p>\n<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n<tbody>\n<tr>\n<td style=\"width: 48.0522%;\"><strong>Increased in</strong></td>\n<td style=\"width: 48.0522%;\"><strong>Decreased in</strong></td>\n</tr>\n<tr>\n<td style=\"width: 48.0522%;\">Hyperthyroidism, nonthyroidal illness, especially psychiatric. <br />Drugs: amiodarone, &beta;-blockers (high-dose).</td>\n<td style=\"width: 48.0522%;\">Hypothyroidism, nonthyroidal illness. <br />Drugs: phenytoin.</td>\n</tr>\n</tbody>\n</table>\n<p>The free thyroxine is used along with sensitive TSH assays for detecting clinical hyperthyroidism and hypothyroidism. The TSH assay detects subclinical thyroid dysfunction (normal FT4) and monitors levothyroxine treatment better, whereas the free thyroxine test detects central hypothyroidism and monitors rapidly changing function status better.<br /><strong>i.&nbsp; &nbsp;Elevated Free T3 and Free T4 with Low TSH:</strong> This often indicates hyperthyroidism, where the thyroid gland is overactive. <br /><strong>ii.&nbsp; Low Free T3 and Free T4 with Elevated TSH:</strong> This usually points to hypothyroidism, where the thyroid gland is underactive. <br /><strong>iii. Normal Free T3 and Free T4 with Normal TSH:</strong> This suggests that the thyroid is functioning normally. <br /><strong>iv. Normal Free T3 and Free T4 with High TSH:</strong> This could indicate subclinical hypothyroidism, where the thyroid is slightly underactive but not enough to cause obvious symptoms. <br /><br />Each individual's situation can be unique, so it's always best to discuss test results with a healthcare provider to get a complete understanding in the context of your overall health.</p>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Free Thyroid Function Test (FTFT)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587531",
    "order": 21,
    "name": "Pcod",
    "category": "Endocrinology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Progesterone",
      "Prolactin",
      "Luteinising Hormone, LH",
      "Follicle Stimulating Hormone, FSH",
      "Random Blood Sugar",
      "Estradiol"
    ],
    "testsCount": 6,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Pcod",
        "fee": 100
      }
    ]
  },
  {
    "id": "587532",
    "order": 22,
    "name": "Urine Protein/Creatinine Ratio (UPCR)",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Urine for creatinine",
      "Urine for Protein",
      "Urine Protein Creatinine Ratio"
    ],
    "testsCount": 3,
    "noteHtml": "<h3 data-start=\"661\" data-end=\"701\"><span style=\"font-size: 10pt;\">Reference Interpretation (Adults)</span></h3>\r\n<ul data-start=\"703\" data-end=\"847\">\r\n<li data-start=\"703\" data-end=\"725\">\r\n<p data-start=\"705\" data-end=\"725\"><span style=\"font-size: 10pt;\"><strong data-start=\"705\" data-end=\"714\">&lt; 0.2</strong> &rarr; Normal</span></p>\r\n</li>\r\n<li data-start=\"726\" data-end=\"762\">\r\n<p data-start=\"728\" data-end=\"762\"><span style=\"font-size: 10pt;\"><strong data-start=\"728\" data-end=\"741\">0.2 &ndash; 0.5</strong> &rarr; Mild proteinuria</span></p>\r\n</li>\r\n<li data-start=\"763\" data-end=\"803\">\r\n<p data-start=\"765\" data-end=\"803\"><span style=\"font-size: 10pt;\"><strong data-start=\"765\" data-end=\"778\">0.5 &ndash; 3.0</strong> &rarr; Moderate proteinuria</span></p>\r\n</li>\r\n<li data-start=\"804\" data-end=\"847\">\r\n<p data-start=\"806\" data-end=\"847\"><span style=\"font-size: 10pt;\"><strong data-start=\"806\" data-end=\"815\">&gt; 3.0</strong> &rarr; Nephrotic range proteinuria</span></p>\r\n</li>\r\n</ul>",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Urine Protein/Creatinine Ratio (UPCR)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587533",
    "order": 23,
    "name": "Estimated Glomerular Filtration Rate (eGFR)",
    "category": "Biochemistry",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Serum Creatinine",
      "eGFR",
      "eGFR Category"
    ],
    "testsCount": 3,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "Estimated Glomerular Filtration Rate (eGFR)",
        "fee": 100
      }
    ]
  },
  {
    "id": "587534",
    "order": 24,
    "name": "CBC with Morphology",
    "category": "Haematology",
    "hideInterpretation": true,
    "hideMethodInstrument": false,
    "tests": [
      "Differential Leucocyte Count",
      "Differential Leukocyte Count (Absolute count)",
      "WBC Count",
      "RBC Indices",
      "Platelet Indices",
      "Morphology"
    ],
    "testsCount": 6,
    "noteHtml": "",
    "ratelistEntries": [
      {
        "sNo": 1,
        "name": "CBC with Morphology",
        "fee": 100
      }
    ]
  }
];
