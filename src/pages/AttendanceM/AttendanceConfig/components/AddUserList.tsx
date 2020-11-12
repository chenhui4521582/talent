// 渲染的列表
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useOrganization, usetDefaultOrganization } from '@/models/global';
import AddUser from './AddUser';
export default props => {
  const { ruleDetail, handleChangeUserList } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const ref = useRef<any>();
  const { organizationJson } = useOrganization();

  useEffect(() => {
    let newList: any = [];
    let newList1: any = [];
    let data = handleList1(organizationJson);
    const handleddata1 = sItem => {
      let select = {};
      const handleddata = data => {
        data?.map(item => {
          if (item.code === sItem.code) {
            select = item;
            return;
          } else {
            if (item.children) {
              handleddata(item.children);
            }
          }
        });
      };
      handleddata(data);
      return select;
    };

    ruleDetail?.memberList?.map(item => {
      let userObj: any = {};
      newList.push({
        codeName: item.codeName,
        code: item.code,
        type: item.type,
      });
      if (item.type === 1) {
        item.name = item.codeName;
        newList1 = newList1.concat(handleList(handleddata1(item)));
      } else {
        item.name = item.codeName;
        userObj[item.code] = [item];
        newList1.push(userObj);
      }
    });
    setUserList(newList1);
    setList(newList);
  }, [ruleDetail, organizationJson]);

  useEffect(() => {
    handleChangeUserList(userList);
    console.log(list);
    list && props.onChange(list);
  }, [list]);

  const handleList1 = data => {
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        if (list[i].memberList && list[i].memberList.length) {
          if (list[i].memberList) {
            if (list[i].children) {
              list[i].children = list[i]?.children?.concat(list[i]?.memberList);
            } else {
              list[i].children = list[i]?.memberList;
            }
          }
        }
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(data);
    return data;
  };

  const handleOk = () => {
    let newList: any = [];
    ref.current.getvalue()?.map(item => {
      newList.push({
        code: item.key,
        codeName: item.name || item.title,
        type: item.level ? 1 : 0,
      });
    });

    setVisible(false);

    let newArr: any = [];
    let newUserList: any = [];
    ref.current.getvalue().map(item => {
      let userObj: any = {};

      if (
        item?.memberList ||
        item?.children ||
        item?.memberList?.length ||
        item?.children?.length
      ) {
        if (!item?.children || !item?.children?.length) {
          item.children = item.memberList;
        }
        newArr = newArr.concat(handleList(item));
      } else {
        userObj[item.code || item.key] = [item];
        newUserList.push(userObj);
      }
    });
    newArr = newArr.concat(newUserList);
    setUserList(newArr);
    setList(newList);
  };

  const handleList = data => {
    if (data?.children) {
      let userObj: any = {};
      let newArr: any = [];
      let newUserList = userList || [];
      const handleItem = list => {
        for (let i = 0; i < list?.length; i++) {
          if (!list[i].level) {
            newArr.push(list[i]);
          }
          if (list[i].children) {
            handleItem(list[i].children);
          }
        }
      };

      handleItem(data?.children);
      userObj[data.code || data.key] = newArr;
      newUserList.push(userObj);
      return newUserList;
    } else {
      return [];
    }
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
  const handleSelectKeys = () => {
    let arr: any = [];
    list?.map(item => {
      arr.push(item.code);
    });
    return arr;
  };
  const renderList = useMemo(() => {
    console.log(list);
    console.log('list');
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
        <AddUser
          key={visible + ''}
          renderUser={true}
          ref={ref}
          selectKeys={handleSelectKeys()}
        />
      </Modal>
    </>
  );
};
