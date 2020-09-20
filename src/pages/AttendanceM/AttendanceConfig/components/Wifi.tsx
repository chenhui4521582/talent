// 打卡地点设置
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Select, Form, Input } from 'antd';
import moment from 'moment';

import '../styles/scheduling.less';
const { Option } = Select;
export default props => {
  const { wifis } = props;
  const [form] = Form.useForm();
  const [editType, setEditType] = useState<'edit' | 'add'>();
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    list && list.length && props.onChange(list);
  }, [list]);

  useEffect(() => {
    let newList = JSON.parse(JSON.stringify(list || []));
    wifis?.map(item => {
      let obj: any = {};
      item?.wifiCode?.split(':')?.map((code, index) => {
        obj[index] = code;
      });

      newList.push({
        wifiCode: obj,
        wifiId: item.wifiId,
        wifiName: item.wifiName,
      });
    });
    setList(newList);
  }, [wifis]);

  const handleOk = () => {
    if (editType === 'edit') {
      setEditType(undefined);
      form.resetFields();
      return;
    }
    form.validateFields().then(value => {
      console.log(value);
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setEditType(undefined);
      form.resetFields();
    });
  };

  const renderList = useMemo(() => {
    console.log(list);
    return list.map((item, index) => {
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{item.wifiName}</span>
          <span>{Object.values(item.wifiCode).join(':')}</span>
          <span>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                let newList = JSON.parse(JSON.stringify(list));
                newList.splice(index, 1);
                setList(newList);
              }}
            >
              删除
            </a>
          </span>
        </div>
      );
    });
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setEditType('add');
          }}
        >
          添加
        </a>
      </div>
      {list?.length ? (
        <div className="scheduling-box-one">{renderList}</div>
      ) : null}
      <Modal
        title="添加打卡wifi"
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        width="36vw"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setEditType(undefined);
          form.resetFields();
        }}
      >
        <Form form={form}>
          <Form.Item name="wifiId" label="wifiId" style={{ display: 'none' }}>
            <Input placeholder="请输入wifi名称" />
          </Form.Item>
          <Form.Item
            name="wifiName"
            rules={[{ required: true, message: '请输入打卡名称!' }]}
            label="WiFi名称"
            style={{ paddingLeft: 20 }}
          >
            <Input placeholder="请输入wifi名称" />
          </Form.Item>
          <Form.Item
            name="wifiCode"
            label="WiFi名称"
            style={{ paddingLeft: 20 }}
          >
            <Input.Group compact>
              <Form.Item
                name={['wifiCode', '0']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['wifiCode', '1']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['wifiCode', '2']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['wifiCode', '3']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['wifiCode', '4']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['wifiCode', '5']}
                noStyle
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  style={{
                    width: 60,
                    display: 'inline-block',
                    margin: '0 6px',
                  }}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
