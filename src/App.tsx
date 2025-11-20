import { useOpenRiskTask } from "./useOpenTask";

function App() {
  const openRisk = useOpenRiskTask(545939);
  
  return (
    <div className="p-6 tw:italic tw:text-9xl">
      <button
        onClick={openRisk}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Open Task Popup
      </button>
    </div>
  );
}

export default App;
