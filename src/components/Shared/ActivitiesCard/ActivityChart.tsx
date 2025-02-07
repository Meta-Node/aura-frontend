import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { AuraImpact } from '@/api/auranode.service';
import { valueColorMap } from '@/constants/chart';
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
    const { evaluatorName, impact, confidence } = payload[0].payload;
    return (
      <div className="bg-dark-primary p-2 shadow-md rounded-lg text-sm border">
        <p className="font-semibold">{evaluatorName}</p>
        <p>Impact: {compactFormat(impact)}</p>
        <p>Confidence: {compactFormat(confidence)}</p>
      </div>
    );
  }
  return null;
};

export function ActivityChart({
  auraImpacts,
  auraScore,
}: {
  auraImpacts: AuraImpact[] | null;
  auraScore: number;
}) {
  if (!auraImpacts) return null;
  const chartData = processAuraImpacts(auraImpacts, auraScore);

  return (
    <ResponsiveContainer className="-ml-10 mt-10" width="100%" height={300}>
      <LineChart data={chartData}>
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
          dataKey="evaluatorName"
          tick={{ fontSize: 10 }}
        />
        <YAxis
          axisLine={false}
          type="number"
          tick={{ fontSize: 9 }}
          domain={['auto', 'auto']}
          scale="log"
          tickFormatter={(value) => compactFormat(value)}
          tickCount={0}
          tickLine={false}
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="cumulativeScore"
          stroke="url(#lineGradient)"
          strokeWidth={2}
          dot={
            chartData.length < 12 ? { fill: 'currentColor', r: 4 } : { r: 0 }
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
