import React, { Compoenent, memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { saveDataFarmHarvest } from 'src/views/actions';
import ModalConfirmation from 'src/components/common/ModalConfirmation';
import moment from 'moment';
import {
    Col,
    Row,
    Card,
    CardHeader,
    CardBody,
    Button,
    ListGroup,
    ListGroupItem,
    Form,
    FormInput,
    FormGroup,
    FormCheckbox,
    FormSelect,
    Collapse,
    DatePicker,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "shards-react";

const initialForm = {
    idHarvest: '',
    nameLoc: '',
    idLoc: '',
    landArea: '',
    dateHarvest: null,
    weight: 0,
    netWeight: 0,
    ramName: '',
    idRAM: '',
    idPrice: '',
    priceKg: 0,
    reduction: 0,
    harvestCostKg: 0,
    harvestCostFinal: 0,
    moveCostKg: 0,
    moveCostFinal: 0,
    etcCostName: '-',
    etcCost: 0,
    transportCost: 0,
    revenueBefore: 0,
    revenueFinal: 0,
}
class HarvestCrud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainForm: true,
            otherCost: true,
            modalDelete: false,
            listPrice: [],
            form: JSON.parse(JSON.stringify(initialForm)),
        }
        this.onChangeForm = this.onChangeForm.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {dataFarmHarvest} = nextProps;
        console.log('RECEIVE dataFarmLocation',dataFarmLocation);
        console.log('RECEIVE dataPriceRAM',dataPriceRAM);
        console.log('RECEIVE dataFarmHarvest',dataFarmHarvest);
    }

    UNSAFE_componentWillMount() {
        const { selectedData } = this.props;
        let { form } = this.state;
        if (selectedData.idHarvest != undefined && selectedData.idHarvest != '') {
            form = selectedData;
            form.dateHarvest = form.dateHarvest != null ? new Date(form.dateHarvest) : null;
        }
        this.setState({ form });
    }
    toggleMainForm() {
        this.setState({ mainForm: !this.state.mainForm });
    }

    toggleOtherCostForm() {
        this.setState({ otherCost: !this.state.otherCost });
    }

    handleDateChange(value) {
        let { form } = this.state;
        const { dataPriceRAM } = this.props;
        let tmpListPrice = [];
        form.dateHarvest = new Date(value);
        dataPriceRAM.map(item => {
            if (item.finishDate != null && item.startDate != null) {

                let s = new Date(item.startDate).getTime() / 1000;
                let f = new Date(item.finishDate).getTime() / 1000;
                let h = new Date(value).getTime() / 1000;
                if (s <= h && f >= h) {
                    tmpListPrice.push(JSON.parse(JSON.stringify(item)));
                }
            }
        })
        let find = tmpListPrice.filter(x => x.idPrice == form.idPrice);
        if (find.length <= 0) {
            form.idPrice = '';
            form.idRAM = '';
            form.ramName = '';
            form.reduction = 0;
            form.priceKg = 0;

            form.netWeight = this.getNetWight(form.weight, form.reduction);
            form.revenueBefore = this.getRevenueBefore(form.netWeight, form.priceKg)
            form.harvestCostFinal = this.getHarvestCostFinal(form.netWeight, form.harvestCostKg);
            form.moveCostFinal = this.getHarvestCostFinal(form.netWeight, form.moveCostKg);
            form.revenueFinal = this.getRevenueFinal(
                form.revenueBefore,
                form.harvestCostFinal,
                form.moveCostFinal,
                form.transportCost,
                form.etcCost,
            );
        }
        this.setState({
            form,
            listPrice: tmpListPrice,
        });
    }

    onChangeForm(e) {
        let { name, value } = e.target;
        let { form } = this.state;
        const { dataFarmLocation, dataPriceRAM } = this.props;

        if (name == 'idLoc') {
            form[name] = value;
            let idL = dataFarmLocation.filter(x => x.idLoc == value);
            if (idL.length > 0) {
                form.nameLoc = idL[0].nameloc;
                form.landArea = idL[0].landArea;
            }
        } else if (name == 'idPrice') {
            form[name] = value;
            let idL = dataPriceRAM.filter(x => x.idPrice == value);
            if (idL.length > 0) {
                form.idRAM = idL[0].idRAM;
                form.ramName = idL[0].ramName;
                form.reduction = idL[0].reduction;
                form.priceKg = idL[0].priceKg;
                form.netWeight = this.getNetWight(form.weight, form.reduction);
                form.revenueBefore = this.getRevenueBefore(form.netWeight, form.priceKg)
                form.harvestCostFinal = this.getHarvestCostFinal(form.netWeight, form.harvestCostKg);
                form.moveCostFinal = this.getHarvestCostFinal(form.netWeight, form.moveCostKg);
                form.revenueFinal = this.getRevenueFinal(
                    form.revenueBefore,
                    form.harvestCostFinal,
                    form.moveCostFinal,
                    form.transportCost,
                    form.etcCost,
                );
            }

        } else if (name == 'weight') {
            form[name] = value;
            form.netWeight = this.getNetWight(value, form.reduction);
            form.revenueBefore = this.getRevenueBefore(form.netWeight, form.priceKg)
            form.harvestCostFinal = this.getHarvestCostFinal(form.netWeight, form.harvestCostKg);
            form.moveCostFinal = this.getHarvestCostFinal(form.netWeight, form.moveCostKg);
            form.revenueFinal = this.getRevenueFinal(
                form.revenueBefore,
                form.harvestCostFinal,
                form.moveCostFinal,
                form.transportCost,
                form.etcCost,
            );
        } else if (name == 'harvestCostKg') {
            form[name] = value;
            form.harvestCostFinal = this.getHarvestCostFinal(form.netWeight, value);
            form.revenueFinal = this.getRevenueFinal(
                form.revenueBefore,
                form.harvestCostFinal,
                form.moveCostFinal,
                form.transportCost,
                form.etcCost,
            );
        } else if (name == 'moveCostKg') {
            form[name] = value;
            form.moveCostFinal = this.getHarvestCostFinal(form.netWeight, value);
            form.revenueFinal = this.getRevenueFinal(
                form.revenueBefore,
                form.harvestCostFinal,
                form.moveCostFinal,
                form.transportCost,
                form.etcCost,
            );
        } else if (name == 'transportCost' || name == 'etcCost') {
            form[name] = value;
            form.revenueFinal = this.getRevenueFinal(
                form.revenueBefore,
                form.harvestCostFinal,
                form.moveCostFinal,
                form.transportCost,
                form.etcCost,
            );
        } else {
            form[name] = value;
        }
        this.setState({
            form,
        });
    }

    getNetWight(w, r) {
        return (Number(w) - (Number(r) / 100));
    }
    getRevenueBefore(nw, p) {
        return Number(nw) * Number(p);
    }
    getHarvestCostFinal(nw, hc) {
        return Number(nw) * Number(hc);
    }
    getMoveCostFinal(nw, mc) {
        return Number(nw) * Number(mc);
    }
    getRevenueFinal(rb, hc, mc, tc, ec) {
        return Number(rb) - (Number(hc) + Number(mc) + Number(tc) + Number(ec));
    }

    convertyCurrency(value) {
        var format = new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
        });
        return format.format(value);
    }

    onSave() {
        let { dataFarmHarvest } = this.props;
        let { form } = this.state;
        if (form.dateHarvest != null)
            form.dateHarvest = moment(form.dateHarvest).format('DD MMMM YYYY');
        else {
            form.dateHarvest = null;
        }
        if (form.idHarvest == '') {
            form.idHarvest = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            dataFarmHarvest.push(form);

        } else {
            dataFarmHarvest.map((item, index) => {
                if (item.idHarvest == form.idHarvest) {
                    dataFarmHarvest[index] = form;
                }
            })
        }

        this.props.saveDataFarmHarvest(dataFarmHarvest);
        this.setState({
            form: JSON.parse(JSON.stringify(initialForm)),
        })
        this.props.showList();
    }
    onDelete() {
        let { dataFarmHarvest } = this.props;
        let { form } = this.state;
        dataFarmHarvest.map((item, index) => {
            if (item.idHarvest == form.idHarvest) {
                dataFarmHarvest.splice(index, 1);
            }
        });
        this.props.saveDataFarmHarvest(dataFarmHarvest);
        this.setState({
            form: JSON.parse(JSON.stringify(initialForm)),
            modalDelete: false
        })
        this.props.showList();
    }
    render() {
        const {
            mainForm,
            otherCost,
            form,
            modalDelete,
            listPrice
        } = this.state;
        const { dataFarmLocation } = this.props;
        return (
            <Row>
                <Col lg="7" className="mb-4">
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom" onClick={() => this.toggleMainForm()}>
                            <h6 className="m-0">
                                Main Data
                                &nbsp;
                                {mainForm
                                    ? (<i className="material-icons iconExpand">expand_less</i>)
                                    : (<i className="material-icons iconExpand">expand_more</i>)
                                }
                            </h6>

                        </CardHeader>
                        <Collapse open={mainForm}>
                            <CardBody className="p-0 pb-3">
                                <ListGroup flush>
                                    <ListGroupItem className="p-3">
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col md="5" className="form-group">
                                                        <label>Name Location</label>
                                                        <FormSelect
                                                            name="idLoc"
                                                            value={form.idLoc}
                                                            onChange={this.onChangeForm}
                                                        >
                                                            <option></option>
                                                            {dataFarmLocation.length > 0 && dataFarmLocation.map((item, index) => (
                                                                <option value={item.idLoc} key={index}>{item.nameloc}</option>
                                                            ))}
                                                        </FormSelect>

                                                    </Col>
                                                    <Col md="3">
                                                        <label>Land Area</label>
                                                        <InputGroup className="mb-2">
                                                            <FormInput
                                                                name="landArea"
                                                                value={form.landArea}
                                                                type={"number"}
                                                                onChange={this.onChangeForm}
                                                            />
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>M<sup>2</sup></InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="5" className="form-group">
                                                        <label>Date</label>
                                                        <InputGroup>
                                                            <DatePicker
                                                                name="dateHarvest"
                                                                onChange={this.handleDateChange}
                                                                selected={form.dateHarvest}
                                                                placeholderText="Start Date"
                                                                dropdownMode="select"
                                                                className="text-center"
                                                                maxDate={new Date()}
                                                            />
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>
                                                                    <i className="material-icons">event</i>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>

                                                    </Col>
                                                    <Col md="4">
                                                        <label>Weight</label>
                                                        <InputGroup className="mb-2">
                                                            <FormInput
                                                                name="weight"
                                                                value={form.weight}
                                                                onChange={this.onChangeForm}
                                                            />
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Kg</InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="5" className="form-group">
                                                        <label>RAM</label>
                                                        <FormSelect
                                                            name="idPrice"
                                                            value={form.idPrice}
                                                            onChange={this.onChangeForm}
                                                        >
                                                            <option></option>
                                                            {listPrice.length > 0 && listPrice.map((item, index) => (
                                                                <option value={item.idPrice} key={index}>{item.ramName}</option>
                                                            ))}
                                                        </FormSelect>
                                                    </Col>
                                                    <Col md="4" className="form-group">
                                                        <label>Cost/Kg</label>
                                                        <InputGroup className="mb-2">
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Rp</InputGroupText>
                                                            </InputGroupAddon>
                                                            <FormInput
                                                                name="priceKg"
                                                                value={form.priceKg}
                                                                readOnly
                                                            />

                                                        </InputGroup>
                                                    </Col>
                                                    <Col md="3" className="form-group">
                                                        <label >Reduction(%)</label>
                                                        <FormInput
                                                            name="reduction"
                                                            value={form.reduction}
                                                            readOnly
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Collapse>

                    </Card>

                </Col>
                <Col lg="5" className="mb-4">
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom" onClick={() => this.toggleOtherCostForm()}>
                            <h6 className="m-0">
                                Other costs
                                &nbsp;
                                {otherCost
                                    ? (<i className="material-icons iconExpand">expand_less</i>)
                                    : (<i className="material-icons iconExpand">expand_more</i>)
                                }
                            </h6>
                        </CardHeader>
                        <Collapse open={otherCost}>
                            <CardBody className="p-0 pb-3">
                                <ListGroup flush>
                                    <ListGroupItem className="p-3">
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col md="6" className="form-group">
                                                        <label>Harvest Cost/Kg</label>
                                                        <InputGroup className="mb-2">
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Rp</InputGroupText>
                                                            </InputGroupAddon>
                                                            <FormInput
                                                                name="harvestCostKg"
                                                                value={form.harvestCostKg}
                                                                onChange={this.onChangeForm} />
                                                        </InputGroup>

                                                    </Col>
                                                    <Col md="6">
                                                        <label>Move Cost/Kg</label>
                                                        <InputGroup className="mb-2">
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Rp</InputGroupText>
                                                            </InputGroupAddon>
                                                            <FormInput
                                                                name="moveCostKg"
                                                                value={form.moveCostKg}
                                                                onChange={this.onChangeForm} />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6" className="form-group">
                                                        <label>Etc Cost</label>
                                                        <FormInput
                                                            name="etcCostName"
                                                            value={form.etcCostName}
                                                            onChange={this.onChangeForm}
                                                        />
                                                    </Col>
                                                    <Col md="6" className="form-group">
                                                        <label>Cost</label>
                                                        <InputGroup className="mb-2">
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Rp</InputGroupText>
                                                            </InputGroupAddon>
                                                            <FormInput
                                                                name="etcCost"
                                                                value={form.etcCost}
                                                                onChange={this.onChangeForm}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feInputAddress2">Transport Cost</label>
                                                        <InputGroup className="mb-2" >
                                                            <InputGroupAddon type="append">
                                                                <InputGroupText>Rp</InputGroupText>
                                                            </InputGroupAddon>
                                                            <FormInput
                                                                name="transportCost"
                                                                value={form.transportCost}
                                                                onChange={this.onChangeForm}
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>

                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Collapse>


                    </Card>
                </Col>
                <Col lg="12" className="mb-4">
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">
                                TOTAL CALCULATION
                            </h6>
                        </CardHeader>
                        <CardBody className="p-3 pb-3">
                            <table className="table mb-0">
                                <thead className="bg-light" >
                                    <tr className="headerTblColor">
                                        <th>Name</th>
                                        <th>Detail</th>
                                        <th>Sum</th>
                                    </tr>
                                </thead>
                                <tbody className="bodyTblColor">
                                    <tr >
                                        <td className="noBorder">Revenue</td>
                                        <td className="noBorder">
                                            {form.weight} - {`${form.reduction}%`}
                                            {` = ${form.netWeight}`}
                                        </td>
                                        <td className="noBorder">{`${this.convertyCurrency(form.revenueBefore)}`}</td>
                                    </tr>
                                    <tr>
                                        <td className="noBorder">Harvest Cost</td>
                                        <td className="noBorder">{`${form.netWeight} * ${this.convertyCurrency(form.harvestCostKg)}`}</td>
                                        <td className="noBorder">{`${this.convertyCurrency(form.harvestCostFinal)}`}</td>
                                    </tr>
                                    <tr>
                                        <td className="noBorder">Move Cost</td>
                                        <td className="noBorder">{`${form.netWeight} * ${this.convertyCurrency(form.moveCostKg)}`}</td>
                                        <td className="noBorder">{`${this.convertyCurrency(form.moveCostFinal)}`}</td>
                                    </tr>
                                    <tr>
                                        <td className="noBorder">Transport Cost</td>
                                        <td className="noBorder"></td>
                                        <td className="noBorder">{`${this.convertyCurrency(form.transportCost)}`}</td>
                                    </tr>
                                    <tr>
                                        <td className="noBorder">{form.etcCostName}</td>
                                        <td className="noBorder"></td>
                                        <td className="noBorder">{`${this.convertyCurrency(form.etcCost)}`}</td>
                                    </tr>
                                    <tr>
                                        <th>Final Total</th>
                                        <th></th>
                                        <th>{`${this.convertyCurrency(form.revenueFinal)}`}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="12" className="mb-4">
                    <Button onClick={() => this.props.showList()}>Back to list</Button>&nbsp;
                    {form.idHarvest != undefined && form.idHarvest != '' ? (
                        <Button onClick={() => { this.setState({ modalDelete: true }) }} theme="danger">Delete</Button>
                    ) : (
                            <Button
                                onClick={() => { this.setState({ form: JSON.parse(JSON.stringify(initialForm)) }) }}
                                theme="danger">Reset
                            </Button>
                        )}
                    &nbsp;
                    <Button onClick={() => { this.onSave() }}>Save</Button>&nbsp;
                </Col>
                <ModalConfirmation
                    open={modalDelete}
                    message={'Are you sure to delete this data?'}
                    onConfirm={() => this.onDelete()}
                    onClose={() => this.setState({ modalDelete: false })}
                ></ModalConfirmation>
            </Row>
        )

    }
}

HarvestCrud.propTypes = {
    saveDataFarmHarvest: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
    dataFarmLocation: estateSelector('dataFarmLocation'),
    dataPriceRAM: estateSelector('dataPriceRAM'),
    dataFarmHarvest: estateSelector('dataFarmHarvest'),
})
export function mapDispatchToProps(dispatch) {
    return {
        saveDataFarmHarvest: (form) => dispatch(saveDataFarmHarvest(form)),
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(HarvestCrud);