import { creatorSelector } from 'reselect';
import { initialState } from '.reducer';

const selectLang = state => state.language || initialState;
const makeSelectLocale = () => 
    createSelector(
        selectLang,
        languageState => languangeState.locale,
    );

export { selectLang, makeSelectLocale };