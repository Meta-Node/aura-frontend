import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useEffect, useMemo, useState } from 'react';
import {  Chart } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import { AuraImpact } from '@/api/auranode.service';
import { ratingToText, valueColorMap, valueLineColorMap } from '@/constants/chart';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';
import { useLazyGetBrightIDProfileQuery } from '@/store/api/profile';
import { selectAuthData, selectBrightIdBackup } from '@/store/profile/selectors';
import { AuraRating } from '@/types';
import { EvaluationCategory } from '@/types/dashboard';
import { compactFormat } from '@/utils/number';

ChartJS.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface ActivityChartData {
  rating: number;
  impact: number;
  color: string;
  evaluatorName: string;
  timestamp: number;
}

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


const processAuraRatings = (ratings: AuraRating[], impacts: (AuraImpact & { evaluated: string })[]) => {

  return ratings.map((rating) => {
    const impact = impacts.find((i) => i.evaluated === rating.toBrightId)
    return {
      ...rating,
      color: valueColorMap[rating.rating],
      impact: impact?.impact,
      evaluatorName: impact?.evaluatorName ?? impact?.evaluated.slice(0, 7),
      evaluated: impact?.evaluated

    };
  });
};


const useOutboundImpacts = (ratings: AuraRating[], evaluationCategory: EvaluationCategory, subjectId: string) => {
  const [outboundImpacts, setOutboundImpacts] = useState<(AuraImpact & { evaluated: string })[]>([]);
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
        rating.toBrightId === authData?.brightId
          ? brightIdBackup?.userData
            : brightIdBackup?.connections.find(
                (conn) => conn.id === rating.toBrightId,
              );

        return {
          evaluatorName: profileInfo?.name ?? `${subjectImpact?.evaluator.slice(0, 7)}`,
          ...subjectImpact,
          evaluated: rating.toBrightId
        } as AuraImpact & { evaluated: string };
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
      if (isNaN(timestamp)) {
        return '' 
      }
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
  const outboundImpacts = useOutboundImpacts(ratings ?? [], evaluationCategory, subjectId);
  const chartData = useMemo(() => 
    processAuraRatings(ratings ?? [], outboundImpacts),
    [ratings, outboundImpacts]
  );

  const data: ChartData<'bar' | 'line', number[]> = {
    labels: chartData.map((_, index) => index + 1),
    datasets: [
      {
        type: 'bar',
        label: 'Rating',
        order: 2,
        data: chartData.map(item => {
          const rating = Number(item.rating);
          return rating < 0 ? rating : rating;
        }),
        backgroundColor: chartData.map(item => item.color),
        borderRadius: 4,
        barThickness: chartData.length > 20 ? 10 : chartData.length > 10 ? 15 : 20,
        barPercentage: chartData.length > 20 ? 0.1 : chartData.length > 10 ? 0.15 : 0.2,
        categoryPercentage: chartData.length > 20 ? 0.2 : chartData.length > 10 ? 0.25 : 0.3,
        yAxisID: 'rating',
      },
      {
        type: 'line',
        label: 'Impact',
        order: 0,
        data: chartData.map(item => {
          const impact = Number(item.impact ?? 0);
          const rating = Number(item.rating);
          return rating < 0 ? -Math.abs(impact) : Math.abs(impact);
        }),
        borderColor: chartData.map(item => item.color),
        backgroundColor: chartData.map(item => item.color),
        segment: {
          borderColor: (ctx) => {
            if (ctx.p0.parsed && ctx.p1.parsed) {
              const index = ctx.p1DataIndex;
              return valueLineColorMap[chartData[index]?.rating];
            }
            return valueLineColorMap[chartData[0]?.rating];
          }
        },
        borderWidth: 2,
        tension: 0,
        pointRadius: chartData.length < 12 ? 4 : 0,
        pointBackgroundColor: chartData.map(item => item.color),
        yAxisID: 'impact',
      }
    ]
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = chartData[context.dataIndex];
            if (context.dataset.label === 'Rating') {
              return [
                `Rating: ${context.parsed.y}`,
                `Confidence: ${ratingToText[dataPoint.rating]}`
              ];
            }
            return [`Impact: ${compactFormat(context.parsed.y)}`];
          },
          title: (tooltipItems) => {
            if (tooltipItems.length > 0) {
              const index = tooltipItems[0].dataIndex;
              return chartData[index].evaluatorName;
            }
            return '';
          },
          // labelColor: () => ({
          //   borderColor: 'transparent',
          //   backgroundColor: 'transparent',
          // }),
          // labelTextColor: () => 'black',
        },
        usePointStyle: true,
        boxPadding: 0,
        padding: {
          top: 4,
          bottom: 4,
          left: 8,
          right: 8,
        },
        backgroundColor: 'black',
        titleColor: 'white',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'transparent',
        borderWidth: 1,
        cornerRadius: 4,
        titleFont: {
          weight: 'bold',
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          drag: {
            enabled: true,
          },
          wheel: {
            enabled: true,
            modifierKey: 'ctrl',
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
          scaleMode: 'x',
        },
      },
    },
    scales: {
      x: {
       
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => formatXAxis(chartData[Number(value) - 1]?.timestamp),
          font: {
            size: 10,
          },
        },
      },
      rating: {
        type: 'linear',
        position: 'left',
        min: -5,
        max: 5,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      impact: {
        type: 'linear',
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="h-[200px] w-full my-10">
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
