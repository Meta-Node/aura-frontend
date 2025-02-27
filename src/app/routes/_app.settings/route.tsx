import { BsTwitterX } from 'react-icons/bs';
import { FaDiscord, FaMoon, FaSun } from 'react-icons/fa';
import { FaHandsHelping } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import { SiGitbook } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { Card } from '@/components/ui/card';

import {
  resetStore,
  selectPreferredTheme,
  setPrefferedTheme,
} from 'BrightID/actions';
import { useDispatch } from 'store/hooks';
import { RoutePath } from 'types/router';
import { __DEV__ } from 'utils/env';
import DefaultHeader from '@/components/Header/DefaultHeader';
import VersionCard from './components/version';

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prefferedTheme = useSelector(selectPreferredTheme);

  return (
    <>
      <DefaultHeader title="Settings" />
      <div className="page flex w-full flex-1 flex-col gap-4 pt-4 dark:text-white">
        <section className="flex w-full flex-col gap-4">
          <Card
            className="flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-2"
            onClick={() => navigate(RoutePath.ROLE_MANAGEMENT)}
          >
            <MdOutlineSecurity size={20} />
            <p className="text-[20px] font-medium">Role Management</p>
          </Card>
          <Link target="_blank" to="https://brightid.gitbook.io/aura">
            <Card className="flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-2">
              <SiGitbook size={20} />
              <p className="text-[20px] font-medium">Aura Guide</p>
            </Card>
          </Link>

          <Card
            onClick={() =>
              dispatch(
                setPrefferedTheme(prefferedTheme === 'dark' ? 'light' : 'dark'),
              )
            }
            className="flex cursor-pointer items-center justify-between rounded-lg py-3.5 pl-5 pr-5"
          >
            <span className="flex items-center gap-2">
              {prefferedTheme === 'dark' ? (
                <FaMoon size={20} />
              ) : (
                <FaSun size={20} />
              )}
              <p className="text-[20px] font-medium">Theme</p>
            </span>
            <small>{prefferedTheme.toUpperCase()}</small>
          </Card>
          <Link target="_blank" to="https://discord.gg/y24xeXq7mj">
            <Card className="flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-5">
              <FaDiscord size={20} className="w-7 cursor-pointer" />
              <p className="text-[20px] font-medium">Discord</p>
            </Card>
          </Link>

          <Link target="_blank" to="https://x.com/brightidproject">
            <Card className="flex cursor-pointer items-center justify-between rounded-lg py-3.5 pl-5 pr-5">
              <BsTwitterX size={25} />
            </Card>
          </Link>
          <Card
            className="flex cursor-pointer items-center gap-2 rounded-lg py-3.5 pl-5 pr-2"
            onClick={() => navigate(`${RoutePath.ONBOARDING}?step=1`)}
          >
            <FaHandsHelping size={20} />
            <p className="text-[20px] font-medium">Onboarding</p>
          </Card>

          <VersionCard />

          {(__DEV__ ||
            process.env.VITE_REACT_APP_IS_CYPRESS === 'true' ||
            process.env.REACT_APP_ENABLE_LOGOUT === 'true') && (
            <Card
              className={'cursor-pointer rounded-lg py-3.5 pl-5 pr-2'}
              onClick={() => dispatch(resetStore())}
              data-testid="logout-button"
            >
              <p className="text-[20px] font-medium">Logout</p>
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
