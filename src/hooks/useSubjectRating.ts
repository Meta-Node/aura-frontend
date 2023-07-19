import { useEffect, useMemo, useState } from 'react';
import { AuraRating } from '../types';
import { getConnection } from '../api/connections.service.ts';
import { getConfidenceValue } from '../utils/constants.ts';

export const useSubjectRating = ({
  fromSubjectId,
  toSubjectId,
}: {
  fromSubjectId: string;
  toSubjectId: string;
}) => {
  const [rating, setRating] = useState<AuraRating | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getConnection(fromSubjectId, toSubjectId).then((conn) => {
      if (mounted) {
        if (conn.previousRating) {
          setRating(conn.previousRating);
        }
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [fromSubjectId, toSubjectId]);
  const confidenceValue = useMemo(() => getConfidenceValue(rating), [rating]);

  return { rating, loading, confidenceValue };
};