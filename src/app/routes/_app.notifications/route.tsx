import { useEffect } from 'react';
import {
  LucideBell,
  LucideStar,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideArrowUp,
  LucideArrowDown,
  LucideUserCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RootState } from '@/store';
import {
  fetchNotificationsThunk,
  Notification,
  notificationsSelector,
  notificationsSlice,
} from '@/store/notifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DefaultHeader from '@/components/Header/DefaultHeader';
import { useDispatch, useSelector } from '@/store/hooks';

const iconMap = {
  level: {
    up: <LucideArrowUp className="text-green-500" />,
    down: <LucideArrowDown className="text-red-500" />,
  },
  score: {
    up: <LucideTrendingUp className="text-green-500" />,
    down: <LucideTrendingDown className="text-red-500" />,
  },
  evaluation: <LucideUserCheck className="text-blue-500" />,
};

function getIcon(notification: Notification) {
  if (
    notification.changeType === 'level' ||
    notification.changeType === 'score'
  ) {
    if (
      typeof (notification as any).newValue === 'number' &&
      typeof (notification as any).oldValue === 'number'
    ) {
      if (notification.changeType === 'level') {
        return (notification as any).newValue > (notification as any).oldValue
          ? iconMap.level.up
          : iconMap.level.down;
      }
      if (notification.changeType === 'score') {
        return (notification as any).newValue > (notification as any).oldValue
          ? iconMap.score.up
          : iconMap.score.down;
      }
    } else {
      return notification.changeType === 'level'
        ? iconMap.level.up
        : iconMap.score.up;
    }
  }
  if (notification.changeType === 'evaluation') {
    return iconMap.evaluation;
  }
  return <LucideBell />;
}

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelector);
  const loading = useSelector(
    (state: RootState) => state.notifications.loading,
  );

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

  return (
    <>
      <DefaultHeader title="Notifications" />
      <div className="page flex w-full flex-1 flex-col gap-4 pt-4 dark:text-white">
        <section className="mt-8 flex w-full flex-col gap-4">
          {loading && <div className="text-center">Loading...</div>}
          {notifications.length === 0 && !loading && (
            <Card className="p-6 text-center">No notifications yet.</Card>
          )}
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                'flex items-center gap-4 rounded-lg p-4',
                !n.read && 'bg-muted',
              )}
            >
              <div className="flex-shrink-0">{getIcon(n)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {n.title}
                  <span className="text-xs text-muted-foreground">
                    [{n.evaluationCategory}]
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {n.description}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {!n.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    dispatch(notificationsSlice.actions.markAsRead(n.id))
                  }
                >
                  Mark as read
                </Button>
              )}
            </Card>
          ))}
        </section>
      </div>
    </>
  );
}
