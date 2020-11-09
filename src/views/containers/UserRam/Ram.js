import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { getProvince } from 'src/views/actions';
import { useInjectReducer } from 'src/utils/injectReducer';
import { useInjectSaga } from 'src/utils/injectSaga';
import { Helmet } from "react-helmet";
import reducer from 'src/views/reducer';
import saga from 'src/views/saga';
import PageTitle from "src/components/common/PageTitle";
import RamCrudList from "src/views/containers/UserRam/Ram-crud-list";
import {
    Container,
    Row,
} from "shards-react";
// const key = 'location';
const key = 'estate';

export function Ram({
    getProvinceData,
    provinces,
    location,
}) {
    const { title } = location;

    useInjectReducer({ key, reducer });
    useInjectSaga({ key, saga });
    useEffect(() => {
        if(provinces.length <= 0)
            getProvinceData();
    }, []);

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
                    title="Ram - Oil Palm "
                    // subtitle="Overview"
                    className="text-sm-left"
                />
            </Row>            
            <RamCrudList provinces={provinces}></RamCrudList>
        </Container>
    );
}

Ram.propTypes = {
    getProvinceData: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
    getProvinceSuccess: estateSelector('getProvinceSuccess'),
    getProvinceFailed: estateSelector('getProvinceFailed'),
    provinces: estateSelector('provinces'),
    provincesError: estateSelector('provincesError'),
})

export function mapDispatchToProps(dispatch) {
    return {
        getProvinceData: () => dispatch(getProvince()),
    };
}
const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(Ram);



// export default Ram;