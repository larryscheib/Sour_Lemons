import RootNavigator from "./navigators/RootNavigator";
import { AppProvider } from "./contexts/AppContext";

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}


