import React, { useState, useMemo, useEffect } from 'react';
import { Transfer, Collapse } from 'antd';
import { GlobalResParams } from '@/types/ITypes';

const { Panel } = Collapse;

interface listItem {
  id: string;
  isGroup: 0 | 1;
  name: string;
  type: string;
  key: string;
  title: string;
  labelName: string;
}

interface tsProps {
  header: string;
  match?: any;
  apiList: (any) => Promise<any>;
  change: any;
  selectKeys: any[];
}

export default (props: tsProps) => {
  const id = props.match.params.id;
  const { header, apiList, change } = props;
  const [list, setList] = useState<listItem[]>([]);
  const [keyList, setKeyList] = useState<string[]>([]);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    let res: GlobalResParams<listItem[]> = await apiList(id);
    if (res.status === 200) {
      let obj: listItem[] = JSON.parse(JSON.stringify(res.obj));
      for (let i = 0; i < obj.length; i++) {
        obj[i].key = obj[i].id;
        obj[i].title = obj[i].name || obj[i]?.labelName;
      }

      setList(obj);
    }
  };

  const handleChange = targetKeys => {
    setKeyList(targetKeys);
    change(targetKeys);
  };

  return (
    <Collapse>
      <Panel header={header} key={header}>
        <Transfer
          dataSource={list}
          titles={['全部', '已选']}
          showSearch
          targetKeys={keyList}
          locale={{
            itemUnit: '项',
            itemsUnit: '项',
            searchPlaceholder: '请输入搜索内容',
          }}
          onChange={handleChange}
          render={item => item?.title || ''}
          listStyle={{
            height: '350px',
            width: '24vw',
          }}
        />
      </Panel>
    </Collapse>
  );
};
