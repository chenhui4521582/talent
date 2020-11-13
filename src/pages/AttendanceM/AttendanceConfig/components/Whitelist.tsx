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
    let newList1 = JSON.parse(JSON.stringify(list || []));
    whitelist?.map(item => {
      newList1.push({
        userCode: item.userCode,
        userName: item.userName,
        businessName: item.businessName,
        businessCode: item.businessCode,
      });
    });
    setList(newList1);
  }, [whitelist]);

  useEffect(() => {
    let newList3 = JSON.parse(JSON.stringify(list || []));
    let arr: any = [];
    newList3?.map(item => {
      arr.push({
        userCode: item?.userCode,
        userName: item?.userName,
        businessName: item?.businessName,
        businessCode: item?.businessCode,
      });
    });

    list && props.onChange(arr);
  }, [list]);
  // console.log('list')
  // console.log(list)

  const handleOk = () => {
    let newList2 = JSON.parse(JSON.stringify([]));
    console.log(newList2);
    ref.current.getvalue()?.map(item => {
      let obj: any = {};
      obj.userCode = item.userCode;
      obj.userName = item.userName;
      obj.businessName = item.businessName;
      obj.businessCode = item.businessCode;
      newList2.push(obj);
    });
    console.log('list');
    console.log(newList2);
    setVisible(false);
    setList(JSON.parse(JSON.stringify(newList2)));
  };

  const handleRemove = code => {
    let selectItemArr = JSON.parse(JSON.stringify(list || []));
    selectItemArr.splice(
      selectItemArr.findIndex(item => item.code === code),
      1,
    );
    setList(selectItemArr);
  };

  const renderList = useMemo(() => {
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
          defKey={list}
        />
      </Modal>
    </>
  );
};
