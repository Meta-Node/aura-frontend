import { Link } from 'react-router-dom';
import { Modal } from '../../components/Shared/Modal';
import { useState } from 'react';
import RoleSelectModal from './RoleSelectModal.tsx';
import { resetStore } from 'BrightID/actions';
import { useDispatch } from 'store/hooks.ts';
import { RoutePath } from 'types/router.ts';

const Dashboard = () => {
  const preferredViews = ['Player', 'Trainer', 'Manager'];
  const preferredView = preferredViews[0];
  const [isRoleSelectModalOpen, setIsRoleSelectModalOpen] = useState(false);

  interface stringValue {
    [key: string]: string;
  }

  const preferredViewIcon: stringValue = {
    Player: '/assets/images/Dashboard/account-icon.svg',
    Trainer: '/assets/images/Dashboard/trainer-icon.svg',
    Manager: '/assets/images/Dashboard/manager-icon.svg',
  };
  const dispatch = useDispatch();
  return (
    <div className="page page__dashboard">
      <div className="row mb-4">
        <div className="card">
          <p className="text-sm">Domain</p>
          <p className="font-bold mb-2.5">BrightID</p>
          <p className="text-sm">Energy Team</p>
          <p className="font-bold mb-5">Core</p>
          <button className="btn">Change</button>
        </div>
        <div className="card">
          <p className="mb-5">Preferred view</p>
          <img
            className="icon mb-7 mx-auto !w-10 !h-10"
            src={preferredViewIcon[preferredView]}
            alt=""
          />
          <span className="flex justify-between w-full items-center mt-auto">
            <p className="font-bold">{preferredView}</p>
            <button
              className="btn btn--icon"
              onClick={() => setIsRoleSelectModalOpen(true)}
            >
              <img src="/assets/images/Dashboard/refresh-icon.svg" alt="" />
            </button>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/domain-overview" className="card">
          <img
            className="icon"
            src="/assets/images/Dashboard/domain-overview-icon.svg"
            alt=""
          />
          <p className="text-right text-[18px] text-gray20">
            Domain <br /> Overview
          </p>
        </Link>
        {preferredView === 'Player' && (
          <Link to="/subjects-evaluation" className="card">
            <img
              className="icon"
              src="/assets/images/Dashboard/subject-evaluation-icon.svg"
              alt=""
            />
            <p className="text-right text-[18px] text-gray20">
              Subjects <br /> Evaluation
            </p>
          </Link>
        )}
        {preferredView === 'Trainer' && (
          <Link to="/subjects-evaluation" className="card">
            <img
              className="icon"
              src="/assets/images/Dashboard/account-icon.svg"
              alt=""
            />
            <p className="text-right text-[18px] text-gray20">
              Players <br /> Evaluation
            </p>
          </Link>
        )}
        {preferredView === 'Manager' && (
          <Link to="/subjects-evaluation" className="card">
            <img
              className="icon"
              src="/assets/images/Dashboard/trainer-icon.svg"
              alt=""
            />
            <p className="text-right text-[18px] text-gray20">
              Trainers <br /> Evaluation
            </p>
          </Link>
        )}

        {preferredView === 'Manager' && (
          <Link to="/subjects-evaluation" className="card">
            <img
              className="icon"
              src="/assets/images/Dashboard/manager-icon.svg"
              alt=""
            />
            <p className="text-right text-[18px] text-gray20">
              Managers <br /> Evaluation
            </p>
          </Link>
        )}

        <Link to={RoutePath.PERFORMANCE_OVERVIEW} className="card">
          <img
            className="icon"
            src="/assets/images/Dashboard/performance-overview.svg"
            alt=""
          />
          <p className="text-right text-[18px] text-gray20">
            Performance Overview
          </p>
        </Link>
        <div className="card">
          <img
            className="icon"
            src="/assets/images/Dashboard/setting-icon.svg"
            alt=""
          />
          <p className="text-right text-[18px] text-gray20 mt-auto">
            {' '}
            <br /> Settings
          </p>
        </div>
        <button className={'btn'} onClick={() => dispatch(resetStore())}>
          Logout
        </button>
      </div>
      <Modal
        title={'Role Selection'}
        isOpen={isRoleSelectModalOpen}
        noButtonPadding={true}
        closeModalHandler={() => setIsRoleSelectModalOpen(false)}
        className="select-button-with-modal__modal"
      >
        <RoleSelectModal />
      </Modal>
    </div>
  );
};

export default Dashboard;
