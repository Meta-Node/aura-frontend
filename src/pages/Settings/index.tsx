import { useNavigate } from 'react-router-dom';

import { resetStore } from '../../BrightID/actions';
import { useDispatch } from '../../store/hooks';
import { RoutePath } from '../../types/router';
import { __DEV__ } from '../../utils/env';

export const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="page page__settings w-full pt-4 flex flex-col gap-4">
      <section className="flex flex-col gap-4 w-full">
        <div
          className="bg-white-90-card cursor-pointer rounded-lg pl-5 py-3.5 pr-2"
          onClick={() => navigate(RoutePath.ROLE_MANAGEMENT)}
        >
          <p className="font-medium text-[20px]">Role Management</p>
        </div>

        <div className="bg-white-90-card cursor-pointer rounded-lg pl-5 py-3.5 pr-2">
          <p className="font-medium text-[20px]">Domain Overview</p>
        </div>

        <div className="bg-white-90-card cursor-pointer rounded-lg pl-5 py-3.5 pr-2">
          <p className="font-medium text-[20px]">FAQ</p>
        </div>

        {(__DEV__ ||
          process.env.REACT_APP_IS_CYPRESS === 'true' ||
          process.env.REACT_APP_ENABLE_LOGOUT === 'true') && (
          <div
            className={
              'bg-white-90-card cursor-pointer rounded-lg pl-5 py-3.5 pr-2'
            }
            onClick={() => dispatch(resetStore())}
            data-testid="logout-button"
          >
            <p className="font-medium text-[20px]">Logout</p>
          </div>
        )}
      </section>

      <section className="mt-auto flex justify-center items-center gap-11 mb-2">
        <img
          src="/assets/images/Shared/guide.svg"
          alt=""
          className="w-auto h-9 cursor-pointer"
        />
        <img
          src="/assets/images/Shared/discord.svg"
          alt=""
          className="w-auto h-9 cursor-pointer"
        />
        <img
          src="/assets/images/Shared/brightid-icon-white.svg"
          alt=""
          className="w-auto h-9 cursor-pointer"
        />
      </section>

      <section className="flex w-full justify-center">
        <p className="text-white text-sm">Aura version 2.1</p>
      </section>
    </div>
  );
};
