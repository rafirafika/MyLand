import React, { Compoenent, memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import HarvestCrud from 'src/views/containers/UserFarm/Harvest-crud';
import LoadingOverlay from 'src/components/common/LoadingOverlay';
import Pagination from 'src/components/common/Pagination';
import {
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Tooltip,
    Button,
} from "shards-react";

class HarvestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTooltip: false,
            showForm: false,
            selectedIdx: '',
            selectedData: {},
            currentPage: 1,
        }
        this.toggle = this.toggle.bind(this);

    }

    toggle() {
        this.setState({
            openTooltip: !this.state.openTooltip
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const {dataFarmHarvest} = nextProps;
        console.log('RECEIVE dataFarmHarvest',dataFarmHarvest);
    }

    getCostTotal(hc, mc, tc, ec) {
        return Number(hc) + Number(mc) + Number(tc) + Number(ec);
    }

    showDetail(idHarvest) {
        let { selectedData } = this.state;
        const { dataFarmHarvest } = this.props;
        let data = dataFarmHarvest.filter(x => x.idHarvest == idHarvest);
        if (data.length > 0) {
            selectedData = JSON.parse(JSON.stringify(data[0]));
        }
        this.setState({
            selectedData,
            selectedIdx: idHarvest,
            showForm: true,
        })

    }

    showList() {
        this.setState({
            selectedData: {},
            selectedIdx: '',
            showForm: false,
        })
    }
    render() {
        let { openTooltip, showForm, selectedIdx, selectedData, currentPage } = this.state;
        const { dataFarmHarvest } = this.props;
        const devide = 5;
        const idxCurrentPage = (currentPage - 1)
        let pages = Math.ceil(dataFarmHarvest.length / devide);
        let dataPaging = [];
        if (pages > 0) {
            for (var a = 0; a < dataFarmHarvest.length; a++) {
                if (a >= (idxCurrentPage * devide) && a < ((idxCurrentPage * devide) + devide)) {
                    dataPaging.push(dataFarmHarvest[a]);
                }
            }
        }
        if (!showForm) {
            return (
                <LoadingOverlay useTimer={true}>
                    <Row>
                        <Col>
                            <Card small className="mb-4">
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Harvest Data
                                    &nbsp;
                                    <Button id="TooltipExample" onClick={() => this.setState({ showForm: !showForm, openTooltip: false })}>
                                            <i className="material-icons">add_task</i>
                                        </Button>
                                        <Tooltip
                                            open={openTooltip}
                                            target="#TooltipExample"
                                            toggle={this.toggle}
                                        >
                                            Add New Harvest
                                    </Tooltip>
                                    </h6>
                                </CardHeader>
                                <CardBody className="p-0 pb-3">
                                    <table className="table mb-0">
                                        <thead className="bg-light" >
                                            <tr>
                                                <th scope="col" className="border-0">
                                                    Name Loc
                                            </th>
                                                <th scope="col" className="border-0">
                                                    Date
                                            </th>
                                                <th scope="col" className="border-0">
                                                    Net weight
                                            </th>
                                                <th scope="col" className="border-0">
                                                    Price/kg
                                            </th>
                                                <th scope="col" className="border-0">
                                                    Other Costs
                                            </th>
                                                <th scope="col" className="border-0">
                                                    Final Sum
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dataPaging.length > 0 ? (
                                                    dataPaging.map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            onClick={() => { this.showDetail(item.idHarvest) }}
                                                            className={selectedIdx == item.idHarvest ? "pickRow" : ""}
                                                        >
                                                            <td>{item.nameLoc}</td>
                                                            <td>{item.dateHarvest}</td>
                                                            <td>{item.netWeight}</td>
                                                            <td>{item.priceKg}</td>
                                                            <td>
                                                                {this.getCostTotal(
                                                                    item.harvestCostFinal,
                                                                    item.moveCostFinal,
                                                                    item.etcCost,
                                                                    item.transportCost,
                                                                )}
                                                            </td>
                                                            <td>{item.revenueFinal}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                        <tr>
                                                            <td colSpan={6} style={{ textAlign: 'center' }}>No Data</td>
                                                        </tr>
                                                    )
                                            }

                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                            {dataFarmHarvest.length > 0 && <Row>
                                <Col className="mb-4">
                                    <Pagination
                                        totalItemsCount={dataFarmHarvest.length}
                                        onChange={(page) => this.setState({ currentPage: page })}
                                        activePage={currentPage}
                                        itemsCountPerPage={devide}
                                    ></Pagination>
                                </Col>

                            </Row>}
                        </Col>
                    </Row>

                </LoadingOverlay>

            )
        } else {
            return (
                <HarvestCrud showList={() => this.showList()} selectedData={selectedData}></HarvestCrud>
            )
        }

    }
}





HarvestList.propTypes = {

}
const mapStateToProps = createStructuredSelector({
    dataFarmHarvest: estateSelector('dataFarmHarvest'),
})
export function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(HarvestList);