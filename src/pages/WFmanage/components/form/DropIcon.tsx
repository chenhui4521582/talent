import React, { useRef } from 'react';
import { XYCoord } from 'dnd-core';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';
import { ItemTypes } from '../../services/form';
import { DeleteOutlined } from '@ant-design/icons';

interface IProps {
  index: number;
  moveIndex: (dragIndex: number, hoverIndex: number) => void;
  name: string;
  remove: (index) => void;
}

const Card: React.FC<IProps> = ({ index, moveIndex, name, remove }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),

    item: { type: ItemTypes.FormBox, index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.FormBox,
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

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current!.getBoundingClientRect();

      // 获取中点垂直坐标
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset();

      // 获取距顶部距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行 move 回调函数
      moveIndex(dragIndex, hoverIndex);

      if (item.index !== undefined) {
        item.index = hoverIndex;
      }
    },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.2 : 1,
    marginTop: 10,
    verticalAlign: 40,
    padding: '6px 8px',
    width: '8em',
  };

  drag(drop(ref));
  return (
    <div ref={ref} style={style}>
      <DeleteOutlined
        style={{
          cursor: 'pointer',
          marginRight: '5px',
        }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          remove(index);
        }}
      />
      <span>{name}</span>
    </div>
  );
};

export default Card;
