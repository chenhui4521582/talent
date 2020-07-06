import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'umi';
import { homeList } from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import './style/home.less';

interface tsList {
  id: number;
  name: string;
  sort: number;
  listForm: tsListItem[];
}

interface tsListItem {
  id: number;
  icon: string | null;
  name: string;
}

export default () => {
  const [list, setList] = useState<tsList[]>([]);
  useEffect(() => {
    async function getList() {
      let json: GlobalResParams<tsList[]> = await homeList();
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
      const name = item.name;
      return (
        <div className="type" key={id}>
          <h3>{name}</h3>
          {listForm.map(u => {
            return (
              <Button className="button-right" key={u.id}>
                <Link to={`homedetail/${u.id}`}>{u.name}</Link>
              </Button>
            );
          })}
        </div>
      );
    });
  }, [list]);

  return <Card title="发起流程">{renderList}</Card>;
};