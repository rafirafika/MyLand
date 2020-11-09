import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import ModalConfirmation from 'src/components/common/ModalConfirmation';
import LoadingOverlay from 'src/components/common/LoadingOverlay';
import Pagination from 'src/components/common/Pagination';
import {
  getCity,
  getDistrict,
  getSubDistrict,
  saveDataRAM,
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
} from "shards-react";
const initialForm = {
  province: '',
  provinceCode: '',
  city: '',
  cityCode: '',
  district: '',
  districtCode: '',
  subDistrict: '',
  subDistrictCode: '',
  ramName: '',
  idRAM: '',
}

class RamCrudList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
      modalDelete: false,
      currentPage: 1,
    };
    this.onChangeForm = this.onChangeForm.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { getCitySuccess } = nextProps;
    console.log('RECEIVE getCitySuccess', getCitySuccess);
  }

  onAdd() {
    const { form } = this.state;
    let { dataRAM } = this.props;
    form.idRAM = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    dataRAM.push(form);
    this.props.saveDataRAM(dataRAM);
    this.setState({ form: JSON.parse(JSON.stringify(initialForm)) });
  }

  onUpdate() {
    let { form, selectedIdx } = this.state;
    let { dataRAM } = this.props;
    if (selectedIdx != '') {
      dataRAM.map((item, index)=>{
        if(selectedIdx == item.idRAM){
          dataRAM[index] = JSON.parse(JSON.stringify(form));
        }
      });
    }
    this.props.saveDataRAM(dataRAM);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
    });
  }

  onChangeForm(e) {
    let { form } = this.state;
    let { name, value } = e.target;
    const {
      provinces,
      cities,
      districts,
      subDistricts
    } = this.props;
    form[name] = value;
    if (name == 'provinceCode') {
      let idP = provinces.filter(x => x.id == value);
      if (idP.length > 0) {
        form.province = idP[0].nama;
      }
      this.props.getCityData(value);

    } else if (name == 'cityCode') {
      let idC = cities.filter(x => x.id == value);
      if (idC.length > 0) {
        form.city = idC[0].nama;
      }
      this.props.getDistrictData(value);

    } else if (name == 'districtCode') {
      let idD = districts.filter(x => x.id == value);
      if (idD.length > 0) {
        form.district = idD[0].nama;
      }
      this.props.getSubDistrictData(value);

    } else if (name == 'subDistrictCode') {
      let idSD = subDistricts.filter(x => x.id == value);
      if (idSD.length > 0) {
        form.subDistrict = idSD[0].nama;
      }
    }

    this.setState({ form });
  }

  onPick(idRAM) {
    let { dataRAM } = this.props;
    let { selectedIdx, form } = this.state;
    if (selectedIdx == idRAM) {
      selectedIdx = '';
      form = JSON.parse(JSON.stringify(initialForm));
    } else {
      selectedIdx = idRAM;
      let data = dataRAM.filter(x => x.idRAM == idRAM);
      if (data.length > 0) {
        form = JSON.parse(JSON.stringify(data[0]));
        this.props.getCityData(form.provinceCode);
        this.props.getDistrictData(form.cityCode);
        this.props.getSubDistrictData(form.districtCode);      
      }      
    }
    this.setState({ selectedIdx, form })
  }

  onDelete() {
    let { dataRAM } = this.props;
    let { selectedIdx } = this.state;
    dataRAM.map((item, index) => {
      if (item.idRAM == selectedIdx)
        dataRAM.splice(index, 1);
    });
    this.props.saveDataRAM(dataRAM);
    this.setState({
      form: JSON.parse(JSON.stringify(initialForm)),
      selectedIdx: '',
      modalDelete: false
    });

  }

  render() {
    const { form, selectedIdx, modalDelete, currentPage } = this.state;
    const {
      provinces,
      cities,
      districts,
      subDistricts,
      dataRAM,
    } = this.props;

    const idxCurrentPage = (currentPage - 1)
    const devide = 6;
    let pages = Math.ceil(dataRAM.length / devide);
    let dataPaging = [];
    if (pages > 0) {
      for (var a = 0; a < dataRAM.length; a++) {
        if (a >= (idxCurrentPage * devide) && a < ((idxCurrentPage * devide) + devide)) {
          dataPaging.push(dataRAM[a]);
        }
      }
    }
    return (
      <LoadingOverlay useTimer={true}>
        <Row>
          <Col lg="8" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">RAM List</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <table className="table mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th scope="col" className="border-0">
                              Name
                          </th>
                            <th scope="col" className="border-0">
                              Sub District
                          </th>
                            <th scope="col" className="border-0">
                              District
                          </th>
                            <th scope="col" className="border-0">
                              City
                          </th>
                            <th scope="col" className="border-0">
                              Province
                          </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            dataPaging.length > 0 ? (
                              dataPaging.map((item, index) => (
                                <tr
                                  key={index}
                                  onClick={() => this.onPick(item.idRAM)}
                                  className={selectedIdx == item.idRAM ? "pickRow" : ""}
                                >
                                  <td>{`${item.ramName}`}</td>
                                  <td>{item.subDistrict}</td>
                                  <td>{item.district}</td>
                                  <td>{item.city}</td>
                                  <td>{item.province}</td>
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
            {dataRAM.length > 0 && <Pagination
              totalItemsCount={dataRAM.length}
              onChange={(page) => this.setState({ currentPage: page })}
              activePage={currentPage}
              itemsCountPerPage={devide}
            ></Pagination>}
          </Col>
          <Col lg="4" className="mb-4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Add New RAM</h6>
              </CardHeader>
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">Name</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormInput
                            name="ramName"
                            value={form.ramName}
                            onChange={this.onChangeForm}
                          />
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">Province</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormSelect
                            name="provinceCode"
                            value={form.provinceCode}
                            onChange={this.onChangeForm}
                          >
                            <option value=""></option>
                            {provinces.length > 0 && provinces.map((item, index) => (
                              <option value={item.id} key={index}>{item.nama}</option>
                            ))}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">City</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormSelect
                            name="cityCode"
                            value={form.cityCode}
                            onChange={this.onChangeForm}
                          >
                            <option value=""></option>
                            {cities.length > 0 && cities.map((item, index) => (
                              <option value={item.id} key={index}>{item.nama}</option>
                            ))}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">District</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormSelect
                            name="districtCode"
                            value={form.districtCode}
                            onChange={this.onChangeForm}
                          >
                            <option value=""></option>
                            {districts.length > 0 && districts.map((item, index) => (
                              <option value={item.id} key={index}>{item.nama}</option>
                            ))}
                          </FormSelect>
                        </Col>
                      </Row>
                      <Row form>
                        <Col md="4" className="form-group">
                          <label htmlFor="feInputCity">Sub District</label>
                        </Col>
                        <Col md="8" className="form-group">
                          <FormSelect
                            name="subDistrictCode"
                            value={form.subDistrictCode}
                            onChange={this.onChangeForm}
                          >
                            <option value=""></option>
                            {subDistricts.length > 0 && subDistricts.map((item, index) => (
                              <option value={item.id} key={index}>{item.nama}</option>
                            ))}
                          </FormSelect>
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


RamCrudList.propTypes = {
  getCityData: PropTypes.func,
  getDistrictData: PropTypes.func,
  getSubDistrictData: PropTypes.func,
  saveDataRAM: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  getCitySuccess: estateSelector('getCitySuccess'),
  getCityFailed: estateSelector('getCityFailed'),
  cities: estateSelector('cities'),
  citiesError: estateSelector('citiesError'),

  getDistrictSuccess: estateSelector('getDistrictSuccess'),
  getDistrictFailed: estateSelector('getDistrictFailed'),
  districts: estateSelector('districts'),
  districtError: estateSelector('districtError'),

  getSubDistSuccess: estateSelector('getSubDistSuccess'),
  getSubDistFailed: estateSelector('getSubDistFailed'),
  subDistricts: estateSelector('subDistricts'),
  subDistrictError: estateSelector('subDistrictError'),

  dataRAM: estateSelector('dataRAM'),

})

export function mapDispatchToProps(dispatch) {
  return {
    getCityData: (province) => dispatch(getCity(province)),
    getDistrictData: (city) => dispatch(getDistrict(city)),
    getSubDistrictData: (district) => dispatch(getSubDistrict(district)),
    saveDataRAM: (form) => dispatch(saveDataRAM(form)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RamCrudList);
// export default RamCrudList;



