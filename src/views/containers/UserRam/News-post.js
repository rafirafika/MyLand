import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { estateSelector } from 'src/views/selectors';
import ReactQuill from "react-quill";
import ModalConfirmation from 'src/components/common/ModalConfirmation';
import { saveDataNews } from 'src/views/actions';
import "react-quill/dist/quill.snow.css";
import "src/assets/styles/quill.css";
import moment from 'moment';
import _ from "lodash";
import {
  ListGroup,
  Form,
  FormInput,
  ButtonGroup,
  ListGroupItem,
  Button,
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

const initialState = {
  text: '',
  html: '',
  title: '',
  idNews: '',
  date: null,
  dpub: false,
}
class NewsPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: JSON.parse(JSON.stringify(initialState)),
      modalDelete: false,
      idDelete: -1,
      open: false,
      currentPage: 0,
    };
    this.handleChangeEditor = this.handleChangeEditor.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataNews } = nextProps;
    console.log('RECEIVE dataNews', dataNews);
  }

  handleChangeEditor(content, delta, source, editor) {
    let { form } = this.state;
    const textP = editor.getText(content);
    form.text = textP;
    form.html = content;
    this.setState({
      form,
    })
  }

  handleChangeForm(e) {
    let { name, value } = e.target;
    let { form } = this.state;
    form[name] = value;
    this.setState({
      form
    })
  }

  onSave() {
    let { form } = this.state;
    let { dataNews } = this.props;
    form.date = moment(new Date()).format('DD MMMM YYYY');
    if (form.idNews == '') {
      form.idNews = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      dataNews.push(form);
    } else {
      dataNews.map((item, index) => {
        if (item.idNews == form.idNews) {
          dataNews[index] = form;
        }
      })
    }
    this.props.saveDataNews(dataNews);
    this.setState({
      form: JSON.parse(JSON.stringify(initialState)),
    })
  }

  dpub(idNews) {
    const { dataNews } = this.props;
    dataNews.map((item, index) => {
      if (item.idNews == idNews) {
        item.dpub = !item.dpub;
      }
    });
    this.props.saveDataNews(dataNews);
    this.setState({});
  }

  onDelete() {
    const { dataNews } = this.props;
    let { idDelete } = this.state;
    dataNews.map((item, index) => {
      if (item.idNews == idDelete) {
        dataNews.splice(index, 1);
      }
    });

    this.props.saveDataNews(dataNews);
    this.setState({
      form: JSON.parse(JSON.stringify(initialState)),
      modalDelete: false,
      idDelete: -1,
      currentPage: 0,
    });
  }

  onUpdate(idNews) {
    const { dataNews } = this.props;
    let find = dataNews.filter(x => x.idNews == idNews);
    if (find.length > 0) {
      this.setState({
        form: JSON.parse(JSON.stringify(find[0])),
      })
    }

  }

  toggle() {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const { dataNews } = this.props;
    const { form, modalDelete, open, currentPage } = this.state;
    const devide = 5;
    let pages = Math.ceil(dataNews.length / devide);
    let dataPaging = [];
    if (pages > 0) {
      for (var a = 0; a < dataNews.length; a++) {
        if (a >= (currentPage * devide) && a < ((currentPage * devide) + devide)) {
          dataPaging.push(dataNews[a]);
        }
      }
    }
    return (
      <Row>
        <Col lg="8" className="mb-4">
          <Card small className="mb-3">
            <CardBody>
              <Form className="add-new-post">
                <FormInput
                  size="lg"
                  className="mb-3"
                  placeholder="Your Post Title"
                  value={form.title}
                  name="title"
                  onChange={this.handleChangeForm}
                />
                <ReactQuill className="add-new-post__editor mb-1"
                  value={form.html}
                  onChange={this.handleChangeEditor}
                  modules={NewsPost.modules}
                  formats={NewsPost.formats}
                />
              </Form>
            </CardBody>
            <CardFooter>
              <Row>
                <ListGroupItem className="d-flex px-3 border-0">
                  <Button
                    theme="danger"
                    squared
                    onClick={() => { this.setState({ form: JSON.parse(JSON.stringify(initialState)) }) }}
                  >
                    <i className="material-icons">clear_all</i> Reset
              </Button>
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
          </Card>
        </Col>
        <Col lg="4" className="mb-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">News List</h6>
            </CardHeader>
            <CardBody className="p-0">
              {dataPaging.length > 0 ? (dataPaging.map((discussion, idx) => (
                <div key={idx} className="blog-comments__item d-flex p-3">
                  <div className="blog-comments__content">
                    <div className="blog-comments__meta text-mutes">
                      <a className="text-secondary">
                        {discussion.title}
                      </a>
                      <span className="text-mutes">- {discussion.date}</span>
                    </div>

                    <p className="m-0 my-1 mb-2 text-muted" > {`${discussion.text.substring(0, 50)} . . .`}
                    </p>
                    <div className="blog-comments__actions">
                      <ButtonGroup size="sm">
                        {discussion.dpub ? (
                          <Button theme="white" onClick={() => this.dpub(discussion.idNews)}>
                            <span className="text-danger">
                              <i className="material-icons">unpublished</i>
                            </span>{" "} Stop
                          </Button>
                        ) : (
                            <Button theme="white" onClick={() => this.dpub(discussion.idNews)}>
                              <span className="text-success">
                                <i className="material-icons">publish</i>
                              </span>{" "}Publish
                            </Button>
                          )
                        }
                        <Button theme="white" onClick={() => this.onUpdate(discussion.idNews)}>
                          <span className="text-warning">
                            <i className="material-icons">more_vert</i>
                          </span>{" "}
                          Edit
                        </Button>
                        <Button theme="white" onClick={() => this.setState({ modalDelete: true, idDelete: discussion.idNews })}>
                          <span className="text-danger">
                            <i className="material-icons">clear</i>
                          </span>{" "}
                          Delete
                        </Button>

                        <Button theme="white">
                          <span className="text-info">
                            <i className="material-icons">preview</i>
                          </span>{" "}
                        View
                      </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              ))) : (
                  <div className="blog-comments__item d-flex p-3 textCenter"><span className="m-auto">No News</span></div>
                )}
            </CardBody>

            {pages > 0 && <CardFooter className="border-top">
              <Row>
                <ListGroupItem className="d-flex px-3 border-0 m-auto">
                  <Button
                    onClick={currentPage > 0 ? () => this.setState({ currentPage: currentPage - 1 }) : () => { }}
                    theme="primary"
                    type="submit"
                    outline >
                    <i className="material-icons">navigate_before</i>
                  </Button>
                  &nbsp;
                    <Dropdown
                    open={open}
                    toggle={this.toggle}
                    addonType="prepend"
                  >
                    <DropdownToggle caret>{currentPage + 1}</DropdownToggle>
                    <DropdownMenu small>
                      {_.times(pages, (i) => (
                        <DropdownItem
                          onClick={() => this.setState({ currentPage: i })}
                          active={currentPage == i}
                          key={i}>
                          {i + 1}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  &nbsp;
                  <Button
                    onClick={currentPage < pages - 1 ? () => this.setState({ currentPage: currentPage + 1 }) : () => { }}
                    theme="primary"
                    type="submit"
                    outline>
                    <i className="material-icons">navigate_next</i>
                  </Button>
                </ListGroupItem>
              </Row>
            </CardFooter>
            }
          </Card>
        </Col>
        <ModalConfirmation
          open={modalDelete}
          message={'Are you sure to delete this data?'}
          onConfirm={() => this.onDelete()}
          onClose={() => this.setState({ modalDelete: false, idDelete: -1 })}
        ></ModalConfirmation>
      </Row >

    );
  }
}

NewsPost.modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'font': [] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values

    ['bold', 'italic', 'underline', 'strike',         // toggled buttons
      { 'script': 'sub' }, { 'script': 'super' }],       // superscript/subscript
    ['blockquote', 'code-block',
      { 'color': [] }, { 'background': [] }],           // dropdown with defaults from theme  

    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' },            // outdent/indent
    { 'direction': 'rtl' },                           // text direction  
    { 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
// https://quilljs.com/docs/formats/
NewsPost.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'script', 'blockquote', 'code',
  'background', 'color', 'align', 'direction', 'code-block',
  'list', 'indent', 'align',
  'link', 'image', 'video'
]

NewsPost.propTypes = {
  saveDataNews: PropTypes.func,
}
const mapStateToProps = createStructuredSelector({
  dataNews: estateSelector('dataNews'),
})

export function mapDispatchToProps(dispatch) {
  return {
    saveDataNews: (form) => dispatch(saveDataNews(form)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(NewsPost);
// export default NewsPost;



