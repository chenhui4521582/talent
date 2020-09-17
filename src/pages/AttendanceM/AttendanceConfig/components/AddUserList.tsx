// 渲染的列表
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddUser from './AddUser';

export default props => {
  const { ruleDetail, handleChangeUserList } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const ref = useRef<any>();

  useEffect(() => {
    let newList = JSON.parse(JSON.stringify(list || []));
    ruleDetail?.memberList?.map(item => {
      newList.push({
        codeName: item.codeName,
        code: item.code,
        type: item.type,
      });
    });
    setList(newList);
  }, [ruleDetail]);

  useEffect(() => {
    handleChangeUserList(userList);
    list && list.length && props.onChange(list);
  }, [list]);

  const handleOk = () => {
    let newList = JSON.parse(JSON.stringify(list || []));
    ref.current.getvalue()?.map(item => {
      newList.push({
        code: item.key,
        codeName: item.name,
        type: item.level ? 1 : 0,
      });
    });

    setVisible(false);

    let newArr: any = [];
    let newUserList = JSON.parse(JSON.stringify(userList || []));
    ref.current.getvalue().map(item => {
      let userObj: any = {};

      if (item.level) {
        newArr = newArr.concat(handleList(item));
        setUserList(newArr);
      } else {
        userObj[item.code] = [item];
        newUserList.push(userObj);
        setUserList(newUserList);
      }
    });

    setList(newList);
  };

  const handleList = data => {
    let userObj: any = {};
    let newArr: any = [];
    let newUserList = JSON.parse(JSON.stringify(userList || []));
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        if (!list[i].level) {
          newArr.push(list[i]);
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };

    handleItem(data.children);
    userObj[data.code] = newArr;
    newUserList.push(userObj);
    return newUserList;
  };

  const handleRemove = code => {
    let selectItemArr = JSON.parse(JSON.stringify(list || []));
    let newUserList = JSON.parse(JSON.stringify(userList || []));
    selectItemArr.splice(
      selectItemArr.findIndex(item => item.code === code),
      1,
    );
    setList([...new Set(selectItemArr)]);
    newUserList.map((item, index) => {
      for (let key in item) {
        if (key === code) {
          newUserList.splice(index, 1);
        }
      }
    });
    setUserList(newUserList);
  };

  const renderList = useMemo(() => {
    return list?.map(item => {
      return (
        <div
          style={{
            padding: '5px 12px',
            border: '1px solid #d9d9d9',
            marginRight: 20,
            marginBottom: 20,
            display: 'inline-block',
          }}
          key={item.code}
        >
          {item.codeName}
          <DeleteOutlined
            style={{
              cursor: 'pointer',
              marginLeft: '5px',
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(item.code);
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
        <AddUser key={visible + ''} renderUser={true} ref={ref} />
      </Modal>
    </>
  );
};
