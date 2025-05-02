import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoAsset } from '../../types/crypto';
import { fetchCryptoData } from '../../services/cryptoAPI';

interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  assets: [],
  loading: false,
  error: null
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateAssets(state, action: PayloadAction<CryptoAsset[]>) {
      state.assets = action.payload;
    }
  }
});

export const { setLoading, setError, updateAssets } = cryptoSlice.actions;

// Thunk for fetching crypto data
export const fetchCryptoAssets = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const data = await fetchCryptoData();
    dispatch(updateAssets(data));
  } catch (error) {
    dispatch(setError('Failed to fetch cryptocurrency data'));
    console.error('Error fetching crypto data:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export default cryptoSlice.reducer;
