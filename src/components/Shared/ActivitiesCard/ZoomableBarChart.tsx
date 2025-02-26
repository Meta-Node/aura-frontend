import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  ComposedChart,
  ReferenceArea,
  ResponsiveContainer,
  Bar,
  Cell,
  TooltipProps,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { MdRefresh } from 'react-icons/md';
import { formatDuration } from '@/utils/time';
import { AuraRating } from '@/types';
import { EvaluationCategory } from '@/types/dashboard';
import { valueColorMap } from '@/constants/chart';
import { AuraImpact } from '@/api/auranode.service';
import {
  selectAuthData,
  selectBrightIdBackup,
} from '@/store/profile/selectors';
import { useSelector } from '@/store/hooks';
import { useLazyGetBrightIDProfileQuery } from '@/store/api/profile';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';

type ZoomableChartProps = {
  ratings: AuraRating[] | null;
  evaluationCategory: EvaluationCategory;
  subjectId: string;
};

const chartConfig = {
  events: {
    label: 'Events',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const CustomRatingTooltip = ({ payload, label }: TooltipProps<any, any>) => {
  if (!payload || payload.length === 0) return null;

  const ratingData = payload[0].payload; // Assuming the data is passed in as the payload

  const { score, evaluatorName, evaluated, confidence } = ratingData;

  return (
    <div className="rounded-md border bg-card p-2">
      <div>
        <strong>Score:</strong> {score}
      </div>
      <div>
        <strong>Confidence:</strong> {confidence || 'N/A'}
      </div>
      <div>
        <strong>Evaluator:</strong> {evaluatorName || evaluated?.slice(0, 7)}
      </div>
    </div>
  );
};

const processAuraRatings = (
  ratings: AuraRating[],
  impacts: (AuraImpact & { evaluated: string })[],
) => {
  return ratings.map((rating) => {
    const impact = impacts.find((i) => i.evaluated === rating.toBrightId);
    return {
      ...rating,
      color: valueColorMap[rating.rating],
      score: impact?.score,
      impact: impact?.impact,
      evaluatorName: impact?.evaluatorName ?? impact?.evaluated.slice(0, 7),
      evaluated: impact?.evaluated,
    };
  });
};

const useOutboundImpacts = (
  ratings: AuraRating[],
  evaluationCategory: EvaluationCategory,
  subjectId: string,
) => {
  const [outboundImpacts, setOutboundImpacts] = useState<
    (AuraImpact & { evaluated: string })[]
  >([]);
  const brightIdBackup = useSelector(selectBrightIdBackup);

  const authData = useSelector(selectAuthData);

  const [getProfilePhoto] = useLazyGetBrightIDProfileQuery();

  useEffect(() => {
    ratings.map(async (rating) => {
      const profilePhoto = await getProfilePhoto({
        id: rating.toBrightId,
      });

      const auraImpacts = getAuraVerification(
        profilePhoto.data?.verifications,
        evaluationCategory,
      )?.impacts;

      const subjectImpact = auraImpacts?.find((i) => i.evaluator === subjectId);

      const profileInfo =
        rating.toBrightId === authData?.brightId
          ? brightIdBackup?.userData
          : brightIdBackup?.connections.find(
              (conn) => conn.id === rating.toBrightId,
            );

      setOutboundImpacts((prev) => [
        ...prev,
        {
          evaluatorName:
            profileInfo?.name ?? `${subjectImpact?.evaluator.slice(0, 7)}`,
          ...subjectImpact,
          evaluated: rating.toBrightId,
        } as AuraImpact & { evaluated: string },
      ]);
    });
  }, [
    authData?.brightId,
    brightIdBackup?.connections,
    brightIdBackup?.userData,
    evaluationCategory,
    getProfilePhoto,
    ratings,
    subjectId,
  ]);

  return outboundImpacts;
};

export function ZoomableChart({
  evaluationCategory,
  ratings,
  subjectId,
}: ZoomableChartProps) {
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<AuraRating[]>(ratings || []);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const outboundImpacts = useOutboundImpacts(
    ratings ?? [],
    evaluationCategory,
    subjectId,
  );

  const chartData = useMemo(
    () => processAuraRatings(ratings ?? [], outboundImpacts),
    [ratings, outboundImpacts],
  );

  useEffect(() => {
    if (chartData?.length) {
      setOriginalData(chartData);
      setStartTime(chartData[0].timestamp);
      setEndTime(chartData.at(-1)?.timestamp!);
    }
  }, [chartData]);

  const zoomedData = useMemo(() => {
    if (!startTime || !endTime) {
      return chartData;
    }

    return chartData.filter(
      (dataPoint) =>
        dataPoint.timestamp >= startTime && dataPoint.timestamp <= endTime,
    );
  }, [startTime, endTime, originalData, chartData]);

  const maxAbs = Math.max(
    ...zoomedData.map((item) => Math.abs(Number(item.score ?? 0))),
  );

  // const total = useMemo(
  //   () => zoomedData.reduce((acc, curr) => acc + curr.events, 0),
  //   [zoomedData],
  // );

  const handleMouseDown = (e: any) => {
    if (e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isSelecting && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (refAreaLeft && refAreaRight) {
      const [left, right] = [refAreaLeft, refAreaRight].sort();
      setStartTime(left);
      setEndTime(right);
    }
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setIsSelecting(false);
  };

  const handleReset = () => {
    setStartTime(originalData[0].timestamp);
    setEndTime(originalData[originalData.length - 1].timestamp);
  };

  const handleZoom = (
    e: React.WheelEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!originalData.length || !chartRef.current) return;

    let zoomFactor = 0.1;
    let direction = 0;
    let clientX = 0;

    if ('deltaY' in e) {
      // Mouse wheel event
      direction = e.deltaY < 0 ? 1 : -1;
      clientX = e.clientX;
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY,
      );

      if ((e as any).lastTouchDistance) {
        direction = currentDistance > (e as any).lastTouchDistance ? 1 : -1;
      }
      (e as any).lastTouchDistance = currentDistance;

      clientX = (touch1.clientX + touch2.clientX) / 2;
    } else {
      return;
    }

    const currentRange =
      new Date(
        endTime || originalData[originalData.length - 1].timestamp,
      ).getTime() - new Date(startTime || originalData[0].timestamp).getTime();
    const zoomAmount = currentRange * zoomFactor * direction;

    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = clientX - chartRect.left;
    const chartWidth = chartRect.width;
    const mousePercentage = mouseX / chartWidth;

    const currentStartTime = new Date(
      (startTime || originalData[0].timestamp) * 1000,
    ).getTime();
    const currentEndTime = new Date(
      (endTime || originalData[originalData.length - 1].timestamp) * 1000,
    ).getTime();

    const newStartTime = new Date(
      currentStartTime + zoomAmount * mousePercentage,
    );
    const newEndTime = new Date(
      currentEndTime - zoomAmount * (1 - mousePercentage),
    );

    setStartTime(newStartTime.getTime() / 1000);
    setEndTime(newEndTime.getTime() / 1000);
  };

  return (
    <ChartContainer config={chartConfig} className="mb-12 h-52 w-full">
      <div
        className="h-full"
        onWheel={handleZoom}
        onTouchMove={handleZoom}
        ref={chartRef}
        style={{ touchAction: 'none' }}
      >
        <div className="my-2 flex justify-end sm:mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            disabled={!startTime && !endTime}
            className="h-6 w-6 text-xs sm:text-sm"
          >
            <MdRefresh className="h-2 w-2" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={zoomedData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <XAxis
              dataKey="timestamp"
              // tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '10px', userSelect: 'none' }}
              tick={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={false}
              style={{ fontSize: '10px', userSelect: 'none' }}
              width={30}
              domain={[-maxAbs, maxAbs]}
              type="number"
            />
            <ChartTooltip content={<CustomRatingTooltip />} />

            {/* Area Chart */}
            <Area
              type="monotone"
              dataKey="score"
              stroke={chartConfig.events.color}
              fillOpacity={1}
              dot={{ r: 2, fill: 'blue' }} // Always show dot, adjust size here
              fill="url(#colorEvents)"
              isAnimationActive={false}
            />
            <Bar dataKey="confidence" barSize={10} opacity={0.9}>
              {zoomedData.map((entry, index) => (
                <Cell radius={2} key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>

            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="hsl(var(--foreground))"
                fillOpacity={0.05}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
