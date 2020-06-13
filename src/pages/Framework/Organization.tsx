import React, { useState, useEffect } from 'react';
import {
  Card,
  Tree,
  Input,
  Button,
  Modal,
  Table,
  Divider,
  Popconfirm,
  Select,
  Form,
} from 'antd';
import json from './services/json';
import Organization from './components/Organization';
import OzTreeSlect from './components/OzTreeSlect';
const { Option } = Select;
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
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <span>
        <a onClick={e => alert(1)}>修改</a>
        <Divider type="vertical" />
        <a onClick={e => alert(2)}>删除</a>
      </span>
    ),
  },
];

export default () => {
  const [newGropForm] = Form.useForm();
  const [changeForm] = Form.useForm();
  const [dataList, setDataList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [currentUserList, setCurrentUserList] = useState<any[]>([]);

  const [hoverItemCode, setHoverItemCode] = useState<string>('');
  const [flag, setFlag] = useState<Boolean>(true);
  const [popconfirm, setPopconfirm] = useState<Boolean>(true);

  // 因为新建子部门跟，修改部门名称是同一个modal
  const [newChildGropVisible, setNewChildGropVisible] = useState<boolean>(
    false,
  );
  const [newGropVisible, setNewGropVisible] = useState<boolean>(false);
  const [removeVisible, setRemoveVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  useEffect(() => {
    if (json.status === 200) {
      let list = json.obj;
      let newObj: any = {};
      newObj.key = '奖多多集团';
      newObj.title = '奖多多集团';
      newObj.code = '奖多多集团';
      newObj.name = '奖多多集团';
      newObj.children = list;
      handleList([newObj]);
    }
  }, []);

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
          flex: '1',
          justifyContent: 'flex-end',
        }}
      >
        <Popconfirm
          title={
            <div>
              <p>添加子部门</p>
              <p
                onClick={() => {
                  setNewChildGropVisible(true);
                }}
              >
                修改名称
              </p>
              <p>设置上级</p>
              <p
                onClick={() => {
                  setFlag(true);
                  setRemoveVisible(true), setHoverItemCode('');
                }}
              >
                删除
              </p>
              <p>上移</p>
              <p>下移</p>
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
              width: '2em',
              justifyContent: 'flex-end',
            }}
            onClick={() => {
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
              <div style={{ width: '8em', display: 'flex' }}>
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
                    e.preventDefault();
                    setNewGropVisible(true);
                  }}
                >
                  +
                </span>
              </div>
            );
          } else {
            if (list[i].code === hoverItemCode) {
              list[i].title = (
                <div style={{ width: '8em', display: 'flex' }}>
                  {' '}
                  {beforeStr}{' '}
                  <span style={{ color: 'red' }}>{searchValue}</span> {afterStr}
                  {more}
                </div>
              );
            } else {
              list[i].title = (
                <div
                  style={{ width: '8em' }}
                  onMouseOver={e => {
                    e.preventDefault();
                    setHoverItemCode(list[i].code);
                  }}
                >
                  {' '}
                  {beforeStr}{' '}
                  <span style={{ color: 'red' }}>{searchValue}</span> {afterStr}{' '}
                </div>
              );
            }
          }
        } else {
          if (list[i].title === '奖多多集团') {
            list[i].title = (
              <div style={{ width: '8em', display: 'flex' }}>
                {list[i].name}
                <span
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'flex-end',
                    fontSize: 20,
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setNewGropVisible(true);
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
                  style={{ width: '8em', display: 'flex', flex: '1' }}
                  onMouseLeave={e => {
                    if (flag) {
                      setHoverItemCode('');
                    }
                  }}
                >
                  <span>{list[i].name}</span>
                  {more}
                </div>
              );
            } else {
              list[i].title = (
                <div
                  style={{ width: '8em', display: 'flex', flex: '1' }}
                  onMouseEnter={e => {
                    e.preventDefault();
                    setHoverItemCode(list[i].code);
                  }}
                >
                  <span>{list[i].name}</span>
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
  console.log(hoverItemCode);
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
        />
      </div>
      <div
        style={{
          margin: '5%',
          float: 'left',
          width: '70%',
          height: '100%',
        }}
      >
        <Table
          style={{ width: '100%' }}
          columns={columns}
          dataSource={currentUserList}
          rowSelection={rowSelection}
        />
      </div>
      {/* 根目录下新建（+） */}
      <Modal
        zIndex={9999999}
        title="新建部门"
        visible={newGropVisible}
        onCancel={() => {
          setNewGropVisible(false);
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
            <Select placeholder="请选择所属部门">
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改部门名称，新建子部门 */}
      <Modal
        zIndex={9999999}
        title="修改部门名称"
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
      {/* 删除 */}
      <Modal
        zIndex={9999999}
        title="删除成员"
        visible={removeVisible}
        onCancel={() => {
          setNewChildGropVisible(false);
        }}
        onOk={() => {
          //  changeForm.submit()
        }}
        okText="保存"
        cancelText="取消"
      >
        <p>删除后，成员的上级属性将完全被清除</p>
      </Modal>

      <Modal
        // zIndex={9999999}
        width="50vw"
        title="设置所在部门"
        visible={true}
        onCancel={() => {
          // setNewChildGropVisible(false);
        }}
        onOk={() => {
          //  changeForm.submit()
        }}
        okText="保存"
        cancelText="取消"
      >
        {/* <Organization renderUser={true} onlySelectUser={true} /> */}
        <OzTreeSlect />
      </Modal>
    </Card>
  );
};
