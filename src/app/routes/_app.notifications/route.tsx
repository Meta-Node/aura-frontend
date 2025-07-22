import {
  LucideBell,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideArrowUp,
  LucideArrowDown,
  LucideUserCheck,
  RefreshCwIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RootState } from '@/store';
import {
  Notification,
  notificationsSelector,
  notificationsSlice,
  triggerNotificationFetch,
} from '@/store/notifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DefaultHeader from '@/components/Header/DefaultHeader';
import { useDispatch, useSelector } from '@/store/hooks';
import { BrightIdBackupConnection } from '@/types';
import { useBrightIdBackupConnectionResolver } from '@/hooks/useBrightIdBackupWithAuraConnectionData';
import { selectAuthData } from '@/store/profile/selectors';
import { shortenBrightIdName } from '@/utils/connection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EvaluationCategory } from '@/types/dashboard';
import BrightIdProfilePicture from '@/components/BrightIdProfilePicture';
import { Link } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import { useStore } from 'react-redux';
import { useMyEvaluations } from '@/hooks/useMyEvaluations';

// Define icons for evaluation categories
export const subjectViewAsIconColored: {
  [key in EvaluationCategory]: string;
} = {
  [EvaluationCategory.SUBJECT]: '/assets/images/Shared/brightid-icon.svg',
  [EvaluationCategory.PLAYER]: '/assets/images/Shared/player.svg',
  [EvaluationCategory.TRAINER]: '/assets/images/Shared/trainer.svg',
  [EvaluationCategory.MANAGER]: '/assets/images/Shared/manager-icon-s-blue.svg',
};

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

export function parseTitleAndDescription(
  description: string,
  type: 'evaluation' | 'level' | 'score',
  profileId: string,
  resolve: (key: string) => BrightIdBackupConnection,
  brightId: string | undefined,
  to?: string,
) {
  switch (type) {
    case 'evaluation':
      if (to === brightId) {
        return (
          (resolve(profileId)?.name ?? shortenBrightIdName(profileId)) +
          ' Evaluated You'
        );
      }
      return (
        (resolve(profileId)?.name ?? shortenBrightIdName(profileId)) +
        ' Evaluated ' +
        (resolve(to!)?.name ?? shortenBrightIdName(to!))
      );
    case 'level':
      if (profileId === brightId) {
        return 'Your ' + description;
      }
      return (
        (resolve(profileId)?.name ?? shortenBrightIdName(profileId)) +
        ' ' +
        description
      );
    case 'score':
      if (profileId === brightId) {
        return 'Your ' + description;
      }
      return (
        (resolve(profileId)?.name ?? shortenBrightIdName(profileId)) +
        ' ' +
        description
      );
  }
}

export default function NotificationsPage() {
  const { getState } = useStore();
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelector);
  const loading = useSelector(
    (state: RootState) => state.notifications.loading,
  );
  const authData = useSelector(selectAuthData);
  const { resolve } = useBrightIdBackupConnectionResolver();
  const { myRatings } = useMyEvaluations();

  // Define the order of categories for tabs
  const categories: EvaluationCategory[] = [
    EvaluationCategory.SUBJECT,
    EvaluationCategory.PLAYER,
    EvaluationCategory.TRAINER,
    EvaluationCategory.MANAGER,
  ];

  const notificationsByCategory = categories.reduce(
    (acc, category) => {
      const categoryNotifications = notifications.filter(
        (n) => n.evaluationCategory === category,
      );
      acc[category] = [
        ...categoryNotifications.filter((n) => !n.read),
        ...categoryNotifications.filter((n) => n.read),
      ];
      return acc;
    },
    {} as Record<EvaluationCategory, Notification[]>,
  );

  const unreadCounts = categories.reduce(
    (acc, category) => {
      acc[category] = notifications.filter(
        (n) => n.evaluationCategory === category && !n.read,
      ).length;
      return acc;
    },
    {} as Record<EvaluationCategory, number>,
  );

  return (
    <>
      <DefaultHeader title="Notifications" />
      {notifications.length === 0 ? (
        <div data-testid="no-notifications"></div>
      ) : (
        <div data-testid={`notifications-count-${notifications.length}`}></div>
      )}
      <div className="page flex w-full flex-1 flex-col gap-4 pt-4 dark:text-white">
        <section className="mt-8 flex w-full flex-col gap-4">
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((item, key) => (
                <NotificationCardSkeleton key={key} />
              ))}
            </div>
          ) : (
            <Tabs defaultValue={categories[0]}>
              <TabsList className="w-full">
                {categories.map((category) => (
                  <TabsTrigger
                    className="relative w-full"
                    key={category}
                    value={category}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={subjectViewAsIconColored[category]}
                        alt={category}
                        className="h-6 w-6"
                      />
                      {category}
                      {unreadCounts[category] > 0 && (
                        <Badge
                          variant="default"
                          className="absolute -right-2 -top-2 ml-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full"
                        >
                          {unreadCounts[category]}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent className="mt-10" key={category} value={category}>
                  {notificationsByCategory[category].length === 0 ? (
                    <Card className="p-6 text-center">
                      No notifications in this category.
                    </Card>
                  ) : (
                    <>
                      {notificationsByCategory[category].map((n, index) => {
                        const showSeparator =
                          index > 0 &&
                          !n.read &&
                          notificationsByCategory[category][index - 1].read;
                        return (
                          <Fragment key={index}>
                            {showSeparator && (
                              <>
                                <hr className="my-4 border-t border-gray-300" />
                                <div className="mb-2 text-sm font-semibold text-muted-foreground">
                                  Read Notifications
                                </div>
                              </>
                            )}
                            <NotificationCard
                              key={index}
                              notification={n}
                              resolve={resolve}
                              brightId={authData?.brightId}
                            />
                          </Fragment>
                        );
                      })}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </section>
      </div>
    </>
  );
}

function NotificationCard({
  notification,
  resolve,
  brightId,
}: {
  notification: Notification;
  resolve: (key: string) => BrightIdBackupConnection;
  brightId: string | undefined;
}) {
  const dispatch = useDispatch();
  return (
    <Link
      to={`/subject/${notification.profileId}?viewas=${notification.evaluationCategory}`}
    >
      <Card
        className={cn(
          'my-2 flex items-center gap-4 rounded-lg p-4',
          !notification.read && 'bg-muted',
          notification.read && 'opacity-50',
        )}
      >
        <div className="flex-shrink-0">
          <BrightIdProfilePicture
            className="h-14 w-14 rounded-full"
            subjectId={notification.profileId}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 font-semibold">
            {parseTitleAndDescription(
              notification.description,
              notification.changeType,
              notification.profileId,
              resolve,
              brightId,
              notification.to,
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </div>
        </div>
        {!notification.read && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(notificationsSlice.actions.markAsRead(notification.id));
            }}
          >
            Mark as read
          </Button>
        )}
      </Card>
    </Link>
  );
}

function NotificationCardSkeleton() {
  return (
    <Card className="my-2 flex items-center gap-4 rounded-lg p-4">
      <div className="flex-shrink-0">
        <div className="h-14 w-14 animate-pulse rounded-full bg-gray-400" />
      </div>
      <div className="flex-1">
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-400" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-400" />
      </div>
      <div className="h-8 w-20 animate-pulse rounded bg-gray-400" />
    </Card>
  );
}
