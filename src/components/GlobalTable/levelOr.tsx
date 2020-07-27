import React, { useEffect, useState, useRef } from 'react';
import { Select } from 'antd';
import { getlevelOr } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';

const { Option } = Select;
interface tsItem {
  code: string;
  name: string;
}
interface tsProps {
  code: string;
  value?: string;
  onChange?: any;
}
export default (props: tsProps) => {
  const { code, onChange, value } = props;
  const [list, setList] = useState<tsItem[]>([]);
  const [mount, setMount] = useState<boolean>(false);
  useEffect(() => {
    async function list() {
      let res: GlobalResParams<tsItem[]> = await getlevelOr(code || '');
      if (res.status === 200) {
        setList(res.obj);
        setMount(true);
      }
    }
    list();
  }, []);
  return (
    <Select
      // placeholder="请选择"
      style={{ maxWidth: '12vw', minWidth: '8vw' }}
      optionFilterProp="children"
      showSearch
      value={mount ? value : ''}
      onChange={onChange}
    >
      {list.map(item => {
        return <Option value={item.code}>{item.name}</Option>;
      })}
    </Select>
  );
};
