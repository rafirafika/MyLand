import React, { Component, memo } from 'react';
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput, CardHeader } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "src/assets/styles/quill.css";
import Parser from 'html-react-parser';
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(content, delta, source, editor) {
    const textP = editor.getText(content);
    console.log(textP)
    this.setState({
      text: content,
    })
  }
  render() {
    // let a = Parser(this.state.text);
    // console.log(a);
    return (
      <div>
        <Card small className="mb-3">
          <CardBody>
            <Form className="add-new-post">
              <FormInput size="lg" className="mb-3" placeholder="Your Post Title" />
              <ReactQuill className="add-new-post__editor mb-1"
                value={this.state.text}
                onChange={this.handleChange} 
                modules={Editor.modules}
                formats={Editor.formats}
              />
            </Form>
          </CardBody>
        </Card>
        <Card small className="mb-3">
          <CardHeader>PREVIEW TEXT</CardHeader>
          <CardBody>
            <div dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
            {/* {Parser(this.state.text)} */}
          </CardBody>
        </Card>
      </div>

    )
  }
}
// https://quilljs.com/docs/modules/
Editor.modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'font': [] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values

    ['bold', 'italic', 'underline', 'strike',         // toggled buttons
    { 'script': 'sub'}, { 'script': 'super' }],       // superscript/subscript
    ['blockquote', 'code-block',
    { 'color': [] }, { 'background': [] }],           // dropdown with defaults from theme  

    [{ 'list': 'ordered'}, { 'list': 'bullet' },
    { 'indent': '-1'}, { 'indent': '+1' },            // outdent/indent
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
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'script', 'blockquote', 'code',
  'background','color', 'align', 'direction', 'code-block',
  'list', 'indent', 'align',
  'link', 'image', 'video'
]

export default Editor;
