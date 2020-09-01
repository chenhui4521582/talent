import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Input, Button, notification, Form } from 'antd';

import { save, updateById, getInfoById, IListItem } from './services/list';
import { saveFile } from '@/services/global';
import { GlobalResParams } from '@/types/ITypes';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
interface ISaveFile {
  url: String;
}

export default props => {
  const [value, setValue] = useState<string>('');
  const editorRef = useRef<any>();
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if (props.match.params.id) {
      getDedatil();
    }

    async function getDedatil() {
      let res: GlobalResParams<IListItem> = await getInfoById({
        id: props.match.params.id,
      });
      if (res.status === 200) {
        setTitle(res.obj.title);
        setValue(res.obj.content || '');
      } else {
        notification['error']({
          message: res.msg,
          description: '',
        });
      }
    }
  }, [props.match.params.id]);

  const handleImage = () => {
    let quillEditor = editorRef.current.getEditor();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files && input.files[0];
      const range = quillEditor.getSelection();
      let res: GlobalResParams<ISaveFile> = await saveFile({ file: file });

      if (res.status === 200) {
        quillEditor.insertEmbed(range.index, 'image', res.obj.url);
      } else {
        notification['error']({
          message: res.msg,
          description: '',
        });
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ font: 14 }],
        [{ header: ['1', '2', '3', '4', '5', '6', false] }],
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
        // ['clean'],
      ],
      handlers: {
        image: e => {
          if (e) {
            handleImage();
          }
        },
      },
    },
  };

  const submitData = async () => {
    let api = save;
    let values: any = {};
    values.content = editorRef.current.state.value;
    values.title = title;

    if (props.match.params.id) {
      api = updateById;
      values.id = props.match.params.id;
    }
    let res: GlobalResParams<ISaveFile> = await api(values);
    if (res.status === 200) {
      notification['success']({
        message: '成功',
        description: '',
      });
    } else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  };

  const renderInput = useMemo(() => {
    return (
      <Input
        placeholder="请输入标题"
        style={{ marginBottom: 20 }}
        value={title}
        onChange={e => {
          e.persist();
          setTitle(e.target.value);
        }}
      />
    );
  }, [title]);

  const renderEditor = useMemo(() => {
    return (
      <ReactQuill
        placeholder="请输入"
        style={{ height: '50vh', position: 'relative' }}
        value={value}
        modules={modules}
        ref={editorRef}
      />
    );
  }, [value]);

  return (
    <Card
      title={props.match.params.id ? '编辑公告' : '新增公告'}
      style={{ height: '100%' }}
    >
      {renderInput}
      {renderEditor}
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Button
          style={{ marginRight: 20, marginTop: 20 }}
          onClick={() => {
            window.history.go(-1);
          }}
        >
          返回
        </Button>
        <Button type="primary" onClick={submitData}>
          提交
        </Button>
      </div>
    </Card>
  );
};
