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
      const listForm = item.listForm;
      const id = item.id;
      return (
        <div className="type" key={id}>
          {listForm.map(u => {
            return (
              <Button key={u.id} style={{ marginRight: 20, marginBottom: 20 }}>
                <Link to={`homedetail/${u.id}`}>{u.name}</Link>
              </Button>
            );
          })}
        </div>
      );
    });
  }, [list]);

  return (
    <Card title="新增工作流">
      <div style={{ marginBottom: 20 }}>
        <a
          style={{ marginRight: 20 }}
          onClick={() => {
            setType('recommend');
          }}
        >
          {' '}
          从推荐模板添加
        </a>
        <a
          onClick={() => {
            setType('recommend');
          }}
        >
          {' '}
          从已有工作流复制
        </a>
      </div>

      {renderList}
    </Card>
  );
};
