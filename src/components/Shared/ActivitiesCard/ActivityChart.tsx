import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { AuraImpact } from '@/api/auranode.service';
import { ratingToText, valueColorMap } from '@/constants/chart';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';
import { useLazyGetBrightIDProfileQuery } from '@/store/api/profile';
import { selectAuthData, selectBrightIdBackup } from '@/store/profile/selectors';
import { AuraRating } from '@/types';
import { EvaluationCategory } from '@/types/dashboard';
import { compactFormat } from '@/utils/number';


const processAuraImpacts = (impacts: AuraImpact[], auraScore: number) => {
  let cumulativeScore = 0;
  return impacts.map((impact, index) => {
    cumulativeScore += impact.impact ?? 0;

    const adjustedScore = cumulativeScore === 0 ? 0.1 : cumulativeScore;

    const confidence =
      adjustedScore > 0 ? impact.confidence : -impact.confidence;

    return {
      index: index + 1,
      evaluatorName: impact.evaluatorName,
      impact: impact.impact,
      confidence,
      cumulativeScore: adjustedScore,
      // @ts-ignore
      color: valueColorMap[confidence] || '#000000',
    };
  });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { evaluatorName, impact, rating } = payload[0].payload;
    return (
      <div className="bg-dark-primary p-2 shadow-md rounded-lg text-sm border">
        <p className="font-semibold">{evaluatorName}</p>
        <p>Impact: {compactFormat(impact)}</p>
        <p>Confidence: {ratingToText[rating]}</p>
      </div>
    );
  }
  return null;
};


const processAuraRatings = (ratings: AuraRating[], impacts: AuraImpact[]) => {
  return ratings.map((rating) => {
    const impact = impacts.find((i) => i.evaluator === rating.fromBrightId)
    return {
      ...rating,
      color: valueColorMap[rating.rating],
      impact: impact?.impact,
      evaluatorName: impact?.evaluatorName

    };
  });
};


const useOutboundImpacts = (ratings: AuraRating[], evaluationCategory: EvaluationCategory, subjectId: string) => {
  const [outboundImpacts, setOutboundImpacts] = useState<AuraImpact[]>([]);
  const brightIdBackup = useSelector(selectBrightIdBackup);

  const authData = useSelector(selectAuthData);

  const [getProfilePhoto] = useLazyGetBrightIDProfileQuery()

  useEffect(() => {
    Promise.all(ratings.map(async (rating) => {
      const profilePhoto = await getProfilePhoto({
        id: rating.toBrightId
      })

      const auraImpacts = getAuraVerification(profilePhoto.data?.verifications, evaluationCategory)?.impacts

      const subjectImpact = auraImpacts?.find(
        (i) => i.evaluator === subjectId,
      )

      const profileInfo =
        subjectImpact?.evaluator === authData?.brightId
          ? brightIdBackup?.userData
            : brightIdBackup?.connections.find(
                (conn) => conn.id === subjectImpact?.evaluator,
              );

        return {
          evaluatorName: profileInfo?.name ?? `${subjectImpact?.evaluator.slice(0, 7)}`,
          ...subjectImpact,
        } as AuraImpact;
    })).then((impacts) => {
      setOutboundImpacts(impacts)
    })
  }, [authData?.brightId, brightIdBackup?.connections, brightIdBackup?.userData, evaluationCategory, getProfilePhoto, ratings, subjectId]);

  return outboundImpacts
}

  const formatXAxis = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    
    if (years > 0) {
      const remainingMonths = Math.floor((days - (years * 365.25)) / 30.44);
      if (remainingMonths > 0) {
        return `${years}y ${remainingMonths}mo`;
      }
      return `${years}y`;
    } else if (months > 0) {
      const remainingDays = Math.floor(days - (months * 30.44));
      if (remainingDays > 0) {
        return `${months}mo ${remainingDays}d`;
      }
      return `${months}mo`;
    } else if (days > 0) {
      const remainingHours = hours - (days * 24);
      if (remainingHours > 0) {
        return `${days}d ${remainingHours}h`;
      }
      return `${days}d`;
    } else if (hours > 0) {
      const remainingMinutes = minutes - (hours * 60);
      if (remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'now';
    }
  };

export function ActivityChart({
  ratings,
  evaluationCategory,
  subjectId
}: {
  ratings: AuraRating[] | null;
  evaluationCategory: EvaluationCategory;
  subjectId: string;
}) {

  const outboundImpacts = useOutboundImpacts(ratings ?? [], evaluationCategory, subjectId)

  const chartData = useMemo(() => processAuraRatings(ratings ?? [], outboundImpacts), [ratings, outboundImpacts]);

  return (
    <ResponsiveContainer className="-ml-10 mt-10" width="100%" height={200}>
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            {chartData.map((entry, index) => (
              <stop
                key={index}
                offset={`${(index / chartData.length) * 100}%`}
                stopColor={entry.color}
              />
            ))}
          </linearGradient>
        </defs>

        <XAxis
          axisLine={false}
          dataKey="timestamp"
          tick={{ fontSize: 10 }}
          tickFormatter={formatXAxis}
        />

        <YAxis
          axisLine={false}
          yAxisId="rating"
          orientation="left"
          tick={{ fontSize: 9 }}
          domain={[0, 5]}
          tickFormatter={(value) => value.toString()}
          tickCount={6}
          tickLine={false}
          tickMargin={10}
        />

        <YAxis
          axisLine={false}
          yAxisId="impact"
          orientation="right"
          tick={{ fontSize: 9 }}
          domain={['auto', 'auto']}
          scale="linear"
          tickFormatter={(value) => compactFormat(value)}
          tickCount={5}
          tickLine={false}
          tickMargin={10}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar 
          yAxisId="rating"
          dataKey="rating" 
          fill={valueColorMap[4]} 
          radius={[4, 4, 2, 2]} 
          barSize={20}
        />

        <Line
          yAxisId="impact"
          type="monotone"
          dataKey="impact"
          stroke="url(#lineGradient)"
          strokeWidth={2}
          dot={chartData.length < 12 ? { fill: 'currentColor', r: 4 } : { r: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
