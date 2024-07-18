import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import userSlice from './slices/userSlice';
import idSlice from './slices/idSlice';

import reduxStorage from './storage';

const rootReducer = combineReducers({
  user: userSlice,
  id : idSlice
});

const persistConfig = {
  key: 'kyc',
  version: 1,
  storage: reduxStorage,
  // blacklist: ['tenant'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
export default store;
