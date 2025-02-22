import { selectPreferredTheme } from "@/BrightID/actions";
import EvaluationOpNotifications from "@/components/EvaluationOpNotifications";
import { Outlet } from "react-router-dom";
import { useSelector } from "store/hooks";



export default function AppLanding() {
  const prefferedTheme = useSelector(selectPreferredTheme)
  return (
    <div className={`bg-background app_container_dark_bg ${prefferedTheme === 'dark' ? 'app_container_dark_bg' : 'bg-background-light'}`}>

      <div className="app">
        <Outlet />

        <div className="sticky bottom-2 pr-5 pl-5">
          <EvaluationOpNotifications />
        </div>
      </div>
    </div>
  )
}