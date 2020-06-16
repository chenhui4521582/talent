import React, { useState, useEffect, useMemo } from 'react';
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
} from 'antd';
import {
  getOrganization,
  getDeleteGroup,
  getDefaultGroup,
  deleteGroup,
  tsListItem,
  tsDeleteItem,
  tsDefaultItem,
  tsSlectGroup,
  tsUserItem,
} from './services/organization';
import Organization from './components/Organization';
import OzTreeSlect from './components/OzTreeSlect';
import { GlobalResParams } from '@/types/ITypes';
import './style/organization.less';
const { Search } = Input;

const columns: any = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'groupCode',
    key: 'groupCode',
  },
  {
    title: '住址',
    dataIndex: 'code',
    key: 'code',
  },
];

export default () => {
  const [newGropForm] = Form.useForm();
  const [changeForm] = Form.useForm();
  const [dataList, setDataList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  //所有的列表item
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  // 选择组下面人的对象
  const [userListObj, setUserList] = useState<any>({});
  // 当前的选准的组对象下面的人
  const [currentUserList, setCurrentUserList] = useState<any[]>([]);
  // 鼠标划入treeItem的选项
  const [hoverItemCode, setHoverItemCode] = useState<string>('');
  // 点击选准的treeitem
  const [selectGroup, setSelectGroup] = useState<tsSlectGroup>({
    title: '',
    key: '',
  });
  // 存储 换气菜单的item；
  const [hoverSelect, setHoverSelect] = useState<tsListItem | undefined>();
  // 接了解决点击弹窗的一个bug
  const [flag, setFlag] = useState<Boolean>(true);
  // 因为新建子部门跟，修改部门名称是同一个   modal
  const [newChildGropVisible, setNewChildGropVisible] = useState<boolean>(
    false,
  );
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
  // 设置上级 modal
  const [superiorVisible, setSuperiorVisible] = useState<boolean>(false);
  // 删除分组
  const [removeGroupVisible, setRemoveGroupVisible] = useState<boolean>(false);

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
      let deleteGroupList: tsListItem[] = [];
      for (let i = 0; i < deleteGroupJson.obj.length; i++) {
        deleteGroupList.push({
          key: deleteGroupJson.obj[i].userCode,
          title: deleteGroupJson.obj[i].trueName,
          code: deleteGroupJson.obj[i].userCode,
          parentCode: '已删除组',
          name: deleteGroupJson.obj[i].trueName,
        });
      }
      let deleteGroupObj: tsListItem = {
        code: '已删除组',
        name: '已删除组',
        parentCode: '奖多多集团',
        key: '已删除组',
        title: '已删除组',
        children: deleteGroupList,
      };

      list.push(deleteGroupObj);

      let defaulGroupList: tsUserItem[] = [];
      for (let i = 0; i < defaultGroupJson.obj.length; i++) {
        defaulGroupList.push({
          key: defaultGroupJson.obj[i].userCode,
          title: defaultGroupJson.obj[i].trueName,
          code: defaultGroupJson.obj[i].userCode,
          groupCode: '已删除组',
          name: defaultGroupJson.obj[i].trueName,
        });
      }

      let defaultGroupObj: tsListItem = {
        code: '默认分组',
        name: '默认分组',
        parentCode: '奖多多集团',
        key: '默认分组',
        title: '默认分组',
        memberList: defaulGroupList,
      };

      list.push(defaultGroupObj);

      console.log(list);

      let newObj: tsListItem = {
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
    let keyTitle = keyTitleList;
    let userList = userListObj;
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        keyTitle.push({
          key: list[i].code,
          title: list[i].name,
        });
        if (list[i].memberList && list[i].memberList.length) {
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

  const onTreeSelect = e => {
    setSelectedKeys(e);
    keyTitleList.map(item => {
      if (item.key === e[0]) {
        setSelectGroup(item);
      }
    });

    if (userListObj[e]) {
      setCurrentUserList(userListObj[e]);
    } else {
      setCurrentUserList([]);
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
          setSelectedKeys([hoverItemCode]);
        }}
      >
        <Popconfirm
          title={
            <div className="hover">
              <p
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFlag(true);
                  setChangeOrNewType('添加子部门');
                  setNewChildGropVisible(true);
                  setHoverItemCode('');
                }}
              >
                添加子部门
              </p>
              <p
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFlag(true);
                  setChangeOrNewType('修改名称');
                  setNewChildGropVisible(true);
                  setHoverItemCode('');
                }}
              >
                修改名称
              </p>
              <p
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFlag(true);
                  setSuperiorVisible(true);
                  setHoverItemCode('');
                }}
              >
                设置上级
              </p>
              <p
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFlag(true);
                  setRemoveGroupVisible(true);
                  setHoverItemCode('');
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
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedKeys([hoverItemCode]);
              setFlag(false);
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
                  onClick={e => {
                    setSelectedKeys([hoverItemCode]);
                    setNewVisible(true);
                  }}
                >
                  +
                </span>
              </div>
            );
          } else {
            if (list[i].code === hoverItemCode) {
              list[i].title = (
                <div
                  style={{ minWidth: '10em', display: 'flex' }}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <span style={{ flex: 1, display: 'flex' }}>
                    {beforeStr}{' '}
                    <span style={{ color: 'red' }}>{searchValue}</span>{' '}
                    {afterStr}{' '}
                  </span>
                  {more}
                </div>
              );
            } else {
              list[i].title = (
                <div
                  style={{ minWidth: '10em', display: 'flex' }}
                  onMouseOver={e => {
                    e.preventDefault();
                    setHoverItemCode(list[i].code);
                    setHoverSelect(list[i]);
                  }}
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
            if (list[i].code === hoverItemCode) {
              list[i].title = (
                <div
                  style={{ minWidth: '10em', display: 'flex', flex: '1' }}
                  onMouseLeave={e => {
                    if (flag) {
                      setHoverItemCode('');
                    }
                  }}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <span style={{ display: 'flex', flex: '1' }}>
                    {list[i].name}
                  </span>
                  {more}
                </div>
              );
            } else {
              list[i].title = (
                <div
                  style={{ minWidth: '10em', display: 'flex', flex: '1' }}
                  onMouseEnter={e => {
                    e.preventDefault();
                    setHoverItemCode(list[i].code);
                    setHoverSelect(list[i]);
                  }}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
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
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
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
          onClick={() => {
            setMoveInVisible(true);
          }}
        >
          从其他部门移入
        </span>
        <Divider type="vertical" />
        <span
          onClick={() => {
            setDepartmentVisible(true);
          }}
        >
          设置所在部门
        </span>
        {currentUserList.length ? (
          <>
            <Divider type="vertical" />
            <span
              onClick={() => {
                setRemoveUserVisible(true);
              }}
            >
              删除
            </span>
          </>
        ) : null}
      </div>
    );
    const groupTitle = (
      <div className="group-title">
        <h1>{selectGroup.title}</h1>
        <div>
          <span
            onClick={() => {
              setFlag(true);
              setChangeOrNewType('修改名称');
              setNewChildGropVisible(true);
            }}
          >
            修改名称
          </span>
          <Divider type="vertical" />
          <span
            onClick={() => {
              setFlag(true);
              setChangeOrNewType('添加子部门');
              setNewChildGropVisible(true);
            }}
          >
            添加子部门
          </span>
          <Divider type="vertical" />
          <span
            onClick={() => {
              setFlag(true);
              setSuperiorVisible(true);
            }}
          >
            设置上级
          </span>
        </div>
      </div>
    );

    if (currentUserList.length) {
      return (
        <div className="right-box">
          {selectGroup.title ? groupTitle : null}
          <Table
            title={() => {
              return tableTitle;
            }}
            style={{ width: '100%' }}
            columns={columns}
            dataSource={currentUserList}
            rowSelection={rowSelection}
          />
        </div>
      );
    } else {
      return (
        <div className="right-box">{selectGroup.title ? groupTitle : null}</div>
      );
    }
  }, [currentUserList]);

  //删除功能
  const handleDeleteGroup = async () => {
    let json: GlobalResParams<string> = await deleteGroup(hoverSelect?.code);
    if (json.status === 200) {
      getJson();
    }
  };

  return (
    <Card title="组织架构">
      <div style={{ width: '20%', float: 'left' }}>
        <Search
          type="search"
          placeholder="请搜索"
          onChange={searchChange}
          style={{ marginBottom: 30 }}
        />
        <Tree
          key={searchValue}
          onExpand={onExpand}
          showLine={true}
          onRightClick={e => {
            console.log(e);
          }}
          treeData={Loop(dataList)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={onTreeSelect}
          selectedKeys={selectedKeys}
        />
      </div>
      {renderRight}
      {/* 根目录下新建（+） */}
      <Modal
        title="新建部门"
        visible={newVisible}
        onCancel={() => {
          setNewVisible(false);
        }}
        onOk={() => {
          newGropForm.submit();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={newGropForm}>
          <Form.Item
            label="部门名称"
            name="userName"
            rules={[{ required: true, message: '请输入部门名称!' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item
            label="所属部门"
            name="gropName"
            rules={[{ required: true, message: '请选择所属部门!' }]}
          >
            <OzTreeSlect />
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改部门名称，新建子部门 */}
      <Modal
        title={changeOrNewType}
        visible={newChildGropVisible}
        onCancel={() => {
          setNewChildGropVisible(false);
        }}
        onOk={() => {
          changeForm.submit();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={changeForm}>
          <Form.Item
            label="部门名称"
            name="userName"
            rules={[{ required: true, message: '请输入部门名称!' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 删除成员 */}
      <Modal
        title="删除成员"
        visible={removeUserVisible}
        onCancel={() => {
          setRemoveUserVisible(false);
        }}
        onOk={() => {
          setRemoveUserVisible(false);
        }}
        okText="保存"
        cancelText="取消"
      >
        <p>删除后，成员的上级属性将完全被清除</p>
      </Modal>
      {/* 从其他部门移入 */}
      <Modal
        width="50vw"
        title="从其他部门移入"
        visible={moveInVisible}
        onCancel={() => {
          setMoveInVisible(false);
        }}
        onOk={() => {
          //  changeForm.submit()
        }}
        okText="保存"
        cancelText="取消"
      >
        <Organization renderUser={true} />
      </Modal>
      {/* 设置所在部门 */}
      <Modal
        width="50vw"
        title="从其他部门移入"
        visible={departmentVisible}
        onCancel={() => {
          setDepartmentVisible(false);
        }}
        onOk={() => {
          //  changeForm.submit()
        }}
        okText="保存"
        cancelText="取消"
      >
        <Organization renderUser={true} />
      </Modal>
      {/* 设置上级 */}
      <Modal
        width="50vw"
        title="设置上级"
        visible={superiorVisible}
        onCancel={() => {
          setSuperiorVisible(false);
        }}
        onOk={() => {
          //  changeForm.submit()
        }}
        okText="保存"
        cancelText="取消"
      >
        <Organization renderUser={true} onlySelectUser={true} />
      </Modal>
      {/* 删除分组 */}
      <Modal
        width="50vw"
        title="删除分组"
        visible={removeGroupVisible}
        onCancel={() => {
          setRemoveGroupVisible(false);
          setHoverSelect(undefined);
        }}
        footer={[
          <Button
            onClick={() => {
              setRemoveGroupVisible(false);
              setHoverSelect(undefined);
            }}
          >
            返回
          </Button>,
          hoverSelect?.code === '已删除组' ||
          hoverSelect?.code === '默认分组' ||
          hoverSelect?.children?.length ||
          hoverSelect?.memberList?.length ? null : (
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
        {hoverSelect?.code === '已删除组' ||
        hoverSelect?.code === '默认分组' ? (
          <div>不能删除根部门和系统默认分组</div>
        ) : hoverSelect?.children?.length || hoverSelect?.memberList?.length ? (
          <div>请删除此部门下的成员或子部门后，再删除此部门</div>
        ) : (
          <div>是否删除${hoverSelect?.name}部门？</div>
        )}
      </Modal>
    </Card>
  );
};
