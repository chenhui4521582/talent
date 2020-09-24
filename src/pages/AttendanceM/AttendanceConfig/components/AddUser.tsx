// 添加人员部门
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Tree, Input, Divider } from 'antd';
import { useOrganization, usetDefaultOrganization } from '@/models/global';

const { Search } = Input;
interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
  renderDefault?: boolean;
  handleChange?: (value) => void;
}

interface tsUserItem {
  code: string;
  groupCode: string;
  name: string;
  key?: string;
  title?: string;
  userType?: string | number;
  parentCode?: string | null;
  employeeId?: string;
}

export interface tsListItem {
  code: string;
  key?: string;
  title?: string;
  id: number;
  level?: number;
  memberList?: tsUserItem[];
  name: string;
  parentCode?: string | null;
  children?: tsListItem[];
  memberNumber?: number;
}

function Organization(props: tsProps, formRef) {
  const { renderUser, renderDefault } = props;
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
  const [selectItem, setSelectItem] = useState<any[]>([]);
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

    const handleItem = (list, name) => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        if (list[i].level) {
          list[i].organizationName = name + '/' + list[i].name;
        } else {
          list[i].organizationName = name;
        }
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
          handleItem(list[i].children, list[i].organizationName);
        }
      }
    };

    handleItem(data, '奖多多');
    setdepartList(departListkey);
    setUserKeyList(userKeyArr);
    setDataList(data);
    setKeyTitleList(keyTitle);
    setUserList(userList);
  };

  useImperativeHandle(formRef, () => {
    return {
      getvalue: () => {
        return selectItem;
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

  // // 获取获得key
  const onCheck = (keys, e) => {
    const {
      checked,
      node: { key, children, level },
    } = e;
    console.log(e);
    let list = JSON.parse(JSON.stringify(checkedKeys));
    let selectItemArr = JSON.parse(JSON.stringify(selectItem));
    if (checked) {
      if (key === '奖多多集团') {
        children?.map(item => {
          list.push(item.key);
        });
        selectItemArr = selectItemArr.concat(children);
      } else {
        selectItemArr.push(e.node);
      }
      list.push(key);
    } else {
      if (key === '奖多多集团') {
        list.splice(
          list.findIndex(item => item === '奖多多集团'),
          1,
        );
        children?.map(items => {
          list.splice(
            list.findIndex(item => item === items.key),
            1,
          );
          selectItemArr.splice(
            selectItemArr.findIndex(item => item.key === items.key),
            1,
          );
        });
      } else {
        list.splice(
          list.findIndex(item => item === key),
          1,
        );
        selectItemArr.splice(
          selectItemArr.findIndex(item => item.key === key),
          1,
        );
      }
    }
    console.log(list);
    console.log(selectItemArr);
    setSelectItem([...new Set(selectItemArr)]);
    setCheckedKeys([...new Set(list)]);
  };

  const removeCheck = key => {
    let list = JSON.parse(JSON.stringify(checkedKeys));
    let selectItemArr = JSON.parse(JSON.stringify(selectItem));
    list.splice(
      list.findIndex(item => item === key),
      1,
    );

    selectItemArr.splice(
      selectItemArr.findIndex(item => item.key === key),
      1,
    );
    setSelectItem([...new Set(selectItemArr)]);
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
    return selectItem.map(item => {
      return (
        <div key={item.key} style={{ display: 'flex', cursor: 'pointer' }}>
          <span>{item.title}</span>
          <span
            onClick={() => {
              removeCheck(item.key);
            }}
            style={{ marginLeft: 10 }}
          >
            x
          </span>
        </div>
      );
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
          onExpand={onExpand}
          showLine={true}
          treeData={Loop(dataList)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkable={true}
          checkStrictly={true}
          checkedKeys={checkedKeys}
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
