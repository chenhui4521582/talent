import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { Link } from 'umi';
import './style/initiate.less';

export default () => {
  return (
    <Card title="发起流程">
      <div className="type">
        <h3>培训类</h3>
        <div>
          <Button className="button-right">
            <Link to={`homedetail?name=${'招聘'}`}>招聘</Link>
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/talent/workflow/homedetail';
            }}
            className="button-right"
          >
            审批
          </Button>
          <Button
            className="button-right"
            onClick={() => {
              window.location.href = '/talent/workflow/homedetail';
            }}
          >
            转岗
          </Button>
          <Button
            className="button-right"
            onClick={() => {
              window.location.href = '/talent/workflow/homedetail';
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
