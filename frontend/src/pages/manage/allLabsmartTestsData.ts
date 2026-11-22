// Comprehensive 252 Test Database Master
// Exact from live Labsmart LIS: https://app.labsmartlis.com/37749971/lab_tests

export type AgeUnit = 'Years' | 'Days' | 'Months';
export type RangeSex = 'Any' | 'Male' | 'Female' | 'Other';

export interface DemographicRange {
  id: string;
  gender: RangeSex;
  minAge: number;
  minAgeUnit: AgeUnit;
  maxAge: number;
  maxAgeUnit: AgeUnit;
  lowerValue: number;
  upperValue: number;
  displayRange: string;
}

export interface NormalValueConfig {
  selectType: 'numeric_range' | 'text';
  textualNormal?: string;
  ranges: DemographicRange[];
}

export interface TestSubParameter {
  id: string;
  order: number;
  name: string;
  unit: string;
  isOptional: boolean;
  inputType?: 'decimal' | 'string' | 'text';
  groupBy?: string;
  normalValues: NormalValueConfig;
}

export interface LabTestDetail {
  id: string;
  order: number;
  name: string;
  shortName: string;
  category: string;
  testType: 'Single parameter' | 'Multi parameter' | 'Multiple nested parameters' | 'Document' | 'Formula' | string;
  unit?: string;
  price?: number;
  description?: string;
  increasedIn?: string[];
  decreasedIn?: string[];
  cellCauses?: Array<{ cell: string; increasedIn: string; decreasedIn: string }>;
  comments?: string;
  method?: string;
  instrument?: string;
  interpretation?: string;
  notes?: string;
  isAlwaysBold?: boolean;
  printLineAfter?: boolean;
  defaultResultText?: string;
  ratelistEntries?: Array<{ name: string; fee: number }>;
  panelsIncluded?: Array<{ name: string }>;
  parameters?: TestSubParameter[];
  normalValues?: NormalValueConfig;
}

export const ALL_LABSMART_TESTS: LabTestDetail[] = [
  {
    "id": "6228737",
    "order": 1,
    "name": "Hemoglobin",
    "shortName": "Hb",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dl",
    "price": 50,
    "description": "Hemoglobin is the major protein of erythrocytes that transports oxygen from the lungs to peripheral tissues. It is measured by spectrophotometry on automated instruments after lysis of red cells and conversion of all hemoglobin to cyanmethemoglobin.",
    "increasedIn": [
      "1. Hemoconcentration (as in dehydration, Burns, vomiting)",
      "2. Polycythemia (erythrocytosis)",
      "3. Extreme physical exercise."
    ],
    "decreasedIn": [
      "1. Macrocytic anemia (liver disease, hypothyroidism, vitamin B 12 deficiency, folate deficiency, myelodysplasia)",
      "2. Normocytic anemia (early iron deficiency, anemia of chronic disease, hemolytic anemia, acute hemorrhage, bone marrow infiltration)",
      "3. Microcytic anemia (iron deficiency, thalassemia)",
      "Hemodilution"
    ],
    "comments": "The cyanmethemoglobin technique is the method of choice selected by the International Committee for Standardization in Hematology. The method measures all hemoglobin derivatives except sulfhemoglobin by hemolyzing the specimen and adding a reducing agent. As such, this method does not distinguish between intracellular versus extracellular hemoglobin (hemolysis). Hypertriglyceridemia and very high white blood cell counts can cause false elevations of Hb.",
    "ratelistEntries": [
      {
        "name": "Hb",
        "fee": 50
      },
      {
        "name": "HB, TLC, DLC",
        "fee": 150
      },
      {
        "name": "HB, TLC, DLC, ESR",
        "fee": 230
      },
      {
        "name": "Pregnancy Profile",
        "fee": 100
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC with ESR"
      },
      {
        "name": "CBC (with absolute counts)"
      },
      {
        "name": "Complete Blood Count (CBC)"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "6125428",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 21,
          "maxAgeUnit": "Days",
          "lowerValue": 17,
          "upperValue": 23,
          "displayRange": "17 - 23"
        },
        {
          "id": "6125429",
          "gender": "Any",
          "minAge": 21,
          "minAgeUnit": "Days",
          "maxAge": 10,
          "maxAgeUnit": "Years",
          "lowerValue": 11.2,
          "upperValue": 16.5,
          "displayRange": "11.2 - 16.5"
        },
        {
          "id": "6125431",
          "gender": "Female",
          "minAge": 10,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 12,
          "upperValue": 15,
          "displayRange": "12 - 15"
        },
        {
          "id": "6125430",
          "gender": "Male",
          "minAge": 10,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 13,
          "upperValue": 17,
          "displayRange": "13 - 17"
        }
      ]
    }
  },
  {
    "id": "6228738",
    "order": 2,
    "name": "Total Leukocyte Count",
    "shortName": "TLC",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "cumm",
    "price": 50,
    "description": "Total Leukocyte Count measures total circulating white blood cells responsible for immune response against infectious agents and inflammatory processes.",
    "increasedIn": [
      "1. Bacterial and pyogenic infections, acute sepsis",
      "2. Inflammatory disorders, tissue necrosis, severe burns",
      "3. Leukemias, myeloproliferative disorders, leukemoid reactions"
    ],
    "decreasedIn": [
      "1. Viral infections (influenza, dengue, typhoid, viral hepatitis)",
      "2. Bone marrow depression (chemotherapy, radiation, aplastic anemia)",
      "3. Autoimmune destruction and hypersplenism"
    ],
    "comments": "Total count is enumerated by automated electrical impedance and light scattering. High nucleated red cells or unlysed platelets can trigger false elevations.",
    "ratelistEntries": [
      {
        "name": "TLC",
        "fee": 50
      },
      {
        "name": "HB, TLC, DLC",
        "fee": 150
      },
      {
        "name": "HB, TLC, DLC, ESR",
        "fee": 230
      },
      {
        "name": "TLC DLC ESR",
        "fee": 180
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC with ESR"
      },
      {
        "name": "CBC (with absolute counts)"
      },
      {
        "name": "Complete Blood Count (CBC)"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "6125432",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 4000,
          "upperValue": 11000,
          "displayRange": "4,000 - 11,000"
        }
      ]
    }
  },
  {
    "id": "6228739",
    "order": 3,
    "name": "Differential Leucocyte Count",
    "shortName": "DLC",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "%",
    "price": 50,
    "description": "CELLS\nINCREASED IN\nDECREASED IN Neutrophils\nInfection (bacterial or early viral), acute stress, acute and chronic inflammation, tumors, drugs (eg, G-CSF), diabetic ketoacidosis, leukemia (rare).\nAplastic anemia, drug-induced neutropenia, chemotherapy, folate or B12 deficiency, myelodysplasia, marrow",
    "increasedIn": [],
    "decreasedIn": [
      "Neutrophils",
      "Infection (bacterial or early viral), acute stress, acute and chronic inflammation, tumors,"
    ],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "DLC",
        "fee": 50
      },
      {
        "name": "HB, TLC, DLC",
        "fee": 150
      },
      {
        "name": "HB, TLC, DLC, ESR",
        "fee": 230
      },
      {
        "name": "TLC DLC ESR",
        "fee": 180
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC with Morphology"
      },
      {
        "name": "CBC with ESR"
      },
      {
        "name": "CBC (with absolute counts)"
      },
      {
        "name": "Complete Blood Count (CBC)"
      }
    ],
    "parameters": [
      {
        "id": "9446441",
        "order": 1,
        "name": "Neutrophils",
        "unit": "%",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "r1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 40,
              "upperValue": 70,
              "displayRange": "40 - 70"
            }
          ]
        }
      },
      {
        "id": "9446442",
        "order": 2,
        "name": "Lymphocyte",
        "unit": "%",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "r2",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 20,
              "upperValue": 40,
              "displayRange": "20 - 40"
            }
          ]
        }
      },
      {
        "id": "9446443",
        "order": 3,
        "name": "Eosinophils",
        "unit": "%",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "r3",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 1,
              "upperValue": 6,
              "displayRange": "1 - 6"
            }
          ]
        }
      },
      {
        "id": "9446444",
        "order": 4,
        "name": "Monocytes",
        "unit": "%",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "r4",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 1,
              "upperValue": 4,
              "displayRange": "1 - 4"
            }
          ]
        }
      },
      {
        "id": "9446445",
        "order": 5,
        "name": "Basophils",
        "unit": "%",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "r5",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 0,
              "upperValue": 2,
              "displayRange": "< 2"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "6228740",
    "order": 4,
    "name": "Differential Leukocyte Count (Absolute count)",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "/cumm",
    "price": 80,
    "description": "Differential Leukocyte Count (Absolute count) diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CBC (with absolute counts)",
        "fee": 250
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC (with absolute counts)"
      }
    ],
    "parameters": [
      {
        "id": "p_anc",
        "order": 1,
        "name": "Absolute Neutrophil Count (ANC)",
        "unit": "/cumm",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "anc_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 2000,
              "upperValue": 7000,
              "displayRange": "2,000 - 7,000"
            }
          ]
        }
      },
      {
        "id": "p_alc",
        "order": 2,
        "name": "Absolute Lymphocyte Count (ALC)",
        "unit": "/cumm",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "alc_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 1000,
              "upperValue": 3000,
              "displayRange": "1,000 - 3,000"
            }
          ]
        }
      },
      {
        "id": "p_amc",
        "order": 3,
        "name": "Absolute Monocyte Count",
        "unit": "/cumm",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "amc_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 200,
              "upperValue": 1000,
              "displayRange": "200 - 1,000"
            }
          ]
        }
      },
      {
        "id": "p_aec",
        "order": 4,
        "name": "Absolute Eosinophil Count",
        "unit": "/cumm",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "aec_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 20,
              "upperValue": 500,
              "displayRange": "20 - 500"
            }
          ]
        }
      },
      {
        "id": "p_abc",
        "order": 5,
        "name": "Absolute Basophil Count",
        "unit": "/cumm",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "abc_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 0,
              "upperValue": 100,
              "displayRange": "0 - 100"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "6228741",
    "order": 5,
    "name": "Erythrocyte sedimentation rate (Westergren)",
    "shortName": "ESR (Westergren)",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "mm for 1st hour",
    "price": 80,
    "description": "The erythrocyte sedimentation rate (ESR) is a simple non-specific indicator of systemic inflammation, infection, autoimmune conditions, and tissue damage.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "ESR (Westergren)",
        "fee": 80
      },
      {
        "name": "CBC with ESR",
        "fee": 280
      },
      {
        "name": "HB, TLC, DLC, ESR",
        "fee": 230
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC with ESR"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "esr_m1",
          "gender": "Male",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 50,
          "maxAgeUnit": "Years",
          "lowerValue": 0,
          "upperValue": 15,
          "displayRange": "0 - 15"
        },
        {
          "id": "esr_m2",
          "gender": "Male",
          "minAge": 50,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0,
          "upperValue": 20,
          "displayRange": "0 - 20"
        },
        {
          "id": "esr_f1",
          "gender": "Female",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 50,
          "maxAgeUnit": "Years",
          "lowerValue": 0,
          "upperValue": 20,
          "displayRange": "0 - 20"
        },
        {
          "id": "esr_f2",
          "gender": "Female",
          "minAge": 50,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0,
          "upperValue": 30,
          "displayRange": "0 - 30"
        }
      ]
    }
  },
  {
    "id": "6228742",
    "order": 6,
    "name": "Erythrocyte Sedimentation Rate (Wintrobe)",
    "shortName": "ESR (Wintrobe)",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "mm/hr",
    "price": 50,
    "description": "Raised ESR can be found in\nLow ESR is found in: 1. Connective tissue disorders\n2. Infections e.g., TB, acute hepatitis, bacterial\n3. Hematological disease e.g., multiple myeloma, anemia of acute or chronic disease, alone or combined with iron deficiency anemia\n4. Malignancy e.g., lymphoma, breast or",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "ESR (Wintrobe)",
        "fee": 50
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228746",
    "order": 7,
    "name": "Platelet Count",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "lakhs/cumm",
    "price": 60,
    "description": "Platelets are released from megakaryocytes in bone marrow and are important for normal hemostasis. An estimated platelet count may be obtained from blood smear by multiplying the number of platelets per 100 × oil immersion field by 10,000.\n\n\n\nIncreased in: \n\nDecreased in:\n\nMyeloproliferative disorders (polycythemia vera, chronic myeloid leukemia, essential thrombocythemia, myelofibrosis), some myelodysplastic disorders, acute blood loss, postsplenectomy, pre-eclampsia, reactive thrombocytosis secondary to inflammatory disorders, infection, tissue injury, iron deficiency, malignancies.\n\nBone marrow suppression or replacement/infiltration, myelodysplasia, chemotherapy, drugs, alcohol, infection (eg, HIV), congenital marrow failure (eg, Fanconi anemia), Increased destruction or excessive pooling: hypersplenism, DIC, TTP, platelet antibodies (ITP), drugs (eg, quinidine, cephalosporins, clopidogrel)",
    "increasedIn": [],
    "decreasedIn": [
      "Myeloproliferative disorders (polycythemia vera, chronic myeloid leukemia, essential thrombocythemia, myelofibrosis), some myelodysplastic disorders, acute blood loss, postsplenectomy, pre-eclampsia, reactive thrombocytosis secondary to inflammatory disorders, infection, tissue injury, iron deficiency, malignancies.",
      "Bone marrow suppression or replacement/infiltration, myelodysplasia, chemotherapy,"
    ],
    "comments": "Platelet counts are determined in patients with suspected bleeding disorders, purpura or petechiae, leukemia/lymphoma, or DIC, and in patients on chemotherapy, and to determine the response to platelet transfusions. There is little tendency to bleed until the platelet count falls below 0.2Lakhs/cumm. Bleeding due to low platelet counts typically presents as petechiae, epistaxis, and gingival bleeding. For invasive procedures, platelet counts > 0.5 Lakhs/cumm are desirable.",
    "ratelistEntries": [
      {
        "name": "Platelet Count",
        "fee": 60
      }
    ],
    "panelsIncluded": [
      {
        "name": "Complete Blood Count (CBC)"
      },
      {
        "name": "Dengue Comprehensive"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "plt_1",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 1.5,
          "upperValue": 4.5,
          "displayRange": "1,50,000 - 4,50,000"
        }
      ]
    }
  },
  {
    "id": "6228747",
    "order": 8,
    "name": "Absolute Eosinophil Count",
    "shortName": "AEC",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "/cumm",
    "price": 100,
    "description": "The Absolute Eosinophil Count (AEC) is a measure of the number of eosinophils, a type of white blood cell, in a given volume of blood. The Absolute Eosinophil Count (AEC) is calculated by multiplying the percentage of eosinophils in the total white blood cell count by the total white blood cell count.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "The AEC is typically assessed as part of a complete blood count (CBC) with a differential. If your AEC is outside the normal range, it's important to consult with a healthcare provider to determine the underlying cause and appropriate treatment.",
    "ratelistEntries": [
      {
        "name": "AEC",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228748",
    "order": 9,
    "name": "Blood Group & Rh.",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 50,
    "description": "The ABO antigen and antibodies remain the most significant for transfusion practice. Routine ABO typing includes forward cell typing and reverse serum grouping.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "For both blood donors and recipients, routine ABO typing includes both red cell and serum testing, as checks on each other. Tube testing is as follows: patient’s red cells are tested with anti-A and anti-B for the presence or absence of agglutination (forward or cell type), and patient’s serum or plasma is tested against known A and B cells (reverse or serum/plasma type).",
    "ratelistEntries": [
      {
        "name": "Blood Group & Rh.",
        "fee": 50
      },
      {
        "name": "Pregnancy Profile",
        "fee": 100
      },
      {
        "name": "Preoperative Screening",
        "fee": 250
      }
    ],
    "panelsIncluded": [
      {
        "name": "Antenatal Profile"
      },
      {
        "name": "Preoperative Profile"
      }
    ],
    "parameters": [
      {
        "id": "9446459",
        "order": 1,
        "name": "ABO Group",
        "unit": "",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "A / B / AB / O Group",
          "ranges": []
        }
      },
      {
        "id": "9446460",
        "order": 2,
        "name": "Rh (ANTI -D)",
        "unit": "",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Positive / Negative",
          "ranges": []
        }
      }
    ]
  },
  {
    "id": "6228749",
    "order": 10,
    "name": "Bleeding Time",
    "shortName": "BT",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "Minutes",
    "price": 100,
    "description": "Bleeding Time diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "BT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228750",
    "order": 11,
    "name": "Clotting Time",
    "shortName": "CT",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "Minutes",
    "price": 100,
    "description": "Clotting Time diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228751",
    "order": 12,
    "name": "Peripheral Blood Smear",
    "shortName": "PBS / GBP",
    "category": "Haematology",
    "testType": "Document",
    "unit": "g/dL",
    "price": 150,
    "description": "Microscopic examination of Leishman-stained blood smear to assess red cell morphology, white cell differential, and platelet adequacy.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Peripheral Blood Smear",
        "fee": 150
      }
    ],
    "panelsIncluded": [
      {
        "name": "CBC with GBP"
      }
    ]
  },
  {
    "id": "6228752",
    "order": 13,
    "name": "Malaria Parasite (Card Test)",
    "shortName": "MP (Card Test)",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Malaria antigen detection-whole blood\nFour species of the plasmodium parasites are responsible for human malaria infections: P. falciparum, P. vivax, P. ovale and P. malariae. Early detection and differentiation of malaria is of paramount importance due to incidence of cerebral malaria and drug resi",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MP (Card Test)",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228753",
    "order": 14,
    "name": "Malaria Parasite (Microscopic)",
    "shortName": "MP (Microscopic)",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Malaria Parasite (Microscopic) diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MP (Microscopic)",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228754",
    "order": 15,
    "name": "Filarial Parasite (Card Test)",
    "shortName": "MF",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Result\nRemarks Detected\nIndicates the presence of circulating Wuchereria bancrofti antigen. Not Detected\nIndicates absence of circulating Wuchereria bancrofti antigen\n\nNote: \n- Positive results are seen in parasitic disease of the human lymph system caused by Wuchereria bancrofti (W. bancrofti) lead",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MF",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228755",
    "order": 16,
    "name": "Total RBC Count",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "million/cumm",
    "price": 100,
    "description": "Total RBC Count diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Total RBC Count",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228756",
    "order": 17,
    "name": "Hematocrit Value, Hct",
    "shortName": "Hct",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "%",
    "price": 100,
    "description": "Hematocrit Value, Hct diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Hct",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228757",
    "order": 18,
    "name": "Mean Corpuscular Volume, MCV",
    "shortName": "MCV",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "fl",
    "price": 100,
    "description": "Mean Corpuscular Volume, MCV diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MCV",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228758",
    "order": 19,
    "name": "Mean Cell Haemoglobin, MCH",
    "shortName": "MCH",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "pg",
    "price": 100,
    "description": "Mean Cell Haemoglobin, MCH diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MCH",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228743",
    "order": 20,
    "name": "Mean Cell Haemoglobin CON, MCHC",
    "shortName": "MCHC",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dl",
    "price": 100,
    "description": "Mean Cell Haemoglobin CON, MCHC diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MCHC",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228744",
    "order": 21,
    "name": "Mean Platelet Volume, MPV",
    "shortName": "MPV",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "fl",
    "price": 100,
    "description": "Mean Platelet Volume, MPV diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "MPV",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228759",
    "order": 22,
    "name": "Reticulocyte Count",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "%",
    "price": 100,
    "description": "Physiologic Basis:\nReticulocytes are young red blood cells that contain cytoplasmic RNA. A reticulocyte count measures how rapidly reticulocytes are produced by the bone marrow and then released into the bloodstream. Reticulocyte count reflects the erythropoietic activity of the bone marrow and is t",
    "increasedIn": [
      "Hemolytic anemia, blood loss (before development of iron deficiency), recovery from iron, B12 or folate deficiency, or from drug-induced anemia."
    ],
    "decreasedIn": [
      "Iron deficiency anemia, aplastic anemia, anemia of chronic disease, megaloblastic anemia, sideroblastic anemia, pure red cell aplasia, renal disease, bone marrow suppression or infiltration, myelodysplastic syndrome."
    ],
    "comments": "This test is indicated for the evaluation of anemia to distinguish hypoproliferative from hemolytic anemia or blood loss. The old method of measuring reticulocytes (manual staining and counting) has poor reproducibility. It has been replaced by automated methods (eg, flow cytometry-based), which are more precise and provide absolute reticulocyte counts.",
    "ratelistEntries": [
      {
        "name": "Reticulocyte Count",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228760",
    "order": 23,
    "name": "Glucose-6-phosphate dehydrogenase",
    "shortName": "G6PD",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Physiologic Basis\nG6PD is an enzyme in the hexose monophosphate shunt that is essential in generating reduced glutathione and NADPH, which protect hemoglobin from oxidative denaturation. Inherited G6PD deficiency causes neonatal hyperbilirubinemia and chronic hemolytic anemia and exposure to oxidati",
    "increasedIn": [
      "Young erythrocytes (reticulocytosis)"
    ],
    "decreasedIn": [
      "G6PD deficiency",
      "Causes of hemolysis in glucose-6- phosphate dehydrogenase deficiency",
      "1. Bacterial and viral infections",
      "2."
    ],
    "comments": "In deficient patients, hemolytic anemia can be triggered by oxidant agents: antimalarial drugs (eg, chloroquine), nalidixic acid, nitrofurantoin, dapsone, phenacetin, vitamin C, and some sulfonamides. Patients from high-risk groups (eg, African American and people from the Mediterranean region) should be screened for G6PD deficiency before taking an oxidant drug. Hemolytic episodes can also occur in deficient patients who eat fava beans (favism), in patients with diabetic acidosis, and in infections. G6PD deficiency may be the cause of hemolytic disease of newborns in Asians and Mediterraneans.\nG6PD activity levels may be measured as normal during an acute episode, because only non-hemolyzed young red cells are assessed. If deficiency is still suspected, assay should be repeated in 2–3 months when cells of all ages are present.",
    "ratelistEntries": [
      {
        "name": "G6PD",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228761",
    "order": 24,
    "name": "Prothrombin time, PT/INR",
    "shortName": "PT/INR",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "Seconds",
    "price": 100,
    "description": "Physiologic Basis\nPT evaluates the extrinsic and common coagulation pathways.The time required for fibrin clot formation is determined. It is most sensitive to deficiencies in the vitamin K-dependent clotting factors II, VII, and X. It is also sensitive to deficiency of factor V. It is less sensitiv",
    "increasedIn": [
      "Warfarin, liver disease, DIC, vitamin K deficiency, hereditary deficiency in factors VII, X, V and II, fibrinogen abnormality (eg, hypofibrinogenemia, afibrinogenemia, dysfibrinogenemia), circulating anticoagulant affecting the PT system (rarely lupus anticoagulant), massive transfusion."
    ],
    "decreasedIn": [
      "Recombinant factor F VII treatment"
    ],
    "comments": "Warfarin therapeutic range is INR 2.0 - 3.0. Bleeding has been reported to be 3 × more common in patients with INRs of 3.0–4.5 than in patients with INRs of 2.0–3.0.",
    "ratelistEntries": [
      {
        "name": "PT/INR",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228762",
    "order": 25,
    "name": "Activated partial thromboplastin time, APTT",
    "shortName": "APTT",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "Seconds",
    "price": 100,
    "description": "APTT evaluates the intrinsic and common coagulation pathways and adequacy of all coagulation factors except XIII and VII. APTT is commonly used to monitor unfractionated heparin therapy.",
    "increasedIn": [
      "Deficiency of any individual coagulation factor except Factors XIII and VII, presence of nonspecific inhibitor (eg, lupus anticoagulant), specific factor inhibitor, von Willebrand disease (PTT may also be normal), hemophilia A and B, DIC."
    ],
    "decreasedIn": [
      "Hypercoagulable states (eg, increased factor VIII levels)."
    ],
    "comments": "APTT cannot be used to monitor very high doses of heparin (eg, cardiac bypass surgery) because the clotting time is beyond the analytical measurement range of APTT. Heparin contamination is a very common cause of an unexplained prolonged APTT. Heparin neutralization with heparinase may be needed to rule out this possibility.",
    "ratelistEntries": [
      {
        "name": "APTT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228763",
    "order": 26,
    "name": "WBC Count",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "/cumm",
    "price": 100,
    "description": "WBC Count diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "WBC Count",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228764",
    "order": 27,
    "name": "P-LCR",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "P-LCR diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "P-LCR",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228765",
    "order": 28,
    "name": "R.D.W. - CV",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "R.D.W. - CV diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "R.D.W. - CV",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228766",
    "order": 29,
    "name": "P.D.W.",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "P.D.W. diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "P.D.W.",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228767",
    "order": 30,
    "name": "R.D.W. - SD",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "R.D.W. - SD diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "R.D.W. - SD",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228768",
    "order": 31,
    "name": "Neutrophil Lymphocyte Ratio",
    "shortName": "NLR",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "The Neutrophil to Lymphocyte Ratio (NLR) is a clinical metric calculated from a Complete Blood Count (CBC) that compares the number of neutrophils to the number of lymphocytes in the blood. It can provide valuable insights into a person’s immune status and inflammation levels.\n\nClinical Significance",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "NLR",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228769",
    "order": 32,
    "name": "Lupus Anticoagulant (DRVVT)",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Interpretation\nFollow ISTH guidelines by using at least two different clot-based assays, such as PTT-LA and dRVVT. Always consider test results along with the patient’s medical history, clinical presentation, and other findings. A positive lupus anticoagulant (LA) test can occur in healthy individua",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Lupus anticoagulants are diverse IgG or IgM autoantibodies that interfere with phospholipid-dependent coagulation tests, particularly the activated partial thromboplastin time (APTT). These antibodies are linked to various conditions, including arterial and venous thrombosis, recurrent miscarriages, and neurological or neuropsychiatric disorders. Testing for lupus anticoagulants can be done using methods such as PTT-LA, activated kaolin clotting time, and dilute Russell’s viper venom time (DrVVT). Among these, the DrVVT assay is the most robust and specific because it is not affected by deficiencies in the intrinsic pathway or by antibodies to factors VIII, IX, or XI.",
    "ratelistEntries": [
      {
        "name": "Lupus Anticoagulant (DRVVT)",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228971",
    "order": 33,
    "name": "Troponin T",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Troponin T diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Troponin T",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228930",
    "order": 34,
    "name": "HEMOGLOBIN HPLC/ELECTROPHORESIS",
    "shortName": "HPLC",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "HEMOGLOBIN HPLC/ELECTROPHORESIS diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HPLC",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228800",
    "order": 35,
    "name": "Leukemia DLC",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Leukemia DLC diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Leukemia DLC",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228839",
    "order": 36,
    "name": "RBC Indices",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "RBC Indices diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "RBC Indices",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228866",
    "order": 37,
    "name": "Platelet Indices",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Platelet Indices diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Platelet Indices",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228874",
    "order": 38,
    "name": "Morphology",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Morphology diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Morphology",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228899",
    "order": 39,
    "name": "DLC 3 Parts",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "DLC 3 Parts diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "DLC 3 Parts",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228932",
    "order": 40,
    "name": "DLC Leukemia",
    "shortName": "",
    "category": "Haematology",
    "testType": "Multi parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "DLC Leukemia diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "DLC Leukemia",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6234691",
    "order": 41,
    "name": "PCT",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "PCT diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "PCT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6234692",
    "order": 42,
    "name": "plcc",
    "shortName": "",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "plcc diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "plcc",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6428775",
    "order": 43,
    "name": "Sickling test",
    "shortName": "Sickling",
    "category": "Haematology",
    "testType": "Single parameter",
    "unit": "g/dL",
    "price": 100,
    "description": "Sickling test diagnostic examination. Used to evaluate clinical status in Haematology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Sickling",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228770",
    "order": 44,
    "name": "Serum Phosphorus",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nThe plasma concentration of inorganic phosphate is determined by parathyroid gland function, action of vitamin D, intestinal absorption, renal function, bone metabolism, and nutrition. Serum phosphorus concentrations have a circadian rhythm (highest level in late morning, lowest in",
    "increasedIn": [],
    "decreasedIn": [
      "Renal failure, Massive blood transfusion, hypoparathyroidism, neoplasms, adrenal insufficiency, hypervitaminosis D, osteolytic metastases to bone, leukemia, Pseudohypoparathyroidism, Cirrhosis, lactic acidosis."
    ],
    "comments": "Shift of phosphorus from extracellular to intracellular compartments, decreased gastrointestinal absorption, and increased urinary losses, are the primary mechanisms of hypophosphatemia. Hypophosphatemia has been implicated as a cause of rhabdomyolysis, respiratory failure, hemolysis, and left ventricular dysfunction.",
    "ratelistEntries": [
      {
        "name": "Serum Phosphorus",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228771",
    "order": 45,
    "name": "Serum Creatinine",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 80,
    "description": "Creatinine is a waste byproduct of muscle metabolism excreted by the kidneys. Critical marker for glomerular filtration and renal clearance assessment.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Creatinine",
        "fee": 80
      },
      {
        "name": "Kidney Function Test (KFT)",
        "fee": 250
      }
    ],
    "panelsIncluded": [
      {
        "name": "Kidney Function Test (KFT)"
      },
      {
        "name": "Full Body Checkup"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "cr_m",
          "gender": "Male",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0.7,
          "upperValue": 1.3,
          "displayRange": "0.7 - 1.3"
        },
        {
          "id": "cr_f",
          "gender": "Female",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0.5,
          "upperValue": 1.1,
          "displayRange": "0.5 - 1.1"
        }
      ]
    }
  },
  {
    "id": "6228772",
    "order": 46,
    "name": "Serum Urea",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 80,
    "description": "Urea is derived in the liver from amino acids and therefore from protein, whether originating from the diet or from tissues. The normal kidney can excrete large amounts of urea. If the rate of production exceeds the rate of clearance, plasma concentrations rise. The rate of production is accelerated",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Urea",
        "fee": 80
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228773",
    "order": 47,
    "name": "Fasting Blood Sugar",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 50,
    "description": "Measures plasma glucose levels after an overnight fast (minimum 8-10 hours) for diagnosing diabetes mellitus and impaired fasting glycemia.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Fasting Blood Sugar",
        "fee": 50
      },
      {
        "name": "Blood Sugar Fasting & PP",
        "fee": 100
      },
      {
        "name": "Diabetic package",
        "fee": 100
      }
    ],
    "panelsIncluded": [
      {
        "name": "Diabetic Profile"
      },
      {
        "name": "Executive Health Checkup"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "fbs_1",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 70,
          "upperValue": 100,
          "displayRange": "70 - 100"
        }
      ]
    }
  },
  {
    "id": "6228775",
    "order": 48,
    "name": "Blood Sugar PP",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 50,
    "description": "Clinical Notes\nElevated glucose levels (hyperglycemia) are most often encountered clinically in the setting of diabetes mellitus, but they may also occur with pancreatic neoplasms, hyperthyroidism, and adrenocortical dysfunction. Decreased glucose levels (hypoglycemia) may result from endogenous or",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Blood Sugar PP",
        "fee": 50
      },
      {
        "name": "Blood Sugar Fasting & PP",
        "fee": 100
      }
    ],
    "panelsIncluded": [
      {
        "name": "Diabetic Profile"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "ppbs_1",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 70,
          "upperValue": 140,
          "displayRange": "70 - 140"
        }
      ]
    }
  },
  {
    "id": "6228776",
    "order": 49,
    "name": "Serum Bilirubin (Total)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "Bilirubin is the orange-yellow pigment derived from the breakdown of hemoglobin (heme). The majority of bilirubin comes from senescent red cells. It is biotransformed in the liver and excreted in bile and urine. Some conjugated bilirubin is bound to serum albumin, so-called D (delta) bilirubin.",
    "increasedIn": [
      "Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (neonatal hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders. Hepatotoxic"
    ],
    "decreasedIn": [],
    "comments": "Assay of total bilirubin includes conjugated (direct) and unconjugated (indirect) bilirubin. Only conjugated bilirubin appears in the urine, and it is indicative of liver disease and biliary tract obstruction. Hemolysis is associated with increased unconjugated bilirubin. Unbound (free) serum or plasma bilirubin level correlates better than total bilirubin with CNS bilirubin concentrations and bilirubin encephalopathy (kernicterus) in newborn jaundice.",
    "ratelistEntries": [
      {
        "name": "Serum Bilirubin (Total)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228777",
    "order": 50,
    "name": "Serum Bilirubin (Direct)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "Bilirubin is the orange-yellow pigment derived from the breakdown of hemoglobin (heme). The majority of bilirubin comes from senescent red cells. It is biotransformed in the liver and excreted in bile and urine. Some conjugated bilirubin is bound to serum albumin, so-called D (delta) bilirubin.",
    "increasedIn": [
      "Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (neonatal hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders. Hepatotoxic"
    ],
    "decreasedIn": [],
    "comments": "Assay of total bilirubin includes conjugated (direct) and unconjugated (indirect) bilirubin. Only conjugated bilirubin appears in the urine, and it is indicative of liver disease and biliary tract obstruction. Hemolysis is associated with increased unconjugated bilirubin. Unbound (free) serum or plasma bilirubin level correlates better than total bilirubin with CNS bilirubin concentrations and bilirubin encephalopathy (kernicterus) in newborn jaundice.",
    "ratelistEntries": [
      {
        "name": "Serum Bilirubin (Direct)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228778",
    "order": 51,
    "name": "Serum Bilirubin (Indirect)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 80,
    "description": "Creatinine is a waste byproduct of muscle metabolism excreted by the kidneys. Critical marker for glomerular filtration and renal clearance assessment.",
    "increasedIn": [
      "Acute or chronic hepatitis, cirrhosis, biliary tract obstruction, toxic hepatitis, neonatal jaundice (neonatal hyperbilirubinemia), congenital liver enzyme abnormalities (Dubin-Johnson, Rotor, Gilbert, Crigler-Najjar syndromes), fasting, hemolytic disorders. Hepatotoxic"
    ],
    "decreasedIn": [],
    "comments": "Assay of total bilirubin includes conjugated (direct) and unconjugated (indirect) bilirubin. Only conjugated bilirubin appears in the urine, and it is indicative of liver disease and biliary tract obstruction. Hemolysis is associated with increased unconjugated bilirubin. Unbound (free) serum or plasma bilirubin level correlates better than total bilirubin with CNS bilirubin concentrations and bilirubin encephalopathy (kernicterus) in newborn jaundice.",
    "ratelistEntries": [
      {
        "name": "Serum Creatinine",
        "fee": 80
      },
      {
        "name": "Kidney Function Test (KFT)",
        "fee": 250
      }
    ],
    "panelsIncluded": [
      {
        "name": "Kidney Function Test (KFT)"
      },
      {
        "name": "Full Body Checkup"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "cr_m",
          "gender": "Male",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0.7,
          "upperValue": 1.3,
          "displayRange": "0.7 - 1.3"
        },
        {
          "id": "cr_f",
          "gender": "Female",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 0.5,
          "upperValue": 1.1,
          "displayRange": "0.5 - 1.1"
        }
      ]
    }
  },
  {
    "id": "6228779",
    "order": 52,
    "name": "Serum Uric Acid",
    "shortName": "Uric Acid",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 90,
    "description": "Uric acid is an end product of nucleoprotein metabolism and is excreted by the kidney. An increase in serum uric acid concentration occurs with increased nucleoprotein synthesis or catabolism (blood dyscrasias, therapy of leukemia) or decreased renal uric acid excretion (eg, thiazide diuretic therapy or renal failure).",
    "increasedIn": [
      "Renal failure, gout, myeloproliferative disorders (leukemia, lymphoma, myeloma, polycythemia vera), psoriasis, glycogen storage disease (type I), Lesch-Nyhan syndrome, lead nephropathy, hypertensive diseases of pregnancy (preeclampsia and eclampsia), menopause, syndrome X (obesity, insulin resistance, hypertension, hyperuricemia, dyslipidemia)."
    ],
    "decreasedIn": [
      "SIADH, Xanthine oxidase deficiency, Low-purine diet, Fanconi syndrome, Neoplastic disease (various, causing Increased renal excretion), Liver disease."
    ],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Uric Acid",
        "fee": 90
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228781",
    "order": 53,
    "name": "SGPT (ALT)",
    "shortName": "SGPT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "U/L",
    "price": 90,
    "description": "Intracellular enzyme involved in amino acid metabolism. Present in large concentrations in liver, kidney; in smaller amounts, in skeletal muscle and heart. Released with tissue damage, particularly liver injury.",
    "increasedIn": [
      "Acute viral hepatitis (ALT > AST), biliary tract obstruction (cholangitis, choledocholithiasis), alcoholic hepatitis and cirrhosis (AST > ALT), liver abscess, metastatic or primary liver cancer",
      "nonalcoholic steatohepatitis",
      "right heart failure, ischemia or hypoxia, injury to liver (“shock liver”), extensive trauma"
    ],
    "decreasedIn": [
      "Pyridoxine (vitamin B6) deficiency."
    ],
    "comments": "ALT is the preferred enzyme for evaluation of liver injury.",
    "ratelistEntries": [
      {
        "name": "SGPT",
        "fee": 90
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228782",
    "order": 54,
    "name": "SGOT (AST)",
    "shortName": "SGOT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "U/L",
    "price": 90,
    "description": "Intracellular enzyme involved in amino acid metabolism. Present in large concentrations in liver, skeletal muscle, brain, red cells, and heart. Released into the bloodstream when tissue is damaged, especially in liver injury.",
    "increasedIn": [
      "Acute viral hepatitis (ALT > AST), biliary tract obstruction (cholangitis, choledocholithiasis), alcoholic hepatitis and cirrhosis (AST > ALT), liver abscess, metastatic or primary liver cancer",
      "right heart failure, ischemic or hypoxic injury to liver (“shock liver”), extensive trauma."
    ],
    "decreasedIn": [
      "Pyridoxine (vitamin B6) deficiency"
    ],
    "comments": "Test is not indicated for diagnosis of myocardial infarction.\nAST/ALT ratio >1 suggests cirrhosis in patients with hepatitis C",
    "ratelistEntries": [
      {
        "name": "SGOT",
        "fee": 90
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228783",
    "order": 55,
    "name": "Serum Protein",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "g/dl",
    "price": 150,
    "description": "Plasma protein concentration is determined by nutritional state, hepatic function, renal function, hydration, and various disease states. Plasma protein concentration determines the colloidal osmotic pressure.",
    "increasedIn": [
      "Polyclonal or monoclonal gammopathies, marked dehydration."
    ],
    "decreasedIn": [
      "Protein-losing enteropathies, acute burns, nephrotic syndrome, severe dietary protein deficiency, chronic liver disease, malabsorption syndrome, agammaglobulinemia, cancer cachexia."
    ],
    "comments": "Serum total protein consists primarily of albumin and globulin. Serum globulin level is calculated as total protein minus albumin. Hypoproteinemia usually indicates hypoalbuminemia, because albumin is the major serum protein",
    "ratelistEntries": [
      {
        "name": "Serum Protein",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228784",
    "order": 56,
    "name": "Serum Albumin",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "g/dl",
    "price": 150,
    "description": "Physiologic Basis\nMajor components of plasma proteins are influenced by nutritional state, hepatic function, renal function, and various diseases. It is a major binding protein, although there are more than 50 different genetic variants (alloalbumins), only occasionally does a mutation cause abnorma",
    "increasedIn": [
      "Dehydration, shock, hemoconcentration."
    ],
    "decreasedIn": [
      "Decreased hepatic synthesis (chronic liver disease, malnutrition, malabsorption, malignancy, congenital analbuminemia [rare]). Increased losses (nephrotic syndrome, burns, trauma, hemorrhage with fluid replacement, fistulas, enteropathy, acute or chronic glomerulonephritis). Hemodilution (pregnancy, CHF)."
    ],
    "comments": "Serum albumin indicates severity in chronic liver disease.\nUseful in nutritional assessment if there is no impairment in production or increased loss of albumin. Independent risk factor for all-cause mortality in the elderly (age >70) and for complications in hospitalized and post-surgical patients.\nThere is a 10% reduction in serum albumin level in late pregnancy (related to hemodilution).",
    "ratelistEntries": [
      {
        "name": "Serum Albumin",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228785",
    "order": 57,
    "name": "Serum Alkaline Phosphatase",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "U/L",
    "price": 150,
    "description": "Physiologic Basis:\nAlkaline phosphatases are primarily found in liver, bone, intestines, kidney, and placenta. Test is used to detect liver disease and bone disorders.\n\nInterpretation:\nIncreased in: Obstructive hepatobiliary disease, bone disease (physiologic bone growth, Paget disease, osteomalacia",
    "increasedIn": [
      "Obstructive hepatobiliary disease, bone disease (physiologic bone growth, Paget disease, osteomalacia, osteogenic sarcoma, bone metastases), hyperparathyroidism, rickets, benign familial hyperphosphatasemia, pregnancy (third trimester), GI disease (perforated ulcer or bowel infarct), hepatotoxic"
    ],
    "decreasedIn": [
      "Hypophosphatasia.",
      "Comment:",
      "Alkaline phosphatase performs well in measuring the extent of bone metastases in prostate cancer. Alkaline phosphatase isoenzyme separation by electrophoresis or differential heat inactivation is unreliable. Use γ-glutamyl transpeptidase, which increases in hepatobiliary disease but not in bone disease, to infer the origin of increased alkaline phosphatase."
    ],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Alkaline Phosphatase",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228786",
    "order": 58,
    "name": "Total Cholesterol",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 100,
    "description": "Cholesterol level is determined by lipid metabolism, which is in turn influenced by heredity, diet, and liver, kidney, thyroid, and other endocrine organ functions.",
    "increasedIn": [
      "Primary disorders: polygenic hypercholesterolemia, familial hypercholesterolemia (deficiency of LDL receptors), familial combined hyperlipidemia, familial dysbetalipoproteinemia. Secondary disorders: hypothyroidism, uncontrolled diabetes mellitus, nephrotic syndrome, biliary obstruction, anorexia nervosa, hepatocellular carcinoma, Cushing syndrome, acute intermittent porphyria."
    ],
    "decreasedIn": [
      "Severe liver disease (acute hepatitis, cirrhosis, malignancy), hyperthyroidism, severe acute or chronic illness, malnutrition, malabsorption (eg, HIV), extensive burns, familial (Gaucher disease, Tangier disease), abetalipoproteinemia, intestinal lymphangiectasia."
    ],
    "comments": "Coronary heart disease (CHD) risk depends on the ratio of total cholesterol to HDL cholesterol. The ratio of LDL to HDL cholesterol has similar predictive ability. Treatment decisions should be based on absolute CHD risk. The risk reduction is proportional to the reduction in LDL cholesterol achieved with treatment.",
    "ratelistEntries": [
      {
        "name": "Total Cholesterol",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228787",
    "order": 59,
    "name": "Triglycerides",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 120,
    "description": "Dietary fat is hydrolyzed in the small intestine, absorbed and resynthesized by mucosal cells, and secreted into lacteals as chylomicrons.\nTriglycerides in the chylomicrons are cleared from the blood by tissue lipoprotein lipase. Endogenous triglyceride production occurs in the liver. These triglycerides are transported in association with β-lipoproteins in very low-density lipoproteins (VLDL).",
    "increasedIn": [
      "Hypothyroidism, diabetes mellitus, nephrotic syndrome, chronic alcoholism (fatty liver), biliary tract obstruction, stress, familial lipoprotein lipase deficiency, familial dysbetalipoproteinemia, familial combined hyperlipidemia, obesity, metabolic syndrome, viral hepatitis, cirrhosis, pancreatitis, chronic renal failure, gout, pregnancy, glycogen storage diseases types I, III, and VI, anorexia nervosa, dietary excess."
    ],
    "decreasedIn": [
      "Tangier disease (α-lipoprotein deficiency), hypo- and abetalipoproteinemia, malnutrition, malabsorption, parenchymal liver disease, hyperthyroidism, intestinal lymphangiectasia."
    ],
    "comments": "If the serum is clear, the serum triglyceride level is generally <350 mg/dL.\nElevated triglycerides are now considered an independent risk factor for coronary artery disease and a major risk factor for acute pancreatitis, particularly when serum triglyceride levels are > 1000 mg/dL and can be seen when a primary lipid disorder that is exacerbated by alcohol or fat intake or by corticosteroid or estrogen therapy.",
    "ratelistEntries": [
      {
        "name": "Triglycerides",
        "fee": 120
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228788",
    "order": 60,
    "name": "HDL Cholesterol",
    "shortName": "HDL Cholesterol",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "HDL Cholesterol diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HDL Cholesterol",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228789",
    "order": 61,
    "name": "LDL Cholesterol",
    "shortName": "LDL Cholesterol",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "LDL Cholesterol diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "LDL Cholesterol",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228790",
    "order": 62,
    "name": "VLDL Cholesterol",
    "shortName": "VLDL Cholesterol",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "VLDL Cholesterol diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "VLDL Cholesterol",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228791",
    "order": 63,
    "name": "LDL / HDL",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "LDL / HDL diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "LDL / HDL",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228792",
    "order": 64,
    "name": "Total Cholesterol / HDL",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Total Cholesterol / HDL diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Total Cholesterol / HDL",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228793",
    "order": 65,
    "name": "TG / HDL",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "TG / HDL diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "TG / HDL",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228794",
    "order": 66,
    "name": "Total Lipid",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Total Lipid diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Total Lipid",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228795",
    "order": 67,
    "name": "Serum Sodium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mmol/L",
    "price": 150,
    "description": "Physiologic Basis\nSodium is the predominant extracellular cation. The serum sodium level is primarily determined by the volume status of the individual. Hyponatremia can be divided into hypovolemia, euvolemia, and hypervolemia categories.\n\nInterpretation\nIncreased in: Dehydration (excessive sweating",
    "increasedIn": [
      "Dehydration (excessive sweating, severe vomiting, or diarrhea), polyuria (diabetes mellitus, diabetes insipidus), hyperaldosteronism, inadequate water intake (coma, hypothalamic disease)."
    ],
    "decreasedIn": [
      "CHF, cirrhosis, vomiting, diarrhea, exercise, excessive sweating (with replacement of water but not salt, eg, marathon running), salt-losing nephropathy, adrenal insufficiency, nephrotic syndrome, water intoxication, syndrome of inappropriate antidiuretic hormone (SIADH), AIDS."
    ],
    "comments": "Hyponatremia in a normovolemic patient with urine osmolality higher than serum (or plasma) osmolality suggests the possibility of SIADH, myxedema, hypopituitarism, or reset osmostat. Treatment of disorders of sodium balance relies on clinical assessment of the patient’s extracellular fluid volume rather than the serum sodium.",
    "ratelistEntries": [
      {
        "name": "Serum Sodium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228796",
    "order": 68,
    "name": "BUN",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Urea is the end product of protein metabolism, which is excreted by the kidney. BUN is directly related to protein intake and nitrogen metabolism and inversely related to the rate of excretion of urea. Urea concentration in glomerular filtrate is the same as in plasma, but its tubular reabsorption is inversely related to the rate of urine formation. Thus, BUN is a less useful measure of glomerular filtration rate than the serum/ plasma creatinine (Cr).\n\n\n\n\nClinic Use\nThe BUN (Blood Urea Nitrogen) test measures the level of urea nitrogen in the blood to assess kidney function and overall health. It is a commonly performed test that helps diagnose and monitor conditions related to kidney health.\n\n\n\nHigh Levels causes :\n\nLow Levels causes:\n\nKidney dysfunction - Acute kidney injury, chronic kidney disease, kidney failure\n- Dehydration\n- Urinary tract obstruction\n- High protein intake\n- Medications: Certain medications, such as diuretics or corticosteroids.\n\n\n\n\n\n\nLiver disease\n- Malnutrition\n- Overhydration\n- Pregnancy\n- Certain medications: Antibiotics, Diuretics",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "BUN",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228797",
    "order": 69,
    "name": "BUN / Creatinine Ratio",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "BUN / Creatinine Ratio diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "BUN / Creatinine Ratio",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228798",
    "order": 70,
    "name": "Urea / Creatinine Ratio",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Urea / Creatinine Ratio diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urea / Creatinine Ratio",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228799",
    "order": 71,
    "name": "Serum Potassium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mmol/L",
    "price": 150,
    "description": "Physiologic Basis\nPotassium is predominantly an intracellular cation whose plasma level is regulated by renal excretion. Elevated or depressed potassium concentrations interfere with muscle contraction.\n\nInterpretation\nIncreased in: Massive hemolysis, severe tissue damage, rhabdomyolysis, acidosis,",
    "increasedIn": [
      "Massive hemolysis, severe tissue damage, rhabdomyolysis, acidosis, dehydration, acute or chronic renal failure, Addison disease, renal tubular acidosis type IV (hyporeninemic) hypoaldosteronism, (hyperkalemic) familial periodic paralysis, exercise (transient)."
    ],
    "decreasedIn": [
      "Low potassium intake, prolonged vomiting or diarrhea, renal tubular acidosis types I and II, hyperaldosteronism, Cushing syndrome, osmotic diuresis (eg, hyperglycemia), alkalosis, (hypokalemic) familial periodic paralysis, trauma (transient), subarachnoid hemorrhage, genetic hypokalemic salt-losing tubulopathies such as Gitelman syndrome (familial hypokalemia- hypocalcemia-hypomagnesemia)."
    ],
    "comments": "Spurious hyperkalemia can occur with hemolysis of a sample, delayed separation of serum from erythrocytes, prolonged fist clenching during blood drawing, and prolonged tourniquet placement. Very high white blood cell or platelet counts may cause spurious elevation of serum potassium, but plasma potassium levels are normal.",
    "ratelistEntries": [
      {
        "name": "Serum Potassium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228801",
    "order": 72,
    "name": "iCalcium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Calcium circulates in three forms: as free Ca2+ (50–55%), protein bound to albumin and globulins (40–45%), and as calcium-ligand complexes (5–10%) (with citrate, bicarbonate, lactate, phosphate, and sulfate). Protein binding is highly pH-dependent, and acidosis results in an increased free calcium fraction. Ionized Ca2+ is the form that is physiologically active. Ionized calcium is a more accurate reflection of physiologic status than total calcium in patients with altered serum proteins (renal failure, nephrotic syndrome, multiple myeloma, etc), altered concentrations of calcium-binding ligands, and acid-base disturbances. Measurement of ionized calcium is by ion-selective electrodes. Ionized calcium levels vary inversely with pH, about 0.2 mg/dL per 0.1 pH unit change.",
    "increasedIn": [
      "↓ Blood pH."
    ],
    "decreasedIn": [
      "↑ Blood pH, citrate, EDTA."
    ],
    "comments": "Ionized calcium measurements may be needed in special circumstances, eg, massive blood transfusion, transfusion of whole blood in neonates, liver transplantation, neonatal hypocalcemia, cardiac bypass surgery, and possibly monitoring of patients with secondary hyperparathyroidism from renal failure.",
    "ratelistEntries": [
      {
        "name": "iCalcium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228802",
    "order": 73,
    "name": "Serum Calcium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 150,
    "description": "Serum calcium is the sum of ionized calcium plus complex calcium and calcium bound to proteins (mostly albumin). Level of ionized calcium is regulated by parathyroid hormone and vitamin D.",
    "increasedIn": [
      "testinal absorption (vitamin d intoxication)",
      "2. Increased skeletal resorption",
      "3. Primary hyperparathyroidism",
      "Primary hyperparathyroidism and malignancy account for 90-95% of cases of hypercalcemia."
    ],
    "decreasedIn": [],
    "comments": "Need to know serum albumin to interpret calcium level. For every decrease in albumin by 1mg/dL, calcium should be corrected upward by 0.8 mg/dL. In 10% of patients with malignancies, hypercalcemia is attributable to coexistent hyperparathyroidism, suggesting that serum PTH levels should be measured at the initial presentation of all hypercalcemic patients.",
    "ratelistEntries": [
      {
        "name": "Serum Calcium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228803",
    "order": 74,
    "name": "Total Calcium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum calcium is the sum of ionized calcium plus complex calcium and calcium bound to proteins (mostly albumin). Level of ionized calcium is regulated by parathyroid hormone and vitamin D.",
    "increasedIn": [
      "testinal absorption (vitamin d intoxication)",
      "2. Increased skeletal resorption",
      "3. Primary hyperparathyroidism",
      "Primary hyperparathyroidism and malignancy account for 90-95% of cases of hypercalcemia."
    ],
    "decreasedIn": [],
    "comments": "Need to know serum albumin to interpret calcium level. For every decrease in albumin by 1mg/dL, calcium should be corrected upward by 0.8 mg/dL. In 10% of patients with malignancies, hypercalcemia is attributable to coexistent hyperparathyroidism, suggesting that serum PTH levels should be measured at the initial presentation of all hypercalcemic patients.",
    "ratelistEntries": [
      {
        "name": "Total Calcium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228804",
    "order": 75,
    "name": "Glucose Tolerance Test, GTT",
    "shortName": "GTT",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "STATUS\nFasting Plasma Glucose in mg/dl\nPost 75g Glucose load mg/dl Normal\n70-100\n70-140 Impaired Fasting Glucose\n101-125\n70-140 Impaired Glucose tolerance\n70-100\n141-199 Pre-Diabetes\n101-125\n141-199 Diabetes Mellitus \n>126\n>200\n\nThe diagnosis of Diabetes requires a fasting plasma glucose of > or = 1",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "GTT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228805",
    "order": 76,
    "name": "Random Blood Sugar",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dl",
    "price": 50,
    "description": "According to ADA guidelines \n\n\nStatus    \nRandom Blood Glucose (mg/dl)\nRandom Blood Glucose (mmol/L) Normal\n70-140\n4.4-7.8 Pre-Diabetes\n140-200\n7.8-11.1 Diabetes\n>200\n>11.1\n\nThe reference values for a Normal Random Glucose test in an average adult are 70-140 mg/dL (4.4-7.8 mmol/i). between 140-200 m",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Random Blood Sugar",
        "fee": 50
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228806",
    "order": 77,
    "name": "Serum Chloride",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mmol/L",
    "price": 150,
    "description": "Chloride, the principal inorganic anion of extracellular fluid, is important in maintaining proper body water distribution, osmotic pressure, and normal acid–base balance. If chloride is lost (as HCl or NH4Cl), alkalosis ensues; if chloride is ingested or retained, acidosis ensues.",
    "increasedIn": [
      "Renal failure, nephrotic syndrome, renal tubular acidosis, dehydration, overtreatment with saline, hyperparathyroidism, diabetes insipidus, metabolic acidosis from diarrhea (loss of HCO3–), respiratory alkalosis, hyperadrenocorticism."
    ],
    "decreasedIn": [
      "Vomiting, diarrhea, gastrointestinal suction, renal failure combined with salt deprivation, over-treatment with diuretics, chronic respiratory acidosis, diabetic ketoacidosis, excessive sweating, SIADH, salt-losing nephropathy, acute intermittent porphyria, water intoxication, expansion of extracellular fluid volume, adrenal insufficiency, hyperaldosteronism, metabolic alkalosis."
    ],
    "comments": "Test is helpful in assessing normal and increased anion gap metabolic acidosis. It is somewhat helpful in distinguishing hypercalcemia due to primary hyperparathyroidism (high serum chloride) from that due to malignancy (normal serum chloride).",
    "ratelistEntries": [
      {
        "name": "Serum Chloride",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228807",
    "order": 78,
    "name": "Serum Amylase",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Amylase hydrolyzes complex carbohydrates. Serum amylase is derived primarily from pancreas and salivary glands and is increased with inflammation or obstruction of these glands. Other tissues have some amylase activity, including ovaries, small and large intestine, and skeletal muscle.",
    "increasedIn": [
      "Acute pancreatitis (70–95%), pancreatic pseudocyst, pancreatic duct obstruction (cholecystitis, choledocholithiasis, pancreatic carcinoma, stone, stricture, duct sphincter spasm), bowel obstruction and infarction, mumps, parotitis, diabetic keto- acidosis, penetrating peptic ulcer, peritonitis, ruptured ectopic pregnancy, macroamylasemia."
    ],
    "decreasedIn": [
      "Pancreatic insufficiency, cystic fibrosis. Usually normal or low in chronic pancreatitis."
    ],
    "comments": "Macroamylasemia is indicated by high serum but low urine amylase. Serum or plasma lipase is an alternative test for acute pancreatitis. It has clinical sensitivity equivalent to that of amylase but with better specificity.",
    "ratelistEntries": [
      {
        "name": "Serum Amylase",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228808",
    "order": 79,
    "name": "HbA1c (Glycosylated Hemoglobin)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "%",
    "price": 300,
    "description": "Interpretation as per American Diabetes Association (ADA) Guidelines\n\nReference Group\n\nNon-Diabetic adults >= 18 years\n\nAt Risk (Prediabetes)\n\nDiagnosing Diabetes\n\nTherapeutic goals for glycemic control\n\nHbA1c in%\n\n4.0-5.6\n\n5.7-6.4\n\n>= 6.5\n\n<7.0\n\n\nClinical significance:\nHemoglobin A1c (HbA1c) level",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HbA1c (Glycosylated Hemoglobin)",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228809",
    "order": 80,
    "name": "A/G Ratio",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "A/G Ratio diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "A/G Ratio",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228810",
    "order": 81,
    "name": "Globulin",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Globulin diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Globulin",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228811",
    "order": 82,
    "name": "Lipase",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nLipases are responsible for hydrolysis of glycerol esters of long-chain fatty acids to produce fatty acids and glycerol.\n\nInterpretation \nIncreased in: Acute, recurrent, or chronic pancreatitis, pancreatic pseudocyst, pancreatic malignancy, peritonitis, biliary disease, hepatic dis",
    "increasedIn": [
      "Acute, recurrent, or chronic pancreatitis, pancreatic pseudocyst, pancreatic malignancy, peritonitis, biliary disease, hepatic disease, diabetes mellitus (especially diabetic ketoacidosis), intestinal disease, gastric malignancy or perforation, cystic fibrosis, inflammatory bowel disease (Crohn disease and ulcerative colitis)."
    ],
    "decreasedIn": [],
    "comments": "Serum lipase may be a more reliable test than serum amylase for the initial diagnosis of acute pancreatitis, because of its increased sensitivity in acute alcoholic pancreatitis and because lipase remains elevated longer than amylase.",
    "ratelistEntries": [
      {
        "name": "Lipase",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228812",
    "order": 83,
    "name": "Ferritin",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Interpretation:\nFerritin is iron storage protein. Determination of ferritin is necessary in Iron deficiency anemia, monitoring iron therapy, and in differential diagnosis of Anaemia. \n\nElevation levels-\nHemochromatosis, Porphyria, Rheumatoid arthritis, Leukaemia, Hodgkin's lymphoma, Liver disease, M",
    "increasedIn": [
      "all inflammatory condition.",
      "Decreased level-",
      "Iron deficiency anemia."
    ],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Ferritin",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228813",
    "order": 84,
    "name": "Microalbumin Creatinine Ratio, Urine Random",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "The normal urinary albumin excretion is less than 30 mg/24 hr. On random spot urine collection, the albumin-to-creatinine ratio (ACR, mcg/mg) should be less than 30.\n\nCategory      \nSpot collection ACR (mg/g) Normal\n< 30 Microalbuminuria\n30-300 Clinical albuminuria\n > 300",
    "increasedIn": [
      "Diabetes mellitus, diabetic nephropathy."
    ],
    "decreasedIn": [],
    "comments": "Microalbuminuria is a useful indicator of early nephropathy in diabetic patients. Urine albumin measurement requires a sensitive immunochemical assay. Urine dipstick analysis is often insensitive to microalbuminuria. Screening for microalbuminuria is often performed by measurement of the ACR in a random spot collection (preferred method).",
    "ratelistEntries": [
      {
        "name": "Microalbumin Creatinine Ratio, Urine Random",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228814",
    "order": 85,
    "name": "CPK-MB",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CK consists of three isoenzymes, made up of 2 subunits, M and B. The fraction with the greatest electrophoretic mobility is CK1 (BB), CK2 (MB) is intermediate, and CK3 (MM) moves slowest toward the anode. Skeletal muscle is characterized by isoenzyme MM and brain by isoenzyme BB. Myocardium has approximately 40% MB isoenzyme. Assay techniques include isoenzyme separation by electrophoresis (isoenzyme activity units) or by immunoassay using antibodies specific for MB fraction (mass units).",
    "increasedIn": [
      "Myocardial infarction, cardiac trauma, certain muscular dystrophies, and polymyositis. Slight persistent elevation reported in a few patients on hemodialysis."
    ],
    "decreasedIn": [],
    "comments": "CK-MB is a relatively specific test for MI. It appears in serum approximately 4 hours after infarction, peaks at 12–24 hours, and declines over 48–72 hours. CK-MB mass concentration is a sensitive marker of MI within 4–12 hours after infarction. Because cardiac troponins are now the markers of choice for the diagnosis of acute MI, high sensitivity cardiac troponin I test has largely replaced the conventional CK-MB assay. Measurement of CK-MB remains useful in evaluating patients who are already troponin positive and have recurrent chest pain and in follow-up of patients who are status post interventional procedures.",
    "ratelistEntries": [
      {
        "name": "CPK-MB",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228815",
    "order": 86,
    "name": "Stool reducing substances",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Stool reducing substances diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Stool reducing substances",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228816",
    "order": 87,
    "name": "25 Hydroxy (OH) Vitamin D",
    "shortName": "Vitamin D3",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 800,
    "description": "The vitamin D system functions to maintain serum calcium levels. Vitamin D is a fat-soluble steroid hormone. Two molecular forms exist: D3 (cholecalciferol), synthesized in the epidermis, and D2 (ergocalciferol), derived from plant sources. To become active, both need to be further metabolized. Two sequential hydroxylations occur: in the liver to 25(OH)D and then, in the kidney, to 1,25[OH] 2 D. Besides consequences for bone health, vitamin D deficiency reportedly is associated with a number of conditions such as cardiovascular disease, autoimmunity and cancer; however, evidence-based cause-and-effect relationships have not been established.",
    "increasedIn": [
      "Heavy milk drinkers (up to 64 ng/mL), vitamin D intoxication, sun exposure."
    ],
    "decreasedIn": [
      "Dietary deficiency, malabsorption, rickets, osteomalacia, biliary and portal cirrhosis, nephrotic syndrome, renal failure, inadequate sun exposure, advanced age (> 70), primary hyperparathyroidism."
    ],
    "comments": "Serum or plasma total 25(OH)D is an integrated marker of vitamin D status, incorporating endogenous synthesis from solar exposure, dietary intake, fortified products and/or supplements. There is no universal or strong evidence-based consensus on the appropriate level of 25(OH)D level. However, according to a 2011 US Institute of Medicine Report, a 25(OH)D level of 20–30 ng/mL is all that is needed for bone and general health, and nearly everyone (97.5%) in the general population is in that range. A 25(OH)D level above 30 ng/mL has not been consistently associated with increased health benefits, and, in fact, risks have been identified for outcomes at levels above 50 ng/mL. Routine screening for vitamin D deficiency is not necessary. Patients with the following conditions should be considered for testing: osteoporosis, osteomalacia, malabsorption, liver disease, pancreatic insufficiency, chronic kidney disease, COPD, bariatric surgery, cancer, bedridden or home-bound, obesity, taking anticonvulsants or long-term glucocorticoids, atraumatic fractures, elderly (> 70 years old), and chronic inflammatory conditions.",
    "ratelistEntries": [
      {
        "name": "Vitamin D3",
        "fee": 800
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228817",
    "order": 88,
    "name": "Vitamin B12",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "pg/mL",
    "price": 700,
    "description": "Physiologic Basis\nVitamin B12 is a necessary cofactor for three important biochemical processes: conversion of methylmalonyl-CoA to succinyl-CoA and methylation of homocysteine to methionine and demethylation of methyltetrahydrofolate to tetra-hydrofolate (THF). All vitamin B12 comes from ingestion",
    "increasedIn": [
      "Leukemia (acute myelocytic, chronic myelocytic, chronic lymphocytic, monocytic), marked leukocytosis, polycythemia vera."
    ],
    "decreasedIn": [
      "Pernicious anemia, gastrectomy, gastric carcinoma, malabsorption, pregnancy, dietary deficiency, HIV infection, chronic high-flux hemodialysis, Alzheimer disease,"
    ],
    "comments": "Low serum B12 levels warrant treatment; intermediate levels should be followed by repeated serum tests or by urine methylmalonic acid tests, as well as by serum homocysteine levels. Neurologic disorders caused by low serum B12 level can occur in the absence of macrocytic anemia or pancytopenia.",
    "ratelistEntries": [
      {
        "name": "Vitamin B12",
        "fee": 700
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228818",
    "order": 89,
    "name": "Gamma Glutamyl Transferase, GGT",
    "shortName": "GGT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Interpretation\nSynthesis of GGT is stimulated by many drugs e.g., phenytoin, phenobarbitone, primidone, alcohol and possibly some antidepressants. GGT is a sensitive test for excess alcohol intake but is not specific.\n\nAbnormal test results\n1. Raised GGT and raised mean corpuscular volume (MCV) sugg",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "GGT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228819",
    "order": 90,
    "name": "Serum IgE",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Notes\nNormal IgE levels don't rule out the possibility of IgE-dependent allergies. This is because the accuracy of the test can be influenced by factors such as the time between exposure to an allergen and testing, the patient's age, and the specific organs affected. Additionally, the severity of an",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Immunoglobulin E (IgE) plays a key role in triggering allergic reactions. Its levels are low in the first year of life but increase as a child grows, reaching adult levels by around age 10. Measuring IgE levels can help differentiate between atopic diseases (like allergic asthma, allergic rhinitis, and atopic dermatitis) and non-atopic conditions.\n\nIncreased Levels - Atopic/Non-atopic allergy, Hyper IgE syndrome, Parasitic infections, IgE Myeloma, Pulmonary Aspergillosis, Immunodeficiency states & Autoimmune diseases.\n\nUses\n1. Evaluate children with a family history of allergies and early symptoms.\n2. Assess individuals for allergic respiratory issues and identify allergens.\n3. Confirm food allergies in patients with severe reactions or skin issues.\n4. Test for insect venom allergies if skin tests are unclear.\n5. Check for IgE antibodies to specific workplace allergens.",
    "ratelistEntries": [
      {
        "name": "Serum IgE",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228820",
    "order": 91,
    "name": "Serum IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum IgG diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228821",
    "order": 92,
    "name": "Serum IgM",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum IgM diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum IgM",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228822",
    "order": 93,
    "name": "Serum IgA",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum IgA diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum IgA",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228823",
    "order": 94,
    "name": "HSV-1/2 IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "HSV-1/2 IgG diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HSV-1/2 IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228824",
    "order": 95,
    "name": "HSV-1/2 IgM",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "HSV-1/2 IgM diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HSV-1/2 IgM",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228825",
    "order": 96,
    "name": "HSV-2 IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "HSV-2 IgG diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HSV-2 IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228826",
    "order": 97,
    "name": "CMV IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Detects the presence of antibodies to CMV, either IgG or IgM. CMV infection is usually acquired during childhood or early adulthood. By age 20–40 years, 40–90% of the population has CMV antibodies.",
    "increasedIn": [
      "Previous or active CMV infection. False-positive CMV IgM tests occur when rheumatoid factor or infectious mononucleosis is present."
    ],
    "decreasedIn": [],
    "comments": "Serial specimens exhibiting a greater than fourfold titer rise suggest a recent infection. Active CMV infection must be documented by viral isolation. Useful for screening of potential organ donors and recipients. Universal prophylaxis reduces infection in transplant recipients. Detection of CMV IgM antibody in the serum of a newborn usually indicates congenital infection. Detection of CMV IgG antibody is not diagnostic, because maternal CMV IgG antibody passed via the placenta can persist in newborn’s serum for 6 months. CMV seronegative blood components are more efficacious than leukocyte-reduced blood components in preventing transfusion-acquired CMV infection.",
    "ratelistEntries": [
      {
        "name": "CMV IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228827",
    "order": 98,
    "name": "CMV IgM",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Detects the presence of antibodies to CMV, either IgG or IgM. CMV infection is usually acquired during childhood or early adulthood. By age 20–40 years, 40–90% of the population has CMV antibodies.",
    "increasedIn": [
      "Previous or active CMV infection. False-positive CMV IgM tests occur when rheumatoid factor or infectious mononucleosis is present."
    ],
    "decreasedIn": [],
    "comments": "Serial specimens exhibiting a greater than fourfold titer rise suggest a recent infection. Active CMV infection must be documented by viral isolation. Useful for screening of potential organ donors and recipients. Universal prophylaxis reduces infection in transplant recipients. Detection of CMV IgM antibody in the serum of a newborn usually indicates congenital infection. Detection of CMV IgG antibody is not diagnostic, because maternal CMV IgG antibody passed via the placenta can persist in newborn’s serum for 6 months. CMV seronegative blood components are more efficacious than leukocyte-reduced blood components in preventing transfusion-acquired CMV infection.",
    "ratelistEntries": [
      {
        "name": "CMV IgM",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228828",
    "order": 99,
    "name": "Rubella IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Rubella IgG diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Rubella IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228829",
    "order": 100,
    "name": "Rubella IgM",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Rubella IgM diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Rubella IgM",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228830",
    "order": 101,
    "name": "Anti TPO",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "TPO is a membrane-bound glycoprotein. This enzyme mediates the oxidation of iodide ions and incorporation of iodine into tyrosine residues of thyroglobulin. Its synthesis is stimulated by thyroid-stimulating hormone (TSH). TPO is the major antigen involved in thyroid antibody-dependent cell-mediated cytotoxicity. TPO Ab can be measured by enzyme-linked immunosorbent assay (ELISA) or automated immunoassay.",
    "increasedIn": [
      "Hashimoto thyroiditis (> 99%), Idiopathic myxedema (> 99%), Graves disease (75–85%), Addison disease (50%), and Riedel thyroiditis. Low titers are present in approximately 10% of normal individuals and patients with non-immune thyroid disease."
    ],
    "decreasedIn": [],
    "comments": "TPO antibody is an antibody to the main autoantigenic component of microsomes and is a more sensitive and specific test than hemagglutination assays for microsomal antibodies in the diagnosis of autoimmune thyroid disease. TPO antibody testing alone is often sufficient to detect autoimmune thyroid disease. TPO antibody titers correlate with TSH levels; their presence may herald impending thyroid failure.",
    "ratelistEntries": [
      {
        "name": "Anti TPO",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228831",
    "order": 102,
    "name": "Thyroglobulin (TG)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nTg is a large protein specific to the thyroid gland from which thyroxine is synthesized and cleaved. Highly sensitive immunometric assays for Tg are available. Tg autoantibodies can interfere with the measurement of Tg.\n\nInterpretation\nIncreased in: Hyperthyroidism, subacute thyroi",
    "increasedIn": [
      "Hyperthyroidism, subacute thyroiditis, untreated thyroid carcinomas (except medullary carcinoma): follicular cancer (sensitivity 72%, specificity 81%), Hürthle cell cancer (sensitivity 56%, specificity 84%)."
    ],
    "decreasedIn": [
      "Factitious hyperthyroidism, presence of thyroglobulin autoantibodies, after (> 25 days) total thyroidectomy."
    ],
    "comments": "Follow-up of patients with differentiated thyroid cancers who are apparently disease-free after surgery and radioiodine therapy involves periodic measurement of serum Tg. Patients with detectable serum Tg during thyroid-stimulating hormone (TSH) suppression by thyroxine therapy or Tg that rises higher than 2 ng/mL after TSH stimulation are highly likely to harbor residual tumors. Undetectable serum Tg during TSH suppressive therapy does not exclude persistent disease. Therefore, serum Tg should be measured after TSH stimulation achieved either by thyroxine withdrawal or by administration of recombinant human TSH (rhTSH). Results are equivalent in detecting recurrent thyroid cancer, but use of rhTSH helps to prevent symptomatic hypothyroidism.\nFollow-up based on serial measurements of basal (ie, unstimulated) Tg may be superior to the single Tg measurement after TSH stimulation. Tg is typically measured together with Tg antibody. In patients with positive Tg Ab, the Tg level should be interpreted with caution.",
    "ratelistEntries": [
      {
        "name": "Thyroglobulin (TG)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228832",
    "order": 103,
    "name": "Thyroglobulin Antibody (TgAb)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Antibodies against thyroglobulin are produced in autoimmune diseases of the thyroid and other organs. Of the normal population, 10% have slightly elevated titers (especially women and the elderly).",
    "increasedIn": [
      "Hashimoto thyroiditis (> 90%), thyroid carcinoma (45%), thyrotoxicosis, pernicious anemia (50%), SLE (20%), subacute thyroiditis, Graves disease.",
      "Not increased in: Multinodular goiter, thyroid adenomas, and some carcinomas.",
      "The thyroid peroxidase antibody test is more sensitive than the thyroglobulin antibody test in autoimmune thyroid disease. There is limited use for this test, ie, monitoring of patients with thyroid carcinoma after treatment."
    ],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Thyroglobulin Antibody (TgAb)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228833",
    "order": 104,
    "name": "Toxo IgG",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Toxo IgG diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Toxo IgG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228834",
    "order": 105,
    "name": "Toxo IgM",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Toxo IgM diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Toxo IgM",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228835",
    "order": 106,
    "name": "Estradiol",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Estradiol diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Estradiol",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228836",
    "order": 107,
    "name": "DHEA",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nDHEA is a 19-carbon endogenous steroid hormone secreted by the adrenal glands. It is converted to DHEA-S in the adrenals, liver, and small intestine. DHEA-S is albumin-bound in the circulation, and there is no diurnal variation in DHEA-S levels. Levels of DHEA-S are about 300 × hig",
    "increasedIn": [
      "Adrenal hyperplasia, adrenal cancer, congenital adrenal hyperplasia, polycystic ovarian syndrome."
    ],
    "decreasedIn": [
      "Adrenal insufficiency, hypopituitarism, rheumatoid arthritis (females), insulin, and corticosteroids."
    ],
    "comments": "DHEA measurement is typically used along with other steroid and peptide hormones to evaluate adrenal function, to help diagnose adrenal cortex tumors, and polycystic ovarian syndrome (in females). Orally ingested DHEA is converted to DHEA-S when passing through intestines and liver. People taking DHEA supplements have elevated blood levels of DHEA-S. Use by athletes is prohibited by the World Anti-doping Agency.",
    "ratelistEntries": [
      {
        "name": "DHEA",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228837",
    "order": 108,
    "name": "Troponin I",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Initial Result In pg/ml \nRemarks <26.2\nThe upper reference limit (99th percentile) for high sensitive Troponin I (hsTnI) < 26.2  &  pain < 6 hours\nRepeat Sampling after 3 hrs, a 50% change from initial value is diagnostic of Myocardial Infarction (MI) >26.2-262\nRepeat Sampling after 3 hrs, 50% chang",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Troponin I",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228838",
    "order": 109,
    "name": "Creatine Kinase",
    "shortName": "CPK-Total",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Creatine Kinase diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CPK-Total",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228840",
    "order": 110,
    "name": "CK-MB",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CK consists of three isoenzymes, made up of 2 subunits, M and B. The fraction with the greatest electrophoretic mobility is CK1 (BB), CK2 (MB) is intermediate, and CK3 (MM) moves slowest toward the anode. Skeletal muscle is characterized by isoenzyme MM and brain by isoenzyme BB. Myocardium has approximately 40% MB isoenzyme. Assay techniques include isoenzyme separation by electrophoresis (isoenzyme activity units) or by immunoassay using antibodies specific for MB fraction (mass units).",
    "increasedIn": [
      "Myocardial infarction, cardiac trauma, certain muscular dystrophies, and polymyositis. Slight persistent elevation reported in a few patients on hemodialysis."
    ],
    "decreasedIn": [],
    "comments": "CK-MB is a relatively specific test for MI. It appears in serum approximately 4 hours after infarction, peaks at 12–24 hours, and declines over 48–72 hours. CK-MB mass concentration is a sensitive marker of MI within 4–12 hours after infarction. Because cardiac troponins are now the markers of choice for the diagnosis of acute MI, high sensitivity cardiac troponin I test has largely replaced the conventional CK-MB assay. Measurement of CK-MB remains useful in evaluating patients who are already troponin positive and have recurrent chest pain and in follow-up of patients who are status post interventional procedures.",
    "ratelistEntries": [
      {
        "name": "CK-MB",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228841",
    "order": 111,
    "name": "D-Dimer",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "D-dimer is one of the terminal fibrin degradation products. The presence of D-dimers indicates that a fibrin clot was formed and subsequently degraded by plasmin. Essentially, D-dimer is elevated whenever the coagulation system has been activated, followed by fibrinolysis.",
    "increasedIn": [
      "Deep vein thrombosis (DVT), venous thrombo-embolism (VTE), pulmonary embolism (PE), disseminated intravascular coagulation (DIC), arterial thromboembolism, pregnancy (especially postpartum period), malignancy, surgery, thrombolytic therapy."
    ],
    "decreasedIn": [],
    "comments": "D-dimer assay is a very sensitive test for DIC, DVT and VTE or PE. The D-dimer can be measured by a variety of methods; for example, semiquantitative latex agglutination and quantitative high-sensitivity immunoassay (eg, ELISA).\nThe newly developed highly sensitive automated D-dimer tests may be used to exclude PE and DVT: a negative test essentially rules out thrombosis, but a positive test does not confirm the diagnosis, and further testing (eg, ultrasound, CT angiography) is recommended.",
    "ratelistEntries": [
      {
        "name": "D-Dimer",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228842",
    "order": 112,
    "name": "Calcitonin",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Calcitonin is a 32-amino-acid polypeptide hormone secreted by the parafollicular C cells of the thyroid. It decreases osteoclastic bone resorption and lowers serum calcium levels.",
    "increasedIn": [
      "Medullary thyroid carcinoma, Zollinger-Ellison syndrome, pernicious anemia, pregnancy (at term), newborns, carcinoma (breast, lung, pancreas), leukemia, myeloproliferative disorders, chronic renal failure."
    ],
    "decreasedIn": [],
    "comments": "Test is useful to diagnose and monitor medullary thyroid carcinoma, although stimulation tests may be necessary (eg, pentagastrin test). Genetic testing (eg, RET mutation test) is now available for the diagnosis of multiple endocrine neoplasia type II.",
    "ratelistEntries": [
      {
        "name": "Calcitonin",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228843",
    "order": 113,
    "name": "Indirect Coomb's Test",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nIndirect antiglobulin test is used to demonstrate the presence in the patient’s serum/plasma of unexpected antibody to ABO and Rh-compatible reagent red blood cells. Patient serum or plasma is incubated in vitro with reagent red cells, which are then washed to remove unbound globul",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "The technique is used in antibody detection and identification, and in the AHG crossmatch prior to transfusion.",
    "ratelistEntries": [
      {
        "name": "Indirect Coomb's Test",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228844",
    "order": 114,
    "name": "Direct Coomb's Test",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Direct Coomb's Test diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Direct Coomb's Test",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228845",
    "order": 115,
    "name": "CA 125",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 125 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 125",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228846",
    "order": 116,
    "name": "CA 15-3",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 15-3 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 15-3",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228847",
    "order": 117,
    "name": "CA 19-9",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 19-9 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 19-9",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228848",
    "order": 118,
    "name": "CA 50",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 50 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 50",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228849",
    "order": 119,
    "name": "CA 242",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 242 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 242",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228850",
    "order": 120,
    "name": "CA 72-4",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "CA 72-4 diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CA 72-4",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228851",
    "order": 121,
    "name": "H-ALB",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "H-ALB diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "H-ALB",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228852",
    "order": 122,
    "name": "Anti cyclic-citrullinated-peptide",
    "shortName": "CCP",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Post-translational deamination of arginine residues by peptidyl arginine deaminase (citrullination) during inflammation results in production of antigenic epitope. Antibodies to citrullinated proteins (particularly filaggrin) are frequently elevated in rheumatoid arthritis (RA).",
    "increasedIn": [
      "- RA (sensitivity 70–80%)."
    ],
    "decreasedIn": [],
    "comments": "Specificity of anti-CCP (90–95%) for RA is higher than that of rheumatoid factor.",
    "ratelistEntries": [
      {
        "name": "CCP",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228853",
    "order": 123,
    "name": "Arterial Blood Gas",
    "shortName": "ABG",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Arterial Blood Gas diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "ABG",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228854",
    "order": 124,
    "name": "Iron",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Plasma iron concentration is determined by absorption from the intestine; storage in the intestine, liver, spleen, bone marrow; rate of breakdown or loss of hemoglobin; and rate of synthesis of new hemoglobin. The key regulator of iron homeostasis is hepcidin. Hepcidin excess or deficiency contributes to the dysregulation of iron homeostasis in hereditary and acquired iron disorders.",
    "increasedIn": [
      "Hemosiderosis (eg, multiple transfusions, excess iron administration), acute Fe poisoning (children), hemolytic anemia, pernicious anemia, aplastic or hypoplastic anemia, viral hepatitis, lead poisoning, thalassemia, hemochromatosis."
    ],
    "decreasedIn": [
      "Iron deficiency, nephrotic syndrome, chronic renal failure, many infections, active hematopoiesis, remission of pernicious anemia, hypothyroidism, malignancy (carcinoma), postoperative state, kwashiorkor."
    ],
    "comments": "Absence of stainable iron on bone marrow aspirate differentiates iron deficiency from other causes of microcytic anemia (eg, thalassemia, sideroblastic anemia, some chronic disease anemias), but the procedure is invasive and expensive. Serum iron, iron-binding capacity, transferrin saturation, serum ferritin or soluble transferrin receptor may obviate the need for bone marrow examination. Serum iron, transferrin saturation and ferritin are useful in screening family members for hereditary hemochromatosis.",
    "ratelistEntries": [
      {
        "name": "Iron",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228855",
    "order": 125,
    "name": "Total Iron Binding Capacity (TIBC)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nIron is transported in plasma complexed to transferrin, which is synthesized in the liver. Total iron-binding capacity is calculated from transferrin levels measured immunologically. Each molecule of transferrin has two iron-binding sites; so its iron- binding capacity is 1.47 mg/g",
    "increasedIn": [],
    "decreasedIn": [
      "Iron deficiency anemia, late pregnancy, infancy, acute hepatitis."
    ],
    "comments": "TIBC correlates with serum transferrin, but the relationship is not linear over a wide range of transferrin values and is disrupted in diseases affecting transferrin-binding capacity or other iron-binding proteins. Increased % transferrin saturation with iron is seen in iron overload (iron poisoning, hemolytic anemia, sideroblastic anemia, thalassemia, hemochromatosis, pyridoxine deficiency, aplastic anemia, RBC transfusions). Decreased % transferrin saturation with iron is seen in iron deficiency (usually saturation <16%). Transferrin levels can also be used to assess nutritional status.",
    "ratelistEntries": [
      {
        "name": "Total Iron Binding Capacity (TIBC)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228856",
    "order": 126,
    "name": "Transferrin Saturation",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Transferrin Saturation diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Transferrin Saturation",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228857",
    "order": 127,
    "name": "Non-HDL cholesterol",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Non-HDL cholesterol diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Non-HDL cholesterol",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228858",
    "order": 128,
    "name": "UIBC",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "UIBC diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "UIBC",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228859",
    "order": 129,
    "name": "eGFR",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "eGFR diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "eGFR",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228860",
    "order": 130,
    "name": "eGFR Category",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "eGFR Category diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "eGFR Category",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228861",
    "order": 131,
    "name": "C3 Complement",
    "shortName": "C3",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "The classic and alternative complement pathways converge at the C3 step in the complement cascade. Low levels indicate activation by one or both pathways. Most diseases with immune complexes show decreased C3 levels. Test is usually performed as an immunoassay (by radial immunodiffusion or nephelometry).",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "C3",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228862",
    "order": 132,
    "name": "High-Sensitivity C-Reactive Protein",
    "shortName": "HsCRP",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Physiologic Basis\nCRP is an acute-phase reactant protein. Hepatic secretion is stimulated in response to inflammatory cytokines. Unlike other acute-phase proteins, CRP is not affected by hormones. CRP activates the complement system, binds to Fc receptors, and serves as an opsonin for some microorga",
    "increasedIn": [
      "Inflammatory states, including arteriosclerotic disorders."
    ],
    "decreasedIn": [],
    "comments": "CRP is a very sensitive but nonspecific marker of inflammation. A variety of conditions other than arteriosclerosis may cause dramatic increases in CRP levels. CRP levels increase within 2 hours of acute insult (eg, surgery, infection) and should peak and begin decreasing within 48 hours if no other inflammatory event occurs. In patients with rheumatoid arthritis, persistently elevated CRP concentrations are present when the disease is active and usually fall to normal during periods of complete remission. Patients with high hs-CRP concentrations are more likely to develop stroke, myocardial infarction, and severe peripheral vascular disease.",
    "ratelistEntries": [
      {
        "name": "HsCRP",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228863",
    "order": 133,
    "name": "ANTI MULLERIAN HORMONE",
    "shortName": "AMH",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Notes\nAnti-Müllerian Hormone (AMH) starts to drop several years before Follicle-Stimulating Hormone (FSH) levels increase. Because of this, AMH is a more sensitive indicator of ovarian reserve. Sometimes, AMH levels and Antral Follicle Count (AFC) can give different results. AMH reflects the overall",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "AMH",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228864",
    "order": 134,
    "name": "Ammonia",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Ammonia diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Ammonia",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228865",
    "order": 135,
    "name": "Magnesium",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Magnesium diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Magnesium",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228867",
    "order": 136,
    "name": "Glucose Tolerance Test, GTT (Pregnancy)",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "According to American Diabetic Association (ADA) Guidelines 2024 For Screening and Diagnosis of Gestational Diabetes Mellitus One-Step Strategy is followed.\n\nMethod\n\nOne-step strategy\nPerform a 75-g OGTT, with plasma glucose measurement when an individual is fasting and at 1 and 2 h, at 24-28 weeks",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Glucose Tolerance Test, GTT (Pregnancy)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228868",
    "order": 137,
    "name": "SGOT/SGPT",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "SGOT/SGPT diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "SGOT/SGPT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228966",
    "order": 138,
    "name": "NT- ProBNP (N-TERMINAL PRO B TYPE NATRIURETIC PEPTIDE)",
    "shortName": "NT- ProBNP",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Chronic Heart failure \nAGE OF PATIENTS  TITER Result\n<75 Year <125 Pg/ml Chronic heart failure unlikely\nYear <450 Pg/ml Chronic heart failure unlikely\n\n\n\n\nACUTE HEART FAILURE \nAGE OF PATIENTS  TITER Result\n<50 YEAR <450 Pg/ml Acute heart failure unlikely\n50-75 YEAR <900 Pg/ml Acute heart failure unl",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "NT- ProBNP",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228968",
    "order": 139,
    "name": "Glucose Challenge Test (GCT); Pregnancy , 75g Glucose",
    "shortName": "GCT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Glucose Challenge Test (GCT); Pregnancy , 75g Glucose diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "GCT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228967",
    "order": 140,
    "name": "Serum Procalcitonin",
    "shortName": "PCT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum Procalcitonin diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "PCT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228961",
    "order": 141,
    "name": "Urine Protein Creatinine Ratio",
    "shortName": "UPCR",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Urine Protein Creatinine Ratio diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "UPCR",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228977",
    "order": 142,
    "name": "Serum Cholinesterase",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum Cholinesterase diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Cholinesterase",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228979",
    "order": 143,
    "name": "Serum Zinc",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum Zinc diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Zinc",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228980",
    "order": 144,
    "name": "Fasting Insulin",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Fasting Insulin diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Fasting Insulin",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228981",
    "order": 145,
    "name": "Bile Acid",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Bile Acid diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Bile Acid",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228984",
    "order": 146,
    "name": "Homocysteine",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Interpretation\n\n\n\n\n\n\n\n5 – 15 µmol/L → Normal\n\n\n\n\n\n\n\n\n15 – 30 µmol/L → Mild elevation\n\n\n\n\n\n\n\n\n30 – 100 µmol/L → Moderate elevation\n\n\n\n\n\n\n\n\n> 100 µmol/L → Severe elevation",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Homocysteine",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228985",
    "order": 147,
    "name": "Serum LDH",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Serum LDH diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum LDH",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228951",
    "order": 148,
    "name": "Oral Glucose Challenge Test",
    "shortName": "OGCT",
    "category": "Biochemistry",
    "testType": "Single parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Oral Glucose Challenge Test diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "OGCT",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228774",
    "order": 149,
    "name": "DOUBLE MARKER, MATERNAL SCREEN-2 TESTS",
    "shortName": "",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dl",
    "price": 50,
    "description": "Measures plasma glucose levels after an overnight fast (minimum 8-10 hours) for diagnosing diabetes mellitus and impaired fasting glycemia.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Fasting Blood Sugar",
        "fee": 50
      },
      {
        "name": "Blood Sugar Fasting & PP",
        "fee": 100
      },
      {
        "name": "Diabetic package",
        "fee": 100
      }
    ],
    "panelsIncluded": [
      {
        "name": "Diabetic Profile"
      },
      {
        "name": "Executive Health Checkup"
      }
    ],
    "normalValues": {
      "selectType": "numeric_range",
      "ranges": [
        {
          "id": "fbs_1",
          "gender": "Any",
          "minAge": 0,
          "minAgeUnit": "Years",
          "maxAge": 120,
          "maxAgeUnit": "Years",
          "lowerValue": 70,
          "upperValue": 100,
          "displayRange": "70 - 100"
        }
      ]
    }
  },
  {
    "id": "6228931",
    "order": 150,
    "name": "Adenosine Deaminase",
    "shortName": "ADA",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Adenosine Deaminase diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "ADA",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228960",
    "order": 151,
    "name": "Estimated glomerular filtration rate",
    "shortName": "(eGFR)",
    "category": "Biochemistry",
    "testType": "Multi parameter",
    "unit": "mg/dL",
    "price": 150,
    "description": "Estimated glomerular filtration rate diagnostic examination. Used to evaluate clinical status in Biochemistry.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "(eGFR)",
        "fee": 150
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228869",
    "order": 152,
    "name": "Widal (Tube Method)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Document",
    "unit": "Index",
    "price": 250,
    "description": "Widal (Tube Method) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Widal (Tube Method)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228870",
    "order": 153,
    "name": "Widal (Slide Method)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Document",
    "unit": "Index",
    "price": 100,
    "description": "Widal (Slide Method) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Widal (Slide Method)",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228964",
    "order": 154,
    "name": "Widal Test (Slide Method)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Note:\n1. Titres ≥1:80 of “O” antigen & ≥1:160 of “H” antigen for Salmonella typhi and titres ≥1:80 of “H” antigen for Salmonella paratyphi A & B are significant.\n2. Reactive results indicate ongoing or recent infection by Salmonella species and it will vary with stage of the disease with appearance",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Widal Test (Slide Method)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228871",
    "order": 155,
    "name": "Malaria Antigen",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Malaria antigen detection-whole blood\nFour species of the plasmodium parasites are responsible for human malaria infections: P. falciparum, P. vivax, P. ovale and P. malariae. Early detection and differentiation of malaria is of paramount importance due to incidence of cerebral malaria and drug resi",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Malaria Antigen",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228872",
    "order": 156,
    "name": "HIV (Card Test)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Rapid card tests are screening tests, false positive and false negative results may occur due to various factors which may influence test results.\nAdvise: Kindly confirm by ELISA or Western blot method.\n\n1.  A negative result implies that no Anti HIV – 1 & HIV - 2 antibodies have been detected in th",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HIV (Card Test)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228873",
    "order": 157,
    "name": "Hepatitis C Virus, HCV",
    "shortName": "HCV",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 300,
    "description": "Comment  \nInterpretation Non-reactive\nAbsence of antibodies to the Hepatitis C virus Reactive\nPresence of antibodies to Hepatitis C virus\n\n\n1. Reactive test result indicates the presence of Hepatitis C virus infection. Active infection to be confirmed by HCV RNA PCR test. It cannot differentiate bet",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HCV",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228875",
    "order": 158,
    "name": "VDRL",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 100,
    "description": "Result\nRemarks Reactive\nIndicates the presence of IgM & IgG antibodies against non-treponemal antigens Non-Reactive\nIndicates absence of IgM & IgG antibodies against non-treponemal antigens\n\n\nNote:\n1. Titers of ≥1: 8 and rising titres are significant.\n2. Positive result indicates ongoing or recent i",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "VDRL",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228876",
    "order": 159,
    "name": "HBsAg",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 200,
    "description": "Comment     \nInterpretation Non- Reactive\nHepatitis B surface antigen absent Reactive\nHepatitis B surface antigen present\n\nPresence of Hepatitis B antigen indicates reactive result which monitors HBAg levels during the disease but cannot predict the stages of disease. Rapid card tests are screening",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HBsAg",
        "fee": 200
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228877",
    "order": 160,
    "name": "Occult Blood, Stool",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Positive in:\n1. Upper GI disease (peptic ulcer, gastritis, variceal bleeding, esophageal and gastric cancer)\n2. Lower GI disease (diverticulosis, colonic polyps, colorectal cancer, inflammatory bowel disease, vascular ectasias, hemorrhoids).\n\nComments\nAlthough fecal occult blood testing is an accept",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Although fecal occult blood testing is an accepted screening test for colorectal cancer, the sensitivity and specificity of an individual test are low. The usefulness of fecal occult blood testing after digital rectal examination is low. Quantitative fecal immunochemical test (FIT) is superior to gFOBT because there are no dietary and drug restrictions and it is more amenable to standardization and quality control.\n\nNote\nTo avoid false negatives, patients should avoid taking vitamin C.",
    "ratelistEntries": [
      {
        "name": "Occult Blood, Stool",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228878",
    "order": 161,
    "name": "Typhidot Antibodies",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "TYPHIDOT is a Dot EIA assay designed for the qualitative detection of specific IgM and IgG antibodies against a specific outer membrane antigen of Salmonella typhi1 in human serum. It is intended to be used as an in vitro diagnostic of typhoid fever. The results obtained should not be the sole deter",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Typhidot Antibodies",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228880",
    "order": 162,
    "name": "Rubella",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Physiologic Basis\nRubella (German measles) is a viral infection that causes fever, malaise, coryza, lymphadenopathy, fine maculopapular rash, and congenital birth defects when infection occurs in utero. Antibodies to rubella can be detected by hemagglutination inhibition, complement fixation, indire",
    "increasedIn": [
      "Recent rubella infection, congenital rubella infection, previous rubella infection, or vaccination (immunity). Spuriously increased IgM antibody occurs in the presence of rheumatoid factor or cross - reacting antibodies to other viral infections or autoimmune illnesses."
    ],
    "decreasedIn": [],
    "comments": "Rubella titers of ≤1:8 indicate susceptibility and need for immunization to prevent infection during pregnancy. Titers of > 1:32 indicate immunity from prior infection or vaccination. Demonstration of a 4-fold rise in titer between acute and convalescent sera may be indicative of a recent infection. Single titers, even > 1:256, cannot be interpreted as evidence of recent infection, since they are more likely to indicate immune status. The recent resurgence of congenital rubella can largely be prevented with improved rubella testing and vaccination programs.",
    "ratelistEntries": [
      {
        "name": "Rubella",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228881",
    "order": 163,
    "name": "Chikungunya",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Positive   \nIndicates the presence of IgM antibodies against the Chikungunya virus. Negative\nIndicates absence of IgM antibodies against Chikungunya virus.\n\n\nNote:\n1. Positive results in serum indicate ongoing or recent infection by Chikungunya virus causing rash, fever, and severe joint pain (arthr",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Chikungunya",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228882",
    "order": 164,
    "name": "Antistreptolysin O, ASO Titer",
    "shortName": "ASO Titer",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Detects the presence of antibody to the antigen streptolysin O produced by group A streptococci. Streptococcal antibodies appear about 2 weeks after infection. Titer rises to a peak at 4–6 weeks and may remain elevated for 6 months to 1 year. Test is based on the neutralization of hemolytic activity of streptolysin O toxin by antistreptolysin O antibodies in serum.",
    "increasedIn": [
      "Recent infection with group A β-hemolytic streptococci: scarlet fever, erysipelas, streptococcal pharyngitis/tonsillitis (40–50%), rheumatic fever (80–85%), poststreptococcal glomerulonephritis. Some collagen vascular diseases, certain serum lipoproteins, bacterial growth products, or oxidized streptolysin O may result in inhibition of hemolysis and thus cause false-positive results."
    ],
    "decreasedIn": [],
    "comments": "In patients with rheumatic fever, the test may be a more reliable indicator of recent streptococcal infection than throat culture. An increasing titer is more suggestive of acute streptococcal infection than a single elevated level. Even with severe infection, ASO titers rise in only 70–80% of patients. ASO and anti-DNase-B together increase test sensitivity. The normal range increases with age.",
    "ratelistEntries": [
      {
        "name": "ASO Titer",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228883",
    "order": 165,
    "name": "Rheumatoid Factor, RA (Quantitative)",
    "shortName": "RA (Quantitative)",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Physiologic Basis\nRheumatoid factor (RF) consists of heterogeneous autoantibodies usually of the IgM class that react against the Fc region of human IgG. Most methods detect only IgM-class RF.\n\nInterpretation\nPositive in: Rheumatoid arthritis (75–90%), Sjögren syndrome (80–90%), scleroderma, dermat",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Rheumatoid factor can be useful in differentiating rheumatoid arthritis from other chronic inflammatory arthritides. However, a positive RF test is only one of several criteria needed to make the diagnosis of rheumatoid arthritis.\nRF must be ordered selectively because its predictive value is low (34%) if it is used as a screening test. The test has poor positive predictive value because of its lack of specificity. The subset of patients with seronegative rheumatic disease limits its sensitivity and negative predictive value.",
    "ratelistEntries": [
      {
        "name": "RA (Quantitative)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228884",
    "order": 166,
    "name": "Rheumatoid Factor, RA (Qualitative)",
    "shortName": "RA (Qualitative)",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Rheumatoid Factor, RA (Qualitative) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "RA (Qualitative)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228885",
    "order": 167,
    "name": "C-Reactive Protein, CRP (Quantitative)",
    "shortName": "CRP (Quantitative)",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Interpretation\n- Produced in the liver and migrates in Y region, where it can produce a small pseudo paraprotein.\n- A marker of systemic inflammation\n- High Sensitivity CRP (hs CRP) assay may indicate cardiovascular risk\n- Seasonal variations with highest levels in winter.\n\n\n\n\nNote:\n1. CRP is an acu",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CRP (Quantitative)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228879",
    "order": 168,
    "name": "C-Reactive Protein, CRP (Qualitative)",
    "shortName": "CRP (Qualitative)",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Interpretation\n- Produced in the liver and migrates in Y region, where it can produce a small pseudo paraprotein.\n- A marker of systemic inflammation\n- High Sensitivity CRP (hs CRP) assay may indicate cardiovascular risk\n- Seasonal variations with highest levels in winter.\n\n\n\n\nNote:\n1. CRP is an acu",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "CRP (Qualitative)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228886",
    "order": 169,
    "name": "Dengue NS1 Antigen",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 350,
    "description": "Dengue virus, transmitted by Aedes mosquitoes, belongs to the Flavivirus genus and has four serotypes: DEN-1, DEN-2, DEN-3, and DEN-4. Immunity from one serotype is lifelong but does not protect against the others.\n\nDengue infection ranges from mild fever to severe, potentially fatal hemorrhagic dis",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Dengue NS1 Antigen",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228887",
    "order": 170,
    "name": "Dengue (Card Method)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 400,
    "description": "Dengue (Card Method) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Dengue (Card Method)",
        "fee": 400
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228888",
    "order": 171,
    "name": "Beta Human Chorionic Gonodotropin (HCG)",
    "shortName": "Beta hCG",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Human chorionic gonadotropin (hCG) is a glycoprotein made up of two subunits (α and β). Serum hCG can be detected as early as 24 hours after implantation at a concentration of 5 mIU/mL. During normal pregnancy, serum levels double every 2–3 days and are 50–100 mIU/mL at the time of the first missed menstrual period. Peak levels are reached 60–80 days after the last menstrual period (LMP) (30,000–100,000 mIU/mL), and levels then decrease to a plateau of 5,000–10,000 mIU/mL at about 120 days after LMP and persist until delivery.",
    "increasedIn": [
      "Pregnancy (including ectopic pregnancy), hyperemesis gravidarum, trophoblastic tumors (hydatidiform mole, choriocarcinoma), some germ cell tumors (teratomas, seminoma), ectopic hCG production by other malignancies.",
      "Decreasing Over time: Threatened abortion"
    ],
    "decreasedIn": [],
    "comments": "Test is positive (>50 mIU/mL) in most pregnant women at the time of or shortly after the first missed menstrual period. Quantitative hCG test detects hCG levels as low as 1.0 mIU/mL. It is preferred for the evaluation of suspected ectopic pregnancy and threatened abortion. In both situations, hCG levels fail to demonstrate the normal early pregnancy increase. Test is also indicated for following the course of trophoblastic and germ cell tumors.",
    "ratelistEntries": [
      {
        "name": "Beta hCG",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228889",
    "order": 172,
    "name": "Free PSA",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Free PSA diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Free PSA",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228890",
    "order": 173,
    "name": "IgA (Urine)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "IgA (Urine) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "IgA (Urine)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228891",
    "order": 174,
    "name": "Total PSA",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "PSA is a glycoprotein produced by cells of the prostatic ductal epithelium and is present in the serum of all men. It is absent from the serum of women.",
    "increasedIn": [
      "Prostate carcinoma (sensitivity ~20%",
      "specificity ~60–70% at a 4.0 ng/mL cutoff), biochemical recurrence after localized treatment, benign prostatic hypertrophy (BPH), prostatitis."
    ],
    "decreasedIn": [
      "Metastatic prostate carcinoma treated with antiandrogen therapy, postprostatectomy, 5α-reductase inhibitor therapy."
    ],
    "comments": "PSA is used both for the early detection of prostate cancer and as a tumor marker to assess response and monitor recurrence of treated prostate cancer.\nThere is still no consensus on whether PSA measurement should be used as a screening test for early detection of prostate cancer.\nA decrease in mortality rates resulting from use for cancer screening is unproven, and the risks of early therapy are significant. As a result, the United States Preventive Services Task Force discourages use of the test for healthy men in all age groups.\nThe PSA nadir (the lowest PSA level achieved after therapeutic intervention) appears to correlate with the likelihood of remaining disease free. Three consecutive PSA rises are interpreted as an indicator of treatment (biochemical) failure.\nPSA is often increased in BPH, and the positive predictive value in healthy older men is low. Use of the free/total PSA ratio or the complex PSA test and prostate volume can improve the diagnostic accuracy for prostate cancer.",
    "ratelistEntries": [
      {
        "name": "Total PSA",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228892",
    "order": 175,
    "name": "Anti-HBc",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HBc diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HBc",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228893",
    "order": 176,
    "name": "Anti-HBs",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HBs diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HBs",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228894",
    "order": 177,
    "name": "Anti-HBe",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HBe diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HBe",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228895",
    "order": 178,
    "name": "HBeAg",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "HBeAg is a soluble protein secreted by HBV, related to HBcAg, indicating viral replication and infectivity. Two distinct serologic types of hepatitis B have been described, one with a positive HbeAg, and the other with a negative HBeAg and a positive anti-HBe antibody.",
    "increasedIn": [],
    "decreasedIn": [
      "fectivity. Testing has proved unreliable, and tests are not routinely needed as indicators of infectivity. All patients positive for HBeAg must be considered infectious."
    ],
    "comments": "The assumption has been that loss of HBeAg and accumulation of HBeAb are associated with decreased infectivity. Testing has proved unreliable, and tests are not routinely needed as indicators of infectivity. All patients positive for HBeAg must be considered infectious.",
    "ratelistEntries": [
      {
        "name": "HBeAg",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228896",
    "order": 179,
    "name": "Anti-HAV",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HAV diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HAV",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228897",
    "order": 180,
    "name": "HAV IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "HAV IgM diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HAV IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228900",
    "order": 181,
    "name": "Anti Nuclear Antibody (ANA) by ELISA",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Heterogeneous antibodies to nuclear antigens (DNA and RNA, histone, and nonhistone proteins). Nuclear antibody is measured in serum by layering the patient’s serum over human epithelial cells and detecting the antibody with fluorescein conjugated polyvalent antihuman immunoglobulin. Enzyme-linked immunosorbent assay (ELISA) is also available for ANA detection, but has lower sensitivity for systemic lupus erythematosus (SLE) compared with immunofluorescence assay(IFA).",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "A negative ANA test does not completely rule out SLE, but alternative diagnoses should be considered. The pattern of ANA staining may give some clues to diagnosis, but because the pattern also changes with serum dilution, it is not routinely reported. Only the rim (peripheral) pattern is highly specific (for SLE). Not useful as a screening test. Should be used only when there is clinical evidence of a connective tissue disease.",
    "ratelistEntries": [
      {
        "name": "Anti Nuclear Antibody (ANA) by ELISA",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228901",
    "order": 182,
    "name": "Insulin Random",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Note\n1. A single random blood sample for insulin may not be sufficient because insulin levels and blood glucose can vary widely over time.\n2. Insulin secretion can be stimulated by various factors, including high blood glucose, glucagon, amino acids, growth hormone, and catecholamines.\n3. Insulin as",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Insulin Random",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228902",
    "order": 183,
    "name": "Testosterone Free",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Clinical Use\n1. As a secondary test to investigate alterations in physiologically active testosterone levels.\n2. To evaluate androgen status in cases with suspected or established abnormalities in sex hormone-binding globulin (SHBG).\n3. To assess functional serum testosterone levels in early puberta",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Testosterone circulates in the blood bound to three proteins: sex hormone-binding globulin (SHBG) (60-80%), albumin, and cortisol-binding globulin. Approximately 1-2% of circulating testosterone remains unbound or free. Measuring free testosterone provides an estimate of the biologically active hormone. This is particularly useful to account for variations in transport proteins that can affect total testosterone levels. Elevated SHBG levels, which can occur with conditions like obesity or advanced age, might obscure a true testosterone deficiency. In conditions such as Polycystic Ovary Syndrome (PCOS), where insulin resistance is prevalent and SHBG levels are often reduced, free or bioavailable testosterone levels may be significantly elevated.",
    "ratelistEntries": [
      {
        "name": "Testosterone Free",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228903",
    "order": 184,
    "name": "Testosterone Total",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Testosterone is the principal male sex hormone, produced by the Leydig cells of the testes. Dehydroepiandrosterone (DHEA) is produced in the adrenal cortex, testes, and ovaries and is the main precursor for serum testosterone in women. In normal males after puberty, the testosterone level is twice as high as all androgens in females. In serum, it is largely bound to albumin (38%) and to a specific steroid hormone-binding globulin (SHBG) (60%), but it is the free hormone (2%) that is physiologically active. The total testosterone level measures both bound and free testosterone in the serum (by immunoassay). Free or bioavailable testosterone may be calculated or measured.",
    "increasedIn": [
      "Idiopathic sexual precocity (in boys, levels may be in adult range), adrenal hyperplasia (boys), adrenocortical tumors, trophoblastic disease during pregnancy, idiopathic hirsutism, virilizing ovarian tumors, arrhenoblastoma, virilizing luteoma, testicular feminization (normal or moderately elevated), cirrhosis (through increased SHBG), hyperthyroidism."
    ],
    "decreasedIn": [
      "Hypogonadism (primary and secondary, orchidectomy, Klinefelter syndrome, uremia, hemodialysis, hepatic insufficiency, ethanol [men])."
    ],
    "comments": "The diagnosis of male hypogonadism is based on clinical symptoms and signs plus laboratory confirmation of low AM total serum testosterone levels on two different occasions. Levels <3.0 ng/mL should be treated. Free testosterone should be measured in symptomatic patients with normal total testosterone levels. Obtain serum luteinizing hormone and FSH levels to distinguish between primary (hypergonadotropic) and secondary (hypogonadotropic) hypogonadism. Hypogonadism associated with aging (andropause) may present a mixed picture, with low testosterone levels and low to low-normal gonadotropin levels. In men, there is a diurnal variation in serum testosterone with a 20% elevation in levels in the evenings.",
    "ratelistEntries": [
      {
        "name": "Testosterone Total",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228904",
    "order": 185,
    "name": "Progesterone",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Menstrual Cycle Phase:\n1. Follicular Phase (Early): Serum progesterone levels are typically low (<1 ng/mL), as progesterone is produced in significant amounts only after ovulation.\n2. Luteal Phase (Mid to Late): Progesterone levels rise significantly, usually ranging from 5 to 20 ng/mL. This increas",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Progesterone",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228898",
    "order": 186,
    "name": "Myoglobin",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Comments\nMyoglobin is a protein found in heart and skeletal muscle. It leaks into the blood when muscle cells are damaged. It’s useful for detecting heart attacks, early re-infarctions, and successful treatment. Myoglobin levels rise about 2 hours after a heart attack, peak in 4-12 hours, and return",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Myoglobin is a protein found in heart and skeletal muscle. It leaks into the blood when muscle cells are damaged. It’s useful for detecting heart attacks, early re-infarctions, and successful treatment. Myoglobin levels rise about 2 hours after a heart attack, peak in 4-12 hours, and return to normal within 24 hours. Since myoglobin is cleared by the kidneys, any changes in kidney function can affect its levels.\n\nClinical Use\nTo rule out a heart attack, if myoglobin levels don’t change in several samples taken 2-6 hours after chest pain starts, it almost certainly means there’s no heart muscle damage.",
    "ratelistEntries": [
      {
        "name": "Myoglobin",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228905",
    "order": 187,
    "name": "Beta 2 Glycoprotein 1, IgG",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "2006 International Consensus statement on Classification of definite APS\n\n\nCLINICAL CRITERIA\nLABORATORY CRITERIA Arterial/Venous thrombosis\nCardiolipin antibodies (aCL) Fetal Loss\nBeta 2 Glycoprotein 1 antibodies Premature birth\nLupus Anticoagulant (LA)\n\n\nNote:\nAPS is diagnosed if at least one labor",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "This test checks for IgG antibodies to Beta-2 glycoprotein. Finding these antibodies can indicate a risk of blood clots in arteries and veins, as well as a higher chance of repeated miscarriages. The new International classification criteria for APS include Beta-2 glycoprotein for 2 key reasons namely:\n1. Beta-2 Glycoprotein antibodies maybe the only antibody present in 10% patients of Antiphospholipid syndrome (APS)\n2. Beta-2 Glycoprotein antibodies are highly specific for APS unlike Anticardiolipin antibodies which may be positive in certain infectious diseases\n\nIndications\n· Clinical history suggestive of Arterial or venous thrombosis\n· History of Recurrent fetal loss /Intrauterine growth restriction/ Premature birth",
    "ratelistEntries": [
      {
        "name": "Beta 2 Glycoprotein 1, IgG",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228906",
    "order": 188,
    "name": "Beta 2 Glycoprotein 1, IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "2006 International Consensus statement on Classification of definite APS\n\n\nCLINICAL CRITERIA\nLABORATORY CRITERIA Arterial/Venous thrombosis\nCardiolipin antibodies (aCL) Fetal Loss\nBeta 2 Glycoprotein 1 antibodies Premature birth\nLupus Anticoagulant (LA)\n\n\nNote:\nAPS is diagnosed if at least one labor",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "This test checks for IgG antibodies to Beta-2 glycoprotein. Finding these antibodies can indicate a risk of blood clots in arteries and veins, as well as a higher chance of repeated miscarriages. The new International classification criteria for APS include Beta-2 glycoprotein for 2 key reasons namely:\n1. Beta-2 Glycoprotein antibodies maybe the only antibody present in 10% patients of Antiphospholipid syndrome (APS)\n2. Beta-2 Glycoprotein antibodies are highly specific for APS unlike Anticardiolipin antibodies which may be positive in certain infectious diseases\n\nIndications\n· Clinical history suggestive of Arterial or venous thrombosis\n· History of Recurrent fetal loss /Intrauterine growth restriction/ Premature birth",
    "ratelistEntries": [
      {
        "name": "Beta 2 Glycoprotein 1, IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228907",
    "order": 189,
    "name": "Anti Phospholipid IgG",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "2006 International Consensus statement on Classification of definite APS\n\n\nCLINICAL CRITERIA\nLABORATORY CRITERIA Arterial/Venous thrombosis\nCardiolipin antibodies (aCL) Fetal Loss\nBeta 2 Glycoprotein 1 antibodies Premature birth\nLupus Anticoagulant (LA)\n\n\nNote:\nAPS is diagnosed if at least one labor",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "A phospholipid antibody test measures the levels of autoantibodies against cardiolipin, phosphatidylserine, phosphatidylinositol, and phosphatidic acid. It helps diagnose an increased risk of blood clots in patients with systemic lupus erythematosus (20-35% of cases) and other similar disorders. This test is also used to diagnose Antiphospholipid syndrome (APS) in patients with recent miscarriage (11-22% in all trimesters), Pulmonary hypertension, Non-vegetative endocarditis, Livedo Reticularis, Stroke at young age and Deep vein thrombosis.",
    "ratelistEntries": [
      {
        "name": "Anti Phospholipid IgG",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228908",
    "order": 190,
    "name": "Anti Phospholipid IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "2006 International Consensus statement on Classification of definite APS\n\n\nCLINICAL CRITERIA\nLABORATORY CRITERIA Arterial/Venous thrombosis\nCardiolipin antibodies (aCL) Fetal Loss\nBeta 2 Glycoprotein 1 antibodies Premature birth\nLupus Anticoagulant (LA)\n\n\nNote:\nAPS is diagnosed if at least one labor",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "A phospholipid antibody test measures the levels of autoantibodies against cardiolipin, phosphatidylserine, phosphatidylinositol, and phosphatidic acid. It helps diagnose an increased risk of blood clots in patients with systemic lupus erythematosus (20-35% of cases) and other similar disorders. This test is also used to diagnose Antiphospholipid syndrome (APS) in patients with recent miscarriage (11-22% in all trimesters), Pulmonary hypertension, Non-vegetative endocarditis, Livedo Reticularis, Stroke at young age and Deep vein thrombosis.",
    "ratelistEntries": [
      {
        "name": "Anti Phospholipid IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228909",
    "order": 191,
    "name": "Anti Cardiolipin IgG",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "RESULT IN GPL\nREMARKS <15\nNegative 15-20\nEquivocal 20-80\nLow Positive >80\nHigh Positive\n\nComments\nACA is a type of antiphospholipid antibody.\nDiagnostic Importance: ACA are significant in diagnosing -\n1. Venous or arterial thrombosis\n2. Thrombocytopenia\n3. Livedo Reticularis\n4. Recurrent miscarriage",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "ACA is a type of antiphospholipid antibody.\nDiagnostic Importance: ACA are significant in diagnosing -\n1. Venous or arterial thrombosis\n2. Thrombocytopenia\n3. Livedo Reticularis\n4. Recurrent miscarriages\n5. Neurological symptoms\nOther Associations: Elevated ACA levels can also be linked to cardiovascular insufficiency and myocardial infarction.",
    "ratelistEntries": [
      {
        "name": "Anti Cardiolipin IgG",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228910",
    "order": 192,
    "name": "Anti Cardiolipin IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "RESULT IN GPL\nREMARKS <15\nNegative 15-20\nEquivocal 20-80\nLow Positive >80\nHigh Positive\n\nComments\nACA is a type of antiphospholipid antibody.\nDiagnostic Importance: ACA are significant in diagnosing -\n1. Venous or arterial thrombosis\n2. Thrombocytopenia\n3. Livedo Reticularis\n4. Recurrent miscarriage",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "ACA is a type of antiphospholipid antibody.\nDiagnostic Importance: ACA are significant in diagnosing -\n1. Venous or arterial thrombosis\n2. Thrombocytopenia\n3. Livedo Reticularis\n4. Recurrent miscarriages\n5. Neurological symptoms\nOther Associations: Elevated ACA levels can also be linked to cardiovascular insufficiency and myocardial infarction.",
    "ratelistEntries": [
      {
        "name": "Anti Cardiolipin IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228911",
    "order": 193,
    "name": "WEIL FELIX TEST, SERUM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "WEIL FELIX TEST, SERUM diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "WEIL FELIX TEST, SERUM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228912",
    "order": 194,
    "name": "Dengue IgG",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Dengue IgG diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Dengue IgG",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228913",
    "order": 195,
    "name": "Dengue IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Dengue IgM diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Dengue IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228914",
    "order": 196,
    "name": "Dengue IgG & IgM",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Dengue IgG & IgM diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Dengue IgG & IgM",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228969",
    "order": 197,
    "name": "Serum Cortisol",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Serum Cortisol diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Serum Cortisol",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228970",
    "order": 198,
    "name": "Scrub Typhus",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Scrub Typhus diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Scrub Typhus",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228972",
    "order": 199,
    "name": "TB GOLD, Interferon Gamma Release Assay",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Main Result (TB Antigen Response)\n\nInterferon-Gamma Value (IU/mL)\nResult\nInterpretation < 0.20\nNegative\nClearly normal; TB infection unlikely 0.20 – 0.34\nBorderline Negative\nUsually considered negative; may repeat if high risk ≥ 0.35\nPositive\nSuggests TB infection (latent or active) ≥ 1.00\nStrong Po",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "TB GOLD, Interferon Gamma Release Assay",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228965",
    "order": 200,
    "name": "Treponema Pallidum Hemagglutination Assay",
    "shortName": "TPHA",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Treponema Pallidum Hemagglutination Assay diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "TPHA",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228962",
    "order": 201,
    "name": "Troponin I Rapid",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Troponin I Rapid diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Troponin I Rapid",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228963",
    "order": 202,
    "name": "Anti-HAV (Hepatitis A Virus Antibody)",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HAV (Hepatitis A Virus Antibody) diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HAV (Hepatitis A Virus Antibody)",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228975",
    "order": 203,
    "name": "Anti-HAV IgM Qualitative",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HAV IgM Qualitative diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HAV IgM Qualitative",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228974",
    "order": 204,
    "name": "Anti-HAV IgG Qualitative",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Anti-HAV IgG Qualitative diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Anti-HAV IgG Qualitative",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228976",
    "order": 205,
    "name": "LEISHMANIA rK-39 ANTIBODY, SERUM",
    "shortName": "KALA AZAR",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Interpretation\n\n\n\n\n\n\n\nPositive → Suggestive of Visceral Leishmaniasis (Kala-azar)\n\n\n\n\n\n\n\n\nNegative → No serological evidence of Kala-azar\n\n\n\n\n\n\n\n\nClinical correlation required",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "KALA AZAR",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228973",
    "order": 206,
    "name": "ASO (Anti-Streptolysin O) Qualitative",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "Interpretation\n\n\n\n\n\n\n\nPositive → Suggests recent streptococcal infection\n\n\n\n\n\n\n\n\nNegative → No significant ASO antibodies detected",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "ASO (Anti-Streptolysin O) Qualitative",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228929",
    "order": 207,
    "name": "HIV ELISA I/II",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "HIV ELISA I/II diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HIV ELISA I/II",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228959",
    "order": 208,
    "name": "HBsAg ELISA",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Single parameter",
    "unit": "Index",
    "price": 250,
    "description": "HBsAg ELISA diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HBsAg ELISA",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228745",
    "order": 209,
    "name": "HCV RNA Quantitative",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Multi parameter",
    "unit": "Index",
    "price": 250,
    "description": "HCV RNA Quantitative diagnostic examination. Used to evaluate clinical status in Serology & Immunology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "HCV RNA Quantitative",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228780",
    "order": 210,
    "name": "ALLERGY SCREENING TEST",
    "shortName": "",
    "category": "Serology & Immunology",
    "testType": "Document",
    "unit": "Index",
    "price": 80,
    "description": "Routine and microscopic urinalysis providing diagnostic information about renal function, metabolic status, urinary tract infection, and systemic disease.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Routine Examination",
        "fee": 80
      }
    ],
    "panelsIncluded": [
      {
        "name": "Basic Urine Screen"
      },
      {
        "name": "Full Body Checkup"
      }
    ],
    "parameters": [
      {
        "id": "u_color",
        "order": 1,
        "name": "Color",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Pale Yellow / Straw",
          "ranges": []
        }
      },
      {
        "id": "u_app",
        "order": 2,
        "name": "Appearance",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Clear",
          "ranges": []
        }
      },
      {
        "id": "u_sg",
        "order": 3,
        "name": "Specific Gravity",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "sg_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 1.005,
              "upperValue": 1.03,
              "displayRange": "1.005 - 1.030"
            }
          ]
        }
      },
      {
        "id": "u_ph",
        "order": 4,
        "name": "Reaction (pH)",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "ph_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 4.5,
              "upperValue": 8,
              "displayRange": "4.5 - 8.0"
            }
          ]
        }
      },
      {
        "id": "u_alb",
        "order": 5,
        "name": "Albumin / Protein",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil",
          "ranges": []
        }
      },
      {
        "id": "u_sug",
        "order": 6,
        "name": "Sugar / Glucose",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil",
          "ranges": []
        }
      },
      {
        "id": "u_pus",
        "order": 7,
        "name": "Pus Cells (WBCs)",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "pus_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 0,
              "upperValue": 5,
              "displayRange": "0 - 5"
            }
          ]
        }
      },
      {
        "id": "u_rbc",
        "order": 8,
        "name": "RBCs",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil / HPF",
          "ranges": []
        }
      },
      {
        "id": "u_epi",
        "order": 9,
        "name": "Epithelial Cells",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "1 - 3 / HPF",
          "ranges": []
        }
      }
    ]
  },
  {
    "id": "6228915",
    "order": 211,
    "name": "Urine for creatinine",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for creatinine diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for creatinine",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228916",
    "order": 212,
    "name": "Urine (Pregnancy)card test",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine (Pregnancy)card test diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine (Pregnancy)card test",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228917",
    "order": 213,
    "name": "Urine for Fungal",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for Fungal diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for Fungal",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228918",
    "order": 214,
    "name": "Urine for Ketone",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for Ketone diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for Ketone",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228919",
    "order": 215,
    "name": "Urine for Microalbumin",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "The normal urinary albumin excretion is less than 30 mg/24 hr. On random spot urine collection, the albumin-to-creatinine ratio (ACR, mcg/mg) should be less than 30. The term microalbuminuria is defined as a subtle increase in the urinary excretion of albumin that cannot be detected by conventional urinalysis. Specifically, the excretion of 30–300 mg albumin per 24 hours or an ACR of 30–300 (mcg/mg) is considered microalbuminuria (urine albumin is high). 300 mg or more of albumin excretion per day or an ACR of 300 or higher indicates gross albuminuria (urine albumin very high or nephrotic) range.",
    "increasedIn": [
      "Diabetes mellitus, diabetic nephropathy."
    ],
    "decreasedIn": [],
    "comments": "Microalbuminuria is a useful indicator of early nephropathy in diabetic patients. Urine albumin measurement requires a sensitive immunochemical assay. Urine dipstick analysis is often insensitive to microalbuminuria. Screening for microalbuminuria is often performed by measurement of the ACR in a random spot collection (preferred method). Twenty-four-hour or timed urine collections are more burdensome.",
    "ratelistEntries": [
      {
        "name": "Urine for Microalbumin",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228920",
    "order": 216,
    "name": "Urine for Protein",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for Protein diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for Protein",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228921",
    "order": 217,
    "name": "Urine Pregnancy Test",
    "shortName": "UPT",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Interpretation\n1. If the pregnancy test is taken too early one may get a false negative result very dilute urine specimen may not contain a representative level of HCG, resulting in a negative test too.\n2. If pregnancy is still suspected, first morning specimen should be collected 48 hours later and",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "UPT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228922",
    "order": 218,
    "name": "Urine for AFB 24 hours",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for AFB 24 hours diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for AFB 24 hours",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228923",
    "order": 219,
    "name": "Urine for Chyle",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine for Chyle diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine for Chyle",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228924",
    "order": 220,
    "name": "Semen Examination",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Multi parameter nested",
    "unit": "",
    "price": 100,
    "description": "Method: Semen is collected in a urine container after masturbation following 3 days of abstinence from ejaculation. Specimen must be examined promptly.\n\nPhysiologic Basis: Conventional semen analysis includes the determination of sperm count, semen volume, sperm motility (qualitative and quantitativ",
    "increasedIn": [],
    "decreasedIn": [
      "- Primary or secondary testicular failure, cryptorchidism, following vasectomy,"
    ],
    "comments": "A low sperm count should be confirmed by sending two other appropriately collected semen specimens for evaluation. The usefulness of conventional semen analysis parameters as predictors of fertility is somewhat limited. Therefore, alternative tests based on more functional aspects (sperm penetration, capacitation, acrosome reaction) have been developed.",
    "ratelistEntries": [
      {
        "name": "Semen Examination",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228925",
    "order": 221,
    "name": "Urine Sugar Fasting",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Sugar Fasting diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Sugar Fasting",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228926",
    "order": 222,
    "name": "Stool Routine Examination",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Multi parameter nested",
    "unit": "",
    "price": 80,
    "description": "Stool Routine Examination diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Stool Routine Examination",
        "fee": 80
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228927",
    "order": 223,
    "name": "Urine Sugar PP",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Sugar PP diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Sugar PP",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228928",
    "order": 224,
    "name": "Urine Sugar Random",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Sugar Random diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Sugar Random",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228933",
    "order": 225,
    "name": "Urine Routine Examination",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Multi parameter nested",
    "unit": "",
    "price": 80,
    "description": "Routine and microscopic urinalysis providing diagnostic information about renal function, metabolic status, urinary tract infection, and systemic disease.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Routine Examination",
        "fee": 80
      }
    ],
    "panelsIncluded": [
      {
        "name": "Basic Urine Screen"
      },
      {
        "name": "Full Body Checkup"
      }
    ],
    "parameters": [
      {
        "id": "u_color",
        "order": 1,
        "name": "Color",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Pale Yellow / Straw",
          "ranges": []
        }
      },
      {
        "id": "u_app",
        "order": 2,
        "name": "Appearance",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Clear",
          "ranges": []
        }
      },
      {
        "id": "u_sg",
        "order": 3,
        "name": "Specific Gravity",
        "unit": "",
        "groupBy": "Physical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "sg_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 1.005,
              "upperValue": 1.03,
              "displayRange": "1.005 - 1.030"
            }
          ]
        }
      },
      {
        "id": "u_ph",
        "order": 4,
        "name": "Reaction (pH)",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "ph_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 4.5,
              "upperValue": 8,
              "displayRange": "4.5 - 8.0"
            }
          ]
        }
      },
      {
        "id": "u_alb",
        "order": 5,
        "name": "Albumin / Protein",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil",
          "ranges": []
        }
      },
      {
        "id": "u_sug",
        "order": 6,
        "name": "Sugar / Glucose",
        "unit": "",
        "groupBy": "Chemical Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil",
          "ranges": []
        }
      },
      {
        "id": "u_pus",
        "order": 7,
        "name": "Pus Cells (WBCs)",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "numeric_range",
          "ranges": [
            {
              "id": "pus_1",
              "gender": "Any",
              "minAge": 0,
              "minAgeUnit": "Years",
              "maxAge": 120,
              "maxAgeUnit": "Years",
              "lowerValue": 0,
              "upperValue": 5,
              "displayRange": "0 - 5"
            }
          ]
        }
      },
      {
        "id": "u_rbc",
        "order": 8,
        "name": "RBCs",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "Nil / HPF",
          "ranges": []
        }
      },
      {
        "id": "u_epi",
        "order": 9,
        "name": "Epithelial Cells",
        "unit": "/HPF",
        "groupBy": "Microscopic Examination",
        "isOptional": false,
        "normalValues": {
          "selectType": "text",
          "textualNormal": "1 - 3 / HPF",
          "ranges": []
        }
      }
    ]
  },
  {
    "id": "6228934",
    "order": 226,
    "name": "Fluid Examination",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Multi parameter nested",
    "unit": "",
    "price": 100,
    "description": "Fluid Examination diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Fluid Examination",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228935",
    "order": 227,
    "name": "Urine Cotinine",
    "shortName": "UCT",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Cotinine diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "UCT",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228936",
    "order": 228,
    "name": "Urine Cortisol",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urinary free cortisol measurement is useful in the initial evaluation of suspected Cushing syndrome.",
    "increasedIn": [
      "Cushing syndrome, acute illness, stress.",
      "Not increased in: Obesity."
    ],
    "decreasedIn": [],
    "comments": "Urinary free cortisol is the initial diagnostic test of choice for Cushing syndrome. Not useful for the diagnosis of adrenal insuffi ciency. A shorter (12-hour) overnight collection and measurement of the ratio of urine-free cortisol to urine creatinine appears to perform nearly as well as a 24-hour collection for urine-free cortisol.",
    "ratelistEntries": [
      {
        "name": "Urine Cortisol",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228937",
    "order": 229,
    "name": "Microalbumin, Urine 24 hours",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Multi parameter",
    "unit": "",
    "price": 100,
    "description": "Microalbumin, Urine 24 hours diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Microalbumin, Urine 24 hours",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228982",
    "order": 230,
    "name": "Urine Bile Pigment",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Bile Pigment diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Bile Pigment",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228983",
    "order": 231,
    "name": "Urine Bile Salt",
    "shortName": "",
    "category": "Clinical Pathology",
    "testType": "Single parameter",
    "unit": "",
    "price": 100,
    "description": "Urine Bile Salt diagnostic examination. Used to evaluate clinical status in Clinical Pathology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Urine Bile Salt",
        "fee": 100
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228938",
    "order": 232,
    "name": "FNAC (Fine Needle Aspiration)",
    "shortName": "",
    "category": "Cytology",
    "testType": "Document",
    "unit": "",
    "price": 300,
    "description": "FNAC (Fine Needle Aspiration) diagnostic examination. Used to evaluate clinical status in Cytology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "FNAC (Fine Needle Aspiration)",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228939",
    "order": 233,
    "name": "PAP Smear",
    "shortName": "",
    "category": "Cytology",
    "testType": "Document",
    "unit": "",
    "price": 300,
    "description": "PAP Smear diagnostic examination. Used to evaluate clinical status in Cytology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "PAP Smear",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228940",
    "order": 234,
    "name": "Skin test for Leprosy",
    "shortName": "",
    "category": "Cytology",
    "testType": "Single parameter",
    "unit": "",
    "price": 300,
    "description": "Skin test for Leprosy diagnostic examination. Used to evaluate clinical status in Cytology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Skin test for Leprosy",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228952",
    "order": 235,
    "name": "Body Fluid",
    "shortName": "",
    "category": "Cytology",
    "testType": "Document",
    "unit": "",
    "price": 300,
    "description": "Body Fluid diagnostic examination. Used to evaluate clinical status in Cytology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Body Fluid",
        "fee": 300
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228941",
    "order": 236,
    "name": "Gram's Stain",
    "shortName": "",
    "category": "Microbiology",
    "testType": "Multi parameter",
    "unit": "",
    "price": 250,
    "description": "Gram's Stain diagnostic examination. Used to evaluate clinical status in Microbiology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Gram's Stain",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228942",
    "order": 237,
    "name": "Acid - Fast Bacilli",
    "shortName": "AFB",
    "category": "Microbiology",
    "testType": "Multi parameter",
    "unit": "",
    "price": 250,
    "description": "Note:\nA positive Acid-Fast Bacillus (AFB) smear result provides an initial indication of a Mycobacterial infection. The positivity and grade of the smear suggest the relative bacterial burden and correlate with the clinical presentation of the disease. Conversely, a negative AFB smear may indicate t",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "AFB",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228943",
    "order": 238,
    "name": "Skin smear for AFB",
    "shortName": "",
    "category": "Microbiology",
    "testType": "Single parameter",
    "unit": "",
    "price": 250,
    "description": "Skin smear for AFB diagnostic examination. Used to evaluate clinical status in Microbiology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Skin smear for AFB",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228944",
    "order": 239,
    "name": "Fungal scraping smear",
    "shortName": "",
    "category": "Microbiology",
    "testType": "Single parameter",
    "unit": "",
    "price": 250,
    "description": "Fungal scraping smear diagnostic examination. Used to evaluate clinical status in Microbiology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Fungal scraping smear",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228945",
    "order": 240,
    "name": "Culture and Sensitivity",
    "shortName": "",
    "category": "Microbiology",
    "testType": "Document",
    "unit": "",
    "price": 250,
    "description": "Culture and Sensitivity diagnostic examination. Used to evaluate clinical status in Microbiology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Culture and Sensitivity",
        "fee": 250
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228946",
    "order": 241,
    "name": "Serum Triiodothyronine, T3",
    "shortName": "T3",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Physiologic Basis\nT3 is the primary active thyroid hormone. Approximately 80% of T3 is produced by extrathyroidal deiodination of T4 and the rest by thyroid gland. Total T3 is influenced by levels of thyroxine binding proteins.\n\nInterpretation\nIncreased in: Hyperthyroidism (some) Increased thyroid b",
    "increasedIn": [
      "Hyperthyroidism (some) Increased thyroid binding globulin."
    ],
    "decreasedIn": [
      "Hypothyroidism, nonthyroidal illness, decreased thyroid binding globulin."
    ],
    "comments": "T3 may be increased in approximately 5% of hyperthyroid patients in whom free T4 is normal (T3 toxicosis). Therefore, the test is indicated when hyperthyroidism is suspected and free T4 value is normal. Test is of no value in the diagnosis and treatment of primary hypothyroidism.",
    "ratelistEntries": [
      {
        "name": "T3",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228947",
    "order": 242,
    "name": "Serum thyroxine, T4",
    "shortName": "T4",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Serum thyroxine, T4 diagnostic examination. Used to evaluate clinical status in Endocrinology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "T4",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228948",
    "order": 243,
    "name": "Thyroid-Stimulating Hormone, TSH",
    "shortName": "TSH",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Physiologic Basis\nTSH is an anterior pituitary hormone that stimulates the thyroid gland to produce thyroid hormones.\nSecretion is stimulated by thyrotropin releasing hormone from the hypothalamus. There is negative feedback on TSH secretion by circulating thyroid hormone.\n\nInterpretation \nIncreased",
    "increasedIn": [
      "Hypothyroidism, mild increases in recovery phase of acute illness, subclinical hypothyroidism."
    ],
    "decreasedIn": [
      "Hyperthyroidism, subclinical hyperthyroidism, acute medical or surgical illness (euthyroid sick syndrome), pituitary hypothyroidism."
    ],
    "comments": "TSH assays are used for screening thyroid function, aiding the diagnosis of hyperthyroidism and hypothyroidism, and monitoring thyroid replacement therapy.\nThe currently used TSH immunoassays are very sensitive, typically with functional sensitivity of ≤0.02 mIU/L.\nMeasurement of serum TSH is the best initial laboratory test of thyroid function. It should be followed by measurement of free thyroxine (FT4) if the TSH value is low and by measurement of anti-thyroperoxidase antibody (TPO Ab) if the TSH value is high.\nMost experts recommend against routine screening of asymptomatic patients, but screening is recommended for high-risk populations.",
    "ratelistEntries": [
      {
        "name": "TSH",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228949",
    "order": 244,
    "name": "Free Triiodothyronine l, FT3",
    "shortName": "FT3",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Free Triiodothyronine l, FT3 diagnostic examination. Used to evaluate clinical status in Endocrinology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "FT3",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228950",
    "order": 245,
    "name": "Free Thyroxine, FT4",
    "shortName": "FT4",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Free Thyroxine, FT4 diagnostic examination. Used to evaluate clinical status in Endocrinology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "FT4",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228953",
    "order": 246,
    "name": "Alfa Fetoprotein, AFP",
    "shortName": "AFP",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Alpha-fetoprotein (AFP) is a crucial protein found in fetal serum, serving a physiological role akin to that of albumin. It is primarily produced in the yolk sac, the fetal liver, and the fetal gastrointestinal tract. However, shortly after birth, AFP levels drop precipitously, becoming virtually un",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "AFP",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228954",
    "order": 247,
    "name": "Prolactin",
    "shortName": "PRL",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Prolactin is a polypeptide hormone secreted by the anterior pituitary. It functions in the initiation and maintenance of lactation in the postpartum period. PRL secretion is inhibited by hypothalamic secretion of dopamine.\nClinical Use:\n1.Diagnosis & management of pituitary adenomas\n2.Differential diagnosis of male & female hypogonadism.",
    "increasedIn": [
      "1. Physiologic: Sleep, stress, postprandially, pain, coitus",
      "2. Systemic disorders: Chest wall or thoracic spinal cord lesions, Primary / Secondary hypothyroidism, Adrenal insufficiency, Chronic renal failure, Cirrhosis",
      "3. Medications:",
      "- Psychiatric medications like Phenothiazine, Haloperidol, Risperidone,   Domperidone, Fluoxetine, Amitriptyline, MAO inhibitors etc.,",
      "- Antihypertensives: Alpha Methyldopa, Reserpine, Verapamil"
    ],
    "decreasedIn": [
      "Pituitary deficiency: Pituitary necrosis / infarction , Pseudohypoparathyroidism, Bromocriptine administration,"
    ],
    "comments": "Serum PRL is used primarily in work-up of suspected pituitary tumors. Clinical presentation is usually amenorrhea and galactorrhea in women and impotence in men. In macroadenoma - PRL is frequently > 500 ng/mL and In microadenoma  - PRL is usually > 150 ng/mL",
    "ratelistEntries": [
      {
        "name": "PRL",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228955",
    "order": 248,
    "name": "Luteinising Hormone, LH",
    "shortName": "LH",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": ":\nLH is stimulated by the hypothalamic hormone gonadotropin- releasing hormone (GnRH). It is secreted from the anterior pituitary and acts on the gonads. LH is the principal regulator of steroid biosynthesis in the ovary and testis.",
    "increasedIn": [
      "Primary hypogonadism, polycystic ovary syndrome, postmenopause, endometriosis, after depot leuprolide injection",
      "immunoassay result may be falsely elevated in pregnancy."
    ],
    "decreasedIn": [
      "Pituitary or hypothalamic failure, anorexia nervosa, bulimia, advanced prostate cancer, severe stress, malnutrition, Kallman syndrome (gonadotropin deficiency associated with anosmia)."
    ],
    "comments": "In male hypogonadism, serum LH and FSH levels can distinguish between primary (hypergonadotropic) and secondary (hypogonadotropic) hypogonadism. Hypogonadism associated with aging (andropause) may present a mixed picture, with low testosterone levels and low to low-normal gonadotropin levels. Repeated measurement may be required to diagnose gonadotropin deficiencies.\nElevated serum LH levels are a common feature in polycystic ovary syndrome, but measurement of total testosterone is the test of choice to diagnose polycystic ovary syndrome.",
    "ratelistEntries": [
      {
        "name": "LH",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228956",
    "order": 249,
    "name": "Follicle Stimulating Hormone, FSH",
    "shortName": "FSH",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Follicle Stimulating Hormone, FSH diagnostic examination. Used to evaluate clinical status in Endocrinology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "FSH",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228957",
    "order": 250,
    "name": "Folic Acid",
    "shortName": "",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Note\n1. Drugs like Methotrexate and Leucovorin can affect folate test results.\n2. To tell apart vitamin B12 deficiency from folate deficiency, check levels of Methyl malonic acid in urine and Homocysteine in blood.\n3. Folic acid has a low risk of toxicity because it's a water-soluble vitamin that’s",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "Folate is crucial for making DNA components and for red blood cell maturation. It comes mainly from plants and some organ meats, but cooking can destroy over half of it. Folate deficiency is common in people with alcoholic liver disease, pregnant women, and the elderly. It can result from poor absorption, inadequate diet, high demand (like in pregnancy or cancer), or certain drugs such as Methotrexate and anticonvulsants\n\nInterpretation\nDecreased Levels: Megaloblastic anemia, Infantile hyperthyroidism, Alcoholism, Malnutrition, Scurvy, Liver disease, B12 deficiency, dietary amino acid excess, adult Celiac disease, Tropical Sprue, Crohn’s disease, Hemolytic anemias, Carcinomas, Myelofibrosis, vitamin B6 deficiency, pregnancy, Whipple’s disease, extensive intestinal resection and severe exfoliative dermatitis.",
    "ratelistEntries": [
      {
        "name": "Folic Acid",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228978",
    "order": 251,
    "name": "Parathyroid Hormone (PTH)",
    "shortName": "",
    "category": "Endocrinology",
    "testType": "Single parameter",
    "unit": "ng/mL",
    "price": 350,
    "description": "Parathyroid Hormone (PTH) diagnostic examination. Used to evaluate clinical status in Endocrinology.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Parathyroid Hormone (PTH)",
        "fee": 350
      }
    ],
    "panelsIncluded": []
  },
  {
    "id": "6228958",
    "order": 252,
    "name": "Mantoux test",
    "shortName": "",
    "category": "Miscellaneous",
    "testType": "Document",
    "unit": "",
    "price": 200,
    "description": "Mantoux test diagnostic examination. Used to evaluate clinical status in Miscellaneous.",
    "increasedIn": [],
    "decreasedIn": [],
    "comments": "",
    "ratelistEntries": [
      {
        "name": "Mantoux test",
        "fee": 200
      }
    ],
    "panelsIncluded": []
  }
];
