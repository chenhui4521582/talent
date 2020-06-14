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
  const [values, setValues] = useState<string[]>([]);
  const [selectKeys, setSelectKeys] = useState<string[]>([]);

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

  // 查找选择后取消祖父节点跟曾子节点的选准状态
  const handleCheckKey = (keys, key) => {
    let fatherArr: string[] = [];
    let childrenArr: string[] = [];

    const handleFater = code => {
      fatherArr.push(code);
      newData.map(item => {
        if (item.parentCode) {
          handleFater(item.parentCode);
        } else {
          return;
        }
      });
    };

    const handleChildren = list => {
      list.map(item => {
        childrenArr.push(item.code);
        if (item.children) {
          handleChildren(item.children);
        } else {
          return;
        }
      });
    };

    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];

        if (key === item.code) {
          if (item.parentCode) {
            handleFater(item.parentCode);
          }
          if (item.children) {
            handleChildren(item.children);
          }
          break;
        }
        if (item.children) {
          handleItem(item.children);
        }
      }
    };

    let newData = JSON.parse(JSON.stringify(dataList));
    handleItem(newData);
    let newList = fatherArr.concat(childrenArr);
    let keyArr = JSON.parse(JSON.stringify(keys));
    console.log(keyArr);
    newList.map(k => {
      if (keyArr.indexOf(k) > -1) {
        keyArr.splice(keyArr.indexOf(k), 1);
      }
    });
    console.log(keyArr);
    setValues(keyArr);
  };

  const onChange = value => {
    console.log(value);
    console.log(value[value.length - 1]);
    // setValues(value);
    handleCheckKey(value, value[value.length - 1]);
  };

  return (
    <TreeSelect
      // searchValue=''
      placeholder="请选择"
      multiple={true}
      showSearch={true}
      treeData={loop(dataList)}
      style={{ minWidth: '200px', width: '100%' }}
      onSearch={onSearch}
      onChange={onChange}
      value={values}
    />
  );
};
