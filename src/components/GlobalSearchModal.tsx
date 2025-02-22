import { toggleSearchModal } from 'BrightID/actions';
import Modal from 'components/Shared/Modal';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const GlobalSearchBody: FC = () => {
  const [searchString, setSearchString] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSearch = () => {
    if (searchString) {
      navigate(`/home?search=${searchString}&tab=evaluate`);
      dispatch(toggleSearchModal());
    }
  };

  return (
    <div className="w-full">
      <form
        className="flex items-center gap-2 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="bg-card text-card-foreground rounded-[10px] p-1 flex-1 flex flex-col justify-center gap-4 max-h-[175px] border">
          <div className="card__input flex gap-2 items-center rounded-lg px-3.5">
            <img
              className="w-4 h-4"
              src="/assets/images/Shared/search-icon.svg"
              alt=""
            />
            <input
              className="bg-card font-medium dark:placeholder:text-gray-50 placeholder-black2 w-full text-sm h-11 focus:outline-none"
              type="text"
              autoFocus
              placeholder="Subject name or ID ..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-pastel-purple px-4 dark:bg-primary-d1 hover:bg-pastel-purple/80 dark:hover:bg-primary-d1/80 rounded-[10px] h-11 text-sm font-bold text-white"
        >
          Search
        </button>
      </form>
    </div>
  );
};

const GlobalSearchModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal
      isOpen={true}
      closeModalHandler={onClose}
      title="Search From your connections"
    >
      <GlobalSearchBody />
    </Modal>
  );
};

export default GlobalSearchModal;
