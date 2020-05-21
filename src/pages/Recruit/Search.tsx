import React from 'react';
import { Card, Tabs } from 'antd';
import SendingResume from './components/SendingResume';
import SendedResume from './components/SendedResume';

const { TabPane } = Tabs;
export default (props) => {
  const demandId = props.match.params.id;
  return (
    <Tabs type="card">
      <TabPane tab="待推送简历" key="1">
        <SendingResume
          demandId={demandId}
        />
      </TabPane>
      <TabPane tab="已推送简历" key="2">
        <SendedResume
          demandId={demandId}
        />
      </TabPane>
    </Tabs>
  )
}