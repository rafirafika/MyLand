import React, { Compoenent, memo, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import { saveDataPurchaseTrans } from 'src/views/actions';
import ModalConfirmation from 'src/components/common/ModalConfirmation';
import LoadingOverlay from 'src/components/common/LoadingOverlay';
import Pagination from 'src/components/common/Pagination';
import moment from 'moment';
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  Button,
  ListGroupItem,
  FormInput,
  FormSelect,
  Collapse,
  DatePicker,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardFooter,
  FormTextarea
} from "shards-react";

const initialForm = {
  idPurchaseTrans: '',
  sellerName: '',
  datePurchase: null,
  bruto: 0,
  tara: 0,
  netto: 0,
  finalWeight: 0,
  totalPurchase: 0,
  finalTotalPurchase: 0,
  ramName: '',
  idRAM: '',
  idPrice: '',
  priceKg: 0,
  reduction: 0,
  redInWeight: 0,
  otherCostName: '',
  otherCost: 0,
}
class PurchaseTransCrudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainForm: false,
      listData: true,
      modalDelete: false,
      listPrice: [],
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
      currentPage: 1,
    }
    this.onChangeForm = this.onChangeForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataPurchaseTrans } = nextProps;
    console.log('RECEIVE dataPurchaseTrans', dataPurchaseTrans);
  }

  UNSAFE_componentWillMount() {

  }
  toggleMainForm() {
    this.setState({ mainForm: !this.state.mainForm });
  }

  toggleList() {
    this.setState({ listData: !this.state.listData });
  }

  handleDateChange(value) {
    let { form } = this.state;
    const { dataPriceRAM } = this.props;
    let tmpListPrice = [];
    form.datePurchase = new Date(value);
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

      form.redInWeight = this.getRedInWeight(form.reduction, form.netto);
      form.finalWeight = this.getFinalWeight(form.netto, form.redInWeight);
      form.totalPurchase = this.getTotalPurchase(form.finalWeight, form.priceKg);
      form.finalTotalPurchase = this.getFinalTotalPurchase(form.totalPurchase, form.otherCost);
    }
    this.setState({
      form,
      listPrice: tmpListPrice,
    });
  }

  onChangeForm(e) {
    let { name, value } = e.target;
    let { form } = this.state;
    const { dataPriceRAM } = this.props;

    if (name == 'idPrice') {
      form[name] = value;
      let idL = dataPriceRAM.filter(x => x.idPrice == value);
      if (idL.length > 0) {
        form.idRAM = idL[0].idRAM;
        form.ramName = idL[0].ramName;
        form.reduction = idL[0].reduction;
        form.priceKg = idL[0].priceKg;
        form.redInWeight = this.getRedInWeight(form.reduction, form.netto);
        form.finalWeight = this.getFinalWeight(form.netto, form.redInWeight);
        form.totalPurchase = this.getTotalPurchase(form.finalWeight, form.priceKg);
        form.finalTotalPurchase = this.getFinalTotalPurchase(form.totalPurchase, form.otherCost);
      }

    } else if (name == 'bruto' || name == 'tara') {
      form[name] = value;
      form.netto = this.getNetto(form.bruto, form.tara);
      form.redInWeight = this.getRedInWeight(form.reduction, form.netto);
      form.finalWeight = this.getFinalWeight(form.netto, form.redInWeight);
      form.totalPurchase = this.getTotalPurchase(form.finalWeight, form.priceKg);
      form.finalTotalPurchase = this.getFinalTotalPurchase(form.totalPurchase, form.otherCost);

    } else if (name == 'otherCost') {
      form[name] = value;
      form.finalTotalPurchase = this.getFinalTotalPurchase(form.totalPurchase, form.otherCost);

    } else {
      form[name] = value;
    }
    this.setState({
      form,
    });
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
    let { dataPurchaseTrans } = this.props;
    let { form } = this.state;

    if (form.datePurchase != null)
      form.datePurchase = moment(form.datePurchase).format('DD MMMM YYYY');
    else {
      form.datePurchase = null;
    }
    if (form.idPurchaseTrans == '') {
      form.idPurchaseTrans = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      dataPurchaseTrans.push(form);

    } else {
      dataPurchaseTrans.map((item, index) => {
        if (item.idPurchaseTrans == form.idPurchaseTrans) {
          dataPurchaseTrans[index] = form;
        }
      })
    }
    this.props.saveDataPurchaseTrans(dataPurchaseTrans);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
    })
  }
  onDelete() {
    let { dataPurchaseTrans } = this.props;
    let { form } = this.state;
    dataPurchaseTrans.map((item, index) => {
      if (item.idPurchaseTrans == form.idPurchaseTrans) {
        dataPurchaseTrans.splice(index, 1);
      }
    });
    this.props.saveDataPurchaseTrans(dataPurchaseTrans);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      modalDelete: false,
      selectedIdx: '',
    })
  }

  onPick(idPurchaseTrans) {
    let { dataPurchaseTrans } = this.props;
    let { selectedIdx, form } = this.state;
    if (selectedIdx == idPurchaseTrans) {
      selectedIdx = '';
      form = JSON.parse(JSON.stringify(initialForm));
    } else {
      selectedIdx = idPurchaseTrans;
      let data = dataPurchaseTrans.filter(x => x.idPurchaseTrans == idPurchaseTrans);
      if (data.length > 0) {
        form = JSON.parse(JSON.stringify(data[0]));
        form.datePurchase = form.datePurchase == null ? null : new Date(form.datePurchase);
      }
    }

    this.setState({ selectedIdx, form })
  }

  getNetto(b, t) {
    return Number(b) - Number(t);
  }

  getRedInWeight(r, n) {
    return (Number(r) / 100) * Number(n);

  }
  getFinalWeight(n, rw) {
    return Number(n) - rw;
  }

  getTotalPurchase(fw, p) {
    return Number(fw) * Number(p);
  }

  getFinalTotalPurchase(tp, c) {
    return Number(tp) - Number(c);
  }
  render() {
    const {
      mainForm,
      listData,
      form,
      modalDelete,
      listPrice,
      selectedIdx,
      currentPage
    } = this.state;
    const { dataPurchaseTrans } = this.props;

    const idxCurrentPage = (currentPage - 1)
    const devide = 6;
    let pages = Math.ceil(dataPurchaseTrans.length / devide);
    let dataPaging = [];
    if (pages > 0) {
      for (var a = 0; a < dataPurchaseTrans.length; a++) {
        if (a >= (idxCurrentPage * devide) && a < ((idxCurrentPage * devide) + devide)) {
          dataPaging.push(dataPurchaseTrans[a]);
        }
      }
    }
    return (
      <LoadingOverlay useTimer={true}>
        <Row>
          <Col lg="12" className="mb-4">
            <Card small className="">
              <CardHeader className="border-bottom" onClick={() => this.toggleMainForm()}>
                <h6 className="m-0">
                  Data Transaction
                  &nbsp;
                                {mainForm
                    ? (<i className="material-icons iconExpand">expand_less</i>)
                    : (<i className="material-icons iconExpand">expand_more</i>)
                  }
                </h6>

              </CardHeader>
              <Collapse open={mainForm}>
                <CardBody className="p-3">
                  <Row>
                    <Col lg="8" className="form-group">
                      <Row >
                        <Col md="4">
                          <label>Name</label>
                          <FormInput
                            name="sellerName"
                            value={form.sellerName}
                            onChange={this.onChangeForm}
                          />
                        </Col>
                        <Col md="4" className="form-group">
                          <label>Date</label>
                          <InputGroup>
                            <DatePicker
                              name="datePurchase"
                              onChange={this.handleDateChange}
                              selected={form.datePurchase}
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
                      </Row>
                      <Row>
                        <Col md="4" >
                          <label>Bruto</label>
                          <InputGroup className="mb-2">
                            <FormInput
                              name="bruto"
                              value={form.bruto}
                              onChange={this.onChangeForm}
                            />
                            <InputGroupAddon type="append">
                              <InputGroupText>Kg</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </Col>
                        <Col md="4">
                          <label>Tara</label>
                          <InputGroup className="mb-2">
                            <FormInput
                              name="tara"
                              value={form.tara}
                              onChange={this.onChangeForm}
                            />
                            <InputGroupAddon type="append">
                              <InputGroupText>Kg</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4" className="form-group">
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
                      <Row>
                        <Col md="4" >
                          <label>Other Cost</label>
                          <FormTextarea
                            name="otherCostName"
                            value={form.otherCostName}
                            onChange={this.onChangeForm}
                          />
                        </Col>
                        <Col md="4">
                          <label>Cost</label>
                          <InputGroup className="mb-2">
                            <InputGroupAddon type="append">
                              <InputGroupText>Rp</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              name="otherCost"
                              value={form.otherCost}
                              onChange={this.onChangeForm}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg="4" className="form-group">
                      <table className="table mb-0">
                        <thead className="bg-light" >
                          <tr className="headerTblColor">
                            <th>Name</th>
                            <th className="rightPos">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bodyTblColor">
                          <tr >
                            <td className="noBorder">Netto</td>
                            <td className="noBorder rightPos">{`${form.netto} Kg`}</td>
                          </tr>
                          <tr>
                            <td className="noBorder">Reduction ({`${form.reduction}`}%)</td>
                            <td className="noBorder rightPos">{`(${form.redInWeight} Kg)`}</td>
                          </tr>
                          <tr>
                            <td >Final Weight</td>
                            <td className="rightPos">{`${form.finalWeight} Kg`}</td>
                          </tr>
                          <tr>
                            <td className="noBorder">Price/Kg</td>
                            <td className="noBorder rightPos">{this.convertyCurrency(form.priceKg)}</td>
                          </tr>
                          <tr>
                            <td >Total</td>
                            <td className="rightPos">{this.convertyCurrency(form.totalPurchase)}</td>
                          </tr>
                          <tr>
                            <td className="noBorder">Other Cost</td>
                            <td className="noBorder rightPos">{`(${this.convertyCurrency(form.otherCost)})`}</td>
                          </tr>
                          <tr>
                            <th>Final Total</th>
                            <th className="rightPos">{this.convertyCurrency(form.finalTotalPurchase)}</th>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <Row>
                    <ListGroupItem className="d-flex px-3 border-0">
                      {form.idPurchaseTrans != undefined && form.idPurchaseTrans != '' ? (
                        <Button onClick={() => { this.setState({ modalDelete: true }) }} theme="danger">Delete</Button>
                      ) : (
                          <Button
                            onClick={() => { this.setState({ form: JSON.parse(JSON.stringify(initialForm)) }) }}
                            theme="danger">Reset
                          </Button>
                        )}
                    &nbsp;
                      <Button
                        theme="accent"
                        squared
                        onClick={() => this.onSave()}
                      >
                        <i className="material-icons">save</i> Save
                    </Button>
                    </ListGroupItem>
                  </Row>
                </CardFooter>
              </Collapse>

            </Card>

          </Col>
          <Col lg="12" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom" onClick={() => this.toggleList()}>
                <h6 className="m-0">
                  List Transaction
                  &nbsp;
                {listData
                    ? (<i className="material-icons iconExpand">expand_less</i>)
                    : (<i className="material-icons iconExpand">expand_more</i>)
                  }
                </h6>
              </CardHeader>
              <Collapse open={listData}>
                <CardBody className="p-3 pb-3">
                  <table className="table mb-0">
                    <thead className="bg-light" >
                      <tr className="headerTblColor">
                        <th>Name</th>
                        <th>Date</th>
                        <th>Net Weight</th>
                        <th>Price/kg</th>
                      </tr>
                    </thead>
                    <tbody className="bodyTblColor">
                      {
                        dataPaging.length > 0 ? (
                          dataPaging.map((item, index) => (
                            <tr
                              key={index}
                              onClick={() => this.onPick(item.idPurchaseTrans)}
                              className={selectedIdx == item.idPurchaseTrans ? "pickRow" : ""}
                            >
                              <td>{`${item.sellerName}`}</td>
                              <td>{item.datePurchase}</td>
                              <td>{`${item.finalWeight} Kg`}</td>
                              <td>{this.convertyCurrency(item.priceKg)}</td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                              <td colSpan={4} style={{ textAlign: 'center' }}>No Data</td>
                            </tr>
                          )
                      }
                    </tbody>
                  </table>
                </CardBody>

              </Collapse>
            </Card>
            {dataPurchaseTrans.length > 0 && 
              <Pagination
                totalItemsCount={dataPurchaseTrans.length}
                onChange={(page) => this.setState({ currentPage: page })}
                activePage={currentPage}
                itemsCountPerPage={devide}
              ></Pagination>}
          </Col>          
          <ModalConfirmation
            open={modalDelete}
            message={'Are you sure to delete this data?'}
            onConfirm={() => this.onDelete()}
            onClose={() => this.setState({ modalDelete: false })}
          ></ModalConfirmation>
        </Row>
      </LoadingOverlay>
    )

  }
}

PurchaseTransCrudList.propTypes = {
  saveDataPurchaseTrans: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  dataPriceRAM: estateSelector('dataPriceRAM'),
  dataPurchaseTrans: estateSelector('dataPurchaseTrans'),
})
export function mapDispatchToProps(dispatch) {
  return {
    saveDataPurchaseTrans: (form) => dispatch(saveDataPurchaseTrans(form)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PurchaseTransCrudList);