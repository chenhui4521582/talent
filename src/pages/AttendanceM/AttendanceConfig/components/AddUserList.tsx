// 渲染的列表
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddUser from './AddUser';

export default props => {
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const ref = useRef<any>();

  const handleChange = list => {};

  const handleOk = () => {
    setList(ref.current.getvalue());
    console.log(ref.current.getvalue());
    setVisible(false);
  };

  const handleRemove = key => {
    let selectItemArr = JSON.parse(JSON.stringify(list));

    selectItemArr.splice(
      selectItemArr.findIndex(item => item.key === key),
      1,
    );
    setList([...new Set(selectItemArr)]);
  };

  const renderList = useMemo(() => {
    return list.map(item => {
      return (
        <div
          style={{
            padding: '5px 12px',
            border: '1px solid #d9d9d9',
            marginRight: 20,
            marginBottom: 20,
            display: 'inline-block',
          }}
        >
          {item.title}
          <DeleteOutlined
            style={{
              cursor: 'pointer',
              marginLeft: '5px',
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(item.key);
            }}
          />
        </div>
      );
    });
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        {renderList}
        <a
          style={{ padding: '5px 12px', lineHeight: '40px' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </a>
      </div>

      <Modal
        title="添加打卡人员"
        okText="确认"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
        }}
        width="46vw"
      >
        <AddUser
          key={visible + ''}
          handleChange={handleChange}
          renderUser={true}
          ref={ref}
        />
      </Modal>
    </>
  );
};
