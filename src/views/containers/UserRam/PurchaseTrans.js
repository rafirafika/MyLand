import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { Helmet } from "react-helmet";
import { useInjectReducer } from 'src/utils/injectReducer';
import { useInjectSaga } from 'src/utils/injectSaga';
import reducer from 'src/views/reducer';
import saga from 'src/views/saga';
import PageTitle from "src/components/common/PageTitle";
import PurchaseTrans from "src/views/containers/UserRam/PurchaseTrans-crud-list";
import {
    Container,
    Row,
} from "shards-react";
// const key = 'PurchaseTrans';
const key = 'estate';

export function News({location}){
    const { title } = location;

    useInjectReducer({key, reducer});
    useInjectSaga({key, saga});
    useEffect(()=>{

    },[]);

    return (
        <Container fluid className="main-content-container px-4">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Purchase"
                    // subtitle="Overview"
                    className="text-sm-left"
                />
            </Row>            
            <PurchaseTrans></PurchaseTrans>
        </Container>
    )

}

News.propTypes = {

}

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps(dispatch) {
    return {

    }
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(News);