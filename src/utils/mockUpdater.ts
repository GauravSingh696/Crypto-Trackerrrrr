import { store } from "../app/store";
import { fetchCryptoAssets } from "../features/crypto/cryptoSlice";

export const startMockWebSocket = () => {
  // Initial fetch
  store.dispatch(fetchCryptoAssets());

  // Update every 30 seconds
  setInterval(() => {
    store.dispatch(fetchCryptoAssets());
  }, 30000);
};
