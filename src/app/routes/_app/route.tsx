import { selectPreferredTheme } from "@/BrightID/actions";
import { Outlet } from "react-router-dom";
import { useSelector } from "store/hooks";



export default function AppLanding() {
  const prefferedTheme = useSelector(selectPreferredTheme)
  return (
    <div className={`bg-background app_container_dark_bg ${prefferedTheme === 'dark' ? 'dark app_container_dark_bg' : 'app_container'}`}>

      <div className="app">
        <Outlet />
      </div>
    </div>
  )
}