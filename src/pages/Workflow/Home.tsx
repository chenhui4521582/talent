import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'umi';
import { homeList, tsCategory } from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import './style/home.less';
import Icon from '@/images/icon.png';

export default () => {
  const [list, setList] = useState<tsCategory[]>([]);
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
      const name = item.name;
      return (
        <div className="type" key={id}>
          <h3>{name}</h3>
          {listForm.map(u => {
            return (
              <Button className="button-right" key={u.id}>
                <Link to={`homedetail/${u.id}`}>
                  <img
                    src={u.icon || Icon}
                    style={{
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      marginRight: 4,
                    }}
                  />
                  <span>{u.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      );
    });
  }, [list]);

  return <Card title="发起流程">{renderList}</Card>;
};
