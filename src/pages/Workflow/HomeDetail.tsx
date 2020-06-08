import React, { useState, useEffect, useMemo } from 'react';
import {
  wfFormDetail,
  tsWfFormDetail,
  tsFormChildlist,
  tsGroupList,
} from './services/home';
import { GlobalResParams } from '@/types/ITypes';
import { Card, Descriptions } from 'antd';
import Temp from './Component';
// import jsons from './services/json.js'

export default () => {
  const [formList, setFormList] = useState<any[]>([]);
  const [title, setTitle] = useState<string | null>('');

  useEffect(() => {
    async function getFrom() {
      let json: GlobalResParams<tsWfFormDetail> = await wfFormDetail(2, 5);
      if (json.status === 200) {
        let obj = json.obj || {};
        let formChildlist = obj.formChildlist || [];
        let groupList = obj.groupList || [];
        let data: any = [];
        let group: any = [];
        for (let k = 0; k < formChildlist.length; k++) {
          let fromItem = formChildlist[k];
          let controlList = fromItem.controlList || [];
          data[k] = fromItem;
          data[k].list = [];
          for (let i = 0; i < groupList.length; i++) {
            let groupItem = groupList[i];
            let list: any = [];
            for (let g = 0; g < controlList.length; g++) {
              if (groupItem.id === controlList[g].resGroupId) {
                formChildlist[k].controlList[g].isGroups = 1;
                list.push(controlList[g]);
                groupItem.list = list;
                data[k].list.push(groupItem);
              } else {
                if (controlList[g].isGroups !== 1) {
                  console.log(controlList[g].isGroups);
                  data[k].list.push(controlList[g]);
                }
              }
            }
            data[k].list = [...new Set(data[k].list)];
          }
        }

        // for(let h=0; h<data.length; h++){
        //   for(let u=0; u<data[h].list.length; u++){
        //     console.log(data[h].list[u])
        //   }
        // }

        console.log(data);
        console.log('data');
        setTitle(obj.name);
        setFormList(data);
      }
    }
    getFrom();
  }, []);

  const fromContent = useMemo(() => {
    return formList.map(fromItem => {
      // return(
      //   <Descriptions title={fromItem.name} key={fromItem.id} bordered column={1}>
      //     {
      //       fromItem.map((groupItem,index)=>{

      //           return(
      //             <Descriptions.Item
      //               key={index}
      //               label={groupItem.name}
      //               span={groupItem.colspan}>
      //               <Temp
      //                 s_type={groupItem.baseControlType}
      //                 readOnly={groupItem.isLocked}
      //                 list={groupItem.itemList || []}
      //               />
      //             </Descriptions.Item>
      //           )

      //       })
      //     }
      //   </Descriptions>
      // )
      return null;
    });
  }, [formList]);

  return <Card title={`发起流程  /  ${title}-创建`}>{fromContent}</Card>;
};
