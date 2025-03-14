import { skipToken } from '@reduxjs/toolkit/query';
import { BarSeriesOption, EChartsOption } from 'echarts';
import useParseBrightIdVerificationData from 'hooks/useParseBrightIdVerificationData';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
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
import { selectPreferredTheme } from '@/BrightID/actions';
import { useDispatch } from '@/store/hooks';
import { getProfilePhoto } from '@/store/api/backup';

export const useSubjectVerifications = (
  subjectId: string | null | undefined,
  evaluationCategory: EvaluationCategory,
) => {
  const profileQuery = useGetBrightIDProfileQuery(subjectId ?? skipToken);

  const verifications = profileQuery.data?.verifications;
  const parsedData = useParseBrightIdVerificationData(
    verifications,
    evaluationCategory,
  );

  return {
    refresh: profileQuery.refetch,
    loading: verifications === undefined,
    isFetching: profileQuery.isFetching,
    ...parsedData,
  };
};

const buildRichLabels = (
  impacts: AuraImpact[],
  images: Record<string, string | null>,
) =>
  impacts.reduce(
    (acc, curr, index) => {
      acc[`img${index}`] = {
        height: 35,
        width: 35,
        align: 'center',
        backgroundColor: { image: images[curr.evaluator] },
        borderRadius: 12,
        style: { 'border-radius': '12px', overflow: 'hidden' },
      };
      return acc;
    },
    {} as Record<string, any>,
  );

const getItemStyle = (
  item: AuraImpact,
  borderRadius: number[],
  authBrightId: string | undefined,
  focusedSubjectId: string | undefined,
) => {
  const colorMap =
    authBrightId === item.evaluator
      ? userRatingColorMap
      : item.evaluator === focusedSubjectId
        ? subjectRatingColorMap
        : valueColorMap;
  return {
    color: findNearestColor(
      item.confidence * (item.impact >= 0 ? 1 : -1),
      colorMap,
    ),
    borderRadius,
  };
};

const getLabel = (
  item: AuraImpact,
  isPositiveSeries: boolean,
  totalImpact: number,
) => {
  const sign = isPositiveSeries
    ? item.impact >= 0
      ? '+'
      : ''
    : item.impact >= 0
      ? ''
      : '-';
  return `${item.evaluatorName} (${sign}${item.confidence}) ${(
    (item.impact / totalImpact) *
    100
  ).toFixed(1)}%`;
};

export const useImpactEChartOption = (
  auraImpacts: AuraImpact[] | null,
  shouldFetchImages?: boolean,
  maxImagesToShow = 5,
): {
  impactChartOption: EChartsOption;
  impactChartSmallOption: EChartsOption;
} => {
  const { subjectIdProp: focusedSubjectId } = useParams();
  const preferredTheme = useSelector(selectPreferredTheme);
  const authData = useSelector(selectAuthData);
  const brightIdBackup = useSelector(selectBrightIdBackup);
  const dispatch = useDispatch();

  const auraTopImpacts = useMemo(
    () =>
      auraImpacts
        ?.filter((i) => i.impact)
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
        .slice(0, 20) ?? [],
    [auraImpacts],
  );

  const auraSumImpacts = useMemo(
    () => auraTopImpacts.reduce((sum, curr) => sum + curr.impact, 0),
    [auraTopImpacts],
  );

  const displayImages =
    shouldFetchImages &&
    auraTopImpacts.length <= maxImagesToShow &&
    authData &&
    brightIdBackup;

  const [profileImages, setProfileImages] = useState<
    Record<string, string | null>
  >(() => {
    if (!displayImages) {
      return auraTopImpacts.reduce(
        (acc, curr) => {
          acc[curr.evaluator] = createBlockiesImage(curr.evaluator);
          return acc;
        },
        {} as Record<string, string | null>,
      );
    }
    return {};
  });

  useEffect(() => {
    if (!displayImages) return;
    const abortController = new AbortController();
    const key = hash(authData.brightId + authData.password);

    const fetchImages = async () => {
      for (const impact of auraTopImpacts) {
        try {
          let imageData: string;
          try {
            const res = await dispatch(
              getProfilePhoto.initiate({
                brightId: impact.evaluator,
                key,
                password: authData.password,
              }),
            );
            const profilePhoto = res.data;
            if (!profilePhoto) throw new Error('No image response');
            imageData = await renderImageCover(
              profilePhoto,
              50,
              50,
              preferredTheme,
            );
          } catch (e) {
            imageData = await renderImageCover(
              createBlockiesImage(impact.evaluator),
              30,
              30,
              preferredTheme,
            );
          }
          if (!abortController.signal.aborted) {
            setProfileImages((prev) => ({
              ...prev,
              [impact.evaluator]: imageData,
            }));
          }
        } catch (error) {
          console.error(`Failed to load image for ${impact.evaluator}:`, error);
        }
      }
    };

    fetchImages();
    return () => abortController.abort();
  }, [
    auraTopImpacts,
    preferredTheme,
    authData,
    brightIdBackup,
    displayImages,
    dispatch,
  ]);

  const richLabels = displayImages
    ? buildRichLabels(auraTopImpacts, profileImages)
    : {};

  const seriesTop: BarSeriesOption = {
    color: '#ABCAAE',
    label: displayImages
      ? {
          show: true,
          position: 'top',
          distance: 2,
          formatter: (params: any) => `{img${params.dataIndex}|}`,
          rich: richLabels,
        }
      : { show: false, formatter: () => '' },
    data: auraTopImpacts.map((item) =>
      item.impact >= 0
        ? ('-' as any)
        : {
            value: item.impact,
            label: getLabel(item, false, auraSumImpacts),
            evaluator: item.evaluator,
            itemStyle: getItemStyle(
              item,
              item.impact >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4],
              authData?.brightId,
              focusedSubjectId,
            ),
          },
    ),
    type: 'bar',
    barGap: '0',
    barMaxWidth: 30,
  };

  const seriesBottom: BarSeriesOption = {
    color: '#ABCAAE',
    label: displayImages
      ? {
          show: true,
          position: 'bottom',
          distance: 2,
          formatter: (params: any) => `{img${params.dataIndex}|}`,
          rich: richLabels,
        }
      : { show: false, formatter: () => '' },
    data: auraTopImpacts.map((item) =>
      item.impact < 0
        ? ('-' as any)
        : {
            value: item.impact,
            label: getLabel(item, true, auraSumImpacts),
            evaluator: item.evaluator,
            itemStyle: getItemStyle(
              item,
              item.impact >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4],
              authData?.brightId,
              focusedSubjectId,
            ),
          },
    ),
    type: 'bar',
    barGap: '0',
    barMaxWidth: 30,
  };

  const impactChartOption: EChartsOption = useMemo(() => {
    const maxImpact = auraTopImpacts.length
      ? Math.max(...auraTopImpacts.map((item) => Math.abs(item.impact)))
      : 0;
    return {
      xAxis: {
        type: 'category',
        axisLine: { show: true },
        axisLabel: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        show: false,
        min: -maxImpact,
        max: maxImpact,
      },
      grid: { top: 15, bottom: 0, left: 0, right: 0 },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => params.data.label,
        position: (point: any, params: any, dom: any, rect: any, size: any) => {
          const [chartWidth] = size.viewSize;
          const tooltipWidth = dom.offsetWidth;
          let xPos = point[0];
          const yPos = point[1] - 45;
          if (xPos + tooltipWidth > chartWidth) {
            xPos -= tooltipWidth;
          }
          return [xPos, yPos];
        },
      },
      series: [seriesTop, seriesBottom],
    };
  }, [
    auraTopImpacts,
    auraSumImpacts,
    authData?.brightId,
    focusedSubjectId,
    profileImages,
    displayImages,
  ]);

  const impactChartSmallOption = useMemo(
    () => ({
      ...impactChartOption,
      grid: { top: 0, bottom: 0, left: 0, right: 0 },
      tooltip: undefined,
      series: [
        {
          color: '#ABCAAE',
          data: auraTopImpacts.map((item) => ({
            value: item.impact,
            label: item.evaluatorName,
            evaluator: item.evaluator,
            itemStyle: getItemStyle(
              item,
              item.impact >= 0 ? [2, 2, 0, 0] : [0, 0, 2, 2],
              authData?.brightId,
              focusedSubjectId,
            ),
          })),
          label: { show: false },
          type: 'bar',
          barMaxWidth: 10,
        } as BarSeriesOption,
      ],
    }),
    [auraTopImpacts, authData?.brightId, focusedSubjectId, impactChartOption],
  );

  return { impactChartOption, impactChartSmallOption };
};

export const useImpactPercentage = (
  auraImpacts: AuraImpactRaw[] | null,
  subjectId: string | null | undefined,
) =>
  useMemo(() => {
    if (!auraImpacts || !subjectId) return null;
    const subjectImpact = auraImpacts.find(
      (i) => i.evaluator === subjectId,
    )?.impact;
    if (!subjectImpact) return 0;
    const total = auraImpacts.reduce(
      (sum, curr) => sum + Math.abs(curr.impact),
      0,
    );
    return Math.round((Math.abs(subjectImpact) * 100) / total);
  }, [auraImpacts, subjectId]);

export const useTotalImpact = (auraImpacts: AuraImpactRaw[] | null) =>
  useMemo(() => {
    if (!auraImpacts)
      return { totalPositiveImpact: null, totalNegativeImpact: null };
    let totalPositiveImpact = 0;
    let totalNegativeImpact = 0;
    auraImpacts.forEach((i) => {
      if (i.impact > 0) totalPositiveImpact += i.impact;
      else totalNegativeImpact += i.impact;
    });
    return { totalPositiveImpact, totalNegativeImpact };
  }, [auraImpacts]);
