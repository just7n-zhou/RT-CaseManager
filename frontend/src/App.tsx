import { Provider } from "react-redux";
import { store } from "./store/store";
import { AgreementPicker } from "./components/AgreementPicker";
import { AgreementEditor } from "./components/AgreementEditor";

export default function App() {
  return (
    <Provider store={store}>
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h2>Challenge 2 – Solution Branch (Redux Toolkit + Normalized State)</h2>
        <AgreementPicker />
        <AgreementEditor />
      </div>
    </Provider>
  );
}
