import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Input,
  Radio,
  Form,
  Modal,
  Select,
  Col,
  Row,
  InputNumber,
  Checkbox,
  Tabs,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { getLableList } from '@/pages/WFmanage/services/rule';
import Organization from '@/pages/Framework/components/Organization';
import { useOrganization, usetDefaultOrganization } from '@/models/global';
const { TabPane } = Tabs;
export default props => {
  const { selectRule } = props;
  const ref = useRef<any>();
  const ref1 = useRef<any>();
  const [userList, setUserList] = useState<any>();
  const [laberList, setLaberList] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  const [val, setVal] = useState<any>();
  const { organizationJson } = useOrganization();

  useEffect(() => {
    let value1: any;
    if (selectRule.value) {
      if (
        Object.prototype.toString.call(selectRule.value) === '[object Object]'
      ) {
        value1 = selectRule.value;
      } else {
        // let value2 = JSON.parse(JSON.stringify(value.value));
        value1 = "'" + selectRule.value + "'";
        value1 = eval('(' + value1 + ')');
        value1 = JSON.parse(value1);
      }
    }
    if (value1?.memberTagIds || value1?.userCodes) {
      let laberListP: any = [];
      let userListP: any = [];

      const getApilableList = async () => {
        let json: GlobalResParams<tsRolrLable[]> = await getLableList();
        if (json.status === 200) {
          let arr: any = [];
          if (value1?.memberTagIds) {
            if (value1?.memberTagIds.split(',')) {
              arr = value1?.memberTagIds.split(',');
            } else {
              arr = [value1.memberTagIds];
            }
          }

          json.obj?.map(item => {
            if (arr?.indexOf(item.id + '') > -1) {
              laberListP.push(item);
            }
          });

          let arr1: any = [];
          if (value1?.userCodes) {
            if (value1?.userCodes.split(',')) {
              arr1 = value1?.userCodes.split(',');
            } else {
              arr1 = [value1.userCodes];
            }
          }
          function handleDate(data) {
            function handleDate1(data1) {
              data1?.map(item => {
                if (arr1?.indexOf(item.code) > -1) {
                  item.title = item.name;
                  item.key = item.code;
                  userListP.push(item);
                }
                if (item.memberList && item.memberList?.length) {
                  item.children = item.memberList;
                }
                if (item.children) {
                  handleDate1(item.children);
                }
              });
            }
            handleDate1(data);
          }
          handleDate(organizationJson);
          setUserList([...new Set(userListP)]);
          setLaberList([...new Set(laberListP)]);
          setVal({
            memberTagIds: arr.join(','),
            userCodes: arr1.join(','),
          });
        }
      };
      getApilableList();
    }
  }, [selectRule?.value, organizationJson]);

  const handelOk = () => {
    let uList: any = [];
    let lList: any = [];
    ref.current?.getvalue &&
      ref.current.getvalue()?.map(item => {
        uList.push(item.key);
      });
    ref1.current?.getvalue &&
      ref1.current.getvalue()?.map(item => {
        lList.push(item.id + '');
      });

    setUserList(ref.current?.getvalue());
    setLaberList(ref1.current?.getvalue());
    props.onChange &&
      props.onChange({
        userCodes: uList.join(','),
        memberTagIds: lList.join(','),
      });

    setVisible(false);
  };

  const handleRemove = id => {
    let newLaberList = JSON.parse(JSON.stringify(laberList || []));
    let newUserList = JSON.parse(JSON.stringify(userList || []));

    newLaberList.map((item, index) => {
      if (item.id == id) {
        newLaberList.splice(index, 1);
      }
    });

    newUserList.map((item, index) => {
      if (item.key == id) {
        newUserList.splice(index, 1);
      }
    });

    setUserList(newUserList);
    setLaberList(newLaberList);
  };

  const renderUser = useMemo(() => {
    return userList?.map(item => {
      return (
        <div
          style={{
            padding: '5px 12px',
            border: '1px solid #d9d9d9',
            marginRight: 20,
            marginBottom: 20,
            display: 'inline-block',
          }}
          key={item.key}
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
  }, [userList, val]);

  const renderLabel = useMemo(() => {
    return laberList?.map(item => {
      return (
        <div
          style={{
            padding: '5px 12px',
            border: '1px solid #d9d9d9',
            marginRight: 20,
            marginBottom: 20,
            display: 'inline-block',
          }}
          key={item.id}
        >
          {item.name}
          <DeleteOutlined
            style={{
              cursor: 'pointer',
              marginLeft: '5px',
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(item.id);
            }}
          />
        </div>
      );
    });
  }, [laberList, val]);

  return (
    <>
      <div>
        {renderUser}
        {renderLabel}
        <a
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </a>
      </div>
      <Modal
        width="45vw"
        title="成员或标签支持多选"
        visible={visible}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={handelOk}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="组织架构" key="1">
            <Organization
              ref={ref}
              onlySelectUser={true}
              renderUser={true}
              selectKeys={val?.userCodes?.split(',') || []}
            />
          </TabPane>
          <TabPane tab="角色标签" key="2">
            <UserLeaber
              ref={ref1}
              value={val?.memberTagIds?.split(',') || []}
            />
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

interface tsRolrLable {
  id: string;
  name: string;
  status: number;
  updatedBy: string | null;
}

const UserLeaber = forwardRef((props: any, formRef) => {
  const { value } = props;
  const [dataList, setDataList] = useState<tsRolrLable[]>([]);
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    getApilableList();
  }, []);

  useEffect(() => {
    value && value.length && setList(value || []);
  }, [value]);
  useImperativeHandle(formRef, () => {
    let arr: tsRolrLable[] = [];
    dataList?.map(item => {
      list?.map(id => {
        if (item.id === id) {
          arr.push(item);
        }
      });
    });
    return {
      getvalue: () => {
        return arr;
      },
    };
  });

  const getApilableList = async () => {
    let json: GlobalResParams<tsRolrLable[]> = await getLableList();
    if (json.status === 200) {
      setDataList(json.obj);
    }
  };

  const onChange = value => {
    setList(value);
  };

  return (
    <Checkbox.Group value={list} onChange={onChange}>
      {dataList.map(item => {
        return (
          <Checkbox value={item.id} style={{ display: 'block', marginLeft: 0 }}>
            {item.name}
          </Checkbox>
        );
      })}
    </Checkbox.Group>
  );
});
