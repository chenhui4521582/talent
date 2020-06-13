import React, { useState, useEffect } from 'react';
import { Input, TreeSelect } from 'antd';
import json from '../services/json';

const { Search } = Input;
interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
}

export default (props: tsProps) => {
  const { renderUser, onlySelectUser } = props;
  const [dataList, setDataList] = useState<any>([]);

  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [userKeyList, setUserKeyList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (json.status === 200) {
      let list = json.obj;
      let newObj: any = {};
      newObj.key = '奖多多集团';
      newObj.title = '奖多多集团';
      newObj.code = '奖多多集团';
      newObj.name = '奖多多集团';
      newObj.value = '奖多多集团';
      newObj.children = list;
      handleList([newObj]);
    }
  }, []);

  const handleList = data => {
    let keyTitle = keyTitleList;
    let userList = userListObj;
    let userKeyArr = userKeyList;
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        list[i].value = list[i].code;
        keyTitle.push({
          key: list[i].code,
          title: list[i].name,
        });
        if (list[i].memberList && list[i].memberList.length) {
          userList[list[i].code] = list[i].memberList;
          if (renderUser) {
            list[i].children = list[i].memberList;
          }
          list[i].memberList.map(item => {
            userKeyArr.push(item.code);
          });
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
        if (list[i].level === 1) {
          list[i].parentCode = '奖多多集团';
        }
      }
    };
    console.log(data);
    setUserKeyList(userKeyArr);
    handleItem(data);
    setDataList(data);
    setKeyTitleList(keyTitle);
    setUserList(userList);
  };

  const onSearch = value => {
    setSearchValue(value);
    console.log(value);
  };

  const loop = data => {
    let loopdata = JSON.parse(JSON.stringify(data));

    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        if (searchValue.length && list[i].value.indexOf(searchValue) > -1) {
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
  const onChange = e => {
    console.log(e);
  };

  return (
    <TreeSelect
      // searchValue=''
      placeholder="请选择"
      multiple={true}
      showSearch={true}
      treeData={loop(dataList)}
      style={{ width: '200px' }}
      onSearch={onSearch}
      onChange={onChange}
    />
  );
};

// searchValue
// filterTreeNode
