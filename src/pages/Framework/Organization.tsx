import React, { useState, useEffect } from 'react';
import { Card, Tree, Input, Button, Modal, Table, Divider, Form } from 'antd';
import json from './services/json';

const { Search } = Input;
export default () => {
  const [dataList, setDataList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [currentUserList, setCurrentUserList] = useState<any[]>([]);
  const [orVisible, setOrVisible] = useState<boolean>(false);
  useEffect(() => {
    if (json.status === 200) {
      let list = json.obj;
      console.log(json);
      handleList(list);
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
    console.log(keyTitleList);
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

    console.log('expandedKeys1');
    console.log(expandedKey);
    setExpandedKeys(expandedKey);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onTreeSelect = e => {
    console.log(userListObj);
    console.log(userListObj[e]);
    if (userListObj[e]) {
      setCurrentUserList(userListObj[e]);
    } else {
      setCurrentUserList([]);
    }
  };

  const Loop = data => {
    let loopdata = JSON.parse(JSON.stringify(data));
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        if (searchValue.length && list[i].name.indexOf(searchValue) > -1) {
          const index = list[i].title.indexOf(searchValue);
          const beforeStr = list[i].title.substr(0, index);
          const afterStr = list[i].title.substr(index + searchValue.length);
          list[i].title = (
            <div>
              {' '}
              {beforeStr} <span style={{ color: 'red' }}>{searchValue}</span>{' '}
              {afterStr}{' '}
            </div>
          );
        } else {
          list[i].title = list[i].name;
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(loopdata);
    return loopdata;
  };

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

  return (
    <Card title="组织架构">
      <div style={{ width: '20%', float: 'left' }}>
        <Search
          type="search"
          placeholder="请搜索"
          onChange={searchChange}
          style={{ marginBottom: 30 }}
        />
        <Button
          onClick={() => {
            setOrVisible(true);
          }}
        >
          操作
        </Button>
        <Tree
          key={searchValue}
          onExpand={onExpand}
          showLine={true}
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
        />
      </div>
      <Modal
        title="操作"
        visible={orVisible}
        onCancel={() => {
          setOrVisible(false);
        }}
        footer={null}
      >
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          添加子部门
        </Button>
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          修改名称
        </Button>
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          设置上级
        </Button>
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          删除
        </Button>
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          上移
        </Button>
        <Button style={{ display: 'block', width: 140, margin: '20px auto' }}>
          下移
        </Button>
      </Modal>
    </Card>
  );
};
