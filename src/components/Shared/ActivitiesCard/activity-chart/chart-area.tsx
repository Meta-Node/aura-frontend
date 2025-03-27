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
import ActivityChartTooltip from './chart-tooltip';
import { ChartTooltip } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { ImageLabel } from '../../ProfileOverview/evaluations-chart/chart-area';

export interface ChartAreaProps {
  data: any[];
  refAreaLeft: number | null;
  refAreaRight: number | null;
  scaleBarHeight: (data: any) => number;
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  zoomedData: any[];
  onBarClick?: (entry: any) => void;
}

export const ActivityChartArea = ({
  refAreaLeft,
  refAreaRight,
  scaleBarHeight,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  zoomedData,
  onBarClick,
}: ChartAreaProps) => {
  return (
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
          tick={<ImageLabel data={zoomedData} />}
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
        <ChartTooltip cursor={false} content={<ActivityChartTooltip />} />

        <ReferenceLine y={0} stroke="gray" strokeWidth={1} />
        <Bar
          maxBarSize={20}
          dataKey={(data) => scaleBarHeight(data)}
          opacity={0.9}
        >
          {zoomedData.map((entry, index) => (
            <Cell
              className={cn(onBarClick && 'cursor-pointer')}
              onClick={onBarClick?.bind(null, entry)}
              radius={entry.borderRadius}
              key={`cell-${index}`}
              fill={entry.color}
            />
          ))}
        </Bar>
        <Area
          type="monotone"
          dataKey="rating"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          dot={{ r: zoomedData.length > 50 ? 1 : 2, fill: 'white' }}
          fill="url(#colorEvaluations)"
          z={10}
          isAnimationActive={false}
          strokeWidth={2}
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
};
export default ActivityChartArea;
