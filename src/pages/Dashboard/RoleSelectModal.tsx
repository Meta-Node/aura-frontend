import { viewModeToString } from 'constants/index';
import useViewMode from 'hooks/useViewMode';
import * as React from 'react';
import { PreferredView } from 'types/dashboard';

const RoleSelectModal = ({
  closeModalHandler,
}: {
  closeModalHandler?: () => void;
}) => {
  const { setPreferredView } = useViewMode();

  return (
    <div className="flex flex-col gap-6">
      <div
        className="card flex !flex-row gap-4 !bg-opacity-100 items-center justify-between cursor-pointer"
        onClick={() => {
          setPreferredView(PreferredView.PLAYER);
          closeModalHandler?.();
        }}
      >
        <img
          className=""
          src={`/assets/images/DomainOverview/${viewModeToString[
            PreferredView.PLAYER
          ].toLowerCase()}s-icon.svg`}
          alt=""
        />
        <div>{viewModeToString[PreferredView.PLAYER]}</div>
      </div>
    </div>
  );
};

export default RoleSelectModal;
