import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';
import { IItem, IGroupItem } from '../../services/form';
import Temp from '@/pages/Workflow/Component';
interface Iprops {
  groupItem: any;
}

const DropItem = (props: Iprops) => {
  const { groupItem } = props;
  alert(2);
  return (
    <Descriptions.Item
      key={groupItem.id}
      style={{ maxWidth: '200px' }}
      label={
        <span className={groupItem.isRequired ? 'label-required' : ''}>
          {groupItem.name}
        </span>
      }
      span={groupItem.colspan}
    >
      <Form.Item
        style={{
          width: '100%',
          marginBottom: 0,
          marginTop: 0,
        }}
        name={groupItem.id}
        rules={[
          {
            required: groupItem.isRequired,
            message: `${groupItem.name}'必填!`,
          },
        ]}
      >
        <Temp
          ismultiplechoice={groupItem.isMultiplechoice}
          s_type={groupItem.baseControlType}
          disabled={groupItem.isLocked}
          list={groupItem.itemList || []}
        />
      </Form.Item>
    </Descriptions.Item>
  );
};

export default DropItem;
