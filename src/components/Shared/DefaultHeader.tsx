import { toggleSearchModal } from '@/BrightID/actions';
import { useDispatch } from '@/store/hooks';
import { selectAuthData } from '@/store/profile/selectors';
import { RoutePath } from '@/types/router';
import { SearchIcon, SettingsIcon } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { FaHome } from 'react-icons/fa';

export const HeaderBody: FC<PropsWithChildren & { title?: string }> = ({
  title,
  children,
}) => {
  const authData = useSelector(selectAuthData);
  const subjectId = authData?.brightId;

  if (!subjectId) return null;

  return (
    <>
      <Link to={RoutePath.HOME} className="mr-2 flex items-center gap-1">
        <FaHome className="h-6 w-6" />
      </Link>
      <span className="text-xl font-semibold">{title ?? 'Home'}</span>
      {children}
    </>
  );
};

export default function DefaultHeader({
  title,
  children,
}: { title?: string } & PropsWithChildren) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-2.5 px-1 pt-9 md:px-6">
      <header className="header flex flex-wrap justify-between pb-4">
        <div className="header-left flex flex-wrap items-center">
          <HeaderBody title={title}>{children}</HeaderBody>
        </div>
        <span className="header-right flex items-center">
          <button
            onClick={() => dispatch(toggleSearchModal())}
            className="header-icon mr-4 dark:text-white"
          >
            <SearchIcon size={20} />
          </button>
          <Link to={RoutePath.SETTINGS}>
            <SettingsIcon className="h-6 w-6" />
          </Link>
        </span>
      </header>
    </div>
  );
}
