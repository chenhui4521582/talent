import React, { useState, useEffect } from 'react';
import { Card, Tree, Input } from 'antd';
import json from './services/json';

const { Search } = Input;
export default () => {
  const [dataList, setDataList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  useEffect(() => {
    if (json.status === 200) {
      let list = json.obj;
      handleList(list);
    }
  }, []);

  const handleList = data => {
    let keyTitle = keyTitleList;
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        keyTitle.push({
          key: list[i].code,
          title: list[i].name,
        });

        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(data);
    setDataList(data);
    setKeyTitleList(keyTitle);
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

  return (
    <Card title="组织架构">
      <Search type="search" placeholder="请搜索" onChange={searchChange} />
      <Tree
        key={searchValue}
        onExpand={onExpand}
        showLine={true}
        treeData={Loop(dataList)}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      />
    </Card>
  );
};
