import EvaluationOpNotifications from "@/components/EvaluationOpNotifications";
import { Outlet } from "react-router-dom";



export default function AppLanding() {
  return (
    <div className={`dark:bg-background bg-background-light`}>

      <div className="app">
        <Outlet />

        <div className="sticky bottom-2 pr-5 pl-5">
          <EvaluationOpNotifications />
        </div>
      </div>
    </div>
  )
}