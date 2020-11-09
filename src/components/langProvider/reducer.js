import produce from 'immer';
import { CHANGE_LOCALE } from './constans';
import { DEFAULT_LOCALE } from 'src/utils/i18n'

export const initialState = {
    locale : DEFAULT_LOCALE,
};

const langProviderReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case CHANGE_LOCALE : 
                draft.locale = action.locale;
                break;
        }
    });

export default langProviderReducer;