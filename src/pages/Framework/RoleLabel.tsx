import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  getLableList,
  getLableMemberList,
  deleteLable,
  newLable,
  editLable,
  deleteBatchLabelmember,
  newBatchLabelmember,
  tsUser,
} from './services/role';
import { GlobalResParams } from '@/types/ITypes';
import { Card, Input, Table, Popconfirm, Modal, Divider, Form } from 'antd';
import { ColumnProps } from 'antd/es/table';
import Organization from './components/Organization';
import './style/role.less';

const { Search } = Input;

interface tsRolrLable {
  id: number;
  labelName: string;
  status: number;
  updatedBy: string | null;
}

const columns: ColumnProps<tsUser>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
];

interface tsId {
  id: Number;
}

export default () => {
  const [newForm] = Form.useForm();
  const formRef = useRef();
  const [dataList, setDataList] = useState<tsRolrLable[]>([]);
  const [mount, setMount] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<tsRolrLable>({});
  const [removeLableVisible, setRemoveLableVisible] = useState<boolean>(false);
  const [changeLableVisible, setChangeLableVisible] = useState<boolean>(false);
  const [changeOrAdd, setChangeOrAdd] = useState<'add' | 'change'>();
  const [userList, setUserList] = useState<tsUser[]>([]);
  const [removeType, setRemoveType] = useState<'lable' | 'user'>();
  const [moveInVisible, setMoveInVisible] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectUser, setSelectUser] = useState<tsUser[]>();

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

  const handleSelectRole = async (id: number) => {
    setSelectUser([]);
    let json: GlobalResParams<tsUser[]> = await getLableMemberList(id);
    if (json.status === 200) {
      json.obj.map(item => {
        item.key = item.id;
      });
      setUserList(json.obj);
    }
  };

  const delectOk = async () => {
    let deleteApi;
    let submitData;
    if (removeType === 'lable') {
      deleteApi = deleteLable;
      submitData = selectItem?.id;
    } else {
      let arr: tsId[] = [];
      deleteApi = deleteBatchLabelmember;
      selectUser?.map(item => {
        arr.push({ id: item.id });
      });

      submitData = arr;
    }

    let res: GlobalResParams<string> = await deleteApi(submitData);
    if (res.status === 200) {
      if (removeType === 'lable') {
        getApilableList();
        setSelectItem(undefined);
      } else {
        handleSelectRole(selectItem?.id);
      }

      setRemoveLableVisible(false);
    }
  };

  const newOrAddOk = async () => {
    let submit;
    if (changeOrAdd === 'change') {
      submit = editLable;
    } else {
      submit = newLable;
    }
    newForm.validateFields().then(async values => {
      if (changeOrAdd === 'change') {
        values.id = selectItem?.id;
      }
      let res: GlobalResParams<string> = await submit(values);
      if (res.status === 200) {
        getApilableList();
        setChangeLableVisible(false);
      }
    });
  };

  const loop = list => {
    let loopdata = JSON.parse(JSON.stringify(list));
    for (let i = 0; i < loopdata.length; i++) {
      if (
        searchValue?.length &&
        loopdata[i].labelName.indexOf(searchValue) > -1
      ) {
        const index = loopdata[i].labelName.indexOf(searchValue);
        const beforeStr = loopdata[i].labelName.substr(0, index);
        const afterStr = loopdata[i].labelName.substr(
          index + searchValue.length,
        );
        loopdata[i].labelName = (
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
          {item.labelName}
          {item.id === selectItem?.id ? (
            <Popconfirm
              key={changeLableVisible + '' + removeLableVisible}
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
                      newForm.setFieldsValue({
                        labelName: selectItem?.labelName,
                      });
                      setChangeLableVisible(true);
                      setChangeOrAdd('change');
                    }}
                  >
                    修改名称
                  </div>
                  <div
                    className="alert-hover"
                    onClick={() => {
                      setRemoveType('lable');
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
    removeLableVisible,
    changeLableVisible,
    searchValue,
  ]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectUser(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const renderRight = useMemo(() => {
    const tableTitle = (
      <div className="table-title">
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => {
            setMoveInVisible(true);
          }}
        >
          从其他部门移入
        </span>
        <Divider type="vertical" />
        <span
          style={{ color: '#1890ff', cursor: 'pointer' }}
          onClick={() => {
            setRemoveType('user');
            setRemoveLableVisible(true);
          }}
        >
          移除
        </span>
      </div>
    );

    {
      return selectItem.id ? (
        <div className="role-right">
          <h3>{`${selectItem?.labelName}(${userList?.length})`}</h3>
          <Table
            title={() => {
              return tableTitle;
            }}
            style={{ width: '60vw' }}
            columns={columns}
            dataSource={userList}
            rowSelection={rowSelection}
          />
        </div>
      ) : null;
    }
  }, [userList, selectItem]);

  const moveIn = async () => {
    let values: any = [];

    // labelId: number,
    // memberType: number,
    // userCode?: string,
    // departmentCode?: string,

    let list: any = formRef?.current?.getvalue();
    list.map(item => {
      // type: list[i].memberList?'user':'department',
      values.id = selectItem?.id;
      if (item.type === 'user') {
        values.push({
          labelId: selectItem?.id,
          memberType: 1,
          userCode: item.key,
        });
      } else {
        values.push({
          labelId: selectItem?.id,
          memberType: 2,
          departmentCode: item.key,
        });
      }
    });

    let json: GlobalResParams<string> = await newBatchLabelmember(values);
    if (json.status === 200) {
      getApilableList();
      handleSelectRole(selectItem?.id);
      setMoveInVisible(false);
    }
  };
  return (
    <Card title="角色标签管理">
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
                newForm.setFieldsValue({ labelName: null });
                setChangeLableVisible(true);
                setChangeOrAdd('add');
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
        // key = {changeOrAdd}
        title={changeOrAdd === 'add' ? '新建标签' : '修改名称'}
        visible={changeLableVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setChangeLableVisible(false);
        }}
        onOk={newOrAddOk}
      >
        <div>标签名称</div>
        <Form form={newForm}>
          <Form.Item
            name="labelName"
            rules={[
              {
                required: true,
                message: `标签名必填!`,
              },
            ]}
          >
            <Input placeholder="如：行政/财务/华南区/领导" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width="50vw"
        title="从其他部门移入"
        visible={moveInVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setMoveInVisible(false);
        }}
        onOk={moveIn}
      >
        <Organization ref={formRef} />
      </Modal>
    </Card>
  );
};
