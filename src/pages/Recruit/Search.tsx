import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import SendingResume from './components/SendingResume';
import SendedResume from './components/SendedResume';

const { TabPane } = Tabs;
export default props => {
  const demandId = props.match.params.id;
  const [flag, setFlag] = useState<boolean>(false);
  const handleChange = () => {
    setFlag(!flag);
  };
  return (
    <Tabs type="card" onChange={handleChange}>
      <TabPane tab="待推送简历" key="1">
        <SendingResume demandId={demandId} key={!flag + ''} />
      </TabPane>
      <TabPane tab="已推送简历" key="2">
        <SendedResume demandId={demandId} key={flag + ''} />
      </TabPane>
    </Tabs>
  );
};
