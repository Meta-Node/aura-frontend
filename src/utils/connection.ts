import { ConnectionLevel } from 'types';

export const connectionLevelIcons: {
  [key in ConnectionLevel]: string | undefined;
} = {
  reported: 'suspicious-icon',
  suspicious: 'suspicious-icon',
  'just met': 'just-met-icon',
  'already known': 'already-known-icon',
  recovery: 'recovery-icon',
  'aura only': 'aura-only',
};
