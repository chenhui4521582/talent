import React, { useRef, useState, useEffect } from 'react';
import { Card, Modal, Button, Descriptions } from 'antd';
import { IForm, ItemTypes } from '../../services/form';
import { XYCoord } from 'dnd-core';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';

import DropGroup from './DropGroup';
import DropItem from './DropItem';
import update from 'immutability-helper';

interface Iprops {
  fromItem: IForm;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
}

export default (props: Iprops) => {
  const { fromItem } = props;
  const [formDetail, setFormDetail] = useState<IForm>();

  const [, drop] = useDrop({
    accept: fromItem.id + 'form',
  });

  useEffect(() => {
    setFormDetail(fromItem);
  }, [fromItem]);

  const moveIndex = (dragIndex: number, hoverIndex: number) => {
    const dragCard = fromItem.list[dragIndex];
    fromItem.list = update(fromItem.list, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    });
    setFormDetail({ ...fromItem });
  };

  const renderForm = () => {
    console.log('fromItem.list');
    console.log(formDetail?.list);
    return formDetail?.list.map((groupItem, index) => {
      if (groupItem.list && groupItem.list.length) {
        return (
          <Descriptions.Item
            label={
              <span className={groupItem.isRequired ? 'label-required' : ''}>
                {groupItem.name}
              </span>
            }
            span={groupItem.colspan}
          >
            <DropGroup
              groupItem={groupItem}
              type={fromItem.id + 'form'}
              index={index}
              moveIndex={moveIndex}
            />
          </Descriptions.Item>
        );
      } else {
        return (
          <Descriptions.Item
            label={
              <span className={groupItem.isRequired ? 'label-required' : ''}>
                {groupItem.name}
              </span>
            }
            span={groupItem.colspan}
          >
            <DropItem
              groupItem={groupItem}
              type={fromItem.id + 'form'}
              index={index}
              moveIndex={moveIndex}
            />
          </Descriptions.Item>
        );
      }
    });
  };

  return (
    <div ref={drop}>
      <Descriptions
        title={<div style={{ textAlign: 'center' }}>{formDetail?.name}</div>}
        key={formDetail?.id}
        bordered
        column={formDetail?.columnNum}
        style={{ marginBottom: 40, marginLeft: '5%', width: '80%' }}
      >
        {renderForm()}
      </Descriptions>
    </div>
  );
};
