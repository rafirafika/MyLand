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
import HarvestList from "src/views/containers/UserFarm/Harvest-list";
import {
    Container,
    Row,
} from "shards-react";
// const key = 'harvest';
const key = 'estate';

export function Harvest({location}) {
    const { title } = location;

    useInjectReducer({ key, reducer });
    useInjectSaga({ key, saga });
    useEffect(() => {
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
                    title="Harvest Data"
                    // subtitle="Overview"
                    className="text-sm-left"
                />
            </Row>            
            <HarvestList></HarvestList>
        </Container>
    );
}

Harvest.propTypes = {
}

const mapStateToProps = createStructuredSelector({   
})

export function mapDispatchToProps(dispatch) {
    return {
        // getProvinceData: () => dispatch(getProvince()),
    };
}
const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(Harvest);



// export default Harvest;