import { CHANGE_LOCALE} from '/constans';

export function changeLocale(languangeLocale){
    return {
        type : CHANGE_LOCALE,
        locale : languangeLocale,
    }
}