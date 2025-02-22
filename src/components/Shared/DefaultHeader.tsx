import { toggleSearchModal } from "@/BrightID/actions";
import { useDispatch } from "@/store/hooks";
import { selectAuthData } from "@/store/profile/selectors";
import { RoutePath } from "@/types/router";
import { FC, PropsWithChildren } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";



export const HeaderBody: FC<PropsWithChildren & { title?: string }> = ({ title, children }) => {
  const authData = useSelector(selectAuthData);
  const subjectId = authData?.brightId;

  if (!subjectId) return null;

  return (
    <>
      <Link to={RoutePath.HOME} className="flex items-center gap-1 mr-2">
        <img src="/assets/images/Header/home.svg" alt="home" width={20} height={20} />
      </Link>
      <span className="text-xl font-semibold">
        {title ?? "Home"}
      </span>
      {children}
    </>
  );
};


export default function DefaultHeader({ title, children }: { title?: string } & PropsWithChildren) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2.5 px-1 md:px-6 pt-9">
      <header className="header pb-4 flex-wrap flex justify-between">
        <div className="header-left flex-wrap items-center flex ">
          <HeaderBody title={title}>
            {children}
          </HeaderBody>
        </div>
        <span className="header-right flex items-center">
          <button
            key="/assets/images/Header/search.svg"
            onClick={() => dispatch(toggleSearchModal())}
            className="header-icon text-gray-300 dark:text-white mr-4"
            data-testid="nav-button"
          >
            <FaSearch size={20} />
          </button>
          <span
            key="/assets/images/Header/settings.svg"
            onClick={() => navigate(RoutePath.SETTINGS)}
            className="header-icon !cursor-pointer"
            data-testid="nav-button"
          >
            <img
              key="/assets/images/Header/settings.svg"
              className="w-6 h-6"
              src="/assets/images/Header/settings.svg"
              alt={''}
            />
          </span>
        </span>
      </header>
    </div>
  )
}
