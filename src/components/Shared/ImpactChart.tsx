import blockies from 'ethereum-blockies';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { AuraImpact } from '@/api/auranode.service';
import { pullProfilePhoto } from '@/api/profilePhoto.service';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  selectAuthData,
  selectBrightIdBackup,
} from '@/store/profile/selectors';
import { hash } from '@/utils/crypto';

const data = [
  { name: 'Facebook', users: 2.8, logo: '/placeholder.svg?height=30&width=30' },
  { name: 'YouTube', users: 2.3, logo: '/placeholder.svg?height=30&width=30' },
  { name: 'WhatsApp', users: 2.0, logo: '/placeholder.svg?height=30&width=30' },
  {
    name: 'Instagram',
    users: 1.4,
    logo: '/placeholder.svg?height=30&width=30',
  },
  { name: 'TikTok', users: 1.0, logo: '/placeholder.svg?height=30&width=30' },
];

const CustomXAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <image
        x={-15}
        y={10}
        width={30}
        height={30}
        xlinkHref={payload.value}
        style={{ objectFit: 'cover' }}
      />
    </g>
  );
};

export default function ImpactChart({
  className,
  auraImpacts,
  shouldFetchImages,
}: {
  className?: string;

  auraImpacts: AuraImpact[] | null;
  shouldFetchImages?: boolean;
}) {
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
      prev[curr.evaluator] = blockies
        .create({
          seed: curr.evaluator,
          size: 10,
          scale: 3,
        })
        .toDataURL();

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
            images[impact.evaluator] = profilePhoto;
          } catch (e) {
            images[impact.evaluator] = blockies
              .create({
                seed: impact.evaluator,
                size: 10,
                scale: 3,
              })
              .toDataURL();
          }
        }),
      );

      setProfileImages(images);
    };

    fetchUserImages();
  }, [auraTopImpacts, authData, brightIdBackup, shouldFetchImages]);

  return (
    <ChartContainer
      config={{
        'value-rating-4': {
          color: '#924848',
        },
        'value-rating-3': { color: '#DA6A6A' },
        'value-rating-2': { color: '#EE9D9D' },
        'value-rating-1': { color: '#F5BFBF' },
        'value-rating1': { color: '#D5ECDA' },
        'value-rating2': { color: '#B4E6C0' },
        'value-rating3': { color: '#72BF83' },
        'value-rating4': { color: '#5B9969' },

        'user-rating-4': {
          color: '#D9C7F9',
        },
        'user-rating-3': { color: '#C2A8F3' },
        'user-rating-2': { color: '#AC89ED' },
        'user-rating-1': { color: '#956AE6' },
        'user-rating1': { color: '#8341DE' },
        'user-rating2': { color: '#6C34B3' },
        'user-rating3': { color: '#572988' },
        'user-rating4': { color: '#451F6D' },

        'subject-rating-4': {
          color: '#FAD7A0',
        },
        'subject-rating-3': { color: '#F8C471' },
        'subject-rating-2': { color: '#F5B041' },
        'subject-rating-1': { color: '#F39C12' },
        'subject-rating1': { color: '#91450F' },
        'subject-rating2': { color: '#AF5714' },
        'subject-rating3': { color: '#CA6A1A' },
        'subject-rating4': { color: '#E67E22' },
      }}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={auraTopImpacts.map((item) => ({
            logo: profileImages[item.evaluator],
            impact: item.impact,
            name: `${item.evaluatorName} ${(
              (item.impact / auraSumImpacts) *
              100
            ).toFixed(2)}%`,
            [`${
              authData?.brightId === item.evaluator
                ? 'user'
                : item.evaluator === focusedSubjectId
                ? 'subject'
                : 'value'
            }-rating${item.confidence}`]: item.score,
          }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            hide
            dataKey="logo"
            tick={(props) => <CustomXAxisTick {...props} />}
            interval={0}
          />
          <YAxis hide />
          <ChartTooltip
            content={({ active, payload }) => {
              if (
                active &&
                payload &&
                payload.length > 0 &&
                payload[0].payload
              ) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {`${data.name} ${(
                        (data.impact / auraSumImpacts) *
                        100
                      ).toFixed(2)}%`}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {['subject', 'value', 'user'].map((item, key) =>
            Array.from(new Array(8)).map((_, key2) => (
              <Bar
                key={`${key}.${key2}`}
                dataKey={`${item}-rating${
                  key2 - 4 >= 0 ? key2 - 4 + 1 : key2 - 4
                }`}
                fill={`var(--color-${item}-rating${
                  key2 - 4 >= 0 ? key2 - 4 + 1 : key2 - 4
                })`}
                radius={[4, 4, 0, 0]}
              />
            )),
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
