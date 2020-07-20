import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'umi';
import { homeList, tsCategory } from './services/new';
import { GlobalResParams } from '@/types/ITypes';

export default () => {
  const [list, setList] = useState<tsCategory[]>([]);
  const [type, setType] = useState<'recommend' | 'already'>('recommend');
  useEffect(() => {
    async function getList() {
      let json: GlobalResParams<tsCategory[]> = await homeList();
      if (json.status === 200) {
        setList(json.obj);
      }
    }
    getList();
  }, []);

  const renderList = useMemo(() => {
    return list.map(item => {
      return (
        <Button key={item.id} style={{ marginRight: 20, marginBottom: 20 }}>
          <Link to={`newform/${item.id}`}>{item.name}</Link>
        </Button>
      );
    });
  }, [list]);

  return (
    <Card
      title="新增工作流"
      extra={<Button type="primary">新增自定义工作流</Button>}
    >
      {renderList}
    </Card>
  );
};
