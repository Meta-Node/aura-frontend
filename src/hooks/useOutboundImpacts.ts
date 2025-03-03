import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { AuraRating } from '@/types';
import {
  EvaluationCategory,
  evaluationsToEvaluatedCategory,
} from '@/types/dashboard';
import {
  selectAuthData,
  selectBrightIdBackup,
} from '@/store/profile/selectors';
import { profileApi } from '@/store/api/profile';
import { getAuraVerification } from './useParseBrightIdVerificationData';
import { AuraImpact } from '@/api/auranode.service';
import { RootState } from '@/store';

const useOutboundImpacts = (
  ratings: AuraRating[],
  evaluationCategory: EvaluationCategory,
  subjectId: string,
) => {
  const authData = useSelector(selectAuthData);
  const brightIdBackup = useSelector(selectBrightIdBackup);
  const [impacts, setImpacts] = useState<
    (AuraImpact & { evaluated: string; subjectScore?: number })[]
  >([]);
  const [triggerFetch, { isFetching }] =
    profileApi.endpoints.getBrightIDProfile.useLazyQuery();

  const filteredRatings = ratings.filter((rating) => rating.rating !== '0');
  const toBrightIds = filteredRatings.map((rating) => rating.toBrightId);

  const cachedProfiles = useSelector((state) =>
    toBrightIds.reduce<{ [key: string]: any }>((acc, id) => {
      const selector = profileApi.endpoints.getBrightIDProfile.select({ id });
      const result = selector(state as RootState);
      acc[id] = result?.data;
      return acc;
    }, {}),
  );

  useEffect(() => {
    const fetchAndProcessProfiles = async () => {
      const updatedImpacts = await Promise.all(
        filteredRatings.map(async (rating) => {
          let profileData = cachedProfiles[rating.toBrightId];

          // Fetch data from API if not in cache
          if (!profileData) {
            const { data } = await triggerFetch({ id: rating.toBrightId });
            profileData = data;
          }

          let impacts = getAuraVerification(
            profileData?.verifications,
            evaluationsToEvaluatedCategory[evaluationCategory],
          );

          if (!impacts && evaluationCategory === EvaluationCategory.MANAGER) {
            impacts = getAuraVerification(
              profileData.verifications,
              EvaluationCategory.MANAGER,
            );
          }
          let auraImpacts = impacts?.impacts;
          let auraScore = impacts?.score;

          const subjectImpact = auraImpacts?.find(
            (i) => i.evaluator === subjectId,
          );

          const profileInfo =
            rating.toBrightId === authData?.brightId
              ? brightIdBackup?.userData
              : brightIdBackup?.connections.find(
                  (conn) => conn.id === rating.toBrightId,
                );

          return {
            evaluatorName:
              profileInfo?.name ?? profileData?.id?.slice(0, 7) ?? '',
            ...subjectImpact,
            evaluated: rating.toBrightId,
            subjectScore: auraScore,
            score:
              (Number(rating.rating) > 0 ? 1 : -1) *
              (subjectImpact?.score ?? 0),
          } as AuraImpact & { evaluated: string; subjectScore: number };
        }),
      );

      setImpacts(updatedImpacts);
    };

    fetchAndProcessProfiles();
  }, [ratings]); // Only re-run when ratings change

  return { impacts, isLoading: isFetching };
};

export default useOutboundImpacts;
