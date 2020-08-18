import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default props => {
  const [form] = Form.useForm();
  const [value, setValue] = useState<any>('');

  return (
    <Card title="新增编辑" style={{ height: '100%' }}>
      <Input placeholder="请输入标题" style={{ marginBottom: 20 }} />
      <ReactQuill
        style={{ height: 280 }}
        theme="snow"
        value={value}
        onChange={e => {
          console.log(e);
          setValue(e);
        }}
      />
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Button type="primary">提交</Button>
      </div>
    </Card>
  );
};
