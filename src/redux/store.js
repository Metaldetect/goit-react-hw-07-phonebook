import { configureStore } from '@reduxjs/toolkit';
import { contactsApi } from './conactsApi';
import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(contactsApi.middleware),
});
