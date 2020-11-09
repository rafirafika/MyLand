const addLocaleData = require('react-intl').addLocaleData;
const enLocalData = require('react-intl/locale-data/en');
const idLocalData = require('react-intl/locale-data/id');
const enTransMess = require('src/assets/json/lang/en.json');
const idTransMess = require('src/assets/json/lang/id.json');

addLocaleData(enLocalData);
addLocaleData(idLocalData);

const DEFAULT_LOCALE = 'en';
const appLocales = [
    'en',
    'id'
];
const formatTransMess = (locale, messages) => {
    const defaultFormatMess = locale !== DEFAULT_LOCALE 
        ? formatTransMess(DEFAULT_LOCALE, enTransMess) 
        : {}
    
    const flattenFormattedMessages  = (formattedMessages, key) => {
        const formattedMess = !messages[key] && locale !== DEFAULT_LOCALE
            ? defaultFormattedMessages[key]
            : messages[key];
        
        return Object.assign(formattedMessages, {[key] : formattedMess});
    };

    return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMess = {
    en : formatTransMess('en', enTransMess),
    id : formatTransMess('id', idTransMess),
};

exports.appLocales = appLocales;
exports.formatTransMess = formatTransMess;
exports.translationMess = translationMess;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
