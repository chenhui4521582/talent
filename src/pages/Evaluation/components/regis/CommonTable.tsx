import React, { useState } from 'react';
import { Table, Card, Button, Form, Modal } from 'antd';
import { formItemLayout } from '@/types/ITypes';

export default (props) => {
  const [modalName, setModalName] = useState<string>('');
  const { data, setData, columns, cnName, rowKeyName, formComponent } = props;
  const [form] = Form.useForm();
  const handleShow = () => {
    setModalName(cnName);
  }
  const cancelModal = () => {
    setModalName('');
    form.resetFields();
  }

  const handleSubmit = values => {
    if (values.startDate) {
      values.startDate = values.startDate.format('YYYY/MM/DD');
    }
    if (values.endDate) {
      values.endDate = values.endDate.format('YYYY/MM/DD');
    }
    if (values.graduateDate) {
      values.graduateDate = values.graduateDate.format('YYYY/MM/DD');
    }
    if (values.degreeDate) {
      values.degreeDate = values.degreeDate.format('YYYY/MM/DD');
    }
    if (values.birthDate) {
      values.birthDate = values.birthDate.format('YYYY/MM/DD');
    }
    setData([...data, values]);
    cancelModal();
  }
  return (
    <div>
      <Card title={cnName} extra={<Button onClick={handleShow} type="primary">{`新增${cnName}`}</Button>}>
        <Table size="small" dataSource={data} rowKey={rowKeyName} columns={columns} />
      </Card>
      <Modal
        visible={modalName === cnName}
        title={`新增${cnName}`}
        okText="确定"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={e => form.submit()}
      >
        <Form
          {...formItemLayout}
          form={form}
          onFinish={handleSubmit}
        >
          {formComponent}
        </Form> 
      </Modal>
    </div>
  )
}