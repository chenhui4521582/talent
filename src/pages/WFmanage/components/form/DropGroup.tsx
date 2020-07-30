import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';
import { IGroupItem } from '../../services/form';
import Temp from '@/pages/Workflow/Component';

interface Iprops {
  groupItem: IGroupItem;
}

const DropGroup = (props: Iprops) => {
  const [name, setName] = useState();

  const { groupItem } = props;
  return (
    <Descriptions.Item
      key={groupItem.id}
      label={groupItem.name}
      span={groupItem.colspan}
      style={{ maxWidth: '300px' }}
    >
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
    </Descriptions.Item>
  );
};

export default DropGroup;
