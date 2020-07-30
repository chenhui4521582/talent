import React, { useRef, useState } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';
import { IForm, ItemTypes } from '../../services/form';
import { XYCoord } from 'dnd-core';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';

import dropGroup from './DropGroup';
import dropItem from './DropItem';

interface Iprops {
  fromItem: IForm;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
}

export default (props: Iprops) => {
  const { fromItem, index, moveIndex } = props;

  const renderForm = () => {
    console.log('fromItem.list');
    console.log(fromItem.list);
    return fromItem.list.map(groupItem => {
      if (groupItem.list && groupItem.list.length) {
        return dropGroup({ groupItem });
      } else {
        return dropItem({ groupItem });
      }
    });
  };

  return (
    <div>
      <Descriptions
        title={<div style={{ textAlign: 'center' }}>{fromItem.name}</div>}
        key={fromItem.id}
        bordered
        column={fromItem.columnNum}
        style={{ marginBottom: 40, marginLeft: '5%', width: '80%' }}
      >
        {renderForm()}
      </Descriptions>
    </div>
  );
};
