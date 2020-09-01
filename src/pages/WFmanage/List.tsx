import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Divider,
  Switch,
  notification,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  Row,
  Col,
} from 'antd';
import { Link } from 'umi';

import { useTable } from '@/components/GlobalTable/useTable';
import { homeList, changeState, save, changeWf } from './services/new';
import { categoryList, tsCategoryItem } from './services/category';
import { ColumnProps } from 'antd/es/table';
import { GlobalResParams } from '@/types/ITypes';
import { UploadOutlined } from '@ant-design/icons';
import { saveFile } from '@/services/global';
import Icon from '@/images/icon.png';

interface tsList {
  id: number;
  name: string;
  status: number;
  icon: string;
}

const { Option } = Select;

export default () => {
  const columns: ColumnProps<tsList>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '工作流类别',
      dataIndex: 'formCategoryName',
      key: 'formCategoryName',
      align: 'center',
    },
    {
      title: '工作流图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      render: (_, record) => {
        return <img src={record.icon || Icon} style={{ height: 40 }} />;
      },
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={!!record.status}
            onChange={() => {
              onChange(record.id);
            }}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Link to={`applicationrecord/${record.id}`}>申请记录</Link>
            <Divider type="vertical" />
            <Link to={`editForm/${record.id}`}>表单设置</Link>
            <Divider type="vertical" />
            <Link to={`editRule/${record.id}`}>规则设置</Link>
            <Divider type="vertical" />
            <a
              onClick={() => {
                setType('change');
                form.setFieldsValue(record);
                setSelectItem(record);
              }}
            >
              修改
            </a>
          </span>
        );
      },
    },
  ];

  const [type, setType] = useState<'add' | 'change'>();
  const [form] = Form.useForm();
  const [category, setCategory] = useState<tsCategoryItem[]>();
  const [selectItem, setSelectItem] = useState<tsCategoryItem>();

  useEffect(() => {
    async function getCategoryList() {
      let json: GlobalResParams<tsCategoryItem[]> = await categoryList();
      if (json.status === 200) {
        setCategory(json.obj);
      }
    }
    getCategoryList();
  }, []);

  const onChange = async id => {
    let res: GlobalResParams<string> = await changeState(id);
    if (res.status === 200) {
      notification['success']({
        message: res.msg,
        description: '',
      });
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };

  const { TableContent, refresh } = useTable({
    queryMethod: homeList,
    columns,
    rowKeyName: 'id',
    cacheKey: '/wfresform/getList',
  });

  const handleOk = () => {
    form.validateFields().then(async value => {
      let api = save;
      if (type === 'change') {
        value.id = selectItem?.id;
        api = changeWf;
      }
      let json: GlobalResParams<string> = await api(value);
      if (json.status === 200) {
        refresh();
        setType(undefined);
        notification['success']({
          message: json.msg,
          description: '',
        });
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  return (
    <Card
      title="工作流列表"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setType('add');
          }}
        >{`新增工作流`}</Button>
      }
    >
      <TableContent>
        <Row>
          <Col span={5}>
            <Form.Item label="工作流名称" name="name">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="状态" name="status">
              <Select placeholder="请选择" allowClear>
                <Option value={0}>禁用</Option>
                <Option value={1}>启用</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="工作流类别" name="categoryId">
              <Select placeholder="请选择" allowClear>
                {category?.map((item, i) => {
                  return (
                    <Option key={i} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </TableContent>
      <Modal
        title={type === 'add' ? '新增工作流' : '修改工作流'}
        visible={!!type}
        okText="确定"
        cancelText="取消"
        key={type + ''}
        onCancel={() => {
          setSelectItem(undefined);
          setType(undefined);
        }}
        onOk={handleOk}
      >
        <Form form={form}>
          <Form.Item
            label="工作流名称"
            name="name"
            rules={[{ required: true, message: '请输入工作流名称!' }]}
          >
            <Input placeholder="请输入工作流名称" />
          </Form.Item>
          <Form.Item
            label="所属类别"
            name="formCategoryId"
            rules={[{ required: true, message: '请选择工作流类别!' }]}
          >
            <Select>
              {category?.map(item => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="工作流图标" name="icon">
            <IconImg iconUrl={selectItem?.icon} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

interface Iprops {
  iconUrl: string | undefined | null;
  onChange?: (value: string) => {};
}

const IconImg = (props: Iprops) => {
  const { iconUrl, onChange } = props;
  const [fileList, setFileList] = useState<any[]>();

  useEffect(() => {
    if (iconUrl) {
      setFileList([
        {
          name: '',
          uid: '-1',
          url: iconUrl,
          status: 'done',
        },
      ]);
    }
  }, [iconUrl]);

  const customRequestwork = async files => {
    const { onSuccess, file } = files;
    let res: GlobalResParams<any> = await saveFile({ file: file });
    if (res.status === 200) {
      setFileList([
        {
          name: '',
          uid: '-1',
          url: res.obj.url,
          status: 'done',
        },
      ]);
      onChange && onChange(res.obj.url);
      onSuccess();
    }
  };

  const action = {
    name: 'file',
    multiple: false,
    customRequest: customRequestwork,
  };

  const onRemove = () => {
    setFileList([]);
  };

  return (
    <Upload
      {...action}
      fileList={fileList}
      accept="image/*"
      listType="picture-card"
      onRemove={onRemove}
    >
      {fileList && fileList?.length ? null : (
        <>
          <UploadOutlined /> 上传附件
        </>
      )}
    </Upload>
  );
};
