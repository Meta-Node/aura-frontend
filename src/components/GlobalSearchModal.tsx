import { toggleSearchModal } from 'BrightID/actions';
import Modal from 'components/Shared/Modal';
import { Search } from 'lucide-react';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

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
        className="flex items-center justify-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="flex max-h-[175px] flex-1 flex-col justify-center gap-4 rounded-[10px] border bg-card p-1 text-card-foreground">
          <div className="card__input flex items-center gap-2 rounded-md px-3.5">
            <Search />
            <input
              className="h-11 w-full bg-card text-sm font-medium placeholder-black2 focus:outline-none dark:placeholder:text-gray-50"
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
          className="h-11 rounded-[10px] bg-pastel-purple px-4 text-sm font-bold text-white hover:bg-pastel-purple/80 dark:bg-primary-d1 dark:hover:bg-primary-d1/80"
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
