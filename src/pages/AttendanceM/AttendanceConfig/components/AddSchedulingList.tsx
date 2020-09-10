// 添加排班
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddScheduling from './AddScheduling';

export default props => {
  const [visible, setVisible] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const ref = useRef<any>();

  const handleOk = () => {
    let form = ref.current.getvalue;
    form.validateFields().then(value => {
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setVisible(false);
    });
  };

  const renderList = useMemo(() => {
    console.log(list);
    return 1;
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </a>
      </div>
      <div>{renderList}</div>
      <Modal
        title="添加排班"
        okText="确认"
        cancelText="取消"
        visible={visible}
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          ref.current.getvalue.re;
          setVisible(false);
        }}
      >
        <AddScheduling ref={ref} />
      </Modal>
    </>
  );
};
