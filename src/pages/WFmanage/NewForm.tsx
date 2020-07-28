import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card } from 'antd';
import { GlobalResParams } from '@/types/ITypes';
import { DndProvider } from 'react-dnd';
import HTMLBackend from 'react-dnd-html5-backend';

export default () => {
  return (
    <Card title="表单新建">
      <DndProvider backend={HTMLBackend}>
        <div>2222</div>
      </DndProvider>
    </Card>
  );
};
