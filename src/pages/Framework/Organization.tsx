import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card,
  Tree,
  Input,
  Modal,
  Table,
  Divider,
  Popconfirm,
  Form,
  Button,
  notification,
} from 'antd';
import {
  getOrganization,
  getDeleteGroup,
  getDefaultGroup,
  deleteGroup,
  newGroup,
  editGroup,
  deleteUserApi,
  moveInUser,
  setDepartLeader,
  setUserParent,
  tsListItem,
  tsDeleteItem,
  tsDefaultItem,
  tsSlectGroup,
  tsUserItem,
  tsRefs,
} from './services/organization';
import Organization from './components/Organization';
import MoveInOz from './components/MoveInOz';
import OzTreeSlect from './components/OzTreeSlect';
import { StarOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { ColumnProps } from 'antd/es/table';
import './style/organization.less';
const { Search } = Input;

const columns: ColumnProps<tsUserItem>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    render: (_, record) => (
      <div
        style={{
          color:
            record.userType === 2 || !record.userType
              ? 'blue'
              : 'rgba(0, 0, 0, 0.65)',
          fontWeight:
            record.userType === 2 || !record.userType ? 'bold' : 'normal',
          minHeight: '1.5em',
        }}
      >
        {record.userType === 2 || !record.userType ? <StarOutlined /> : null}
        {record.name}
      </div>
    ),
  },
  {
    title: 'code',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
  },
  {
    title: '上级',
    dataIndex: 'parentName',
    key: 'parentName',
    align: 'center',
  },
  {
    title: '是否部门负责人',
    dataIndex: 'groupCode',
    key: 'groupCode',
    align: 'center',
    render: (_, record) => (
      <span>{record.userType === 1 || !record.userType ? '否' : '是'}</span>
    ),
  },
];

export default props => {
  const formRef = useRef<tsRefs>();
  const [newGropForm] = Form.useForm();
  const [changeForm] = Form.useForm();
  const [dataList, setDataList] = useState<tsListItem[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['奖多多集团']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectUserkeys, setSelectUserkeys] = useState<string[]>([]);
  const [selectUserParent, setSelectUserParent] = useState<string[]>([]);
  const [selectUserAll, setSelectUserAll] = useState<string[]>([]);
  //所有的列表item
  const [keyTitleList, setKeyTitleList] = useState<tsSlectGroup[]>([]);
  // 选择组下面人的对象
  const [userListObj, setUserList] = useState<any>({});
  // 当前的选准的组对象下面的人
  const [currentUserList, setCurrentUserList] = useState<tsUserItem[]>([]);
  // 点击选准的treeitem
  const [selectGroup, setSelectGroup] = useState<tsSlectGroup>({
    title: '',
    key: '',
    id: 0,
    parentCode: '',
    memberList: [],
  });
  // 因为新建子部门跟，修改部门名称是同一个   modal
  const [newChildGropVisible, setNewChildGropVisible] = useState<boolean>(
    false,
  );
  const [flag, setFlag] = useState<boolean>(false);
  // 判断是新增还是修改选准的部门新增子部门
  const [changeOrNewType, setChangeOrNewType] = useState<
    '添加子部门' | '修改名称'
  >('添加子部门');
  // 点击根旁边+的modal
  const [newVisible, setNewVisible] = useState<boolean>(false);
  // 删除人员的第一层modal
  const [removeUserVisible, setRemoveUserVisible] = useState<boolean>(false);
  // 从其他部门移入 modal
  const [moveInVisible, setMoveInVisible] = useState<boolean>(false);
  // 设置所在部门 modal
  const [departmentVisible, setDepartmentVisible] = useState<boolean>(false);
  // 设置部门负责人 modal
  const [superiorVisible, setSuperiorVisible] = useState<boolean>(false);
  // 删除分组
  const [removeGroupVisible, setRemoveGroupVisible] = useState<boolean>(false);
  // 设置直属上级
  const [reportToVisible, setReportToVisible] = useState<boolean>(false);

  useEffect(() => {
    getJson();
  }, []);

  async function getJson() {
    let organizationJson: GlobalResParams<tsListItem[]> = await getOrganization();
    let deleteGroupJson: GlobalResParams<tsDeleteItem[]> = await getDeleteGroup();
    let defaultGroupJson: GlobalResParams<tsDefaultItem[]> = await getDefaultGroup();
    if (
      organizationJson.status === 200 &&
      deleteGroupJson.status === 200 &&
      defaultGroupJson.status === 200
    ) {
      let list = organizationJson.obj;
      let deleteGroupList: tsUserItem[] = [];
      for (let i = 0; i < deleteGroupJson.obj.length; i++) {
        deleteGroupList.push({
          key: deleteGroupJson.obj[i].userCode,
          title: deleteGroupJson.obj[i].trueName,
          code: deleteGroupJson.obj[i].userCode,
          groupCode: '已删除组',
          name: deleteGroupJson.obj[i].trueName,
          parentCode: deleteGroupJson.obj[i].parentCode,
        });
      }
      let deleteGroupObj: tsListItem = {
        id: -1,
        code: '已删除组',
        name: '已删除组',
        parentCode: '奖多多集团',
        key: '已删除组',
        title: '已删除组',
        memberList: deleteGroupList,
      };

      list.push(deleteGroupObj);

      let defaulGroupList: tsUserItem[] = [];
      for (let i = 0; i < defaultGroupJson.obj.length; i++) {
        defaulGroupList.push({
          key: defaultGroupJson.obj[i].userCode,
          title: defaultGroupJson.obj[i].trueName,
          code: defaultGroupJson.obj[i].userCode,
          groupCode: '默认分组',
          name: defaultGroupJson.obj[i].trueName,
        });
      }

      let defaultGroupObj: tsListItem = {
        id: -2,
        code: '默认分组',
        name: '默认分组',
        parentCode: '奖多多集团',
        key: '默认分组',
        title: '默认分组',
        memberList: defaulGroupList,
      };

      list.push(defaultGroupObj);
      let newObj: tsListItem = {
        id: 0,
        key: '奖多多集团',
        title: '奖多多集团',
        code: '奖多多集团',
        name: '奖多多集团',
        children: list,
      };
      handleList([newObj]);
    }
  }

  const handleList = data => {
    let keyTitle: tsSlectGroup[] = [];
    let userList = userListObj;
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        keyTitle.push({
          key: list[i].code,
          title: list[i].name,
          id: list[i].id,
          parentCode: list[i].parentCode,
          memberList: list[i].memberList,
          children: list[i].children,
        });

        if (list[i].memberList && list[i].memberList.length) {
          for (let k = 0; k < list[i].memberList.length; k++) {
            list[i].memberList[k].key = list[i].memberList[k].code;
          }
          userList[list[i].code] = list[i].memberList;
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(data);
    setDataList(data);
    setKeyTitleList(keyTitle);
    newKey(keyTitle);
    setUserList(userList);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const searchChange = (e): void => {
    const {
      target: { value },
    } = e;
    let expandedKey = keyTitleList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, dataList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKey);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const newKey = keyTitle => {
    keyTitle.map(item => {
      if (item.key === selectedKeys[0]) {
        setSelectGroup(item);
      }
    });
  };

  const onTreeSelect = e => {
    setSelectedKeys(e);
    keyTitleList.map(item => {
      if (item.key === e[0]) {
        setSelectGroup(item);
      }
    });

    if (userListObj[e]) {
      setCurrentUserList(userListObj[e]);
      let arr: string[] = [];
      userListObj[e].map(item => {
        arr.push(item.key);
      });
      setSelectUserAll(arr);
    } else {
      setCurrentUserList([]);
      setSelectUserAll([]);
    }
  };

  const Loop = data => {
    let loopdata = JSON.parse(JSON.stringify(data));
    const more = (
      <span
        style={{
          display: 'flex',
          width: '1em',
          justifyContent: 'flex-end',
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Popconfirm
          key={flag + ''}
          title={
            <div className="hover">
              <p
                onClick={e => {
                  setChangeOrNewType('添加子部门');
                  setNewChildGropVisible(true);
                  setFlag(!flag);
                  changeForm.setFieldsValue({
                    name: '',
                  });
                }}
              >
                添加子部门
              </p>
              <p
                onClick={e => {
                  setChangeOrNewType('修改名称');
                  changeForm.setFieldsValue({
                    name: selectGroup.title,
                  });
                  setFlag(!flag);
                  setNewChildGropVisible(true);
                }}
              >
                修改名称
              </p>
              <p
                onClick={e => {
                  setFlag(!flag);
                  selectGroup.memberList?.map(item => {
                    if (item.userType === 2) {
                      setSelectUserParent([item.code]);
                    }
                  });
                  setSuperiorVisible(true);
                }}
              >
                设置部门负责人
              </p>
              <p
                onClick={e => {
                  setFlag(!flag);
                  setRemoveGroupVisible(true);
                }}
              >
                删除
              </p>
            </div>
          }
          icon={<></>}
          onConfirm={() => {}}
          onCancel={() => {}}
          placement="bottomLeft"
          cancelButtonProps={{ style: { display: 'none' } }}
          okButtonProps={{ style: { display: 'none' } }}
          okText=""
          cancelText=""
        >
          <span
            style={{
              display: 'flex',
              width: '1em',
              justifyContent: 'flex-end',
            }}
          >
            ⋮
          </span>
        </Popconfirm>
      </span>
    );

    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        if (searchValue.length && list[i].name.indexOf(searchValue) > -1) {
          const index = list[i].title.indexOf(searchValue);
          const beforeStr = list[i].title.substr(0, index);
          const afterStr = list[i].title.substr(index + searchValue.length);
          if (list[i].title === '奖多多集团') {
            list[i].title = (
              <div style={{ minWidth: '10em', display: 'flex' }}>
                {beforeStr}{' '}
                <span style={{ color: 'red' }}> {searchValue} </span>
                {afterStr}
                <span
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                    fontSize: 20,
                  }}
                  onClick={() => {
                    setNewVisible(true);
                  }}
                >
                  +
                </span>
              </div>
            );
          } else {
            if (list[i].code === selectGroup.key) {
              list[i].title = (
                <div style={{ minWidth: '10em', display: 'flex' }}>
                  <span style={{ flex: 1, display: 'flex' }}>
                    {beforeStr}{' '}
                    <span style={{ color: 'red' }}>{searchValue}</span>{' '}
                    {afterStr}{' '}
                  </span>
                  {list[i].title === '已删除组' || list[i].title === '默认分组'
                    ? null
                    : more}
                </div>
              );
            } else {
              list[i].title = (
                <div
                  style={{ minWidth: '10em', display: 'flex' }}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <span style={{ flex: 1, display: 'flex' }}>
                    {' '}
                    {beforeStr}{' '}
                    <span style={{ color: 'red' }}>{searchValue}</span>{' '}
                    {afterStr}{' '}
                  </span>
                </div>
              );
            }
          }
        } else {
          if (list[i].title === '奖多多集团') {
            list[i].title = (
              <div style={{ minWidth: '10em', display: 'flex' }}>
                {list[i].name}
                <span
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'flex-end',
                    fontSize: 20,
                  }}
                  onClick={e => {
                    setNewVisible(true);
                  }}
                >
                  +
                </span>
              </div>
            );
          } else {
            if (list[i].code === selectGroup.key) {
              list[i].title = (
                <div style={{ minWidth: '10em', display: 'flex', flex: '1' }}>
                  <span style={{ display: 'flex', flex: '1' }}>
                    {list[i].name}
                  </span>
                  {list[i].title === '已删除组' || list[i].title === '默认分组'
                    ? null
                    : more}
                </div>
              );
            } else {
              list[i].title = (
                <div style={{ minWidth: '10em', display: 'flex', flex: '1' }}>
                  <span style={{ display: 'flex', flex: '1' }}>
                    {list[i].name}
                  </span>
                </div>
              );
            }
          }
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(loopdata);
    return loopdata;
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectUserkeys(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  //删除功能
  const handleDeleteGroup = async () => {
    let json: GlobalResParams<string> = await deleteGroup(selectGroup?.id);
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setRemoveGroupVisible(false);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };

  // 新增或者修改
  const newAndChangeGroupOk = async () => {
    let submit;
    if (changeOrNewType === '修改名称') {
      submit = editGroup;
    } else {
      submit = newGroup;
    }

    changeForm.validateFields().then(async values => {
      if (changeOrNewType === '修改名称') {
        values.id = selectGroup.id;
        values.code = selectGroup.key;
        values.parentCode = selectGroup.parentCode;
      } else {
        values.parentCode = selectGroup.key;
      }
      values.status = 1;
      let json: GlobalResParams<string> = await submit(values);
      if (json.status === 200) {
        notification['success']({
          message: json.msg,
          description: '',
        });
        getJson();
        setNewChildGropVisible(false);
      } else {
        notification['error']({
          message: json.msg,
          description: '',
        });
      }
    });
  };
  // 从其他部门移入人员
  const moveInOk = async () => {
    let arr: string[] = [];
    formRef.current?.getvalue().map(item => {
      arr.push(item.key);
    });
    let json: GlobalResParams<string> = await moveInUser(
      selectGroup.key,
      arr.join(','),
    );
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setSelectUserkeys([]);
      setMoveInVisible(false);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };
  // 删除人员
  const deleteUser = async () => {
    let json: GlobalResParams<string> = await deleteUserApi(
      selectUserkeys.join(','),
    );
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setRemoveUserVisible(false);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };
  // 从本部门移出
  const moveOther = async () => {
    let arr: string[] = [];
    formRef.current?.getvalue().map(item => {
      arr.push(item.key);
    });
    let json: GlobalResParams<string> = await moveInUser(
      arr.join(','),
      selectUserkeys.join(','),
    );
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setSelectUserkeys([]);

      setDepartmentVisible(false);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };
  // 设置部门负责人
  const superior = async () => {
    let arr: string[] = [];
    formRef.current?.getvalue().map(item => {
      arr.push(item.key);
    });
    let json: GlobalResParams<string> = await setDepartLeader(
      arr[0] || '',
      selectGroup.key,
    );
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setSuperiorVisible(false);
      setSelectUserParent([]);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };
  // 设置直属上级
  const reportTo = async () => {
    let arr: string[] = [];
    formRef.current?.getvalue().map(item => {
      arr.push(item.key);
    });

    let json: GlobalResParams<string> = await setUserParent(
      selectGroup.key,
      selectUserkeys.join(','),
      arr[0] || '',
    );
    if (json.status === 200) {
      notification['success']({
        message: json.msg,
        description: '',
      });
      getJson();
      setReportToVisible(false);
    } else {
      notification['error']({
        message: json.msg,
        description: '',
      });
    }
  };

  const newAdd = () => {
    newGropForm.validateFields().then(async values => {
      let data = {
        name: values.name,
        parentCode: values.parentCode[0].split('-$-')[0],
        status: 1,
      };

      let res: GlobalResParams<string> = await newGroup(data);
      if (res.status === 200) {
        getJson();
        setNewVisible(false);
      }
    });
  };

  const renderRight = useMemo(() => {
    const tableTitle =
      selectGroup.title === '已删除组' ||
      selectGroup.title === '默认分组' ? null : (
        <div className="table-title">
          <span
            onClick={() => {
              let arr: any[] = [];
              let list = selectGroup.memberList || [];
              list?.map(item => {
                arr.push(item?.code);
              });

              setSelectUserAll(arr);
              setMoveInVisible(true);
            }}
          >
            从其他部门移入
          </span>
          <Divider type="vertical" />
          <span
            onClick={() => {
              if (selectGroup.memberList && selectUserkeys.length) {
                setDepartmentVisible(true);
              } else {
                notification['error']({
                  message: '请选择需要设置的人员',
                  description: '',
                });
              }
            }}
          >
            设置所在部门
          </span>
          <Divider type="vertical" />
          {selectGroup.memberList ? (
            <span
              onClick={() => {
                if (selectGroup.memberList && selectUserkeys.length) {
                  let arr: any[] = [];
                  let list = selectGroup.memberList || [];
                  list?.map(item => {
                    if (selectUserkeys.indexOf(item.code) > -1) {
                      arr.push(item?.parentCode);
                    }
                  });
                  setSelectUserParent(arr);
                  setReportToVisible(true);
                } else {
                  notification['error']({
                    message: '请选择需要设置的人员',
                    description: '',
                  });
                }
              }}
            >
              设置直属上级
            </span>
          ) : null}
          {currentUserList.length ? (
            <>
              <Divider type="vertical" />
              <span
                onClick={() => {
                  if (selectGroup.memberList && selectUserkeys.length) {
                    setRemoveUserVisible(true);
                  } else {
                    notification['error']({
                      message: '请选择需要删除的人员',
                      description: '',
                    });
                  }
                }}
              >
                删除
              </span>
            </>
          ) : null}
        </div>
      );
    const groupTitle =
      selectGroup.title === '已删除组' ||
      selectGroup.title === '默认分组' ? null : (
        <div className="group-title">
          <h1>{selectGroup.title}</h1>
          <div>
            <span
              onClick={() => {
                setChangeOrNewType('修改名称');
                changeForm.setFieldsValue({
                  name: selectGroup.title,
                });
                setNewChildGropVisible(true);
              }}
            >
              修改名称
            </span>
            <Divider type="vertical" />
            <span
              onClick={() => {
                setChangeOrNewType('添加子部门');
                setNewChildGropVisible(true);
                changeForm.setFieldsValue({
                  name: '',
                });
              }}
            >
              添加子部门
            </span>
            <Divider type="vertical" />
            {selectGroup.memberList ? (
              <span
                onClick={() => {
                  selectGroup.memberList?.map(item => {
                    if (item.userType === 2) {
                      setSelectUserParent([item.code]);
                    }
                  });

                  setSuperiorVisible(true);
                }}
              >
                设置部门负责人
              </span>
            ) : null}
          </div>
        </div>
      );
    if (selectGroup.key !== '奖多多集团' && selectGroup.title) {
      return (
        <div className="right-box">
          {selectGroup.title ? groupTitle : null}
          <Table
            key={selectGroup.memberList?.length}
            title={() => {
              return tableTitle;
            }}
            style={{ width: '100%' }}
            columns={columns}
            dataSource={selectGroup.memberList || []}
            rowSelection={rowSelection}
          />
        </div>
      );
    } else {
      return (
        <div className="right-box">{selectGroup.title ? groupTitle : null}</div>
      );
    }
  }, [currentUserList, dataList, selectGroup.memberList, selectUserkeys]);
  return dataList.length ? (
    <Card title="组织架构">
      <div style={{ width: '20%', float: 'left' }}>
        <Search
          type="search"
          placeholder="请搜索"
          onChange={searchChange}
          style={{ marginBottom: 30 }}
        />
        <Tree
          onExpand={onExpand}
          showLine={true}
          treeData={Loop(dataList)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={onTreeSelect}
          selectedKeys={selectedKeys}
          defaultExpandedKeys={expandedKeys}
        />
      </div>
      {renderRight}
      {/* 根目录下新建（+） */}
      <Modal
        key={'newVisible' + newVisible}
        title="新建部门"
        visible={newVisible}
        onCancel={() => {
          setNewVisible(false);
        }}
        onOk={newAdd}
        okText="保存"
        cancelText="取消"
      >
        <Form form={newGropForm}>
          <Form.Item
            label="部门名称"
            name="name"
            rules={[{ required: true, message: '请输入部门名称!' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item
            label="所属部门"
            name="parentCode"
            rules={[{ required: true, message: '请选择所属部门!' }]}
          >
            <OzTreeSlect onlySelect={true} {...props} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改部门名称，新建子部门 */}
      <Modal
        key={'newChildGropVisible' + newChildGropVisible}
        title={changeOrNewType}
        visible={newChildGropVisible}
        onCancel={() => {
          setNewChildGropVisible(false);
        }}
        onOk={() => {
          newAndChangeGroupOk();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={changeForm}>
          <Form.Item
            label="部门名称"
            name="name"
            rules={[{ required: true, message: '请输入部门名称!' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 删除成员 */}
      <Modal
        key={'removeUserVisible' + removeUserVisible}
        title="删除成员"
        visible={removeUserVisible}
        onCancel={() => {
          setRemoveUserVisible(false);
        }}
        onOk={deleteUser}
        okText="确认"
        cancelText="取消"
      >
        <p>删除后，成员的上级属性将完全被清除</p>
      </Modal>
      {/* 从其他部门移入 */}
      <Modal
        key={'moveInVisible' + moveInVisible}
        width="50vw"
        title="从其他部门移入"
        visible={moveInVisible}
        onCancel={() => {
          setMoveInVisible(false);
        }}
        onOk={moveInOk}
        okText="保存"
        cancelText="取消"
      >
        <MoveInOz
          renderUser={true}
          onlySelectUser={true}
          ref={formRef}
          renderDefault={true}
          selectKeys={selectUserAll}
          isLockedPropskey={true}
        />
      </Modal>
      {/* 设置所在部门 */}
      <Modal
        key={'departmentVisible' + departmentVisible}
        width="50vw"
        title="移入其他部门"
        visible={departmentVisible}
        onCancel={() => {
          setDepartmentVisible(false);
        }}
        onOk={moveOther}
        okText="保存"
        cancelText="取消"
      >
        <Organization onlyDepart={true} ref={formRef} onlySelect={true} />
      </Modal>
      {/* 设置部门负责人 */}
      <Modal
        key={'superiorVisible' + superiorVisible}
        width="40vw"
        title="设置部门负责人"
        visible={superiorVisible}
        onCancel={() => {
          setSuperiorVisible(false);
        }}
        onOk={superior}
        okText="保存"
        cancelText="取消"
      >
        <Organization
          renderUser={true}
          onlySelect={true}
          onlySelectUser={true}
          ref={formRef}
          selectKeys={selectUserParent.length ? [selectUserParent[0]] : []}
        />
      </Modal>
      {/* 删除分组 */}
      <Modal
        key={'removeGroupVisible' + removeGroupVisible}
        title="删除部门"
        visible={removeGroupVisible}
        onCancel={() => {
          setRemoveGroupVisible(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setRemoveGroupVisible(false);
            }}
          >
            返回
          </Button>,
          selectGroup?.key === '已删除组' ||
          selectGroup?.key === '默认分组' ||
          selectGroup?.children?.length ||
          selectGroup?.memberList?.length ? null : (
            <Button
              type="primary"
              onClick={() => {
                handleDeleteGroup();
              }}
            >
              确认
            </Button>
          ),
        ]}
      >
        {selectGroup?.key === '已删除组' || selectGroup?.key === '默认分组' ? (
          <div key={selectGroup?.key}>不能删除根部门和系统默认分组</div>
        ) : selectGroup?.children?.length || selectGroup?.memberList?.length ? (
          <div key={selectGroup?.key}>
            请删除此部门下的成员或子部门后，再删除此部门
          </div>
        ) : (
          <div key={selectGroup?.key}>确认删除{selectGroup?.title}？</div>
        )}
      </Modal>
      <Modal
        key={reportToVisible + 'reportToVisible'}
        width="50vw"
        title="设置直属上级"
        visible={reportToVisible}
        onCancel={() => {
          setReportToVisible(false);
        }}
        onOk={reportTo}
        okText="保存"
        cancelText="取消"
      >
        <Organization
          renderUser={true}
          onlySelectUser={true}
          renderDefault={true}
          ref={formRef}
          onlySelect={true}
          selectKeys={selectUserParent.length ? [selectUserParent[0]] : []}
        />
      </Modal>
    </Card>
  ) : (
    <Card title="组织架构"></Card>
  );
};
