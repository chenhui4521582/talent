import React, { useState } from 'react';
import { Button, Card } from 'antd';
import './style/initiate.less';

const routerJson = {
  approval: '/talent/workflow/approval',
  dismissal: '/talent/workflow/dismissal',
  promotion: '/talent/workflow/promotion',
  recruit: '/talent/workflow/recruit',
  resignation: '/talent/workflow/resignation',
  transfer: '/talent/workflow/transfer',
};

export default () => {
  return (
    <Card title="发起流程">
      <div className="type">
        <h3>培训类</h3>
        <div>
          <Button
            onClick={() => {
              window.location.href = routerJson['recruit'];
            }}
            className="button-right"
          >
            招聘
          </Button>
          <Button
            onClick={() => {
              window.location.href = routerJson['approval'];
            }}
            className="button-right"
          >
            审批
          </Button>
          <Button
            className="button-right"
            onClick={() => {
              window.location.href = routerJson['transfer'];
            }}
          >
            转岗
          </Button>
          <Button
            className="button-right"
            onClick={() => {
              window.location.href = routerJson['promotion'];
            }}
          >
            晋升
          </Button>
          <Button className="button-right">辞职</Button>
          <Button className="button-right">辞退</Button>
        </div>
      </div>
      <div className="type">
        <h3>公共类</h3>
        <div>
          <Button className="button-right">招聘</Button>
          <Button className="button-right">审批</Button>
          <Button className="button-right">转岗</Button>
          <Button className="button-right">晋升</Button>
        </div>
      </div>
      <div className="type">
        <h3>财务类</h3>
        <div>
          <Button className="button-right">招聘</Button>
          <Button className="button-right">审批</Button>
          <Button className="button-right">转岗</Button>
          <Button className="button-right">晋升</Button>
        </div>
      </div>
    </Card>
  );
};
