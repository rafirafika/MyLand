import { createSelector } from 'reselect';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { initialState } from './reducer';

const selectEstateSelector = state => state.estate || initialState;
// const selectEstateSelector = state => state.get('estate', initialState);


const estateSelector = item =>
  createSelector(
    selectEstateSelector,
    locationState => locationState[item]
);

export { selectEstateSelector, estateSelector };
