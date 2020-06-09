import React, { useState, useEffect } from 'react';
import { Card, Tree, Input } from 'antd';
import json from './services/json';

const { TreeNode } = Tree;
export default () => {
  const [dataList, setDataList] = useState<any>([]);

  useEffect(() => {
    console.log(json);
    if (json.status === 200) {
      let list = json.obj;
      handleList(list);
    }
  });

  const handleList = data => {
    let arr: any = [];
    const handleItem = list => {
      for (let i = 0; i < list.length; i++) {
        list[i].key = list[i].code;
        list[i].title = list[i].name;
        if (list[i].children) {
          handleItem(list[i].children);
        }
      }
    };
    handleItem(data);
    console.log(data);
    setDataList(data);
  };

  return (
    <Card title="组织架构">
      <Tree autoExpandParent={true} showLine={true} treeData={dataList} />
    </Card>
  );
};
