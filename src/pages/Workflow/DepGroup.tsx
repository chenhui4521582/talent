import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { tsUserItem } from '@/services/global';
import { useOrganization } from '@/models/global';

interface tsListItem {
  label: string;
  value: string;
  children?: tsListItem[];
}

export default props => {
  const [dataList, setDataList] = useState<tsListItem[]>([]);
  const [keyTitleList, setKeyTitleList] = useState<any[]>([]);
  const { organizationJson } = useOrganization();
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    getJson();
  }, [organizationJson]);

  async function getJson() {
    handleList(organizationJson);
  }

  const handleList = data => {
    const handleItem = list => {
      let keyTitle = keyTitleList;
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].code;
        list[i].label = list[i].name;
        keyTitle.push({
          label: list[i].name,
          value: list[i].value,
        });
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    handleItem(data);
    setDataList(data);
  };
  return (
    <Cascader
      {...props}
      value={value || props.value}
      placeholder="请选择"
      showSearch={true}
      options={dataList}
      style={{ minWidth: '200px', width: '100%' }}
      size="middle"
      onChange={e => {
        setValue(e);
        let labelArr: string[] = [];
        e.map(item => {
          keyTitleList.map(itemObj => {
            if (item === itemObj.value) {
              labelArr.push(itemObj.label);
            }
          });
        });
        props.onChange &&
          props.onChange(e.join(',') + '-$-' + labelArr.join(','));
      }}
    />
  );
};
