import { AuraImpact } from '@/api/auranode.service';
import { valueColorMap } from '@/constants/chart';
import { BrightIdBackup, BrightIdBackupConnection } from '@/types';
import { EvaluationCategory } from '@/types/dashboard';
import { calculateImpactPercent } from '@/utils/score';

export const calculateRatingsImpact = (
  impacts: AuraImpact[] | undefined,
  evaluationCategory: EvaluationCategory,
  brightIdBackup: BrightIdBackup | null,
) => {
  if (!impacts) return [];

  const connectionsAsObj = brightIdBackup?.connections.reduce(
    (prev, curr) => {
      prev[curr.id] = curr;

      return prev;
    },
    {} as Record<string, BrightIdBackupConnection>,
  );

  const inboundImpacts = impacts?.reduce(
    (prev, curr) => {
      prev[curr.evaluator] = curr;

      return prev;
    },
    {} as Record<string, AuraImpact>,
  );

  return impacts.map((impact) => {
    const ratingProfile = inboundImpacts[impact.evaluator];

    return {
      ...impact,
      color: valueColorMap[impact.confidence],
      subjectScore: ratingProfile.score,
      impactPercentage: calculateImpactPercent(impacts, impact.impact),
      evaluatorName: connectionsAsObj?.[impact.evaluator]?.name,
      evaluated: impact.evaluator,
    };
  });
};
