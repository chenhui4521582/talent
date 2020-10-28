import React, { useState, useEffect, useMemo, useRef } from 'react';
import { XYCoord } from 'dnd-core';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import Temp from '../Component';
interface Iprops {
  groupItem: any;
  type: string;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  index: number;
}

const DropItem = (props: Iprops) => {
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

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
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

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: '5px 16px',
        border: '1px dashed #444',
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <Temp
        ismultiplechoice={groupItem.isMultiplechoice}
        s_type={groupItem.baseControlType}
        disabled={groupItem.isLocked}
        list={groupItem.itemList || []}
      />
    </div>
  );
};

export default DropItem;
