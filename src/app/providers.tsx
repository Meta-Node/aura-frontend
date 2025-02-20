import UpdatePrompt from "@/components/Shared/UpdatePrompt";
import { Toaster } from "@/components/ui/toaster";
import { BrowserHistoryContextProvider } from "@/contexts/BrowserHistoryContext";
import { MyEvaluationsContextProvider } from "@/contexts/MyEvaluationsContext";
import { RefreshEvaluationsContextProvider } from "@/contexts/RefreshEvaluationsContext";
import { SubjectsListContextProvider } from "@/contexts/SubjectsListContext";
import { persistor, store } from "@/store";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import NodeApiGateContextProvider from 'BrightID/components/NodeApiGate';


export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RefreshEvaluationsContextProvider>
          <MyEvaluationsContextProvider>
            <SubjectsListContextProvider>
              <NodeApiGateContextProvider>
                <BrowserHistoryContextProvider>
                  <Toaster />
                  <UpdatePrompt />
                  {children}
                </BrowserHistoryContextProvider>
              </NodeApiGateContextProvider>
            </SubjectsListContextProvider>
          </MyEvaluationsContextProvider>
        </RefreshEvaluationsContextProvider>
      </PersistGate>
    </Provider>
  )
}