import React, { useState, useEffect, useMemo } from 'react';
import {
  getLableList,
  getLableMemberList,
  deleteLable,
  editLable,
  tsLableItem,
} from './services/handle';
import { GlobalResParams } from '@/types/ITypes';
import {
  Card,
  Input,
  Popconfirm,
  Modal,
  Form,
  Descriptions,
  notification,
} from 'antd';
import './style/role.less';

const { Search, TextArea } = Input;

interface tsRolrLable {
  id: number;
  name: string;
  status: number;
  updatedBy: string | null;
}

export default () => {
  const [newForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [dataList, setDataList] = useState<tsRolrLable[]>([]);
  const [mount, setMount] = useState<boolean>(false);
  const [removeLableVisible, setRemoveLableVisible] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<tsRolrLable>();
  const [detail, setDetail] = useState<any>();
  const [searchValue, setSearchValue] = useState<string>();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [changeOrAddVisible, setChangeOrAddVisible] = useState<boolean>(false);

  useEffect(() => {
    getApilableList();
  }, []);

  const getApilableList = async () => {
    let json: GlobalResParams<tsRolrLable[]> = await getLableList();
    if (json.status === 200) {
      setDataList(json.obj);
      setMount(true);
    }
  };

  const searchChange = (e): void => {
    const {
      target: { value },
    } = e;
    setSearchValue(value);
  };

  const handleSelectRole = async (id: number | undefined) => {
    let json: GlobalResParams<tsLableItem> = await getLableMemberList(id);
    if (json.status === 200) {
      setDetail(json.obj);
    }
  };

  const delectOk = async () => {
    let json: GlobalResParams<string> = await deleteLable(selectItem?.id);
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      setRemoveLableVisible(false);
      getApilableList();
      setDetail(undefined);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };

  const editOk = async () => {
    editForm.validateFields().then(async values => {
      selectItem?.id ? (values.id = selectItem?.id) : '';
      let json: GlobalResParams<string> = await editLable(values);
      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        handleSelectRole(selectItem?.id);
        getApilableList();
        setEditVisible(false);
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };

  const loop = list => {
    let loopdata = JSON.parse(JSON.stringify(list));
    for (let i = 0; i < loopdata.length; i++) {
      if (searchValue?.length && loopdata[i].name.indexOf(searchValue) > -1) {
        const index = loopdata[i].name.indexOf(searchValue);
        const beforeStr = loopdata[i].name.substr(0, index);
        const afterStr = loopdata[i].name.substr(index + searchValue.length);
        loopdata[i].name = (
          <>
            {beforeStr}
            <span style={{ color: 'red' }}>{searchValue}</span>
            {afterStr}
          </>
        );
      }
    }
    return loopdata;
  };

  const renderRoleLable = useMemo(() => {
    return loop(dataList).map(item => {
      return (
        <div
          className={
            item.id === selectItem?.id ? 'role-select-item' : 'role-item'
          }
          key={item.id}
          onClick={() => {
            setSelectItem(item);
            handleSelectRole(item.id);
          }}
        >
          {item.name}
          {item.id === selectItem?.id ? (
            <Popconfirm
              key={changeOrAddVisible + '' + removeLableVisible}
              icon={<></>}
              onConfirm={() => {}}
              onCancel={() => {}}
              placement="bottomLeft"
              cancelButtonProps={{ style: { display: 'none' } }}
              okButtonProps={{ style: { display: 'none' } }}
              okText=""
              cancelText=""
              title={
                <div style={{ marginLeft: '-11px' }}>
                  <div
                    className="alert-hover"
                    onClick={() => {
                      setType('edit');
                      // newForm.setFieldsValue({
                      //   name: selectItem?.name,
                      // });
                      setChangeOrAddVisible(true);
                      editForm.setFieldsValue(detail);
                      setEditVisible(true);
                    }}
                  >
                    修改
                  </div>
                  <div
                    className="alert-hover"
                    onClick={() => {
                      setRemoveLableVisible(true);
                    }}
                  >
                    删除
                  </div>
                </div>
              }
            >
              <span className="more">⋮</span>
            </Popconfirm>
          ) : null}
        </div>
      );
    });
  }, [
    dataList,
    selectItem,
    searchValue,
    changeOrAddVisible,
    removeLableVisible,
  ]);

  const renderRight = useMemo(() => {
    return detail?.id ? (
      <div className="role-right" style={{ width: '70%', marginLeft: 60 }}>
        <div className="table-title">
          {selectItem?.name}
          <span
            style={{
              color: 'rgb(24, 144, 255)',
              cursor: 'pointer',
              marginLeft: 50,
            }}
            onClick={() => {
              editForm.setFieldsValue(detail);
              setEditVisible(true);
            }}
          >
            编辑
          </span>
        </div>

        <Descriptions
          layout="vertical"
          bordered
          column={1}
          style={{ width: '100%', marginTop: 20 }}
        >
          <Descriptions.Item label="URL内容：">{detail?.url}</Descriptions.Item>
          <Descriptions.Item label="标签描述：">
            {detail?.remark}
          </Descriptions.Item>
        </Descriptions>
      </div>
    ) : null;
  }, [selectItem, detail]);

  return (
    <Card title="执行操作管理">
      <div className="role">
        <div style={{ width: '20%' }} className="role-left">
          {mount ? (
            <Search
              type="search"
              placeholder="请搜索"
              onChange={searchChange}
              style={{ marginBottom: 30 }}
            />
          ) : null}
          <div className="role-title">
            所有标签名
            <span
              onClick={() => {
                editForm.setFieldsValue({
                  name: undefined,
                  url: undefined,
                  remark: undefined,
                });
                setEditVisible(true);
              }}
            >
              +
            </span>
          </div>
          {renderRoleLable}
        </div>
        {renderRight}
      </div>

      <Modal
        title="删除标签"
        visible={removeLableVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setRemoveLableVisible(false);
        }}
        onOk={delectOk}
      >
        <h3>确认删除？</h3>
        <div>删除标签不会导致包含部门或成员从组织架构删除</div>
      </Modal>

      <Modal
        title="编辑"
        visible={editVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setEditVisible(false);
        }}
        onOk={editOk}
      >
        <Form form={editForm}>
          <Form.Item
            name="name"
            label="标题"
            rules={[{ required: true, message: `标题内容必填!` }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="url"
            label="URL内容"
            rules={[{ required: true, message: `URL内容必填!` }]}
          >
            <Input placeholder="示例：http://172.16.248.175:8082/syslabel/get?type=ceo&businessCode={}" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="标签描述"
            rules={[{ required: true, message: `URL内容必填!` }]}
          >
            <TextArea placeholder="请输入描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
