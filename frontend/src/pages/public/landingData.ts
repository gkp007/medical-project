// Aastha Multi-Speciality Polyclinic & Diagnostic Centre Data
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  fee: number;
  feeType?: string;
  feeDeskNote?: string;
  visitingFrequency?: string;
  visitingScheduleText: string;
  rating: number;
  reviewsCount?: number;
  availableDays: string[];
  timing: string;
  image: string;
  about: string;
  expertise: string[];
  roomNo?: string;
  languages?: string[];
  [key: string]: any;
}

export interface ClinicService {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  icon?: string;
  department: string;
  commonConditions: string[];
  procedures: string[];
  opdDays: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  testsCount?: number;
  parametersCount: number;
  reportTime?: string;
  homeCollection?: boolean;
  homeCollectionAvailable?: boolean;
  sampleType?: string;
  fasting?: string;
  fastingRequired?: boolean;
  fastingDetails?: string;
  recommendedFor?: string;
  colorTheme?: string;
  testsIncluded?: any[];
  categories?: {
    name: string;
    tests: string[];
  }[];
  [key: string]: any;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  code: string;
  category: string;
  subCategory?: string;
  shortDesc?: string;
  description?: string;
  price: number;
  originalPrice: number;
  sampleType: string;
  reportTime: string;
  fastingRequired: boolean;
  homeCollectionAvailable?: boolean;
  parametersCount?: number;
  popular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishDate: string;
  image?: string;
  tags?: string[];
  author: {
    name: string;
    role: string;
  };
  excerpt: string;
  content: string;
  [key: string]: any;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  location: string;
  rating: number;
  date: string;
  serviceUsed: string;
  comment: string;
  verified: boolean;
}

export const CLINIC_INFO = {
  name: "Aastha Polyclinic & Diagnostic Centre",
  shortName: "Aastha Diagnostics",
  tagline: "Serve Respect Love",
  subTagline: "Multi-Specialty OPD Consultations & Automated Pathology",
  domain: "aasthamspolyclinic.com",
  phonePrimary: "+919827493536",
  phoneLab: "+918249769121",
  phoneHistopath: "+918917469121",
  whatsapp: "918249769121",
  email: "aasthapolyclinic@gmail.com",
  addressLine1: "Aastha Healthcare Complex, Medical Square, Main Hospital Road",
  city: "Bargarh",
  state: "Odisha",
  pincode: "768028",
  hoursOpd: "07:00 AM - 09:30 PM Daily",
  hoursLab: "Emergency Lab Open 24/7",
};

export const DOCTORS_DATA: Doctor[] = [
  {
    "id": "doc-1",
    "name": "Dr. Rajesh N. Panda",
    "specialty": "Consultant Physician & Diabetologist",
    "qualification": "MD (Internal Medicine), Fellowship in Diabetes",
    "experience": "16+ Years Experience",
    "fee": 500,
    "feeType": "fixed",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Daily Regular OPD",
    "rating": 4.9,
    "reviewsCount": 312,
    "availableDays": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "timing": "09:00 AM - 01:00 PM & 05:00 PM - 08:00 PM",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    "about": "Senior Consultant Physician specializing in hypertension, metabolic syndrome, uncontrolled diabetes mellitus, infectious ailments, and geriatric preventive health management.",
    "expertise": [
      "Diabetes Mellitus Management",
      "Hypertension & Lipid Disorders",
      "Infectious Diseases",
      "Preventive Adult Care"
    ],
    "roomNo": "OPD Chamber 01 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-pr-cardio",
    "name": "Dr. P R Mohapatra",
    "specialty": "Consultant Cardiologist",
    "qualification": "MD (Medicine), DM (Cardiology), FACC",
    "experience": "10+ Years Experience",
    "fee": 500,
    "feeType": "fixed",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Once in a Week",
    "rating": 4.9,
    "reviewsCount": 245,
    "availableDays": [
      "Wed"
    ],
    "timing": "09:00 AM - 01:00 PM & 05:00 PM - 08:00 PM",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    "about": "Experienced clinical and interventional cardiologist specializing in coronary artery disease, heart failure management, arrhythmia screening, and non-invasive cardiac evaluation.",
    "expertise": [
      "Echocardiography (2D Echo)",
      "Hypertension & Angina Management",
      "Coronary Risk Assessment",
      "Post-Stent Patient Care"
    ],
    "roomNo": "Room 102 (Cardiology Unit)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-2",
    "name": "Dr. Sunita Tripathy",
    "specialty": "Consultant Gynecologist & Obstetrician",
    "qualification": "MBBS, MS (Obstetrics & Gynaecology), FMAS",
    "experience": "14+ Years Experience",
    "fee": 600,
    "feeType": "fixed",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Regular OPD (Mon, Wed, Fri, Sat)",
    "rating": 4.9,
    "reviewsCount": 248,
    "availableDays": [
      "Mon",
      "Wed",
      "Fri",
      "Sat"
    ],
    "timing": "10:00 AM - 02:00 PM & 05:30 PM - 07:30 PM",
    "image": "https://images.unsplash.com/photo-1594824813589-3221b29a24c5?auto=format&fit=crop&w=600&q=80",
    "about": "Dedicated specialist providing comprehensive women’s health care, high-risk pregnancy management, PCOS/PCOD hormonal balancing, and minimally invasive gynecological care.",
    "expertise": [
      "Antenatal & High-Risk Pregnancy",
      "PCOS / PCOD Therapy",
      "Adolescent & Menopausal Health",
      "Infertility Evaluation"
    ],
    "roomNo": "OPD Chamber 03 (First Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-3",
    "name": "Dr. Amitav Mohapatra",
    "specialty": "Consultant Orthopedic Surgeon",
    "qualification": "MBBS, MS (Orthopedics), Fellowship in Joint Replacement",
    "experience": "12+ Years Experience",
    "fee": 600,
    "feeType": "fixed",
    "visitingFrequency": "weekly",
    "visitingScheduleText": "Visiting Specialist • Once in a Week (Every Sunday)",
    "rating": 4.8,
    "reviewsCount": 189,
    "availableDays": [
      "Sun"
    ],
    "timing": "10:00 AM - 02:00 PM",
    "image": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    "about": "Expert Orthopedic surgeon with extensive clinical focus on osteoarthritis, sports injuries, spine health, chronic joint pain, and trauma rehabilitation.",
    "expertise": [
      "Arthritis & Joint Preservation",
      "Spine & Lumbar Pain Care",
      "Sports Ligament Injuries",
      "Fracture & Trauma"
    ],
    "roomNo": "OPD Chamber 02 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-4",
    "name": "Dr. Priyadarshini Sahoo",
    "specialty": "Consultant Pediatrician & Neonatologist",
    "qualification": "MBBS, MD (Pediatrics), DNB (Pediatrics)",
    "experience": "11+ Years Experience",
    "fee": 500,
    "feeType": "fixed",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Daily Regular OPD",
    "rating": 4.9,
    "reviewsCount": 284,
    "availableDays": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "timing": "09:30 AM - 01:30 PM",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    "about": "Caring pediatrician passionate about child growth milestones, pediatric immunization schedules, allergy care, childhood nutritional guidance, and pediatric infections.",
    "expertise": [
      "Newborn Care & Neonatology",
      "Vaccination Schedules",
      "Childhood Asthma & Allergies",
      "Nutritional Deficiencies"
    ],
    "roomNo": "OPD Chamber 04 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-5",
    "name": "Dr. Subhashree Dash",
    "specialty": "Consultant Dermatologist & Cosmetologist",
    "qualification": "MBBS, MD (Dermatology, Venereology & Leprosy)",
    "experience": "9+ Years Experience",
    "fee": 500,
    "feeType": "fixed",
    "visitingFrequency": "weekly",
    "visitingScheduleText": "Visiting Consultant • Once in a Week (Every Wednesday)",
    "rating": 4.8,
    "reviewsCount": 165,
    "availableDays": [
      "Wed"
    ],
    "timing": "04:30 PM - 08:30 PM",
    "image": "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=600&q=80",
    "about": "Specialist clinical dermatologist focused on chronic skin ailments, eczema, psoriasis, acne scar reduction, hair fall diagnostics, and laser procedures.",
    "expertise": [
      "Acne, Pigmentation & Melasma",
      "Hair Loss & Trichology",
      "Psoriasis & Eczema Care",
      "Fungal Skin Disorders"
    ],
    "roomNo": "OPD Chamber 05 (First Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-6",
    "name": "Dr. Bikram K. Jena",
    "specialty": "Consultant Cardiologist & Interventionist",
    "qualification": "MBBS, MD (Medicine), DM (Cardiology)",
    "experience": "15+ Years Experience",
    "fee": 0,
    "feeType": "dept_specific",
    "feeDeskNote": "Cardiology Desk / Respective Desk",
    "visitingFrequency": "monthly",
    "visitingScheduleText": "Visiting Super Specialist • Once in a Month (1st & 3rd Sunday)",
    "rating": 4.9,
    "reviewsCount": 340,
    "availableDays": [
      "1st & 3rd Sun of Month"
    ],
    "timing": "09:30 AM - 02:30 PM",
    "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    "about": "Renowned cardiologist offering preventive cardiac diagnostics, coronary artery disease assessment, heart failure management, ECG/2D Echo reporting, and arrhythmia evaluations.",
    "expertise": [
      "Preventive Cardiology",
      "Heart Failure Management",
      "2D Echocardiography & ECG",
      "Cardiovascular Risk Profiling"
    ],
    "roomNo": "Cardiac Care Suite 01 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-neurologist",
    "name": "Dr. Soumya Ranjan Nayak",
    "specialty": "Consultant Neurologist & Neuro-Physician",
    "qualification": "MBBS, MD (Medicine), DM (Neurology)",
    "experience": "13+ Years Experience",
    "fee": 0,
    "feeType": "reception_desk",
    "feeDeskNote": "Reception Desk / Respective Desk",
    "visitingFrequency": "monthly",
    "visitingScheduleText": "Visiting Consultant • Once in a Month (2nd Saturday)",
    "rating": 4.9,
    "reviewsCount": 198,
    "availableDays": [
      "2nd Sat of Month"
    ],
    "timing": "11:00 AM - 04:00 PM",
    "image": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    "about": "Senior visiting neuro-physician specializing in stroke prevention, epilepsy, chronic migraines, peripheral neuropathies, tremors, and Parkinson’s care.",
    "expertise": [
      "Stroke & Cerebrovascular Care",
      "Migraine & Chronic Headache",
      "Epilepsy & Seizure Disorders",
      "Neuropathy & Tremors"
    ],
    "roomNo": "Neuro Consultation Chamber (First Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-urologist",
    "name": "Dr. Debasis Hota",
    "specialty": "Consultant Urologist & Andrologist",
    "qualification": "MBBS, MS (Surgery), MCh (Urology)",
    "experience": "12+ Years Experience",
    "fee": 0,
    "feeType": "dept_specific",
    "feeDeskNote": "Respective Desk / Dept Specific",
    "visitingFrequency": "weekly",
    "visitingScheduleText": "Visiting Specialist • Once in a Week (Every Friday)",
    "rating": 4.8,
    "reviewsCount": 176,
    "availableDays": [
      "Fri"
    ],
    "timing": "04:00 PM - 07:30 PM",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    "about": "Specialist urological consultant for kidney stones, prostate enlargement (BPH), urinary tract ailments, male infertility, and bladder diagnostics.",
    "expertise": [
      "Kidney Stones & Lithotripsy",
      "Prostate & BPH Management",
      "Urological Infections",
      "Male Health & Andrology"
    ],
    "roomNo": "OPD Chamber 07 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-gastro",
    "name": "Dr. S. K. Mahapatra",
    "specialty": "Consultant Gastroenterologist & Hepatologist",
    "qualification": "MBBS, MD (Medicine), DM (Gastroenterology)",
    "experience": "16+ Years Experience",
    "fee": 0,
    "feeType": "dept_specific",
    "feeDeskNote": "Respective Desk / Reception Desk",
    "visitingFrequency": "monthly",
    "visitingScheduleText": "Visiting Super Specialist • Once in a Month (4th Sunday)",
    "rating": 4.9,
    "reviewsCount": 220,
    "availableDays": [
      "4th Sun of Month"
    ],
    "timing": "10:00 AM - 03:00 PM",
    "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    "about": "Expert gastroenterologist for chronic liver ailments, fatty liver, acid peptic diseases, IBS, pancreatitis, and diagnostic endoscopy review.",
    "expertise": [
      "Liver Disease & Cirrhosis",
      "GERD & Peptic Ulcers",
      "IBD & Colon Health",
      "Diagnostic GI Endoscopy"
    ],
    "roomNo": "Gastroenterology Suite (First Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-7",
    "name": "Dr. Manas Ranjan Pradhan",
    "specialty": "Consultant Pathologist & Lab Director",
    "qualification": "MBBS, MD (Pathology), MIAP",
    "experience": "18+ Years Experience",
    "fee": 0,
    "feeType": "free_in_house",
    "feeDeskNote": "Diagnostic In-House (No Consultation Fee)",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Daily In-House Lab Director",
    "rating": 5,
    "reviewsCount": 420,
    "availableDays": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "timing": "08:00 AM - 06:00 PM (Lab Consultations)",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    "about": "Senior Histopathologist and Clinical Pathologist overseeing ND Diagnostics automated laboratories, specialized molecular pathology, biopsy examinations, and clinical correlation.",
    "expertise": [
      "Histopathology & Surgical Biopsies",
      "Hematology & Bone Marrow Aspiration",
      "Cytopathology (FNAC & Pap)",
      "Quality Assurance in Diagnostics"
    ],
    "roomNo": "Pathology & Histopathology Lab Suite",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  },
  {
    "id": "doc-8",
    "name": "Dr. Ananya Mishra",
    "specialty": "Consultant ENT Specialist",
    "qualification": "MBBS, MS (ENT - Otorhinolaryngology)",
    "experience": "10+ Years Experience",
    "fee": 500,
    "feeType": "fixed",
    "visitingFrequency": "regular",
    "visitingScheduleText": "Regular OPD (Mon, Tue, Thu, Fri)",
    "rating": 4.7,
    "reviewsCount": 142,
    "availableDays": [
      "Mon",
      "Tue",
      "Thu",
      "Fri"
    ],
    "timing": "05:00 PM - 08:30 PM",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    "about": "Expert in treating recurrent sinusitis, tonsillitis, hearing impairment, tinnitus, vertigo assessment, and diagnostic nasal endoscopy.",
    "expertise": [
      "Sinus & Allergic Rhinitis",
      "Hearing & Vertigo Assessment",
      "Throat & Voice Disorders",
      "Endoscopic Ear Examinations"
    ],
    "roomNo": "OPD Chamber 06 (Ground Floor)",
    "languages": [
      "English",
      "Hindi",
      "Odia"
    ]
  }
];

export const SERVICES_DATA: ClinicService[] = [
  {
    "id": "srv-gen-med",
    "name": "General Medicine",
    "shortDesc": "Comprehensive primary care, fever management, diabetes, hypertension and lifestyle disease treatment.",
    "description": "Our General Medicine outpatient department serves as the first point of contact for acute and chronic adult health concerns. Backed by in-house point-of-care diagnostics, our physicians ensure rapid diagnosis and evidence-based clinical protocols.",
    "icon": "Stethoscope",
    "department": "Internal Medicine",
    "commonConditions": [
      "Viral Fevers & Typhoid",
      "Uncontrolled Diabetes & BP",
      "Respiratory Infections",
      "Fatigue & Anemia",
      "Thyroid Imbalances"
    ],
    "procedures": [
      "Comprehensive Health Assessment",
      "Vital Monitoring & ECG",
      "Chronic Disease Care Plans",
      "Preventive Health Counseling"
    ],
    "opdDays": "Mon to Sat (Morning & Evening)"
  },
  {
    "id": "srv-pediatrics",
    "name": "Pediatrics & Child Health",
    "shortDesc": "Compassionate pediatric healthcare, growth monitoring, milestone tracking and full vaccination.",
    "description": "Specialized healthcare designed for infants, toddlers, and adolescents. We provide a kid-friendly environment with gentle pediatricians and on-time vaccination protocols.",
    "icon": "Baby",
    "department": "Pediatrics",
    "commonConditions": [
      "Childhood Infections",
      "Neonatal Jaundice",
      "Growth & Height Lag",
      "Asthma & Bronchitis",
      "Nutritional Deficiencies"
    ],
    "procedures": [
      "Complete Immunization Schedule",
      "Growth & Milestone Tracking",
      "Dietary & Lactation Advice",
      "Nebulization & Allergy Care"
    ],
    "opdDays": "Mon to Sat (Daily Morning OPD)"
  },
  {
    "id": "srv-gynecology",
    "name": "Gynecology & Obstetrics",
    "shortDesc": "Holistic care for women across all stages of life, pregnancy care, PCOS management, and wellness.",
    "description": "Expert gynecological consultations with privacy and empathy. From routine screening (Pap smear, Sonography) to antenatal tracking and menopausal wellness.",
    "icon": "HeartHandshake",
    "department": "Women’s Health",
    "commonConditions": [
      "PCOD / PCOS & Irregular Cycles",
      "Pregnancy & Antenatal Checkups",
      "Pelvic Pain & Infections",
      "Menopause Symptoms",
      "Fibroids & Cysts"
    ],
    "procedures": [
      "Antenatal Sonography & Doppler",
      "Pap Smear Cervical Screening",
      "Hormonal Evaluation",
      "Pre-conceptional Counseling"
    ],
    "opdDays": "Mon, Wed, Fri, Sat"
  },
  {
    "id": "srv-orthopedics",
    "name": "Orthopedics & Joint Care",
    "shortDesc": "Advanced evaluation and therapy for joint pain, arthritis, spinal issues, fractures, and sports injuries.",
    "description": "Specialized orthopedic care focused on mobility restoration, non-surgical joint preservation, digital X-Ray analysis, and physical rehabilitation.",
    "icon": "Activity",
    "department": "Orthopedics",
    "commonConditions": [
      "Knee Osteoarthritis",
      "Lower Back Pain & Sciatica",
      "Cervical Spondylosis",
      "Ligament & Tendon Tears",
      "Uric Acid & Gout"
    ],
    "procedures": [
      "Digital High-Res X-Rays",
      "Joint Injections & Aspiration",
      "Plaster & Splinting",
      "Physiotherapy Guidance"
    ],
    "opdDays": "Tue, Thu, Sat Evening"
  },
  {
    "id": "srv-cardiology",
    "name": "Cardiology & Heart Care",
    "shortDesc": "Preventive heart health screening, 12-Lead ECG, 2D Echocardiography, lipid profiling and BP control.",
    "description": "State-of-the-art non-invasive cardiac evaluation unit equipped with digital 12-lead ECG, Color Doppler 2D Echo, and advanced cardiac biomarkers (Troponin, CK-MB, Lipid fraction ratios).",
    "icon": "HeartPulse",
    "department": "Cardiac Sciences",
    "commonConditions": [
      "Chest Discomfort & Angina",
      "High Blood Pressure",
      "Palpitations & Arrhythmias",
      "Dyslipidemia & Plaque Risk",
      "Post-MI Rehabilitation"
    ],
    "procedures": [
      "12-Lead Digital ECG",
      "Color Doppler 2D Echo",
      "High-Sensitivity Troponin-I",
      "Lipid Fraction Diagnostics"
    ],
    "opdDays": "Tue, Thu, Sun"
  },
  {
    "id": "srv-dermatology",
    "name": "Dermatology & Skin Care",
    "shortDesc": "Clinical diagnosis of persistent skin disorders, fungal infections, acne, eczema, and hair loss.",
    "description": "Comprehensive dermatological examinations incorporating digital dermoscopy, fungal scrape microscopy, skin allergy tests, and individualized clinical regimens.",
    "icon": "Sparkles",
    "department": "Dermatology",
    "commonConditions": [
      "Persistent Acne & Scars",
      "Fungal Tinea Infections",
      "Psoriasis & Lichen Planus",
      "Telogen Hair Loss",
      "Eczema & Atopic Dermatitis"
    ],
    "procedures": [
      "Dermoscopy & Biopsy",
      "Wood’s Lamp Examination",
      "Chemical Peeling",
      "Intralesional Injections"
    ],
    "opdDays": "Mon, Wed, Sat Evening"
  },
  {
    "id": "srv-ent",
    "name": "ENT (Ear, Nose & Throat)",
    "shortDesc": "Advanced diagnosis and care for sinus congestion, hearing loss, vertigo, throat and voice problems.",
    "description": "Equipped with diagnostic video otoscopy and nasal endoscopes to pinpoint causes of chronic sinusitis, recurring ear discharge, dizziness, and voice strain.",
    "icon": "Ear",
    "department": "Otorhinolaryngology",
    "commonConditions": [
      "Chronic Sinusitis & Polyps",
      "Hearing Loss & Tinnitus",
      "Vertigo / BPPV",
      "Tonsillitis & Pharyngitis",
      "Deviated Nasal Septum (DNS)"
    ],
    "procedures": [
      "Diagnostic Video Otoscopy",
      "Diagnostic Nasal Endoscopy",
      "Ear Wax Removal / Suction",
      "Audiometry Coordination"
    ],
    "opdDays": "Mon, Tue, Thu, Fri Evening"
  },
  {
    "id": "srv-gastro",
    "name": "Gastroenterology & Liver",
    "shortDesc": "Diagnosis and management of acid peptic disease, fatty liver, IBS, pancreatitis, and hepatitis.",
    "description": "Complete digestive health assessment backed by liver function tests, viral hepatitis markers, abdominal ultrasound, and dietary planning.",
    "icon": "ShieldCheck",
    "department": "Digestive Health",
    "commonConditions": [
      "GERD & Acid Reflux",
      "Grade I/II/III Fatty Liver",
      "Irritable Bowel Syndrome",
      "H. Pylori Gastritis",
      "Jaundice & Hepatitis"
    ],
    "procedures": [
      "Abdominal Sonography",
      "Complete LFT & Amylase/Lipase",
      "H. Pylori Serology/Antigen",
      "Dietary Protocols"
    ],
    "opdDays": "Wed & Sat"
  },
  {
    "id": "srv-urology",
    "name": "Urology & Kidney Care",
    "shortDesc": "Care for kidney stones, urinary tract infections, prostate enlargement, and renal health.",
    "description": "Clinical evaluation of renal function and urinary disorders with point-of-care urine automated analysis, ultrasound KUB, and serum creatinine profiling.",
    "icon": "Droplets",
    "department": "Renal & Urological Care",
    "commonConditions": [
      "Renal & Ureteric Calculi (Stones)",
      "Recurrent UTIs",
      "Benign Prostatic Hyperplasia",
      "Proteinuria & Hematuria",
      "Chronic Kidney Disease Stage 1-3"
    ],
    "procedures": [
      "Ultrasound KUB (Kidney, Ureter, Bladder)",
      "Urine Culture & Sensitivity",
      "Serum Electrolytes & eGFR",
      "Prostate Specific Antigen (PSA)"
    ],
    "opdDays": "Tue & Fri"
  },
  {
    "id": "srv-physio",
    "name": "Physiotherapy & Rehabilitation",
    "shortDesc": "Modern electrotherapy, ultrasonic therapy, manual traction, and exercise therapy for pain relief.",
    "description": "Our certified physiotherapists provide tailored rehabilitation plans for frozen shoulder, slipped disc, post-fracture stiffness, stroke recovery, and postural ergonomics.",
    "icon": "Flame",
    "department": "Physical Medicine & Rehab",
    "commonConditions": [
      "Frozen Shoulder & Rotator Cuff",
      "Lumbar Spondylolisthesis",
      "Post-Op Knee/Hip Rehab",
      "Bell’s Palsy",
      "Neck & Tech-Neck Strain"
    ],
    "procedures": [
      "Shortwave Diathermy & IFT",
      "Therapeutic Ultrasound",
      "TENS & Electrical Muscle Stim",
      "Targeted Strengthening Therapy"
    ],
    "opdDays": "Mon to Sat (08:00 AM - 07:00 PM)"
  },
  {
    "id": "srv-nutrition",
    "name": "Nutrition & Clinical Dietetics",
    "shortDesc": "Personalized evidence-based meal plans for diabetes, cholesterol reduction, fatty liver, and weight loss.",
    "description": "Expert clinical dietitians design sustainable nutrition charts customized to local food habits, metabolic blood test indicators, and personal lifestyle goals.",
    "icon": "Apple",
    "department": "Preventive Nutrition",
    "commonConditions": [
      "Prediabetes & High HbA1c",
      "High Triglycerides / LDL",
      "PCOS Weight Resistance",
      "Uric Acid Diet Planning",
      "Renal Diet Planning"
    ],
    "procedures": [
      "Body Composition Analysis",
      "Macronutrient Breakdown",
      "Custom Weekly Meal Plans",
      "Follow-up Bio-tracking"
    ],
    "opdDays": "Mon to Sat"
  },
  {
    "id": "srv-neurology",
    "name": "Neurology Consultation",
    "shortDesc": "Specialist assessment for chronic migraines, epilepsy, neuropathy, tremors, and stroke prevention.",
    "description": "Comprehensive neurological screening with clinical reflex analysis, diabetic peripheral neuropathy detection, and neuro-vascular risk factor profiling.",
    "icon": "Zap",
    "department": "Neurosciences",
    "commonConditions": [
      "Chronic Migraine & Tension Headache",
      "Diabetic Peripheral Neuropathy",
      "Seizures & Blackouts",
      "Vertigo & Balance Impairment",
      "Tremors & Parkinsonism"
    ],
    "procedures": [
      "Neurological Cranial Nerve Exam",
      "Monofilament Sensitivity Test",
      "Vitamin B12 & Folate Profiling",
      "Carotid Doppler Coordination"
    ],
    "opdDays": "Mon & Thu"
  }
];

export const PACKAGES_DATA: HealthPackage[] = [
  {
    "id": "pkg-basic",
    "name": "Basic Health Checkup",
    "tagline": "Essential screening for everyday wellness and early anomaly detection.",
    "price": 999,
    "originalPrice": 2200,
    "discountPercent": 55,
    "testsCount": 38,
    "parametersCount": 42,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (6-8 Hours)",
    "fastingRequired": true,
    "fastingDetails": "10-12 hours overnight fasting mandatory.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Adults aged 18-45 looking for annual baseline preventive screening.",
    "colorTheme": "blue",
    "testsIncluded": [
      {
        "category": "Hematology",
        "tests": [
          "Complete Blood Count (CBC - 24 Parameters)",
          "ESR (Erythrocyte Sedimentation Rate)"
        ]
      },
      {
        "category": "Diabetes Screening",
        "tests": [
          "Fasting Blood Sugar (FBS)"
        ]
      },
      {
        "category": "Kidney Profile",
        "tests": [
          "Serum Creatinine",
          "Blood Urea",
          "Uric Acid"
        ]
      },
      {
        "category": "Lipid Health",
        "tests": [
          "Total Cholesterol",
          "Triglycerides",
          "HDL Cholesterol"
        ]
      },
      {
        "category": "Liver Screen",
        "tests": [
          "SGPT (ALT)",
          "SGOT (AST)",
          "Total Bilirubin"
        ]
      },
      {
        "category": "Urine Analysis",
        "tests": [
          "Complete Urine Routine & Microscopy (18 Parameters)"
        ]
      }
    ],
    "preparation": [
      "Fast for 10-12 hours overnight before sample collection.",
      "Plain drinking water is permitted.",
      "Collect early morning midstream urine in the provided sterile vial."
    ]
  },
  {
    "id": "pkg-complete",
    "name": "Complete Health Checkup",
    "tagline": "Comprehensive 72-parameter diagnostic check covering vital organs and vitamins.",
    "price": 1999,
    "originalPrice": 4800,
    "discountPercent": 58,
    "testsCount": 65,
    "parametersCount": 72,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (Evening)",
    "fastingRequired": true,
    "fastingDetails": "10-12 hours overnight fasting mandatory.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Men & Women aged 30+ wanting deep insights into liver, kidney, thyroid, heart and vitamins.",
    "colorTheme": "teal",
    "testsIncluded": [
      {
        "category": "Complete Hemogram",
        "tests": [
          "Complete Blood Count (CBC with ESR - 24 parameters)",
          "Peripheral Smear Examination"
        ]
      },
      {
        "category": "Advanced Diabetes Profile",
        "tests": [
          "HbA1c (Glycated Hemoglobin by HPLC)",
          "Estimated Average Glucose (eAG)",
          "Fasting Blood Sugar"
        ]
      },
      {
        "category": "Full Lipid Profile (8 Parameters)",
        "tests": [
          "Total Cholesterol",
          "Triglycerides",
          "HDL",
          "LDL",
          "VLDL",
          "Cholesterol/HDL Ratio",
          "LDL/HDL Ratio"
        ]
      },
      {
        "category": "Liver Function Test (11 Parameters)",
        "tests": [
          "Total Bilirubin",
          "Direct & Indirect Bilirubin",
          "SGOT",
          "SGPT",
          "Alkaline Phosphatase",
          "Total Protein",
          "Albumin",
          "Globulin",
          "A/G Ratio"
        ]
      },
      {
        "category": "Kidney Function Test (9 Parameters)",
        "tests": [
          "Serum Creatinine",
          "Blood Urea Nitrogen",
          "Uric Acid",
          "Sodium",
          "Potassium",
          "Chloride",
          "Calcium",
          "eGFR"
        ]
      },
      {
        "category": "Thyroid Function",
        "tests": [
          "TSH (Ultrasensitive 3rd Gen CLIA)"
        ]
      },
      {
        "category": "Vital Vitamin Assessment",
        "tests": [
          "Vitamin D (25-OH) Total",
          "Vitamin B12 Level"
        ]
      },
      {
        "category": "Cardiac & Urine Analysis",
        "tests": [
          "Complete Urine Routine & Microscopy (18 params)"
        ]
      }
    ],
    "preparation": [
      "10-12 hours overnight fasting required.",
      "Avoid high-fat meal or alcohol the night before.",
      "Take morning blood pressure medication with a sip of water if prescribed."
    ]
  },
  {
    "id": "pkg-diabetes",
    "name": "Diabetes Care & Metabolic Package",
    "tagline": "Specialized diagnostic panel to evaluate insulin control and diabetic complications.",
    "price": 799,
    "originalPrice": 1850,
    "discountPercent": 57,
    "testsCount": 22,
    "parametersCount": 26,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (4 Hours)",
    "fastingRequired": true,
    "fastingDetails": "Fasting sample + PP (Post Prandial 2 hours after breakfast) sample.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Individuals with diabetes, prediabetes, family history of diabetes, or insulin resistance.",
    "colorTheme": "cyan",
    "testsIncluded": [
      {
        "category": "Glycemic Control",
        "tests": [
          "HbA1c by HPLC (3 Months Average)",
          "Fasting Blood Sugar (FBS)",
          "Post Prandial Blood Sugar (PPBS)"
        ]
      },
      {
        "category": "Diabetic Renal Health",
        "tests": [
          "Serum Creatinine",
          "Blood Urea",
          "eGFR Calculation",
          "Urine Microalbumin/Creatinine Ratio (Early Kidney Marker)"
        ]
      },
      {
        "category": "Lipid Cardiovascular Assessment",
        "tests": [
          "Total Cholesterol",
          "Triglycerides",
          "HDL & LDL Direct"
        ]
      },
      {
        "category": "Urine Analysis",
        "tests": [
          "Urine Routine Examination (Urine Glucose & Ketones)"
        ]
      }
    ],
    "preparation": [
      "Fast 8-10 hours for the fasting sample.",
      "Have normal breakfast with regular medicines, then give 2nd blood sample exactly 2 hours after meal completion."
    ]
  },
  {
    "id": "pkg-women",
    "name": "Women's Wellness Health Package",
    "tagline": "Tailored specifically for hormonal balance, bone density, anemia, thyroid and wellness.",
    "price": 1499,
    "originalPrice": 3500,
    "discountPercent": 57,
    "testsCount": 48,
    "parametersCount": 54,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (6 Hours)",
    "fastingRequired": true,
    "fastingDetails": "10 hours overnight fasting recommended.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Women of all ages (PCOS, thyroid issues, fatigue, pre/post menopause, bone health).",
    "colorTheme": "rose",
    "testsIncluded": [
      {
        "category": "Anemia & Iron Profile",
        "tests": [
          "CBC with ESR (24 params)",
          "Serum Iron",
          "Serum Ferritin (Stored Iron)"
        ]
      },
      {
        "category": "Thyroid & Hormonal Screen",
        "tests": [
          "Complete Thyroid Profile (T3, T4, TSH Ultrasensitive CLIA)"
        ]
      },
      {
        "category": "Bone & Vitamin Health",
        "tests": [
          "Vitamin D (25-OH)",
          "Serum Calcium",
          "Serum Phosphorus"
        ]
      },
      {
        "category": "Metabolic & Vital Organ Screen",
        "tests": [
          "Fasting Blood Glucose",
          "Lipid Profile Screen",
          "Liver & Kidney Parameters",
          "Urine Routine Examination"
        ]
      }
    ],
    "preparation": [
      "10 hours fasting before sample collection.",
      "Mention menstrual cycle date if hormonal tests are requested."
    ]
  },
  {
    "id": "pkg-men",
    "name": "Men's Vital Health Package",
    "tagline": "Comprehensive screening for cardiac risk, liver vitality, uric acid, and prostate health.",
    "price": 1499,
    "originalPrice": 3400,
    "discountPercent": 56,
    "testsCount": 50,
    "parametersCount": 56,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (6 Hours)",
    "fastingRequired": true,
    "fastingDetails": "10-12 hours overnight fasting.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Men aged 25+ seeking cardiovascular, liver, uric acid and lifestyle screening.",
    "colorTheme": "blue",
    "testsIncluded": [
      {
        "category": "Cardiac & Lipid Risk",
        "tests": [
          "Full Lipid Profile (8 Parameters)",
          "hs-CRP Marker"
        ]
      },
      {
        "category": "Liver & Metabolism",
        "tests": [
          "Liver Function Test (11 Parameters)",
          "Fasting Blood Sugar",
          "HbA1c"
        ]
      },
      {
        "category": "Kidney & Joints",
        "tests": [
          "Kidney Function Test",
          "Serum Uric Acid (Gout Risk)"
        ]
      },
      {
        "category": "General & Immunity",
        "tests": [
          "CBC with ESR",
          "Vitamin D Total",
          "Urine Routine"
        ]
      }
    ],
    "preparation": [
      "10-12 hours overnight fast.",
      "Avoid strenuous exercise 24 hours prior."
    ]
  },
  {
    "id": "pkg-senior",
    "name": "Senior Citizen Comprehensive Package",
    "tagline": "Specially engineered for seniors (60+) to monitor heart, kidney, bones, and joint health.",
    "price": 1999,
    "originalPrice": 5200,
    "discountPercent": 62,
    "testsCount": 70,
    "parametersCount": 78,
    "sampleType": "Blood & Urine",
    "reportTime": "Same Day (Evening)",
    "fastingRequired": true,
    "fastingDetails": "10 hours overnight fasting.",
    "homeCollectionAvailable": true,
    "recommendedFor": "Senior citizens aged 55+ with free priority home collection.",
    "colorTheme": "emerald",
    "testsIncluded": [
      {
        "category": "Cardiac & Vascular Screen",
        "tests": [
          "Complete Lipid Profile (8 Parameters)",
          "Cardiac Risk Factors",
          "12-Lead ECG at Clinic"
        ]
      },
      {
        "category": "Diabetes & Metabolism",
        "tests": [
          "HbA1c by HPLC",
          "Fasting Blood Sugar",
          "Average Blood Glucose"
        ]
      },
      {
        "category": "Bone & Joint Strength",
        "tests": [
          "Vitamin D (25-OH)",
          "Vitamin B12",
          "Serum Calcium",
          "Uric Acid"
        ]
      },
      {
        "category": "Renal & Hepatic Function",
        "tests": [
          "Full Kidney Function Test with Electrolytes (Na, K, Cl)",
          "Full Liver Function Test"
        ]
      },
      {
        "category": "General & Prostate / Thyroid",
        "tests": [
          "CBC with ESR (24 Params)",
          "TSH Ultrasensitive",
          "Urine Routine & Microscopic"
        ]
      }
    ],
    "preparation": [
      "10 hours overnight fasting.",
      "Senior patients receive free home sample collection and priority digital reporting."
    ]
  }
];

export const ALL_TESTS_DATA: DiagnosticTest[] = [
  {
    "id": "test-cat-1-cg002",
    "name": "1P/19Q By FISH",
    "code": "CG002",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: CG002 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (CG002) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 10500,
    "originalPrice": 13125,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-2-3-small",
    "name": "3 SMALL BIOPSY",
    "code": "3 SMALL",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: 3 SMALL | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (3 SMALL) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2400,
    "originalPrice": 3000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-3-biopl",
    "name": "BIOPSY - LARGE",
    "code": "BIOPL",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: BIOPL | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (BIOPL) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-4-biopm",
    "name": "BIOPSY - MEDIUM",
    "code": "BIOPM",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: BIOPM | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (BIOPM) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 600,
    "originalPrice": 750,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-5-biops",
    "name": "BIOPSY SMALL",
    "code": "BIOPS",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: BIOPS | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (BIOPS) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-6-bone",
    "name": "BONE MARROW ASPIRATION",
    "code": "BONE",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: BONE | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (BONE) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1500,
    "originalPrice": 1875,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-7-out",
    "name": "BONE MARROW ASPIRATION OUT SIDE",
    "code": "OUT",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: OUT | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (OUT) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-8-cb",
    "name": "CELL BLOCK FOR CYTOLOGY",
    "code": "CB",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: CB | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (CB) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 600,
    "originalPrice": 750,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-9-her",
    "name": "CYTOGENETICS: HER2/neu - FISH",
    "code": "HER",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: HER | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (HER) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 12500,
    "originalPrice": 15625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-10-cyto-sme",
    "name": "CYTOLOGY SMEAR FOR OPENIAN",
    "code": "CYTO SME",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: CYTO SME | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (CYTO SME) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-11-erpr",
    "name": "ER PR Her2Nue kI67",
    "code": "ERPR",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: ERPR | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (ERPR) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4500,
    "originalPrice": 5625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-12-fnac",
    "name": "F.N.A.C",
    "code": "FNAC",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: FNAC | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (FNAC) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-13-fluid-cell",
    "name": "FLUID FOR CELL COUNT / CELLTYPE",
    "code": "FLUID CELL",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: FLUID CELL | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (FLUID CELL) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 400,
    "originalPrice": 500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-14-malig",
    "name": "FLUID FOR MALIGNANT CELLS",
    "code": "MALIG",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: MALIG | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (MALIG) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 400,
    "originalPrice": 500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-15-fta",
    "name": "FTA - ABS",
    "code": "FTA",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: FTA | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (FTA) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2500,
    "originalPrice": 3125,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-16-her2",
    "name": "HER2/Neu",
    "code": "HER2",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: HER2 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (HER2) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1800,
    "originalPrice": 2250,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-17-ihc3",
    "name": "IHC MARKERS -3 (CD117,OCT3/4,CD30)",
    "code": "IHC3",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: IHC3 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (IHC3) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 6000,
    "originalPrice": 7500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-18-ihc1",
    "name": "IHC ONE ANTIGEN",
    "code": "IHC1",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: IHC1 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (IHC1) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2000,
    "originalPrice": 2500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-19-ihc-package--2",
    "name": "IHC PACKAGE-2",
    "code": "IHC PACKAGE -2",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: IHC PACKAGE -2 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (IHC PACKAGE -2) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 6950,
    "originalPrice": 8688,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-20-ihc2",
    "name": "IHC TWO ANTIGENS",
    "code": "IHC2",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: IHC2 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (IHC2) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4000,
    "originalPrice": 5000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-21-j271",
    "name": "IMMUNOHISTIOCHEMISTRY: NELL1",
    "code": "J271",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: J271 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (J271) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4000,
    "originalPrice": 5000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-22-j077",
    "name": "IMMUNOHISTOCHEMISTRY: EPIDERMAL GROWTH FACTOR RECEPTOR (EGFR)",
    "code": "J077",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: J077 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (J077) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4000,
    "originalPrice": 5000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-23-j207",
    "name": "IMMUNOHISTOCHEMISTRY: PD-L1 CLONE SP263 (VENTANA)",
    "code": "J207",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: J207 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (J207) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 6200,
    "originalPrice": 7750,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-24-kidney",
    "name": "KIDNEY BIOPSY (LM & IF)",
    "code": "KIDNEY",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: KIDNEY | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (KIDNEY) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4500,
    "originalPrice": 5625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-25-lm",
    "name": "KIDNEY BIOPSY - LM ONLY",
    "code": "LM",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: LM | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (LM) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1000,
    "originalPrice": 1250,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-26-kidney-em",
    "name": "KIDNEY BIOPSY EM STUDY",
    "code": "KIDNEY EM",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: KIDNEY EM | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (KIDNEY EM) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 7500,
    "originalPrice": 9375,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-27-kbioma",
    "name": "KIDNEY BIOPSY MATERIALS",
    "code": "KBIOMA",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: KBIOMA | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (KBIOMA) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4500,
    "originalPrice": 5625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-28-renal",
    "name": "KIDNY BIOPSY (RENAL TRANSPLANTATION)",
    "code": "RENAL",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: RENAL | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (RENAL) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 3000,
    "originalPrice": 3750,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-29-liver-bi",
    "name": "LIVER BIOPSY",
    "code": "LIVER BI",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: LIVER BI | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (LIVER BI) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1000,
    "originalPrice": 1250,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-30-n160",
    "name": "MICROSATELLITE INSTABILITY (MSI) PCR",
    "code": "N160",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: N160 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (N160) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 10000,
    "originalPrice": 12500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-31-md069",
    "name": "O6-Methylguanine Methyltransferase (MGMT) Promoter",
    "code": "MD069",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: MD069 | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (MD069) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 12500,
    "originalPrice": 15625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-32-pap",
    "name": "PAP SMEAR FOR CYTOLOGY",
    "code": "PAP",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: PAP | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (PAP) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-33-ihc",
    "name": "PD-L1 IHC",
    "code": "IHC",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: IHC | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (IHC) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 8000,
    "originalPrice": 10000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-34-pla2r",
    "name": "PLA2R IHC MARKER",
    "code": "PLA2R",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: PLA2R | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (PLA2R) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 3000,
    "originalPrice": 3750,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-35-proce",
    "name": "PROCEDURE CHARGES",
    "code": "PROCE",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: PROCE | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (PROCE) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4500,
    "originalPrice": 5625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-36-radical-biopsy",
    "name": "Radical Biopsy",
    "code": "Radical Biopsy",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: Radical Biopsy | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (Radical Biopsy) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4800,
    "originalPrice": 6000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-37-return",
    "name": "Return Blocks or Slides Up to 3",
    "code": "Return",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: Return | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (Return) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 250,
    "originalPrice": 313,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-38-returns",
    "name": "Return Blocks or Slides 3-5",
    "code": "returns",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: returns | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (returns) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-39-blocks",
    "name": "Return Blocks or Slides 7-10",
    "code": "blocks",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: blocks | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (blocks) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1000,
    "originalPrice": 1250,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-40-return-blocks-or-slides",
    "name": "Return Blocks or Slides5-7",
    "code": "return blocks or slides",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: return blocks or slides | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (return blocks or slides) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 750,
    "originalPrice": 938,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-41-scrape",
    "name": "SCRAPE CYTOLOGY",
    "code": "SCRAPE",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SCRAPE | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SCRAPE) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1500,
    "originalPrice": 1875,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-42-skin-bio",
    "name": "SKIN BIOPSY -1",
    "code": "SKIN BIO",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SKIN BIO | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SKIN BIO) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1500,
    "originalPrice": 1875,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-43-skin-lm---if",
    "name": "SKIN BIOPSY LM & IF",
    "code": "SKIN LM & IF",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SKIN LM & IF | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SKIN LM & IF) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 3500,
    "originalPrice": 4375,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-44-skin-biop",
    "name": "SKIN BIOPSY-2",
    "code": "SKIN BIOP",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SKIN BIOP | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SKIN BIOP) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 3500,
    "originalPrice": 4375,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-45-skin-biopsy",
    "name": "SKIN BIOPSY-3",
    "code": "SKIN BIOPSY",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SKIN BIOPSY | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SKIN BIOPSY) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 5000,
    "originalPrice": 6250,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-46-second-op",
    "name": "SLIDE AND BLOCK FOR SECOND OPENIAN",
    "code": "SECOND OP",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: SECOND OP | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (SECOND OP) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1300,
    "originalPrice": 1625,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-47-two-large-biopsys",
    "name": "TWO LARGE BIOPSYS",
    "code": "TWO LARGE BIOPSYS",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: TWO LARGE BIOPSYS | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (TWO LARGE BIOPSYS) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4800,
    "originalPrice": 6000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-48-two-medium-biopsys",
    "name": "TWO MEDIUM BIOPSYS",
    "code": "TWO MEDIUM BIOPSYS",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: TWO MEDIUM BIOPSYS | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (TWO MEDIUM BIOPSYS) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4000,
    "originalPrice": 5000,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-49-2-biop",
    "name": "TWO SMALL BIOPSYS",
    "code": "2 BIOP",
    "category": "Biopsy & Histopathology",
    "subCategory": "Histopathology & Cytology",
    "shortDesc": "Diagnostic code: 2 BIOP | ANATOMICAL PATHOLOGY AND CYTOLOGY",
    "description": "Official ND Diagnostics standardized test (2 BIOP) under DEPARTMENT OF ANATOMICAL PATHOLOGY AND CYTOLOGY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2000,
    "originalPrice": 2500,
    "sampleType": "Tissue Biopsy / Smear Slide in 10% Formalin",
    "reportTime": "48 to 72 Hours",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-50-alcohol",
    "name": "ALCOHOL -SERUM",
    "code": "ALCOHOL",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: ALCOHOL | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (ALCOHOL) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2500,
    "originalPrice": 3125,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-51-cpeptide",
    "name": "C - PEPTIDE",
    "code": "CPEPTIDE",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: CPEPTIDE | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (CPEPTIDE) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-52-cholin",
    "name": "Cholinesterase",
    "code": "CHOLIN",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: CHOLIN | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (CHOLIN) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 600,
    "originalPrice": 750,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-53-copper",
    "name": "Copper - Serum",
    "code": "COPPER",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: COPPER | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (COPPER) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-54-fena",
    "name": "Fractional excretion of sodium (Fe Na+)",
    "code": "FENA",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: FENA | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (FENA) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-55-gastrin",
    "name": "GASTRIN LEVEL",
    "code": "gastrin",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: gastrin | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (gastrin) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2500,
    "originalPrice": 3125,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-56-insuf",
    "name": "INSULIN -SERUM",
    "code": "INSUF",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: INSUF | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (INSUF) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 600,
    "originalPrice": 750,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-57-iron",
    "name": "IRON - SERUM",
    "code": "IRON",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: IRON | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (IRON) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-58-metane",
    "name": "METANENEPHRINES - URINE",
    "code": "METANE",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: METANE | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (METANE) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2500,
    "originalPrice": 3125,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-59-pregen",
    "name": "PREGNANCY TEST",
    "code": "PREGEN",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: PREGEN | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (PREGEN) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 200,
    "originalPrice": 250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-60-proges",
    "name": "PROGESTERONE - SERUM",
    "code": "PROGES",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: PROGES | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (PROGES) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-61-nas",
    "name": "SODIUM - SERUM/PLASMA",
    "code": "NAS",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: NAS | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (NAS) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 200,
    "originalPrice": 250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-62-trans",
    "name": "TRANSFERRITIN",
    "code": "TRANS",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: TRANS | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (TRANS) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1200,
    "originalPrice": 1500,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-63-trop-i",
    "name": "TROPONIN - I",
    "code": "TROP I",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: TROP I | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (TROP I) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1000,
    "originalPrice": 1250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-64-uuacid",
    "name": "URIC ACID - SPOT URINE",
    "code": "UUACID",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: UUACID | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (UUACID) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 300,
    "originalPrice": 375,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-65-s278",
    "name": "(1, 3)-BETA-D-GLUCAN (BDG)",
    "code": "S278",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: S278 | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (S278) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 13000,
    "originalPrice": 16250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-66-17-ohp",
    "name": "17-alpha Hydroxy Progesterone (17-OHP)",
    "code": "17-OHP",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 17-OHP | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (17-OHP) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2600,
    "originalPrice": 3250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-67-24prote",
    "name": "24 Hours URINE PROTEIN",
    "code": "24PROTE",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24PROTE | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24PROTE) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-68-vma24",
    "name": "24 HRS URINARY VMA",
    "code": "vma24",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: vma24 | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (vma24) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 2500,
    "originalPrice": 3125,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-69-24-hrs",
    "name": "24 HRS URINE ANALYSIS",
    "code": "24 HRS",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24 HRS | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24 HRS) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 5000,
    "originalPrice": 6250,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-70-cal24",
    "name": "24 Hrs URINE CALCIUM",
    "code": "CAL24",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: CAL24 | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (CAL24) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-71-cate",
    "name": "24 HRS URINE CATECHOLAMINES",
    "code": "CATE",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: CATE | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (CATE) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 4500,
    "originalPrice": 5625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-72-24clor",
    "name": "24 HRS URINE CHLORIDE",
    "code": "24CLOR",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24CLOR | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24CLOR) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-73-copp24",
    "name": "24 HRS Urine COPPER",
    "code": "copp24",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: copp24 | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (copp24) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 1850,
    "originalPrice": 2313,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-74-24-hrs-urea",
    "name": "24 Hrs URINE FOR UREA",
    "code": "24 HRS UREA",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24 HRS UREA | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24 HRS UREA) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-75-24fc",
    "name": "24 HRS URINE FREE CORTISOL",
    "code": "24FC",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24FC | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24FC) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 800,
    "originalPrice": 1000,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-76-24megn",
    "name": "24 HRS URINE MEGNISSIUM",
    "code": "24MEGN",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24MEGN | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24MEGN) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-77-24po4",
    "name": "24 HRS URINE PHOSPHARUS",
    "code": "24PO4",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24PO4 | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24PO4) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-78-24pot",
    "name": "24 HRS URINE POTASSIUM",
    "code": "24POT",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24POT | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24POT) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-79-24sodi",
    "name": "24 HRS URINE SODIUM",
    "code": "24SODI",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24SODI | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24SODI) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  },
  {
    "id": "test-cat-80-24crea",
    "name": "24Hrs URINE CREATININE",
    "code": "24CREA",
    "category": "Pathology",
    "subCategory": "Clinical Biochemistry",
    "shortDesc": "Diagnostic code: 24CREA | CLINICAL BIOCHEMISTRY",
    "description": "Official ND Diagnostics standardized test (24CREA) under DEPARTMENT OF CLINICAL BIOCHEMISTRY. Accurate quantitative and qualitative analysis with strict laboratory calibration and MD Pathologist verification.",
    "price": 500,
    "originalPrice": 625,
    "sampleType": "Clinical Assessment / Center Visit",
    "reportTime": "Same Day",
    "fastingRequired": false,
    "homeCollectionAvailable": false,
    "parametersCount": 1,
    "popular": false
  }
];

export const BLOGS_DATA: BlogPost[] = [
  {
    "id": "blog-1",
    "title": "Understanding Your Complete Blood Count (CBC) Report: What Every Patient Should Know",
    "slug": "understanding-your-cbc-report",
    "category": "Diagnostic Education",
    "readTime": "4 min read",
    "publishDate": "August 18, 2026",
    "author": {
      "name": "Dr. Manas Ranjan Pradhan",
      "role": "Consultant Pathologist & Lab Director"
    },
    "excerpt": "Demystifying hemoglobin, platelet counts, and leukocyte indices to help you understand your body’s infection response and oxygen-carrying capacity.",
    "content": "Complete Blood Count (CBC) is the most widely prescribed diagnostic test in clinical medicine. It gives a panoramic overview of cellular components circulating in your bloodstream.\n\n### 1. Hemoglobin & Red Blood Cells (RBCs)\nHemoglobin is the iron-rich protein inside red blood cells responsible for transporting oxygen from your lungs to your organs. Normal male ranges fall between 13.0 - 17.0 g/dL and females between 12.0 - 15.0 g/dL. Lower values indicate anemia, which can stem from dietary iron deficiency, Vitamin B12 deficiency, or blood loss.\n\n### 2. Total Leukocyte Count (TLC) and White Cells\nWhite blood cells form your immune army. Elevated TLC (>11,000 /cumm) indicates that your body is fighting a bacterial or acute viral infection. Neutrophils rise rapidly during bacterial attacks, whereas Lymphocytes play a major role in antiviral defense.\n\n### 3. Platelets\nPlatelets are micro-cellular fragments vital for blood clotting. A healthy range is 1.5 to 4.5 Lakh/cumm. Transient drops can happen during seasonal viral fevers (like Dengue or Malaria), requiring careful monitoring.\n\nAt ND Diagnostics, all CBCs are run on automated 5-part laser cell counters with microscopic slide verification by consultant pathologists whenever abnormal flags are detected.",
    "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "CBC",
      "Anemia",
      "Pathology",
      "Blood Health"
    ]
  },
  {
    "id": "blog-2",
    "title": "Why HbA1c Is Far Superior to Fasting Sugar for Monitoring Diabetes",
    "slug": "why-hba1c-is-superior-for-diabetes",
    "category": "Diabetes Care",
    "readTime": "5 min read",
    "publishDate": "August 10, 2026",
    "author": {
      "name": "Dr. Rajesh N. Panda",
      "role": "Consultant Physician & Diabetologist"
    },
    "excerpt": "Why single-point fingerprick glucose can be misleading and how 3-month Glycated Hemoglobin (HbA1c) protects your heart, eyes, and kidneys.",
    "content": "Daily blood glucose levels fluctuate wildly based on your last meal, emotional stress, physical activity, and sleep. A patient might have a normal fasting glucose of 95 mg/dL because they ate very little dinner the previous night, yet have damaging blood sugar spikes during the day.\n\n### What is HbA1c?\nGlucose in the bloodstream permanently attaches to hemoglobin inside red blood cells. Because red blood cells live for approximately 120 days, measuring this 'glycated hemoglobin' provides a weighted average of your blood glucose over the past 3 months.\n\n### Interpreting HbA1c Levels:\n- **Below 5.7%**: Normal\n- **5.7% to 6.4%**: Prediabetes (Impaired Glucose Tolerance - reversible with diet/lifestyle!)\n- **6.5% and Above**: Diabetes Mellitus\n\nFor diabetic patients, keeping your HbA1c below 7.0% dramatically reduces the risk of diabetic retinopathy (vision loss), nephropathy (kidney disease), and diabetic neuropathy.",
    "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "Diabetes",
      "HbA1c",
      "Metabolic Health",
      "Preventive Care"
    ]
  },
  {
    "id": "blog-3",
    "title": "The Silent Threat of High Cholesterol: Decoding Your Lipid Profile",
    "slug": "decoding-your-lipid-profile",
    "category": "Cardiology",
    "readTime": "4 min read",
    "publishDate": "August 02, 2026",
    "author": {
      "name": "Dr. Bikram K. Jena",
      "role": "Consultant Cardiologist"
    },
    "excerpt": "Learn the difference between HDL (good cholesterol), LDL (bad cholesterol), and triglycerides, and why routine screening is essential.",
    "content": "High cholesterol is termed a 'silent killer' because arterial plaque buildup causes zero pain until it blocks blood flow to the heart or brain.\n\n### The Critical Lipid Markers:\n1. **LDL (Low-Density Lipoprotein)**: Often termed 'bad cholesterol', elevated LDL particles penetrate the endothelium of coronary arteries, creating atherosclerotic plaques.\n2. **HDL (High-Density Lipoprotein)**: 'Good cholesterol' that scavenges excess cholesterol from arteries and transports it back to the liver for excretion. Values above 50 mg/dL offer cardiac protection.\n3. **Triglycerides**: Fats derived from dietary refined carbohydrates and sugars. High triglycerides coupled with low HDL is a classic marker of metabolic syndrome.\n\nEarly detection with an annual Lipid Profile test allows simple dietary adjustments, exercise routines, and preventive therapies before any cardiovascular damage occurs.",
    "image": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "Cardiology",
      "Lipid Profile",
      "Heart Health",
      "Cholesterol"
    ]
  },
  {
    "id": "blog-4",
    "title": "Histopathology Biopsies: Why Early Microscopic Tissue Examination Saves Lives",
    "slug": "histopathology-biopsies-early-tissue-examination",
    "category": "Histopathology & Biopsy",
    "readTime": "6 min read",
    "publishDate": "July 26, 2026",
    "author": {
      "name": "Dr. Manas Ranjan Pradhan",
      "role": "Consultant Pathologist & Lab Director"
    },
    "excerpt": "Understanding the vital role of surgical biopsies, FNAC, and tissue staining in diagnosing chronic swellings and preventing malignancy.",
    "content": "While routine blood tests analyze body biochemistry, histopathology examines actual cellular tissue architecture under high-magnification microscopy.\n\n### When is a Biopsy Recommended?\nWhenever your physician discovers an unexplained lump, persistent mucosal ulcer, enlarged lymph node, skin lesion, or atypical imaging finding, a small tissue sample is retrieved to provide an unequivocal diagnosis.\n\n### The Histopathology Workflow at ND Diagnostics:\n1. **Fixation**: Tissues are preserved in 10% neutral buffered formalin to prevent cellular autolysis.\n2. **Tissue Processing & Wax Embedding**: Samples undergo dehydration and paraffin block casting.\n3. **Microtomy & H&E Staining**: Ultra-thin 4-micron slices are mounted on glass slides and stained.\n4. **Expert Review**: Every specimen is microscopically evaluated by Dr. Manas Ranjan Pradhan for accurate pathological staging.\n\nEarly histopathology diagnosis is the foundation for targeted, successful medical treatments.",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "Histopathology",
      "Biopsy",
      "FNAC",
      "Pathology"
    ]
  },
  {
    "id": "blog-5",
    "title": "PCOS and Hormonal Balance: Clinical Management and Diagnostic Tests",
    "slug": "pcos-hormonal-balance-clinical-management",
    "category": "Women's Health",
    "readTime": "5 min read",
    "publishDate": "July 15, 2026",
    "author": {
      "name": "Dr. Sunita Tripathy",
      "role": "Consultant Gynecologist & Obstetrician"
    },
    "excerpt": "Navigating irregular cycles, weight resistance, and androgen spikes with comprehensive ultrasound and endocrine testing.",
    "content": "Polycystic Ovary Syndrome (PCOS) affects 1 in 5 reproductive-age women. It is primarily an endocrine and metabolic condition rather than merely an ovarian disorder.\n\n### Key Clinical Signs:\n- Irregular or missed menstrual cycles\n- Persistent acne and facial hirsutism\n- Difficulty losing weight due to insulin resistance\n\n### Recommended Diagnostic Workup:\n1. **Pelvic Ultrasound (USG)** to visualize follicular cysts.\n2. **Endocrine Blood Panel**: LH/FSH ratio, Fasting Insulin, Free Testosterone, and Thyroid (TSH).\n3. **Lipid and Glucose Screening** to monitor long-term cardiometabolic wellness.\n\nWith personalized medical care and dietary changes, PCOS symptoms can be completely controlled.",
    "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    "tags": [
      "PCOS",
      "Gynecology",
      "Hormones",
      "Ultrasound"
    ]
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    "id": "faq-1",
    "category": "Appointments",
    "question": "How can I book a doctor appointment at ND Diagnostics?",
    "answer": "You can book directly through this website by clicking \"Book Appointment\", selecting your required specialty and doctor, choosing your preferred date and time slot, and providing patient details. You will instantly receive a confirmed Appointment ID (e.g. ND-2026-00125). Alternatively, you can call our direct clinic line: +919827493536."
  },
  {
    "id": "faq-2",
    "category": "Lab Tests",
    "question": "Can I book diagnostic lab tests online?",
    "answer": "Yes! You can search through our extensive diagnostic catalog of over 150+ blood, urine, imaging, and histopathology tests or preventive health packages. You can choose whether you prefer visiting our centre or opting for our rapid doorstep Home Sample Collection."
  },
  {
    "id": "faq-3",
    "category": "Home Collection",
    "question": "Is home sample collection available in my area?",
    "answer": "Yes, our certified phlebotomists provide sterile, temperature-monitored home sample collection from 06:30 AM to 07:00 PM across town and surrounding areas. Call our dedicated laboratory dispatch desk at +918249769121 to book immediate slots."
  },
  {
    "id": "faq-4",
    "category": "Reports",
    "question": "How do I view and download my diagnostic reports?",
    "answer": "Simply click \"Download Reports\" on the header or enter your Patient ID / Registered Mobile Number on the Reports portal. Once verified, you can view your real-time analyte values, interactive parameter health trends, and download official verified PDF reports with pathologist signatures."
  },
  {
    "id": "faq-5",
    "category": "Lab Tests",
    "question": "Do I need to fast before a blood test?",
    "answer": "Tests like Fasting Blood Sugar (FBS), Lipid Profile, and Liver Function Tests typically require 10-12 hours of overnight fasting (water is allowed). Routine tests like CBC, Thyroid (TSH), HbA1c, and Vitamin D can be done non-fasting. Each test card clearly displays fasting requirements."
  },
  {
    "id": "faq-6",
    "category": "Lab Tests",
    "question": "Where can I get specialized Biopsy & Histopathology samples tested?",
    "answer": "ND Diagnostics houses a specialized Histopathology & Cytopathology division overseen by Dr. Manas Ranjan Pradhan (MD Pathology). For biopsy status and queries, contact our Histopathology Laboratory directly at +918917469121."
  },
  {
    "id": "faq-7",
    "category": "Appointments",
    "question": "Can I reschedule or cancel my appointment?",
    "answer": "Yes. You can manage or reschedule your appointment by logging into your Patient Portal dashboard or calling our clinic booking reception at +919827493536 at least 2 hours prior to your slot."
  },
  {
    "id": "faq-8",
    "category": "General",
    "question": "What are your laboratory and clinic operational timings?",
    "answer": "Our Outpatient Clinic is open Monday to Saturday (08:00 AM to 08:30 PM) and Sunday (08:00 AM to 01:00 PM). Our Laboratory Sample Receiving and Emergency Diagnostics operate 24x7."
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    "id": "testi-1",
    "patientName": "Prasanna Kumar Sahu",
    "location": "Bargarh Town",
    "rating": 5,
    "date": "August 2026",
    "serviceUsed": "Home Sample Collection & Comprehensive Package",
    "comment": "The home collection service was extremely punctual. Phlebotomist Subrat arrived at 7 AM sharp, painless blood sample extraction, and by 2 PM I got the full digital report with clear normal ranges. Truly unmatched diagnostic standard in our area.",
    "verified": true
  },
  {
    "id": "testi-2",
    "patientName": "Dr. M. K. Nayak (Retd. Prof)",
    "location": "Hospital Road",
    "rating": 5,
    "date": "July 2026",
    "serviceUsed": "Histopathology Biopsy & Cardiology",
    "comment": "Having experienced hospitals across metros, ND Diagnostics stands out for high-precision pathology. Dr. Manas Pradhan provided meticulous histopathological biopsy analysis that guided my precise surgical outcome. Highly recommended.",
    "verified": true
  },
  {
    "id": "testi-3",
    "patientName": "Snehalata Das",
    "location": "Gopalji Square",
    "rating": 5,
    "date": "August 2026",
    "serviceUsed": "Dr. Sunita Tripathy Consultation & USG",
    "comment": "Dr. Sunita is so patient and reassuring. The clinic is spotless, reception staff is courteous, and you get both doctor consultation and immediate lab tests in the same building without wandering around.",
    "verified": true
  }
];
