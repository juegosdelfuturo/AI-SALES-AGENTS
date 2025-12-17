export type View = 'DASHBOARD' | 'DOJO' | 'DEBRIEF' | 'MANAGER' | 'PERSONA_CREATOR';

export enum Language {
  EN = 'EN',
  DE = 'DE',
  ES = 'ES'
}

export interface Persona {
  id: string;
  name: string;
  age?: number;
  role: string;
  company?: string;
  industry?: string;
  companySize?: string;
  personality?: string;
  description?: string;
  openingLine?: string;
  
  // Sales Context
  productDetails?: string;
  trainingObjectives?: string[];
  challenges?: string[];
  conversationType?: string;
  
  objection: string;
  avatarUrl: string;
  type: 'B2B' | 'B2C';
}

export interface Session {
  id: string;
  personaId: string;
  personaName: string;
  avatarUrl: string;
  date: string;
  durationSeconds: number;
  score: number;
}

export interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  role: string;
  status: 'Screening' | 'Interview' | 'Offer';
}

export interface ChartData {
  name: string;
  value: number;
  fullMark?: number;
}

export interface TranslationDictionary {
  [key: string]: {
    [key in Language]: string;
  }
}