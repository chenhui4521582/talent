// 渲染的列表
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import WhiteUser from './WhiteUser';
import '../styles/scheduling.less';

export default props => {
  const { whitelist } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>();
  const ref = useRef<any>();

  useEffect(() => {
    let newList = JSON.parse(JSON.stringify(list || []));
    whitelist?.map(item => {
      newList.push({
        userCode: item.userCode,
        userName: item.userName,
        businessName: item.businessName,
        businessCode: item.businessCode,
      });
    });
    setList(newList);
  }, [whitelist]);

  useEffect(() => {
    list && list.length && props.onChange(list);
  }, [list]);

  const handleOk = () => {
    let newList = JSON.parse(JSON.stringify(list || []));
    ref.current.getvalue()?.map(item => {
      newList.push({
        userCode: item.key,
        userName: item.name,
        businessName: item.businessName,
        businessCode: item.businessCode,
      });
    });

    setVisible(false);
    setList(newList);
  };

  const handleRemove = code => {
    let selectItemArr = JSON.parse(JSON.stringify(list || []));
    selectItemArr.splice(
      selectItemArr.findIndex(item => item.code === code),
      1,
    );
    setList([...new Set(selectItemArr)]);
  };

  const renderList = useMemo(() => {
    console.log(list);
    return list?.map((item, index) => {
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{item.userName}</span>
          <span>{item.businessName}</span>
          <span>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                handleRemove(item.userCode);
              }}
            >
              删除
            </a>
          </span>
        </div>
      );
    });
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '5px 12px', lineHeight: '40px' }}
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </a>
        {list && list.length ? (
          <div className="scheduling-box-one">{renderList}</div>
        ) : null}
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
        <WhiteUser
          key={visible + ''}
          renderUser={true}
          ref={ref}
          onlySelectUser={true}
          defKey={whitelist}
        />
      </Modal>
    </>
  );
};
