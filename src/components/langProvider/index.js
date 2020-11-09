import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { makeSelectLocale } from './selector';

export function languageProvider(props) {
    return (
        <IntlProvider
            locale = {props.locale}
            key = {props.locale}
            messages = {prop.messages[props.locale]}
        >
            {React.Children.only(props.children)}
        </IntlProvider>
    )
}

languageProvider.PropTypes = {
    locale : PropTypes.string,
    messages : PropTypes.object,
    children : PropTypes.element.isRequired,
}

const mapStateToProps = createSelector(
    makeSelectLocale(),
    locale => ({
        locale,
    }),
);

export default connect(mapStateToProps)(languageProvider);