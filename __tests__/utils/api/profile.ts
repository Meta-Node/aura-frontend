import { BrightIdBackupConnection } from 'types';

export const TEST_BRIGHT_ID = 'TEST_BRIGHTID';
export const TEST_BRIGHT_PASSWORD = 'TEST_BRIGHTID_PASSWORD';

export const generateRandomBrightIdConnectionBackup = (
  incomingLevel = 'already known',
) => {
  return {
    id: Math.random().toString(36).slice(2, 16),
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
        hash: 'HASH',
      },
      {
        name: 'SeedConnected',
        rank: Math.floor(Math.random() * 100),
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

const data = {
  data: {
    id: TEST_BRIGHT_ID,
    sponsored: false,
    verifications: [
      {
        name: 'Aura',
        block: 30138000,
        timestamp: 1740239009787,
        domains: [
          {
            name: 'BrightID',
            categories: [
              {
                name: 'subject',
                score: 104207372.08003037,
                level: 1,
                impacts: [
                  {
                    evaluator: 'BRIGHTID',
                    level: 3,
                    score: 104207372.08003037,
                    confidence: 1,
                    impact: 104207372.08003037,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'SeedConnected',
        rank: 5,
        connected: ['BRIGHTID', 'BRIGHTID', 'BRIGHTID', 'BRIGHTID', 'BRIGHTID'],
        communities: ['HASH', 'HASH'],
        reported: [],
        block: 30138000,
        timestamp: 1740239030320,
        hash: 'HASH',
      },
      {
        name: 'BrightID',
        block: 30138000,
        timestamp: 1740239050922,
        hash: 'HASH',
      },
    ],
    recoveryConnections: [],
    connectionsNum: 2,
    groupsNum: 0,
    reports: [],
    createdAt: 1738434513000,
    signingKeys: ['SIGN_KEY'],
    requiredRecoveryNum: 2,
  },
};
