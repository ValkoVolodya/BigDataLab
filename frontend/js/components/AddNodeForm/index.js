import React from 'react';
const uuidv4 = require('uuid/v4');

import { Button, Modal, Form, Input, Radio, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

export const AddNodeForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, types } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new node"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the title of node!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Priority">
            {getFieldDecorator('priority')(<Input type="number" />)}
          </FormItem>
          <FormItem label="Node Type">
            {getFieldDecorator('type', {
                rules: [
                    { required: true, message: 'Please select node type!' },
                ],
            })(
              <Select placeholder="Please select a type">
                {types.map((type) => {
                  return (
                    <Option key={uuidv4()} value={type}>{type}</Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

class CollectionsPage extends React.Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New Collection</Button>
        <CollectionCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}