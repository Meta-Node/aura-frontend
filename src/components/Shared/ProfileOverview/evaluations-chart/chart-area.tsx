import {
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Cell,
  ReferenceLine,
  Area,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import EvaluationsChartTooltip from './chart-tooltip';
import { ChartTooltip } from '@/components/ui/chart';
import { ChartAreaProps } from '../../ActivitiesCard/activity-chart/chart-area';
import { cn } from '@/lib/utils';

export interface EvaluationChartAreaProps extends ChartAreaProps {}

export const EvaluationsChartArea = ({
  data,
  refAreaLeft,
  refAreaRight,
  scaleBarHeight,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  zoomedData,
  onBarClick,
}: EvaluationChartAreaProps) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart
      data={zoomedData}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <XAxis
        dataKey="index"
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
        domain={[-4, 4]}
        type="number"
      />
      <ChartTooltip content={<EvaluationsChartTooltip />} />

      <ReferenceLine y={0} stroke="gray" strokeWidth={1} />
      <Bar
        maxBarSize={20}
        dataKey={(data) => scaleBarHeight(data)}
        opacity={0.9}
      >
        {zoomedData.map((entry, index) => (
          <Cell
            className={cn(onBarClick && 'cursor-pointer')}
            radius={entry.borderRadius}
            onClick={onBarClick?.bind(null, entry)}
            key={`cell-${index}`}
            fill={entry.color}
          />
        ))}
      </Bar>
      <Area
        type="monotone"
        dataKey="confidence"
        stroke="hsl(var(--primary))"
        fillOpacity={1}
        dot={{ r: 2, fill: 'white' }}
        fill="url(#colorEvaluations)"
        z={10}
        isAnimationActive={false}
      />
      {refAreaLeft !== null && refAreaRight !== null && (
        <ReferenceArea
          x1={Math.min(refAreaLeft, refAreaRight)}
          x2={Math.max(refAreaLeft, refAreaRight)}
          strokeOpacity={0.3}
          fill="hsl(var(--foreground))"
          fillOpacity={0.1}
        />
      )}
    </ComposedChart>
  </ResponsiveContainer>
);

export default EvaluationsChartArea;
