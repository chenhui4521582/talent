import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';

import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  getControls,
  getFormDetail,
  IControls,
  IForm,
  IGroupItem,
} from './services/form';
import { GlobalResParams } from '@/types/ITypes';

import DropForm from './components/form/DropForm';
export default props => {
  const [controlList, setControlList] = useState<IControls[]>();
  const [formDetail, setFormDetail] = useState<IForm[]>([]);
  const [cVisible, setCvisible] = useState<boolean>(false);

  useEffect(() => {
    getForm();
    getC();
  }, []);

  async function getForm() {
    const id = props.match.params.id;
    let json = await getFormDetail(id);
    if (json.status === 200) {
      handleDetail(json.obj);
      // setFormDetail(json.obj)
    }
  }

  async function getC() {
    let json: GlobalResParams<IControls[]> = await getControls();
    if (json.status === 200) {
      setControlList(json.obj);
    }
  }

  const handleDetail = obj => {
    let formChildlist = obj.formChildlist || [];
    let groupList = obj.groupList || [];
    let data: any = [];
    for (let k = 0; k < formChildlist.length; k++) {
      let fromItem = formChildlist[k];
      let controlList = fromItem.controlList;
      // idItem = idItem.concat(controlList);
      data[k] = fromItem;
      data[k].list = [];
      data[k].arr = [];
      data[k].groupColArr = [];
      if (groupList.length) {
        for (let i = 0; i < groupList.length; i++) {
          let groupItem = groupList[i];
          let list: any = [];
          for (let g = 0; g < controlList.length; g++) {
            if (groupItem.id === controlList[g].resGroupId) {
              data[k].groupColArr.push(formChildlist[k].controlList[g].id);
              list.push(controlList[g]);
              groupItem.list = list;
              data[k].list.push(groupItem);
            }
            if (
              data[k].arr.indexOf(formChildlist[k].controlList[g].id) === -1 &&
              data[k].groupColArr.indexOf(
                formChildlist[k].controlList[g].id,
              ) === -1 &&
              i === groupList.length - 1
            ) {
              data[k].arr.push(formChildlist[k].controlList[g].id);
              data[k].list.push(controlList[g]);
            }
          }
          data[k].list = [...new Set(data[k].list)];
        }
      } else {
        data[k].list = controlList;
      }
    }
    setFormDetail(data);
  };

  const renderControl = useMemo(() => {
    return controlList?.map(item => {
      return (
        <Button key={item.id} style={{ width: 200, margin: 8 }}>
          {item.name}
        </Button>
      );
    });
  }, [controlList]);

  const fromContent = useMemo(() => {
    if (formDetail?.length) {
      return formDetail?.map(fromItem => {
        return <DropForm fromItem={fromItem} />;
      });
    } else {
      return null;
    }
  }, [formDetail]);

  return (
    <Card
      title="工作流列表"
      extra={
        <>
          <Button
            type="primary"
            onClick={() => {
              setCvisible(true);
            }}
          >
            添加控件
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }}>
            保存
          </Button>
        </>
      }
    >
      <DndProvider backend={HTML5Backend}>{fromContent}</DndProvider>
      <Modal
        width="40vw"
        visible={cVisible}
        title="添加控件"
        okText="确认"
        cancelText="取消"
        onOk={() => {
          setCvisible(false);
        }}
        onCancel={() => {
          setCvisible(false);
        }}
      >
        {renderControl}
      </Modal>
    </Card>
  );
};
