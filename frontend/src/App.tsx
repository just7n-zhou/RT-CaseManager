import { AgreementProvider } from "./context/AgreementContext";
import { AgreementPicker } from "./components/AgreementPicker";
import { AgreementEditor } from "./components/AgreementEditor";

export default function App() {
  return (
    <AgreementProvider>
      <div style={{ padding: 16, fontFamily: "system-ui", }}>
        <h2>State Causes Input Lag Challenge</h2>
        <AgreementPicker />
        <AgreementEditor />
      </div>
    </AgreementProvider>
  );
}
