import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import ModalConfirmation from 'src/components/common/ModalConfirmation';
import LoadingOverlay from 'src/components/common/LoadingOverlay';
import Pagination from 'src/components/common/Pagination';
import moment from 'moment';
import {
  saveDataPriceRAM
} from 'src/views/actions';
import {
  ListGroup,
  FormInput,
  FormSelect,
  ListGroupItem,
  Button,
  Col,
  Row,
  Card,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  DatePicker
} from "shards-react";

const initialForm = {
  ramName: '',
  idRAM: '',
  idPrice: '',
  startDate: null,
  finishDate: null,
  priceKg: 0,
  reduction: 0,
}

class PurchasePriceCrudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
      modalDelete: false,
      currentPage: 1,
    };
    this.onChangeForm = this.onChangeForm.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataNews } = nextProps;
    console.log('RECEIVE dataPriceRAM', dataPriceRAM);
  }

  onAdd() {
    const { form } = this.state;
    let { dataPriceRAM } = this.props;
    form.idPrice = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (form.startDate != null) {
      form.startDate = moment(form.startDate).format('DD MMMM YYYY');
    }
    if (form.finishDate != null) {
      form.finishDate = moment(form.finishDate).format('DD MMMM YYYY');
    }
    dataPriceRAM.push(form);
    this.props.saveDataPriceRAM(dataPriceRAM);
    this.setState({ form: JSON.parse(JSON.stringify(initialForm)) });
  }

  onUpdate() {
    let { form, selectedIdx } = this.state;
    let { dataPriceRAM } = this.props;
    if (selectedIdx != '') {
      let find = dataPriceRAM.findIndex(x=>x.idPrice == selectedIdx);
      if(find != -1){
        dataPriceRAM[find] = JSON.parse(JSON.stringify(form));

        if (dataPriceRAM[find].startDate != null)
          dataPriceRAM[find].startDate = moment(dataPriceRAM[find].startDate).format('DD MMMM YYYY');
  
        if (dataPriceRAM[find].finishDate != null)
          dataPriceRAM[find].finishDate = moment(dataPriceRAM[find].finishDate).format('DD MMMM YYYY');
      }

      
    }
    this.props.saveDataPriceRAM(dataPriceRAM);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
    });
  }

  onChangeForm(e) {
    let { form } = this.state;
    let { name, value } = e.target;
    const { dataRAM } = this.props;
    if (name == 'idRAM') {
      form[name] = value;
      let data = dataRAM.filter(x => x.idRAM == value);
      if (data.length > 0) {
        form.ramName = data[0].ramName
      }

    } else {
      form[name] = value;
    }
    this.setState({ form });
  }

  handleStartDate(value) {
    let { form } = this.state;
    form.startDate = new Date(value);
    this.setState({
      form,
    });
  }
  handleEndDate(value) {
    let { form } = this.state;
    form.finishDate = new Date(value);
    this.setState({
      form,
    });
  }
  onPick(idPrice) {
    let { dataPriceRAM } = this.props;
    let { selectedIdx, form } = this.state;
    if (selectedIdx == idPrice) {
      selectedIdx = '';
      form = JSON.parse(JSON.stringify(initialForm));
    } else {
      selectedIdx = idPrice;
      let data = dataPriceRAM.filter(x => x.idPrice == idPrice);
      if (data.length > 0) {
        form = JSON.parse(JSON.stringify(data[0]));
        form.startDate = form.startDate != null ? new Date(form.startDate) : null;
        form.finishDate = form.finishDate != null ? new Date(form.finishDate) : null;
      }      
    }

    this.setState({ selectedIdx, form })
  }

  onDelete() {
    let { dataPriceRAM } = this.props;
    let { selectedIdx } = this.state;
    dataPriceRAM.map((item, index) => {
      if (item.idPrice == selectedIdx)
        dataPriceRAM.splice(index, 1);
    });
    this.props.saveDataPriceRAM(dataPriceRAM);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
      modalDelete: false
    });

  }

  render() {
    const { form, selectedIdx, modalDelete, currentPage } = this.state;
    const { dataRAM, dataPriceRAM } = this.props;
    
    const idxCurrentPage = (currentPage - 1)
    const devide = 6;
    let pages = Math.ceil(dataPriceRAM.length / devide);
    let dataPaging = [];
    if (pages > 0) {
      for (var a = 0; a < dataPriceRAM.length; a++) {
        if (a >= (idxCurrentPage * devide) && a < ((idxCurrentPage * devide) + devide)) {
          dataPaging.push(dataPriceRAM[a]);
        }
      }
    }
    return (
      <LoadingOverlay useTimer={true}>
        <Row>
          <Col lg="8" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">RAM Purchase Price List</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <table className="table mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th scope="col" className="border-0">
                              RAM Name
                          </th>
                            <th scope="col" className="border-0">
                              Price/kg
                          </th>
                            <th scope="col" className="border-0">
                              Reduction
                          </th>
                            <th scope="col" className="border-0">
                              Start Date
                          </th>
                            <th scope="col" className="border-0">
                              End Date
                          </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            dataPaging.length > 0 ? (
                              dataPaging.map((item, index) => (
                                <tr
                                  key={index}
                                  onClick={() => this.onPick(item.idPrice)}
                                  className={selectedIdx == item.idPrice ? "pickRow" : ""}
                                >
                                  <td>{`${item.ramName}`}</td>
                                  <td>{item.priceKg}</td>
                                  <td>{item.reduction}</td>
                                  <td>{item.startDate}</td>
                                  <td>{item.finishDate}</td>
                                </tr>
                              ))
                            ) : (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center' }}>No Data</td>
                                </tr>
                              )
                          }
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
            {dataPriceRAM.length > 0 && <Pagination
              totalItemsCount={dataPriceRAM.length}
              onChange={(page) => this.setState({ currentPage: page })}
              activePage={currentPage}
              itemsCountPerPage={devide}
            ></Pagination>}
          </Col>
          <Col lg="4" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Add New Purchase Price</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">RAM</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormSelect
                            name="idRAM"
                            value={form.idRAM}
                            onChange={this.onChangeForm}
                          >
                            <option value=""></option>
                            {dataRAM.length > 0 && dataRAM.map((item, index) => (
                              <option value={item.idRAM} key={index}>{item.ramName}</option>
                            ))}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">Purchase Price</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <InputGroup className="mb-2">
                            <InputGroupAddon type="append">
                              <InputGroupText>Rp</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              name="priceKg"
                              value={form.priceKg}
                              onChange={this.onChangeForm}
                            />
                            <InputGroupAddon type="append">
                              <InputGroupText>/kg</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>

                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">Reduction</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <InputGroup className="mb-2">
                            <FormInput
                              name="reduction"
                              value={form.reduction}
                              onChange={this.onChangeForm}
                            />
                            <InputGroupAddon type="append">
                              <InputGroupText>%</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>

                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">From</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <DatePicker
                            name="startDate"
                            onChange={this.handleStartDate}
                            selected={form.startDate}
                            placeholderText="Start Date"
                            dropdownMode="select"
                            className="text-center"
                            maxDate={form.finishDate}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">To</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <DatePicker
                            name="finishDate"
                            onChange={this.handleEndDate}
                            selected={form.finishDate}
                            placeholderText="End Date"
                            dropdownMode="select"
                            className="text-center"
                            minDate={form.startDate}
                          />
                        </Col>
                      </Row>
                      {selectedIdx == '' &&
                        <Button
                          theme="danger"
                          className="inLineBtn"
                          onClick={() => this.setState({ form: JSON.parse(JSON.stringify(initialForm)) })}
                        >Reset
                      </Button>
                      }
                      {selectedIdx == '' &&
                        <Button onClick={() => this.onAdd()} className="inLineBtn">Add New</Button>
                      }
                      {selectedIdx != '' &&
                        <Button onClick={() => this.setState({ modalDelete: true })} className="inLineBtn" theme="danger">Delete</Button>
                      }
                      {selectedIdx != '' &&
                        <Button onClick={() => this.onUpdate()}>Update</Button>
                      }

                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
          <ModalConfirmation
            open={modalDelete}
            message={'Are you sure to delete this data?'}
            onConfirm={() => this.onDelete()}
            onClose={() => this.setState({ modalDelete: false })}
          ></ModalConfirmation>
        </Row>
      </LoadingOverlay>


    );
  }
}


PurchasePriceCrudList.propTypes = {
  saveDataPriceRAM: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  dataRAM: estateSelector('dataRAM'),
  dataPriceRAM: estateSelector('dataPriceRAM'),

})

export function mapDispatchToProps(dispatch) {
  return {
    saveDataPriceRAM: (form) => dispatch(saveDataPriceRAM(form)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(PurchasePriceCrudList);
// export default PurchasePriceCrudList;



