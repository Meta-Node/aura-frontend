import { skipToken } from '@reduxjs/toolkit/query';
import { pullProfilePhoto } from 'api/profilePhoto.service';
import { EChartsOption } from 'echarts-for-react/src/types';
import useParseBrightIdVerificationData from 'hooks/useParseBrightIdVerificationData';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetBrightIDProfileQuery } from 'store/api/profile';
import { selectAuthData, selectBrightIdBackup } from 'store/profile/selectors';
import { hash } from 'utils/crypto';

import { createBlockiesImage, renderImageCover } from '@/utils/image';

import { AuraImpact, AuraImpactRaw } from '../api/auranode.service';
import {
  findNearestColor,
  subjectRatingColorMap,
  userRatingColorMap,
  valueColorMap,
} from '../constants/chart';
import { EvaluationCategory } from '../types/dashboard';

export const useSubjectVerifications = (
  subjectId: string | null | undefined,
  evaluationCategory: EvaluationCategory,
) => {
  const profileFetch = useGetBrightIDProfileQuery(
    subjectId ? { id: subjectId } : skipToken,
  );

  const verifications = profileFetch.data?.verifications;

  const { auraLevel, userHasRecovery, auraScore, auraImpacts } =
    useParseBrightIdVerificationData(verifications, evaluationCategory);

  return {
    auraLevel,
    userHasRecovery,
    auraScore,
    auraImpacts,
    loading: verifications === undefined,
  };
};

export const useImpactEChartOption = (
  auraImpacts: AuraImpact[] | null,
  shouldFetchImages?: boolean,
) => {
  const params = useParams();
  const focusedSubjectId = params.subjectIdProp;

  const authData = useSelector(selectAuthData);

  const auraTopImpacts = useMemo(
    () =>
      auraImpacts
        ?.filter((i) => i.impact)
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, 20) ?? [],
    [auraImpacts],
  );

  const [profileImages, setProfileImages] = useState(() => {
    if (auraTopImpacts.length > 5) return {} as Record<string, string | null>;

    return auraTopImpacts.reduce((prev, curr) => {
      prev[curr.evaluator] = createBlockiesImage(curr.evaluator);

      return prev;
    }, {} as Record<string, string | null>);
  });

  const auraSumImpacts = useMemo(
    () => auraTopImpacts.reduce((prev, curr) => prev + curr.impact, 0),
    [auraTopImpacts],
  );
  const brightIdBackup = useSelector(selectBrightIdBackup);

  useEffect(() => {
    if (!shouldFetchImages || !authData || !brightIdBackup) return;

    const fetchUserImages = async () => {
      if (auraTopImpacts.length > 5) return;

      const images: Record<string, string | null> = {};

      await Promise.all(
        auraTopImpacts.map(async (impact) => {
          try {
            const profilePhoto = await pullProfilePhoto(
              hash(authData.brightId + authData.password),
              impact.evaluator,
              authData.password,
            );
            images[impact.evaluator] = await renderImageCover(
              profilePhoto,
              50,
              50,
            );
          } catch (e) {
            images[impact.evaluator] = await renderImageCover(
              createBlockiesImage(impact.evaluator),
              30,
              30,
            );
          }
        }),
      );
      setProfileImages(images);
    };

    fetchUserImages();
  }, [auraTopImpacts, authData, brightIdBackup, shouldFetchImages]);

  const impactChartOption: EChartsOption = useMemo(() => {
    const maxImpact = auraTopImpacts
      ? Math.max(...auraTopImpacts.map((item) => Math.abs(item.impact)))
      : 0;

    return {
      xAxis: {
        type: 'category',
        axisLine: {
          show: true,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          // Setting splitLine to null removes the lines indicating x-axis values
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        min: -maxImpact,
        max: maxImpact,
      },
      grid: {
        top: 15,
        bottom: 0,
        left: 0,
        right: 0,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const { data } = params;
          return data.label;
        },
        position: (point: any, params: any, dom: any, rect: any, size: any) => {
          // Destructure width from size.viewSize
          const [chartWidth] = size.viewSize;
          const tooltipWidth = dom.offsetWidth;

          // Adjust tooltip position to prevent overflow
          let xPos = point[0];
          const yPos = point[1] - 45;

          // If the tooltip is too close to the right edge, shift it to the left
          if (xPos + tooltipWidth > chartWidth) {
            xPos -= tooltipWidth;
          }

          // Return adjusted position
          return [xPos, yPos];
        },
      },
      series: [
        {
          color: '#ABCAAE',
          label:
            !shouldFetchImages || auraTopImpacts.length > 5
              ? undefined
              : {
                  show: true,
                  position: 'bottom',
                  distance: 2,
                  formatter: (params: any) => {
                    return `{img${params.dataIndex}|}`;
                  },
                  rich: auraTopImpacts.reduce((prev, curr, index) => {
                    prev[`img${index}`] = {
                      height: 35,
                      width: 35,
                      align: 'center',
                      backgroundColor: {
                        image: profileImages[curr.evaluator],
                      },
                      borderRadius: 12,
                      style: {
                        'border-radius': '12px',
                        overflow: 'hidden',
                      },
                    };

                    return prev;
                  }, {} as Record<string, any>),
                },
          data: auraTopImpacts.map((item) => ({
            value: item.impact,
            label: `${item.evaluatorName} ${(
              (item.impact / auraSumImpacts) *
              100
            ).toFixed(2)}%`,
            evaluator: item.evaluator,
            itemStyle: {
              color: findNearestColor(
                item.confidence * (item.impact >= 0 ? 1 : -1),
                authData?.brightId === item.evaluator
                  ? userRatingColorMap
                  : item.evaluator === focusedSubjectId
                  ? subjectRatingColorMap
                  : valueColorMap,
              ),
              borderRadius: item.impact >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4],
            },
          })),
          type: 'bar',
          barGap: '0',
          barMaxWidth: 30,
        },
      ],
      // graphic:
      //   !shouldFetchImages || auraTopImpacts.length > 5
      //     ? undefined
      //     : auraTopImpacts.map((item, index) => ({
      //         type: 'group',
      //         children: [
      //           {
      //             type: 'image',
      //             style: {
      //               data: item, // Add your custom data here
      //               image:
      //                 profileImages[item.evaluator] ??
      //                 '/assets/images/avatar-thumb.jpg',
      //               width: 30,
      //               height: 30,
      //             },
      //             position: [0, 0],
      //             bounding: 'raw',
      //           },
      //         ], // 3 = 50

      //         position: calculateImagePosition(
      //           index,
      //           140,
      //           auraTopImpacts.length,
      //           item.impact >= 0,
      //         ),
      //         z: 100,
      //         clipPath: {
      //           type: 'rect',
      //           shape: {
      //             x: 0,
      //             y: 0,
      //             width: 30,
      //             height: 30,
      //             r: [5, 5, 5, 5],
      //           },
      //         },
      //       })),
    };
  }, [
    auraSumImpacts,
    auraTopImpacts,
    authData?.brightId,
    focusedSubjectId,
    profileImages,
    shouldFetchImages,
  ]);

  const impactChartSmallOption = useMemo(
    () => ({
      ...impactChartOption,
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      tooltip: undefined,
      series: [
        {
          color: '#ABCAAE',
          data: auraTopImpacts.map((item) => ({
            value: item.impact,
            label: item.evaluatorName,
            evaluator: item.evaluator,
            itemStyle: {
              color:
                authData?.brightId === item.evaluator
                  ? '#8341DE'
                  : findNearestColor(
                      item.confidence * (item.impact >= 0 ? 1 : -1),
                      authData?.brightId === item.evaluator
                        ? userRatingColorMap
                        : item.evaluator === focusedSubjectId
                        ? subjectRatingColorMap
                        : valueColorMap,
                    ),
              borderRadius: item.impact >= 0 ? [2, 2, 0, 0] : [0, 0, 2, 2],
            },
          })),
          label: {
            show: false,
          },
          type: 'bar',
          barMaxWidth: 10,
        },
      ],
    }),
    [auraTopImpacts, authData?.brightId, focusedSubjectId, impactChartOption],
  );

  return {
    impactChartOption,
    impactChartSmallOption,
  };
};

export const useImpactPercentage = (
  auraImpacts: AuraImpactRaw[] | null,
  subjectId: string | null | undefined,
) => {
  return useMemo(() => {
    if (auraImpacts === null || auraImpacts === undefined || !subjectId)
      return null;
    const subjectImpact = auraImpacts.find(
      (i) => i.evaluator === subjectId,
    )?.impact;
    if (!subjectImpact) return 0;
    return Math.round(
      Math.abs(subjectImpact * 100) /
        auraImpacts.reduce((a, c) => a + Math.abs(c.impact), 0),
    );
  }, [auraImpacts, subjectId]);
};

export const useTotalImpact = (auraImpacts: AuraImpactRaw[] | null) => {
  return useMemo(() => {
    if (auraImpacts === null || auraImpacts === undefined)
      return {
        totalPositiveImpact: null,
        totalNegativeImpact: null,
      };
    let totalPositiveImpact = 0;
    let totalNegativeImpact = 0;
    auraImpacts.forEach((i) => {
      if (i.impact > 0) {
        totalPositiveImpact += i.impact;
      } else {
        totalNegativeImpact += i.impact;
      }
    });
    return {
      totalPositiveImpact,
      totalNegativeImpact,
    };
  }, [auraImpacts]);
};
