// 添加打卡
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default props => {
  const [visible, setVisible] = useState<boolean>(true);

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

      <Modal
        title="添加打卡时间"
        okText="确认"
        cancelText="取消"
        visible={visible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        width="46vw"
      ></Modal>
    </>
  );
};
