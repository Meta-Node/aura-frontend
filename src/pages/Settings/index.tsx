import { BsTwitterX } from 'react-icons/bs';
import { FaDiscord, FaMoon, FaSun } from 'react-icons/fa';
import { FaHandsHelping } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import { SiGitbook } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
  resetStore,
  selectPrefferedTheme,
  setPrefferedTheme,
} from '../../BrightID/actions';
import { useDispatch } from '../../store/hooks';
import { RoutePath } from '../../types/router';
import { __DEV__ } from '../../utils/env';

export const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prefferedTheme = useSelector(selectPrefferedTheme);

  return (
    <div className="page page__settings dark:text-white w-full pt-4 flex flex-col gap-4">
      <section className="flex flex-col gap-4 w-full">
        <div
          className="bg-white-90-card cursor-pointer flex items-center gap-2 dark:bg-button-primary rounded-lg pl-5 py-3.5 pr-2"
          onClick={() => navigate(RoutePath.ROLE_MANAGEMENT)}
        >
          <MdOutlineSecurity size={20} />
          <p className="font-medium text-[20px]">Role Management</p>
        </div>
        <Link
          target="_blank"
          to="https://brightid.gitbook.io/aura"
          className="bg-white-90-card dark:bg-button-primary flex items-center gap-2 cursor-pointer rounded-lg pl-5 py-3.5 pr-2"
        >
          <SiGitbook size={20} />
          <p className="font-medium text-[20px]">Aura Guide</p>
        </Link>

        <div
          onClick={() =>
            dispatch(
              setPrefferedTheme(prefferedTheme === 'dark' ? 'light' : 'dark'),
            )
          }
          className="bg-white-90-card dark:bg-button-primary cursor-pointer rounded-lg pl-5 py-3.5 pr-5 flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {prefferedTheme === 'dark' ? (
              <FaMoon size={20} />
            ) : (
              <FaSun size={20} />
            )}
            <p className="font-medium text-[20px]">Theme</p>
          </span>
          <small>{prefferedTheme.toUpperCase()}</small>
        </div>
        <Link
          target="_blank"
          to="https://discord.gg/y24xeXq7mj"
          className="bg-white-90-card dark:bg-button-primary cursor-pointer flex items-center rounded-lg pl-5 py-3.5 gap-2 pr-5"
        >
          <FaDiscord size={20} className="w-7 cursor-pointer" />
          <p className="font-medium text-[20px]">Discord</p>
        </Link>

        <Link
          target="_blank"
          to="https://x.com/brightidproject"
          className="bg-white-90-card dark:bg-button-primary cursor-pointer flex items-center justify-between rounded-lg pl-5 py-3.5 pr-5"
        >
          <BsTwitterX size={25} />
        </Link>
        <div
          className="bg-white-90-card cursor-pointer flex items-center gap-2 dark:bg-button-primary rounded-lg pl-5 py-3.5 pr-2"
          onClick={() => navigate(`${RoutePath.ONBOARDING}?step=1`)}
        >
          <FaHandsHelping size={20} />
          <p className="font-medium text-[20px]">Onboarding</p>
        </div>

        {(__DEV__ ||
          process.env.REACT_APP_IS_CYPRESS === 'true' ||
          process.env.REACT_APP_ENABLE_LOGOUT === 'true') && (
          <div
            className={
              'bg-white-90-card dark:bg-button-primary cursor-pointer rounded-lg pl-5 py-3.5 pr-2'
            }
            onClick={() => dispatch(resetStore())}
            data-testid="logout-button"
          >
            <p className="font-medium text-[20px]">Logout</p>
          </div>
        )}
      </section>
    </div>
  );
};
