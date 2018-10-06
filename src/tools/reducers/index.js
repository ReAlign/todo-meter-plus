import { combineReducers } from 'redux';

import ItemListReducer from './item-list.js';
import DateReducer from './date.js';

const rootReducer = combineReducers({
  itemList: ItemListReducer,
  date: DateReducer
});

export default rootReducer;