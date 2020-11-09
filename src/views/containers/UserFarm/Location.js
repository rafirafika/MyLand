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
import LocationCrudList from "src/views/containers/UserFarm/Location-crud-list";
import {
    Container,
    Row,
} from "shards-react";
// const key = 'location';
const key = 'estate';

export function Location({
    getProvinceData,
    provinces,
    location,
}) {
    const { title } = location;
    
    useInjectReducer({ key, reducer });
    useInjectSaga({ key, saga });
    useEffect(() => {
        if (provinces.length <= 0) { getProvinceData(); }
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
                    title="Oil Palm Plantation Location"
                    // subtitle="Overview"
                    className="text-sm-left"
                />
            </Row>
            <LocationCrudList provinces={provinces} ></LocationCrudList>
        </Container>

    );
}

Location.propTypes = {
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
)(Location);



// export default Location;