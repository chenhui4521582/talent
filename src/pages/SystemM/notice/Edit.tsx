import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default props => {
  const [value, setValue] = useState<any>('');
  const formRef = useRef<any>();
  const modules = {
    toolbar: {
      container: [
        [{ font: 14 }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ color: [] }, { background: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { align: [] },
        ],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <Card title="新增编辑" style={{ height: '100%' }}>
      <Input placeholder="请输入标题" style={{ marginBottom: 20 }} />
      <ReactQuill
        placeholder="请输入"
        style={{ height: 280, position: 'relative' }}
        formats={formats}
        value={value}
        modules={modules}
        ref={formRef}
        onChange={content => {
          setValue(content);
        }}
      />
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Button type="primary">提交</Button>
      </div>
    </Card>
  );
};
