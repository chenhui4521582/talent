import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { getOrganization, tsListItem } from '../services/organization';
import { GlobalResParams } from '@/types/ITypes';

interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
  onlySelect?: boolean;
  id: number;
}

export default (props: tsProps) => {
  const { renderUser, onlySelectUser, onlySelect } = props;
  const [dataList, setDataList] = useState<any>([]);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [userKeyList, setUserKeyList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [values, setValues] = useState<string[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<any[]>([]);
  const [expandAll, setExpandAll] = useState<boolean>(false);

  useEffect(() => {
    getJson();
  }, []);

  async function getJson() {
    let organizationJson: GlobalResParams<tsListItem[]> = await getOrganization();
    if (organizationJson.status === 200) {
      let list = organizationJson.obj;
      handleList(list);
    }
  }

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
          id: list[i].id,
          parentCode: list[i].parentCode,
          memberList: list[i].memberList,
          children: list[i].children,
          type:
            list[i].memberList && list[i].memberList.length
              ? 'user'
              : 'department',
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
      }
    };

    console.log('data');
    console.log(data);
    setUserKeyList(userKeyArr);
    handleItem(data);
    setDataList(data);
    setKeyTitleList(keyTitle);
    setUserList(userList);
  };

  const loop = data => {
    let loopdata = JSON.parse(JSON.stringify(data));

    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        if (searchValue.length && list[i].title.indexOf(searchValue) > -1) {
          const index = list[i].title.indexOf(searchValue);
          const beforeStr = list[i].title.substr(0, index);
          const afterStr = list[i].title.substr(index + searchValue.length);
          list[i].title = (
            <div>
              {beforeStr}
              <span style={{ color: 'red' }}>{searchValue}</span>
              {afterStr}
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
    props.onChange(keyArr);
  };

  const onChange = value => {
    if (onlySelect) {
      if (onlySelectUser) {
        if (userKeyList.indexOf(value) > -1) {
          setValues(value);
          keyTitleList.map(item => {
            if (item.key === value) {
              props.onChange(`${value}-$-${item.title}`);
            }
          });
          return;
        } else {
          props.onChange([]);
          setValues([]);
          return;
        }
      }
      keyTitleList.map(item => {
        if (item.key === value) {
          props.onChange(`${value}-$-${item.title}`);
        }
      });
      setValues(value);
    } else {
      handleCheckKey(value, value[value.length - 1]);
    }
  };

  const getParentKey = keys => {
    let parentKey: string[] = [];
    let newData = JSON.parse(JSON.stringify(dataList));

    const handleItem = (list, key) => {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (key === item.code) {
          if (item.parentCode) {
            parentKey.push(item.parentCode);
            handleItem(newData, item.parentCode);
            // break;
          }

          if (item.groupCode) {
            parentKey.push(item.groupCode);
            handleItem(newData, item.groupCode);
            // break;
          }
        }
        if (item.children) {
          handleItem(item.children, key);
        }
      }
    };
    handleItem(newData, keys);
    console.log(parentKey);
    return parentKey;
  };

  const searchChange = (e): void => {
    setExpandAll(true);
    setSearchValue(e);
  };

  const onTreeExpand = expandedKeys => {
    setExpandAll(false);
    setTreeExpandedKeys(expandedKeys);
  };
  return (
    <TreeSelect
      {...props}
      placeholder="请选择"
      showSearch={true}
      treeData={loop(dataList)}
      treeDefaultExpandAll={expandAll}
      onTreeExpand={onTreeExpand}
      style={{ minWidth: '200px', width: '100%' }}
      onSearch={searchChange}
      multiple={!onlySelect}
      onChange={onChange}
      value={values}
    />
  );
};
