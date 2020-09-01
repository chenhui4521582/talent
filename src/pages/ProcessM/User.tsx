import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { tsUserItem } from '@/services/global';
import {
  useOrganization,
  usetDeleteOrganization,
  usetDefaultOrganization,
} from '@/models/global';

interface tsListItem {
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
  employeeId?: string;
}

interface tsProps {
  renderUser?: boolean;
  onlySelectUser?: boolean;
  onlySelect?: boolean;
  onChange?: any;
  value?: any;
}

export default (props: tsProps) => {
  const { renderUser, value } = props;
  const [dataList, setDataList] = useState<any>([]);
  const [userList, setUserList] = useState<String[]>([]);
  const [mount, setMount] = useState<boolean>(false);
  const { organizationJson } = useOrganization();
  const { deleteGroupJson } = usetDeleteOrganization();
  const { defaultGroupJson } = usetDefaultOrganization();

  useEffect(() => {
    getJson();
  }, [organizationJson]);

  async function getJson() {
    let list = organizationJson;
    if (organizationJson && organizationJson.length) {
      setMount(true);
    }

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
  }

  const handleList = data => {
    let keyTitle = userList;
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        list[i].value = list[i].code;
        if (list[i].employeeId) {
          list[i].title = list[i].name + '-' + list[i].employeeId;
          list[i].value = list[i].code;
          list[i].key = list[i].name + '-' + list[i].employeeId;
          keyTitle.push(list[i].value);
        }
        if (list[i].memberList && list[i].memberList.length) {
          if (renderUser) {
            list[i].children = list[i].memberList;
          }
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    handleItem(data);
    setDataList(data);
    setUserList(keyTitle);
  };

  const onChange = value => {
    if (userList.indexOf(value) > -1) {
      props.onChange && props.onChange(value);
      return;
    }
    props.onChange && props.onChange(undefined);
  };

  return (
    <TreeSelect
      value={value}
      placeholder="请选择"
      showSearch={true}
      treeData={dataList}
      onChange={onChange}
      size="middle"
      allowClear
      treeNodeFilterProp="title"
    />
  );
};
