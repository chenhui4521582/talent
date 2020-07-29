import React, { useState, useEffect, useMemo } from 'react';
import { Card, Modal, Button, Descriptions, Form } from 'antd';
import { IForm, IItem, IGroupItem } from '../../services/form';
import DropGroup from './DropGroup';
import DropItem from './DropItem';

interface Iprops {
  fromItem: IForm;
}

export default (props: Iprops) => {
  const { fromItem } = props;

  const renderForm = () => {
    console.log('fromItem.list');
    console.log(fromItem.list);
    return fromItem.list.map(groupItem => {
      if (groupItem.list && groupItem.list.length) {
        // return <div>1</div>
        return <DropGroup key={groupItem.id} groupItem={groupItem} />;
      } else {
        // return <div>2</div>
        return <DropItem key={groupItem.id} groupItem={groupItem} />;
      }
    });
  };

  return (
    <Descriptions
      title={<div style={{ textAlign: 'center' }}>{fromItem.name}</div>}
      key={fromItem.id}
      bordered
      column={fromItem.columnNum}
      style={{ marginBottom: 40, width: '90%', marginLeft: '5%' }}
    >
      {renderForm()}
    </Descriptions>
  );
};
