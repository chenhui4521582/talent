import React, { useState } from 'react';
import { Card, Input, Table } from 'antd';

const { Search } = Input;

export default () => {
  const [dataList, setDataList] = useState<string[]>([]);

  const searchChange = (e): void => {
    console.log(e);
  };

  return (
    <Card title="角色标签管理">
      <div style={{ width: '20%' }}>
        <Search
          type="search"
          placeholder="请搜索"
          onChange={searchChange}
          style={{ marginBottom: 30 }}
        />
        <ul>
          <li>1</li>
          <li>2</li>
        </ul>
      </div>
    </Card>
  );
};
