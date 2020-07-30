import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { IGroupItem } from '../../services/form';
import Temp from '@/pages/Workflow/Component';

interface Iprops {
  groupItem: IGroupItem;
  type: string;
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
}

const DropGroup = (props: Iprops) => {
  const { groupItem, type, moveIndex, index } = props;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),

    item: { type: type, index },
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item: { type: string; index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      //   return;
      // }

      // // // 向上拖动
      // if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      //   return;
      // }

      // 执行 move 回调函数
      moveIndex(dragIndex, hoverIndex);

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */
      if (item.index !== undefined) {
        item.index = hoverIndex;
      }
    },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.2 : 1,
  };

  drag(drop(ref));

  return (
    <div ref={ref}>
      {groupItem.list.map(listItem => {
        return (
          <div
            key={listItem.id}
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              margin: '10px',
            }}
          >
            <div
              className={listItem.isRequired ? 'label-required' : ''}
              style={{ display: 'flex', flex: 1 }}
            >
              {listItem.name}
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
              <Form.Item
                style={{
                  width: '100%',
                  marginBottom: 6,
                  marginTop: 6,
                }}
                rules={[
                  {
                    required: listItem.isRequired,
                    message: `${listItem.name}'必填!`,
                  },
                ]}
                name={listItem.id}
              >
                <Temp
                  ismultiplechoice={listItem.isMultiplechoice}
                  s_type={listItem.baseControlType}
                  disabled={listItem.isLocked}
                  list={listItem.itemList || []}
                />
              </Form.Item>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DropGroup;
