import { Candidate, Language, Persona, TranslationDictionary } from './types';

export const COLORS = {
  background: '#F9FAFB',
  primary: '#DC2626', // Red 600
  secondary: '#FECACA', // Red 200
  danger: '#EF4444',
  card: '#FFFFFF',
  text: '#1F2937',
  textDim: '#6B7280'
};

export const INDUSTRY_OPTIONS = [
  'Software / SaaS',
  'Finance / Fintech',
  'Healthcare / MedTech',
  'E-commerce',
  'Real Estate',
  'Manufacturing',
  'Education',
  'Marketing / Advertising'
];

export const COMPANY_SIZE_OPTIONS = [
  'Startup (1-10 employees)',
  'Small Business (10-50 employees)',
  'Mid-Market (50-200 employees)',
  'Enterprise (200+ employees)'
];

export const TRAINING_OBJECTIVES = [
  'Improve objection handling',
  'Work on overall sales process',
  'Pitch and close better',
  'Work on the discovery phase',
  'Build rapport and trust',
  'Improve door-to-door approach',
  'Better qualify prospects',
  'Create urgency'
];

export const CHALLENGE_OPTIONS = [
  'Doubt of the product working',
  'Budget / Price',
  'Logistical timing issues',
  'Competitors',
  'Technical concerns',
  'Integration complexity',
  'Not at home/available',
  'Needs to consult spouse/partner',
  'Not the decision maker',
  'ROI concerns'
];

export const CONVERSATION_TYPES = [
  'Discovery call',
  'Closing call',
  'Product demo',
  'Cold call',
  'Follow up call'
];

export const MOCK_PERSONAS: Persona[] = [
  {
    id: '1',
    name: 'Marcus Steele',
    age: 45,
    role: 'CTO',
    company: 'TechFlow',
    industry: 'Software',
    personality: 'Skeptic',
    objection: 'Integration Complexity',
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    type: 'B2B'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    age: 34,
    role: 'VP Sales',
    company: 'GrowthX',
    industry: 'Finance',
    personality: 'Analytical',
    objection: 'ROI Proof',
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    type: 'B2B'
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  { id: '101', name: 'John Doe', matchScore: 92, role: 'AE', status: 'Screening' },
  { id: '102', name: 'Alice Vane', matchScore: 88, role: 'SDR', status: 'Interview' },
  { id: '103', name: 'Bob Smith', matchScore: 74, role: 'AE', status: 'Screening' },
];

export const TRANSLATIONS: TranslationDictionary = {
  dashboard: { EN: 'Dashboard', DE: 'Armaturenbrett', ES: 'Tablero' },
  dojo: { EN: 'Roleplay Dojo', DE: 'Das Dojo', ES: 'El Dojo' },
  debrief: { EN: 'Analytics', DE: 'Analytik', ES: 'Analítica' },
  manager: { EN: 'Team', DE: 'Mannschaft', ES: 'Equipo' },
  persona: { EN: 'Create Prospect', DE: 'Interessent', ES: 'Crear Prospecto' },
  trainingHours: { EN: 'Training Hours', DE: 'Trainingsstunden', ES: 'Horas de Entrenamiento' },
  globalRank: { EN: 'Global Rank', DE: 'Globaler Rang', ES: 'Rango Global' },
  cta: { EN: 'Upgrade to Pro', DE: 'Upgrade auf Pro', ES: 'Mejorar a Pro' },
};