import React from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { changeOwnPwd, IChangePwdParams } from '@/services/global';

interface IPwdProps {
  modalName: string;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
}

export default ({ modalName, setModalName }: IPwdProps) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };
  const submitForm = async () => {
    let data = form.getFieldsValue() as IChangePwdParams;
    let response = await changeOwnPwd(data);
    if (response.status === 200) {
      notification['success']({
        message: response.msg,
        description: '',
      });
      cancelChange();
    } else {
      notification['error']({
        message: response.msg,
        description: '',
      });
    }
  };

  const cancelChange = () => {
    form.resetFields();
    setModalName('');
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };
  return(
    <Modal
      title="修改密码"
      visible={modalName === 'changPwd'}
      onOk={handleSubmit}
      onCancel={cancelChange}
      okText="确定"
      cancelText="取消"
    >
      <Form
        {...formItemLayout}
        form={form}
        onFinish={submitForm}
      >
        <Form.Item
          label='原密码'
          name="oldPassword"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          label='新密码'
          name="newPassword"
          rules={
            [
              { required: true, message: '请输入新密码' },
              {
                min: 6,
                message: '最小长度为6！',
              },
            ]
          }
        >
          <Input placeholder="至少6位密码，区分大小写" />
        </Form.Item>
        <Form.Item
          label='确认新密码'
          name="confirm"
          rules={
            [
              { required: true, message: '请输入新密码' },
              {
                min: 6,
                message: '最小长度为6！',
              },
              ({ getFieldValue }) => ({
                validator(_, value: string) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不匹配!');
                },
              }),
            ]
          }
        >
          <Input placeholder="确认密码" />
        </Form.Item>
      </Form>
    </Modal>
  )
}