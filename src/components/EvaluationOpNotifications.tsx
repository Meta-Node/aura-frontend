import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {
  EvaluateSubmittedOperation,
  selectEvaluateOperations,
} from 'BrightID/reducer/operationsSlice';
import { operation_states } from '../BrightID/utils/constants';
import {
  getBgClassNameOfAuraRatingNumber,
  getViewModeSubjectBorderColorClass,
  subjectViewAsIconColored,
  viewAsToViewMode,
} from '../constants';
import { useRefreshEvaluationsContext } from '../contexts/RefreshEvaluationsContext';
import { useSubjectName } from '../hooks/useSubjectName';
import { useSelector } from '../store/hooks';
import BrightIdProfilePicture from './BrightIdProfilePicture';
import EvaluationThumb from './Shared/EvaluationThumb';

type EvaluateOpNotificationData = {
  text: string;
  operation: EvaluateSubmittedOperation;
};

function EvaluateOpNotification({
  notification,
  dismiss,
}: {
  notification: EvaluateOpNotificationData;
  dismiss: () => void;
}) {
  const subjectName = useSubjectName(notification.operation.evaluated);
  return (
    <div className="card !bg-neutral-l2 !border-neutral-l3 flex flex-col gap-1">
      <div className="flex w-full justify-between items-center">
        <Link
          className="flex gap-2 items-center"
          to={
            '/subject/' +
            notification.operation.evaluated +
            '?viewas=' +
            notification.operation.category
          }
        >
          <img
            src="/assets/images/Shared/close-filled-red.svg"
            className="cursor-pointer"
            onClick={dismiss}
            alt=""
          />
          <BrightIdProfilePicture
            subjectId={notification.operation.evaluated}
            className={`border-solid border rounded w-4 h-4 ${getViewModeSubjectBorderColorClass(
              viewAsToViewMode[notification.operation.category],
            )}`}
          />
          <div>{subjectName}</div>
          <img
            src={subjectViewAsIconColored[notification.operation.category]}
            className="w-4 h-4"
            alt=""
          />
          <div
            className={`rounded flex px-3 py-1 gap-1 items-center ${getBgClassNameOfAuraRatingNumber(
              notification.operation.confidence,
            )}`}
          >
            <EvaluationThumb
              rating={notification.operation.confidence}
              className="w-3.5 h-3.5"
              alt=""
            />
            <span
              className={`font-medium text-xs  ${Math.abs(notification.operation.confidence) > 2
                  ? 'text-white'
                  : 'text-black'
                }`}
            >
              (
              {notification.operation.confidence > 0
                ? `+${notification.operation.confidence}`
                : notification.operation.confidence}
              )
            </span>
          </div>
        </Link>
        <p className="font-bold text-sm text-button-primary">
          {notification.text}
        </p>
      </div>
      {/*TODO: Handle failed notifications*/}
      {/*<div className="flex w-full justify-between items-center">*/}
      {/*<div className="flex gap-0.5">*/}
      {/*  <p className="font-medium text-sm text-nl3">Try Again</p>*/}
      {/*  <img src="/assets/images/Shared/refresh-red.svg" alt="" />*/}
      {/*</div>*/}
      {/*</div>*/}
    </div>
  );
}

export default function EvaluationOpNotifications() {
  const operations = useSelector(selectEvaluateOperations);
  const prevOperationsRef = useRef<EvaluateSubmittedOperation[] | null>(null);

  useEffect(() => {
    const storedOperations = localStorage.getItem('prevOperations');
    if (storedOperations) {
      prevOperationsRef.current = JSON.parse(
        storedOperations,
      ) as EvaluateSubmittedOperation[];
    }
  }, []);

  const [notifications, setNotifications] = useState<
    (EvaluateOpNotificationData & {
      id: string;
    })[]
  >([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((currentNotifications) => {
      console.log({
        currentNotifications,
        id,
      });
      return currentNotifications.filter((n) => n.id !== id);
    });
  }, []);

  const addNotification = useCallback(
    (data: EvaluateOpNotificationData) => {
      const newId = uuidv4();
      setNotifications((currentNotifications) =>
        currentNotifications.concat([
          {
            id: newId,
            ...data,
          },
        ]),
      );
      if (data.operation.state !== operation_states.FAILED) {
        setTimeout(() => removeNotification(newId), 5000);
      }
    },
    [removeNotification],
  );
  const { refreshEvaluations } = useRefreshEvaluationsContext();
  useEffect(() => {
    const prevOperations = prevOperationsRef.current;
    if (prevOperations) {
      operations.forEach((operation) => {
        const prevOperation = prevOperations.find(
          (op) => op.hash === operation.hash,
        );
        if (!prevOperation) {
          addNotification({
            operation,
            text: `Waiting...`,
          });
        } else if (
          prevOperation.state !== operation_states.APPLIED &&
          operation.state === operation_states.APPLIED
        ) {
          addNotification({
            operation,
            text: `Applied!`,
          });
          refreshEvaluations();
        } else if (
          prevOperation.state !== operation_states.FAILED &&
          operation.state === operation_states.FAILED
        ) {
          addNotification({
            operation,
            text: `Failed!`,
          });
        }
      });
    }

    // Update ref and localStorage with the latest operations
    prevOperationsRef.current = operations;
    localStorage.setItem('prevOperations', JSON.stringify(operations));
  }, [addNotification, operations, refreshEvaluations]);

  return notifications.length === 0 ? (
    <></>
  ) : (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <EvaluateOpNotification
            key={notification.id}
            notification={notification}
            dismiss={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
