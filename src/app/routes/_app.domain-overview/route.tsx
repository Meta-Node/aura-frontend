import { Link } from 'react-router-dom';

const DomainOverview = () => {
  return (
    <div className="page page__dashboard">
      <div className="row mb-4">
        <div className="card">
          <span className="row">
            <span className="flex-1">
              <p className="text-sm">Domain</p>
              <p className="font-bold mb-2.5">BrightID</p>
            </span>
            <span className="flex-1">
              <p className="text-sm">Creator</p>
              <p className="font-bold mb-2.5 flex">
                Sina.eth
                <img
                  className="ml-1"
                  src="/assets/images/DomainOverview/link-icon.svg"
                  alt=""
                />
              </p>
            </span>
            <span className="flex-1">
              <p className="text-sm">Created at</p>
              <p className="font-bold mb-2.5">23 May 03</p>
            </span>
          </span>
          <span className="row">
            <span className="flex-1">
              <p className="text-sm">#Energy teams</p>
              <p className="font-bold mb-2.5">3</p>
            </span>
            <span className="flex-1">
              <p className="text-sm">Current team</p>
              <p className="font-bold mb-2.5">Core</p>
            </span>
            <span className="flex-1">
              <button className="btn">Change</button>
            </span>
          </span>
          <p className="text-sm">About</p>
          <p className="font-bold text-sm">
            BrightID is a digital identity solution that aims to revolutionize
            how identities are verified online
          </p>
        </div>
      </div>

      <div className="row mb-4">
        <Link to="/domain-overview" className="card">
          <div className="row">
            <img
              className="icon"
              src="/assets/images/DomainOverview/subjects-icon.svg"
              alt=""
            />
            <p className="text-gray20 font-bold">1203</p>
          </div>
          <p className="text-right text-[18px] text-gray20">Subjects</p>
        </Link>
        <Link to="/domain-overview" className="card">
          <div className="row">
            <img
              className="icon"
              src="/assets/images/DomainOverview/players-icon.svg"
              alt=""
            />
            <p className="text-gray20 font-bold">247</p>
          </div>
          <p className="text-right text-[18px] text-gray20">Players</p>
        </Link>
      </div>

      <div className="row mb-4">
        <Link to="/domain-overview" className="card">
          <div className="row">
            <img
              className="icon"
              src="/assets/images/DomainOverview/trainers-icon.svg"
              alt=""
            />
            <p className="text-gray20 font-bold">11</p>
          </div>
          <p className="text-right text-[18px] text-gray20">Trainers</p>
        </Link>
        <Link to="/domain-overview" className="card">
          <div className="row">
            <img
              className="icon"
              src="/assets/images/DomainOverview/managers-icon.svg"
              alt=""
            />
            <p className="text-gray20 font-bold">3</p>
          </div>
          <p className="text-right text-[18px] text-gray20">Managers</p>
        </Link>
      </div>
    </div>
  );
};

export default DomainOverview;
