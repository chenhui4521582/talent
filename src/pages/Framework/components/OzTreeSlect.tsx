import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { tsListItem } from '../services/organization';
import { tsUserItem } from '@/services/global';
import {
  useOrganization,
  usetDeleteOrganization,
  usetDefaultOrganization,
} from '@/models/global';

interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
  onlySelect?: boolean;
  onlySelectLevel?: number;
  onChange?: any;
  value?: any;
}

export default (props: tsProps) => {
  const { renderUser, onlySelectUser, onlySelect, onlySelectLevel } = props;
  const [dataList, setDataList] = useState<any>([]);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [userKeyList, setUserKeyList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [values, setValues] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [once, setOnce] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean>(false);
  const [levelKeys, setLevelKeys] = useState<string[]>([]);
  const { organizationJson } = useOrganization();
  const { deleteGroupJson } = usetDeleteOrganization();
  const { defaultGroupJson } = usetDefaultOrganization();

  useEffect(() => {
    getJson();
  }, [organizationJson]);

  useEffect(() => {
    if (props?.value) {
      if (!once && mount) {
        setValues(props?.value?.split('-$-')[0].split(','));
      }
    }
  }, [props?.value, once, mount]);

  async function getJson() {
    let list = organizationJson;
    let deleteGroupList: tsUserItem[] = [];
    for (let i = 0; i < deleteGroupJson.length; i++) {
      deleteGroupList.push({
        key: deleteGroupJson[i].userCode,
        title: deleteGroupJson[i].trueName,
        code: deleteGroupJson[i].userCode,
        groupCode: '已删除组',
        name: deleteGroupJson[i].trueName,
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
    for (let i = 0; i < defaultGroupJson?.length; i++) {
      defaulGroupList.push({
        key: defaultGroupJson[i].userCode,
        title: defaultGroupJson[i].trueName,
        code: defaultGroupJson[i].userCode,
        groupCode: '默认分组',
        name: defaultGroupJson[i].trueName,
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

    handleList(list);
    setMount(true);
  }

  const handleList = data => {
    let keyTitle = keyTitleList;
    let userList = userListObj;
    let userKeyArr = userKeyList;
    let levelKeysArr = levelKeys;
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
        if (onlySelectLevel && onlySelectLevel === list[i].level) {
          levelKeysArr.push(list[i].code);
          list[i].children = [];
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    setLevelKeys(levelKeysArr);
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
        list[i].key = list[i].code + '';
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
    newList.map(k => {
      if (keyArr.indexOf(k) > -1) {
        keyArr.splice(keyArr.indexOf(k), 1);
      }
    });
    setValues(keyArr);
    let formArr: any = [];
    keyTitleList.map(item => {
      if (keyArr.indexOf(item.key)) {
        formArr.push(`${item.key}-$-${item.title}`);
      }
    });

    props.onChange(formArr);
  };

  const onChange = value => {
    setOnce(true);
    if (onlySelect) {
      if (onlySelectUser) {
        if (userKeyList.indexOf(value) > -1) {
          setValues(value);
          keyTitleList.map(item => {
            if (item.key === value) {
              setValues(value);
              props.onChange([`${value}-$-${item.title}`]);
            }
          });
        } else {
          props.onChange([]);
          setValues([]);
        }
      } else if (onlySelectLevel) {
        if (levelKeys.indexOf(value) > -1) {
          setValues(value);
          props.onChange(value);
        }
      } else {
        setValues(value);
        keyTitleList.map(item => {
          if (item.key === value) {
            setValues(value);
            props.onChange([`${value}-$-${item.title}`]);
          }
        });
      }
    } else {
      if (onlySelectUser) {
        let arr: any = [];
        let formArr: any = [];
        value.map(item => {
          if (userKeyList.indexOf(item) > -1) {
            keyTitleList.map(u => {
              if (u.key === item) {
                formArr.push(`${item}-$-${u.title}`);
              }
            });
            arr.push(item);
          }
        });

        setValues(arr);
        props.onChange(formArr);
      } else {
        handleCheckKey(value, value[value.length - 1]);
      }
    }
  };

  const searchChange = (e): void => {
    setExpandAll(true);
    setSearchValue(e);
  };

  const onTreeExpand = expandedKeys => {
    setExpandAll(false);
  };
  return (
    <TreeSelect
      {...props}
      value={values}
      placeholder="请选择"
      showSearch={true}
      treeData={loop(dataList)}
      treeDefaultExpandAll={expandAll}
      onTreeExpand={onTreeExpand}
      style={{ minWidth: '200px', width: '100%' }}
      size="middle"
      onSearch={searchChange}
      multiple={!onlySelect}
      onChange={onChange}
    />
  );
};