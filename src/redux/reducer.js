import { combineReducers } from '@reduxjs/toolkit';
import { filtersReducer } from './filterSlice';
import { contactsReducer } from './contactSlice';
import { contactsApi } from './contactsApi';

const rootReducer = combineReducers({
  contacts: contactsReducer,
  filter: filtersReducer,
  [contactsApi.reducerPath]: contactsApi.reducer,
});

export default rootReducer;
