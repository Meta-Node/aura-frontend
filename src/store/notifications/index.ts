import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { RESET_STORE } from 'BrightID/actions';
import { profileApi } from '../api/profile';
import { RootState } from '..';
import { Verifications } from '@/api/auranode.service';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';
import { EvaluationCategory } from '@/types/dashboard';
import { connectionsApi } from '../api/connections';
import { AuraNodeBrightIdConnection } from '@/types';

export const NOTIFICATION_THRESHOLDS = {
  LEVEL_CHANGE: 1, // Notify on any level change
  SCORE_CHANGE_PERCENTAGE: 10, // Notify on 10% score change
  MIN_SCORE_CHANGE: 50, // Minimum absolute score change to trigger notification
};

export interface Evaluator {
  id: string;
  timestamp: number;
  value: number;
}

export interface TrackedCategoryState {
  score: number;
  level: number;
  evaluators: Evaluator[];
  explorivity: number;
}

export interface TrackedProfileState {
  id: string;
  categories: Record<EvaluationCategory, TrackedCategoryState>;
  lastUpdated: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  link?: string;
  icon?: string;
  createdAt: number;
  read: boolean;
  profileId: string;
  changeType: 'level' | 'score' | 'evaluation';
  evaluationCategory: EvaluationCategory;
  viewed?: boolean;
}

export type NotificationsState = {
  items: Notification[];
  trackedProfiles: Record<string, TrackedProfileState>;
  lastFetched: number | null;
  loading: boolean;
  error: string | null;
};

const initialNotificationsState: NotificationsState = {
  items: [],
  trackedProfiles: {},
  lastFetched: null,
  loading: false,
  error: null,
};

// Async thunk for fetching notifications
export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetch',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    if (!state.profile.authData) return;

    // Prevent fetch if lastFetched is less than 2.5 minutes ago
    const lastFetched = state.notifications.lastFetched;
    if (lastFetched && Date.now() - lastFetched < 2.5 * 60 * 1000) {
      return state.notifications.items;
    }

    const trackedProfiles = state.notifications.trackedProfiles;

    const response =
      await connectionsApi.endpoints.getInboundConnections.initiate({
        id: state.profile.authData.brightId,
      })(dispatch, getState, {});

    response.data?.forEach((item) => {
      dispatch(notificationsSlice.actions.updateProfileState(item));
    });

    return;
  },
);

// Helper function to check if change meets threshold
const shouldNotifyOnChange = (
  changeType: 'level' | 'score' | 'evaluation',
  oldValue: number,
  newValue: number,
): boolean => {
  switch (changeType) {
    case 'level':
      return (
        Math.abs(newValue - oldValue) >= NOTIFICATION_THRESHOLDS.LEVEL_CHANGE
      );
    case 'score':
      const percentageChange = Math.abs((newValue - oldValue) / oldValue) * 100;
      const absoluteChange = Math.abs(newValue - oldValue);
      return (
        percentageChange >= NOTIFICATION_THRESHOLDS.SCORE_CHANGE_PERCENTAGE &&
        absoluteChange >= NOTIFICATION_THRESHOLDS.MIN_SCORE_CHANGE
      );
    case 'evaluation':
      return true; // Always notify on evaluation changes
  }
};

// Helper function to generate notification from state change
const generateNotification = (
  profileId: string,
  changeType: 'level' | 'score' | 'evaluation',
  oldValue: number,
  newValue: number,
  explorivity: number,
  evaluationCategory: EvaluationCategory,
): Notification => {
  const changeDescription =
    changeType === 'level'
      ? `Level ${newValue > oldValue ? 'increased' : 'decreased'} by ${Math.abs(newValue - oldValue)}`
      : changeType === 'score'
        ? `Score ${newValue > oldValue ? 'increased' : 'decreased'} by ${Math.abs(newValue - oldValue)} points`
        : `Evaluation changed from ${oldValue} to ${newValue}`;

  const explorivyInfo = explorivity
    ? ` (Profile explorivity: ${explorivity.toFixed(1)}%)`
    : '';

  return {
    id: `${profileId}-${changeType}-${Date.now()}`,
    profileId,
    changeType,
    title: `Profile ${changeType} changed`,
    description: `${changeDescription}${explorivyInfo}`,
    createdAt: Date.now(),
    read: false,
    link: `/profile/${profileId}`,
    icon:
      changeType === 'level'
        ? newValue > oldValue
          ? 'level-up'
          : 'level-down'
        : changeType === 'score'
          ? newValue > oldValue
            ? 'trending-up'
            : 'trending-down'
          : 'evaluation',
    evaluationCategory,
  };
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationsState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(
        (item) => item.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((notification) => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
    trackProfile: (
      state,
      action: PayloadAction<{
        id: string;
        categories: Record<
          EvaluationCategory,
          { score: number; level: number; evaluators?: Evaluator[] }
        >;
      }>,
    ) => {
      const { id, categories } = action.payload;
      const catState: Record<EvaluationCategory, TrackedCategoryState> =
        {} as any;
      Object.entries(categories).forEach(([cat, data]) => {
        const evaluators = data.evaluators || [];
        const uniqueEvaluators = new Set(evaluators.map((e) => e.id)).size;
        const explorivity =
          evaluators.length > 0
            ? (uniqueEvaluators / evaluators.length) * 100
            : 0;
        catState[cat as EvaluationCategory] = {
          score: data.score,
          level: data.level,
          evaluators,
          explorivity,
        };
      });
      state.trackedProfiles[id] = {
        id,
        categories: catState,
        lastUpdated: Date.now(),
      };
    },
    untrackProfile: (state, action: PayloadAction<string>) => {
      delete state.trackedProfiles[action.payload];
    },
    addEvaluation: (
      state,
      action: PayloadAction<{
        profileId: string;
        evaluationCategory: EvaluationCategory;
        evaluatorId: string;
        value: number;
      }>,
    ) => {
      const profile = state.trackedProfiles[action.payload.profileId];
      if (profile) {
        const cat = profile.categories[action.payload.evaluationCategory];
        if (cat) {
          cat.evaluators.push({
            id: action.payload.evaluatorId,
            value: action.payload.value,
            timestamp: Date.now(),
          });
          const uniqueEvaluators = new Set(cat.evaluators.map((e) => e.id))
            .size;
          cat.explorivity = (uniqueEvaluators / cat.evaluators.length) * 100;
        }
      }
    },
    updateProfileState: (
      state,
      action: PayloadAction<AuraNodeBrightIdConnection>,
    ) => {
      const { id, verifications } = action.payload;
      const oldState = state.trackedProfiles[id];
      const categories: EvaluationCategory[] = [
        EvaluationCategory.SUBJECT,
        EvaluationCategory.PLAYER,
        EvaluationCategory.TRAINER,
        EvaluationCategory.MANAGER,
      ];
      // Initialize newCategories with all categories
      const newCategories: Record<EvaluationCategory, TrackedCategoryState> = {
        [EvaluationCategory.SUBJECT]: {
          score: 0,
          level: 0,
          evaluators: [],
          explorivity: 0,
        },
        [EvaluationCategory.PLAYER]: {
          score: 0,
          level: 0,
          evaluators: [],
          explorivity: 0,
        },
        [EvaluationCategory.TRAINER]: {
          score: 0,
          level: 0,
          evaluators: [],
          explorivity: 0,
        },
        [EvaluationCategory.MANAGER]: {
          score: 0,
          level: 0,
          evaluators: [],
          explorivity: 0,
        },
      };

      categories.forEach((cat) => {
        const data = getAuraVerification(verifications, cat);
        const score = data?.score || 0;
        const level = data?.level || 0;
        const evaluators: Evaluator[] = (data?.impacts || []).map((impact) => ({
          id: impact.evaluator,
          timestamp: Date.now(), // No timestamp in impact, use now
          value: impact.score || 0,
        }));
        const uniqueEvaluators = new Set(evaluators.map((e) => e.id)).size;
        const explorivity =
          evaluators.length > 0
            ? (uniqueEvaluators / evaluators.length) * 100
            : 0;
        newCategories[cat] = { score, level, evaluators, explorivity };
      });

      // For each category, compare with old state and generate notifications
      categories.forEach((cat) => {
        const newCat = newCategories[cat];
        const oldCat = oldState?.categories?.[cat];
        if (oldCat) {
          // Level change
          if (
            newCat.level !== oldCat.level &&
            shouldNotifyOnChange('level', oldCat.level, newCat.level)
          ) {
            state.items.push(
              generateNotification(
                id,
                'level',
                oldCat.level,
                newCat.level,
                newCat.explorivity,
                cat,
              ),
            );
          }
          // Score change
          if (
            newCat.score !== oldCat.score &&
            shouldNotifyOnChange('score', oldCat.score, newCat.score)
          ) {
            state.items.push(
              generateNotification(
                id,
                'score',
                oldCat.score,
                newCat.score,
                newCat.explorivity,
                cat,
              ),
            );
          }
          // New evaluations (by evaluator id)
          const oldEvalIds = new Set(oldCat.evaluators.map((e) => e.id));
          newCat.evaluators.forEach((ev) => {
            if (!oldEvalIds.has(ev.id)) {
              state.items.push(
                generateNotification(
                  id,
                  'evaluation',
                  0,
                  ev.value,
                  newCat.explorivity,
                  cat,
                ),
              );
            }
          });
        }
      });

      // Update the stored state
      state.trackedProfiles[id] = {
        id,
        categories: newCategories,
        lastUpdated: Date.now(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state) => {
        state.loading = false;
        // Do not overwrite state.items here
        state.lastFetched = Date.now();
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addMatcher(
        (action) => action.type === RESET_STORE,
        () => initialNotificationsState,
      );
  },
});

export const notificationsSelector = createSelector(
  (state: RootState) => state.notifications,
  (notifications) => notifications.items,
);

export const {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  trackProfile,
  untrackProfile,
  addEvaluation,
  updateProfileState,
} = notificationsSlice.actions;
