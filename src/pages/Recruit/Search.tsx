import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import SendingResume from './components/SendingResume';
import SendedResume from './components/SendedResume';

let keyTive = '1';
const { TabPane } = Tabs;
export default props => {
  const demandId = props.match.params.id;
  const [flag, setFlag] = useState<boolean>(false);
  const [ativeKey, setAtiveKey] = useState<string>();

  useEffect(() => {
    let active = sessionStorage.getItem('activeKey');
    if (active === '2') {
      setAtiveKey('2');
    } else {
      setAtiveKey('1');
    }
    sessionStorage.removeItem('activeKey');
    return () => {
      sessionStorage.setItem('activeKey', keyTive || '');
    };
  }, []);
  const handleChange = e => {
    setAtiveKey(e);
    keyTive = e;
    setFlag(!flag);
  };

  return (
    <Tabs type="card" onChange={handleChange} activeKey={ativeKey}>
      <TabPane tab="待推送简历" key="1">
        <SendingResume demandId={demandId} key={!flag + ''} />
      </TabPane>
      <TabPane tab="已推送简历" key="2">
        <SendedResume demandId={demandId} key={flag + ''} />
      </TabPane>
    </Tabs>
  );
};
