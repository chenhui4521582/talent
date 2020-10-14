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
const { TabPane } = Tabs;
export default props => {
  const ref = useRef<any>();
  const ref1 = useRef<any>();
  const [userList, setUserList] = useState<any>();
  const [laberList, setLaberList] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);

  const handelOk = () => {
    setUserList(ref.current?.getvalue && ref.current.getvalue());
    setLaberList(ref1.current?.getvalue && ref1.current.getvalue());
    props.onChange &&
      props.onChange({
        userList: ref.current?.getvalue && ref.current.getvalue(),
        laberList: ref1.current?.getvalue && ref1.current.getvalue(),
      });
    setVisible(false);
  };

  const renderUser = useMemo(() => {
    console.log(userList);
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
              // handleRemove(item.code);
            }}
          />
        </div>
      );
    });
  }, [userList]);

  const renderLabel = useMemo(() => {
    console.log(userList);
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
              // handleRemove(item.code);
            }}
          />
        </div>
      );
    });
  }, [laberList]);

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
            <Organization ref={ref} onlySelectUser={true} renderUser={true} />
          </TabPane>
          <TabPane tab="角色标签" key="2">
            <UserLeaber ref={ref1} />
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

const UserLeaber = forwardRef((props, formRef) => {
  const [dataList, setDataList] = useState<tsRolrLable[]>([]);
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    getApilableList();
  }, []);

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
