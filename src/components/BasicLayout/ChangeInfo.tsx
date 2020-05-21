import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, notification, Select } from 'antd';
import { queryBusiness, IBusiness, ICurrentUserParams, updateUserInfo, IChangeUserInfoParams } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select

interface IAccountProps {
  modalName: string;
  currentUser: ICurrentUserParams | undefined;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  fetchCurrent: () => Promise<any>
}

export default ({ modalName, currentUser, setModalName, fetchCurrent }: IAccountProps) => {
  const [businessLine, setBusinessLine] = useState<IBusiness[]>();
  const [form] = Form.useForm();
  useEffect(() => {
    async function fetchBusiness() {
      let response: GlobalResParams<IBusiness[]> = await queryBusiness();
      setBusinessLine(response.obj);
    };
    fetchBusiness();
  }, []);
  const handleSubmit = () => {
    form.submit();
  };

  const submitForm = async () => {
    let data = form.getFieldsValue() as IChangeUserInfoParams;
    let response = await updateUserInfo(data);
    if (response.status === 200) {
      notification['success']({
        message: response.msg,
        description: '',
      });
      fetchCurrent();
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
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  return(
    <Modal
      title="账户信息修改"
      visible={modalName === 'account'}
      onOk={handleSubmit}
      onCancel={cancelChange}
      okText="确定"
      cancelText="取消"
    >
      <Form
        {...formItemLayout}
        form={form}
        onFinish={submitForm}
        initialValues={currentUser}
      >
        <Form.Item
          label='用户名称'
          name="userName"
          rules={[{ required: true, message: '请输入用户名称!' }]}
        >
          <Input placeholder="请输入用户名称" />
        </Form.Item>
        <Form.Item
          label='手机号码'
          name="phone"
          rules={[{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码！!' }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          label='邮箱'
        >
          <Input defaultValue={currentUser?.email} disabled />
        </Form.Item>
        <Form.Item
          label='业务线'
        >
          <Select
            style={{width: '100%'}}
            defaultValue={currentUser?.businessCode}
            disabled
          >
            {
              businessLine?.map(item => {
                return <Option key={item.businessCode} value={item.businessCode}>{item.businessLineName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
