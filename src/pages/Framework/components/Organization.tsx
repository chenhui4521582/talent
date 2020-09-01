import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Tree, Input, Divider } from 'antd';
import { tsListItem, tsUserItem } from '../services/organization';
import { useOrganization, usetDefaultOrganization } from '@/models/global';

const { Search } = Input;
interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
  ref: any;
  onlyDepart?: boolean;
  onlySelect?: boolean;
  propsData?: any[];
  renderDefault?: boolean;
  selectKeys?: string[];
  isLockedPropskey?: boolean;
}

function Organization(props: tsProps, formRef) {
  const {
    renderUser,
    onlySelectUser,
    onlyDepart,
    onlySelect,
    propsData,
    renderDefault,
    selectKeys,
    isLockedPropskey,
  } = props;
  const [dataList, setDataList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['奖多多集团']);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const [userListObj, setUserList] = useState<any>({});
  const [userKeyList, setUserKeyList] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [departList, setdepartList] = useState<any[]>([]);
  const { organizationJson } = useOrganization();
  const { defaultGroupJson } = usetDefaultOrganization();
  useEffect(() => {
    getJson();
  }, [organizationJson]);

  async function getJson() {
    let list = organizationJson;
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
    if (renderDefault) {
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
    }

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

  const handleList = data => {
    let keyTitle = keyTitleList;
    let userList = userListObj;
    let userKeyArr = userKeyList;
    let departListkey = departList;

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
        if (list[i].memberList) {
          departListkey.push(list[i].code);
        }

        if (propsData) {
          userKeyArr.push(list[i].key);
        }

        if (list[i].memberList && list[i].memberList.length) {
          userList[list[i].code] = list[i].memberList;
          if (renderUser) {
            if (list[i].memberList) {
              if (list[i].children) {
                list[i].children = list[i]?.children?.concat(
                  list[i]?.memberList,
                );
              } else {
                list[i].children = list[i]?.memberList;
              }
            }
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

    handleItem(data);
    if (selectKeys?.length && selectKeys) {
      let expandedKey = keyTitle
        .map(item => {
          if (selectKeys.indexOf(item.key) > -1) {
            return getParentKey(item.key, data);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setCheckedKeys(selectKeys);
      setExpandedKeys(expandedKey);
      setAutoExpandParent(true);
    }

    setdepartList(departListkey);
    setUserKeyList(userKeyArr);
    setDataList(data);
    setKeyTitleList(keyTitle);
    setUserList(userList);
  };

  useImperativeHandle(formRef, () => {
    return {
      getvalue: () => {
        let arr: any = [];
        checkedKeys.map(item => {
          keyTitleList.map(u => {
            if (item === u.key) {
              if (userKeyList.indexOf(u.key) > -1) {
                u.type = 'user';
              } else {
                u.type = 'department';
              }
              arr.push(u);
            }
          });
        });
        return arr;
      },
    };
  });

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
    setCheckedKeys(
      isLockedPropskey ? [...new Set(selectKeys?.concat(keyArr))] : keyArr,
    );
  };

  // 获取获得key
  const onCheck = (keys, e) => {
    const {
      checked,
      node: { key },
    } = e;

    if (onlyDepart) {
      if (departList.indexOf(key) > -1) {
        setCheckedKeys([keys.checked[keys.checked.length - 1]]);
        // handleCheckKey(keys.checked, key);
        return;
      } else {
        setCheckedKeys(
          isLockedPropskey
            ? [...new Set(selectKeys?.concat(checkedKeys))]
            : checkedKeys,
        );
        return;
      }
    }

    if (onlySelectUser && checked) {
      if (userKeyList.indexOf(key) > -1) {
        if (onlySelect) {
          setCheckedKeys(
            isLockedPropskey
              ? [
                  ...new Set(
                    selectKeys?.concat([keys.checked[keys.checked.length - 1]]),
                  ),
                ]
              : [keys.checked[keys.checked.length - 1]],
          );
        } else {
          setCheckedKeys(
            isLockedPropskey
              ? [...new Set(selectKeys?.concat(keys.checked))]
              : keys.checked,
          );
        }
      }
    } else {
      if (checked) {
        handleCheckKey(keys.checked, key);
      } else {
        setCheckedKeys(
          isLockedPropskey
            ? [...new Set(selectKeys?.concat(keys.checked))]
            : keys.checked,
        );
      }
    }
  };

  const removeCheck = key => {
    if (isLockedPropskey && selectKeys && selectKeys?.indexOf(key) > -1) {
      return;
    }
    let list = JSON.parse(JSON.stringify(checkedKeys));
    list.splice(
      list.findIndex(item => item === key),
      1,
    );
    setCheckedKeys(list);
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

  const renderSelect = () => {
    return keyTitleList.map(item => {
      return checkedKeys.map(key => {
        if (item.key === key) {
          return (
            <div key={key} style={{ display: 'flex', cursor: 'pointer' }}>
              <span>{item.title}</span>
              <span
                onClick={() => {
                  removeCheck(key);
                }}
                style={{ marginLeft: 10 }}
              >
                x
              </span>
            </div>
          );
        }
      });
    });
  };

  return dataList.length ? (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '22vw' }}>
        <Search
          type="search"
          placeholder="请搜索"
          onChange={searchChange}
          style={{ marginBottom: 30 }}
        />
        <Tree
          style={{
            height: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flex: 1,
          }}
          checkedKeys={checkedKeys}
          onExpand={onExpand}
          showLine={true}
          treeData={Loop(dataList)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkable={true}
          checkStrictly={true}
        />
      </div>
      <Divider
        type="vertical"
        style={{ height: '70vh', width: '2px', margin: '0 1vw' }}
      />
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <p style={{ height: 40, lineHeight: '40px', marginBottom: 30 }}>
          选中列表
        </p>
        <div
          style={{ height: '60vh', overflowY: 'auto', flexDirection: 'column' }}
        >
          {renderSelect()}
        </div>
      </div>
    </div>
  ) : null;
}

export default forwardRef(Organization);
