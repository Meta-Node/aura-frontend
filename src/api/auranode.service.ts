import { EvaluationCategory } from '../types/dashboard';
import { auraBrightIdNodeApi } from './index';

export interface AuraImpactRaw {
  evaluator: string;
  level?: number | null;
  score: number | null;
  confidence: number;
  impact: number;
}

export interface AuraImpact extends AuraImpactRaw {
  evaluatorName: string;
}

export type Verifications = {
  name: string;
  block: number;
  timestamp: number;
  domains?: {
    name: 'BrightID'; // for now
    categories: {
      name: EvaluationCategory;
      score: number;
      level: number;
      impacts: AuraImpactRaw[];
    }[];
  }[];
}[];

//TODO: complete based on this: https://brightid.stoplight.io/docs/node-api/5f925a7124856-gets-profile-information-of-a-user
export interface BrightIdProfile {
  createdAt: number;
  verifications: Verifications;
}
