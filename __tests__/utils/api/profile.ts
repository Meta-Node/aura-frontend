import { hash } from '@/utils/crypto';
import { type BrightIdBackupConnection } from 'types';

export const TEST_BRIGHT_ID = 'TEST_BRIGHTID';
export const TEST_BRIGHT_PASSWORD = 'TEST_BRIGHTID_PASSWORD';
export const TEST_AUTH_KEY = hash(TEST_BRIGHT_ID + TEST_BRIGHT_PASSWORD);

export const generateRandomBrightId = () =>
  Math.random().toString(36).slice(2, 16);

export const generateRandomBrightIdConnectionBackup = (
  incomingLevel = 'already known',
) => {
  return {
    id: generateRandomBrightId(),
    name: `Name ${Math.random().toString(36).slice(2, 5)}`,
    connectionDate: Date.now(),
    photo: {
      filename: `${Math.random().toString(36).slice(2, 16)}.jpg`,
    },
    status: 'verified', // static status
    notificationToken: 'TOKEN', // static token
    level: 'just met', // static level
    socialMedia: [], // empty array for simplicity
    verifications: [
      {
        name: 'Seed',
        block: Math.floor(Math.random() * 100000),
        timestamp: Date.now(),
      },
      {
        name: 'SeedConnected',
        // rank: Math.floor(Math.random() * 100),
        block: Math.floor(Math.random() * 100000),
        timestamp: Date.now(),
        hash: 'HASH',
      },
      {
        name: 'BrightID',
        block: Math.floor(Math.random() * 100000),
        timestamp: Date.now(),
        hash: 'HASH',
      },
    ],
    timestamp: Date.now(),
    incomingLevel: incomingLevel,
    reportReason: null,
  } as BrightIdBackupConnection;
};

export const BRIGHTID_BACKUP = {
  userData: {
    id: TEST_BRIGHT_ID,
    name: 'Test User',
    photo: {
      filename: 'test-image.jpg',
    },
  },
  connections: Array.from({ length: 5 }, () =>
    generateRandomBrightIdConnectionBackup(),
  ),
  groups: [],
};

export const generateEvaluationImpact = (
  fromBrightId: string,
  score?: number,
  confidence?: number,
  impact?: number,
) => {
  return {
    evaluator: fromBrightId,
    score: score ?? Math.random() * 200000,
    confidence: confidence ?? Math.round(Math.random() * 4),
    impact: impact ?? Math.abs(Math.random() * 100),
  };
};

export const generateRoleData = (
  name: string,
  level?: number,
  evaluationsCount = 5,
) => {
  const evaluations = Array.from({ length: evaluationsCount }).map(() =>
    generateEvaluationImpact(generateRandomBrightId(), Math.random() * 1000000),
  );

  return {
    name,
    level: level ?? 1,
    impacts: evaluations,
  };
};

export const mockedBrightIdProfileData = {
  data: {
    id: TEST_BRIGHT_ID,
    sponsored: true,
    verifications: [
      {
        name: 'Aura',
        block: 30146400,
        timestamp: 1740282045881,
        domains: [
          {
            name: 'BrightID',
            categories: [
              generateRoleData('manager'),
              generateRoleData('trainer'),
              generateRoleData('player'),
              generateRoleData('subject'),
            ],
          },
        ],
      },
    ],
    recoveryConnections: [],
    connectionsNum: 11,
    groupsNum: 0,
    reports: [],
    createdAt: new Date(),
    signingKeys: [],
    requiredRecoveryNum: 2,
  },
};
