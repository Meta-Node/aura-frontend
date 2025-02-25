import { toggleSearchModal } from 'BrightID/actions';
import { useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { matchPath, useLocation, useNavigate } from 'react-router';
import routes from 'Routes';
import { RoutePath } from 'types/router';
import { findLastIndex } from 'utils/index';

import useViewMode from '../../hooks/useViewMode';
import { PlayerHistorySequenceType } from '../../types';
import { PlayerHistorySequence } from './PlayerHistorySequence';

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentRouteObject = useMemo(
    () => routes.find((route) => route.pathRegex.test(pathname)),
    [pathname],
  );

  const [playerHistorySequence, setPlayerHistorySequence] = useState<
    PlayerHistorySequenceType[]
  >([]);
  const [isSequenceOpen, setIsSequenceOpen] = useState(false);

  const { currentEvaluationCategory } = useViewMode();
  const dispatch = useDispatch();

  useEffect(() => {
    if (matchPath(RoutePath.HOME, pathname)) {
      setIsSequenceOpen(false);
      setPlayerHistorySequence([]);
      return;
    }
    const subjectIdProp = matchPath(RoutePath.SUBJECT_PROFILE, pathname)?.params
      .subjectIdProp;
    if (!subjectIdProp) return;
    setPlayerHistorySequence((prevSequence) => {
      if (
        findLastIndex(prevSequence, (h) => h.subjectId === subjectIdProp) ===
        prevSequence.length - 1
      ) {
        return [
          ...prevSequence.slice(0, prevSequence.length - 1),
          {
            subjectId: subjectIdProp,
            evaluationCategory: currentEvaluationCategory,
          },
        ];
      }
      const index = findLastIndex(
        prevSequence,
        (h) =>
          h.subjectId === subjectIdProp &&
          h.evaluationCategory === currentEvaluationCategory,
      );
      if (index === -1) {
        return [
          ...prevSequence,
          {
            subjectId: subjectIdProp,
            evaluationCategory: currentEvaluationCategory,
          },
        ];
      }
      return prevSequence.slice(0, index + 1);
    });
  }, [currentEvaluationCategory, pathname]);

  let HeaderComponent: any;

  if (currentRouteObject) {
    HeaderComponent = currentRouteObject.header;
  } else {
    HeaderComponent = {
      title: <></>,
      icon: '/assets/images/Header/home.svg',
      iconClickedHandler: () => {
        navigate(RoutePath.HOME);
      },
    };
  }

  const HeaderTitle = HeaderComponent.title ?? (() => <></>);

  return (
    <div className="flex flex-col gap-2.5 px-1 pt-9 md:px-6">
      {isSequenceOpen && (
        <PlayerHistorySequence playerHistorySequence={playerHistorySequence} />
      )}
      <header className="header flex flex-wrap justify-between pb-4">
        <div className="header-left flex flex-wrap items-center gap-1.5">
          {HeaderComponent.icon && (
            <span
              key={HeaderComponent.icon}
              onClick={() =>
                HeaderComponent && HeaderComponent.iconClickedHandler(navigate)
              }
              className="header-icon mr-0.5 !cursor-pointer"
              data-testid="nav-button"
            >
              <img
                key={HeaderComponent.icon}
                className="h-6 w-6"
                src={HeaderComponent.icon}
                alt={''}
              />
            </span>
          )}
          {playerHistorySequence.length !== 0 && (
            <img
              className="h-[18px] w-6 cursor-pointer"
              src={
                isSequenceOpen
                  ? '/assets/images/Header/close-sequence.svg'
                  : '/assets/images/Header/sequence.svg'
              }
              alt=""
              onClick={() => setIsSequenceOpen(!isSequenceOpen)}
            />
          )}
          <div className="header-title flex items-center whitespace-nowrap text-xl font-medium text-white">
            <HeaderTitle />
          </div>
        </div>
        <span className="header-right flex items-center">
          <button
            key="/assets/images/Header/search.svg"
            onClick={() => dispatch(toggleSearchModal())}
            className="header-icon mr-4 text-gray-300 dark:text-white"
            data-testid="nav-button"
          >
            <FaSearch size={20} />
          </button>
          {!matchPath(RoutePath.SETTINGS, pathname) && (
            <span
              key="/assets/images/Header/settings.svg"
              onClick={() => navigate(RoutePath.SETTINGS)}
              className="header-icon !cursor-pointer"
              data-testid="nav-button"
            >
              <img
                key="/assets/images/Header/settings.svg"
                className="h-6 w-6"
                src="/assets/images/Header/settings.svg"
                alt={''}
              />
            </span>
          )}
        </span>
      </header>
    </div>
  );
};

export default Header;
