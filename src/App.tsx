import { useEffect } from "react";
import CryptoTable from "./features/crypto/CryptoTable";
import { startMockWebSocket } from "./utils/mockUpdater";

function App() {
  useEffect(() => {
    startMockWebSocket();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-center text-3xl font-bold p-6">Crypto Price Tracker</h1>
      <CryptoTable />
    </div>
  );
}

export default App;
