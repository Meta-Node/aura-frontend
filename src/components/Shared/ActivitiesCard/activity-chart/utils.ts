import { valueColorMap } from '@/constants/chart';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';
import { AuraRating, AuraNodeBrightIdConnection } from '@/types';
import {
  EvaluationCategory,
  evaluationsToEvaluatedCategory,
} from '@/types/dashboard';
import { calculateImpact, calculateImpactPercent } from '@/utils/score';

export const calculateRatingsImpact = (
  ratings: AuraRating[],
  evaluations: AuraNodeBrightIdConnection[] | undefined,
  evaluationCategory: EvaluationCategory,
  profileData: ProfileInfo | undefined,
) => {
  if (!evaluations || !profileData) return [];

  const outboundProfiles = evaluations?.reduce(
    (prev, curr) => {
      prev[curr.id] = curr;

      return prev;
    },
    {} as Record<string, AuraNodeBrightIdConnection>,
  );

  const profileImpact = getAuraVerification(
    profileData.verifications,
    evaluationCategory,
  );

  return ratings.map((rating) => {
    const ratingProfile = outboundProfiles[rating.toBrightId];

    const impact = getAuraVerification(
      ratingProfile.verifications,
      evaluationsToEvaluatedCategory[evaluationCategory],
    );

    const score = calculateImpact(
      profileImpact?.score ?? 0,
      Number(rating.rating),
    );
    return {
      ...rating,
      color: valueColorMap[rating.rating],
      subjectScore: impact?.score,
      score: profileImpact?.score,
      impact: score,
      impactPercentage: calculateImpactPercent(impact?.impacts ?? [], score),
      evaluatorName: rating.toBrightId.slice(0, 7),
      evaluated: rating.toBrightId,
    };
  });
};
