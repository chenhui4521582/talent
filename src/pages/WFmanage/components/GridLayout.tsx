import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Divider,
  Collapse,
  Input,
  Modal,
  Radio,
  Form,
  Select,
  message,
} from 'antd';
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import update from 'immutability-helper';
import {
  getFormSimple,
  tsStep,
  ItemTypes,
  getLableList as handleLable,
  getParam,
} from '../services/rule';
import { GlobalResParams } from '@/types/ITypes';
import { getLableList } from '@/pages/Framework/services/role';
import { useDrop } from 'react-dnd';
import MoveInOz from '@/pages/Framework/components/MoveInOz';
import Assembly from './Assembly';
import SystemLabel from './SystemLabel';
import Card from './Card';
import Condition from './Condition';

import './style/rule.less';

interface tsRolrLable {
  id: number;
  name: string;
  status: number;
  updatedBy: string | null;
}

const { Option } = Select;
const { Panel } = Collapse;

interface tsLabel {
  id: string;
  labelName: string;
}

interface IFile {
  controlShowName: string;
  id: number;
}

interface IListItem {
  id: string;
  isGroup: 0 | 1;
  name: string;
  type: string;
  key: string;
  title: string;
  labelName: string;
  isLocked?: number;
  childName: string;
}

interface IruleSets {
  fromNodeId: number; //起始id
  toNodeId: number; //终点节点id
  id?: number; // 主键id
  isDefault: number; // 是否是默认流程
  name: number; //名称
  priority: number; //优先级
  resRuleCurdParams: any[]; // 条件的内容
  resStepId: number; //起始主键id
  resNextStepId: number; // 终点id
}

const levelList = [
  '直接上级',
  '第二上级',
  '第三上级',
  '第四上级',
  '第五上级',
  '第六上级',
  '第七上级',
  '第八上级',
  '第九上级',
  '第十上级',
];

const typeObj = {
  1: '上级',
  2: '标签',
  3: '指定成员',
  4: '申请人',
  5: '系统标签',
  6: '归档',
};

let userkeyList;
let controlId;
let systemObj;

// type 审批类型；   1：上级，2：标签，3：单个成员，4：申请人，5：系统标签 6.归档,
// signType : 0：会签，1：或签 在审批类型为上级和标签时有效 ,
// nodeType : 节点类型 1:开始节点;2:中间节点;3:结束节点
// specifiedLevel

export default props => {
  const { ruleList, change, propsRuleSets } = props;
  const [list, setList] = useState<tsStep[] | any>();
  const [, drop] = useDrop({
    accept: ItemTypes.Card,
  });

  const [form] = Form.useForm();
  const [nameForm] = Form.useForm();
  const ref = useRef<any>();

  const [labelList, setLabelList] = useState<tsLabel[]>();
  const [edit, setEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<number | undefined>(1);
  const [selectObj, setSelectObj] = useState<any>();
  const [name, setName] = useState<string>();
  const [cardIndex, setCardIndex] = useState<number>();
  const [handleList, setHandleList] = useState<tsRolrLable[]>();
  const [paramForm] = Form.useForm();
  const [param, setParam] = useState<IFile[]>([]);
  const [controlList, setControlList] = useState<IListItem[]>();
  const [isFiles, setIsFiles] = useState<boolean>(false);
  const [conditionVisable, setConditionVisable] = useState<
    '新增' | '编辑' | undefined
  >();
  const [ruleItem, setRuleItem] = useState<any>();
  const [selectRule, setSelectRule] = useState<any>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function getLable() {
      let json: GlobalResParams<tsLabel[]> = await getLableList();
      if (json.status === 200) {
        setLabelList(json.obj);
      }

      let res: GlobalResParams<IListItem[]> = await getFormSimple(
        props?.match.params.id,
      );
      if (res.status === 200) {
        setControlList(res.obj);
      }
    }

    const getApilableList = async () => {
      let json: GlobalResParams<tsRolrLable[]> = await handleLable();
      if (json.status === 200) {
        setHandleList(json.obj);
      }
    };

    getApilableList();
    getLable();
  }, []);

  useEffect(() => {
    let propsList = ruleList?.steps || [];
    propsList.map(item => {
      if (item.type === 6) {
        item.stepNumber = 1000000;
      }
    });
    propsList = propsList.sort(compare('stepNumber'));
    let propsRuleSets = ruleList?.ruleSets || [];
    if (propsRuleSets.length === 0) {
      if (propsList?.length) {
        let newList = JSON.parse(JSON.stringify(propsList || []));
        let obj = {
          ruleList: [
            {
              list: newList,
            },
          ],
        };
        let arr = [obj];
        const droopData = data => {
          let newData = data;
          function handleData(listItem, poi) {
            listItem.map((item, index) => {
              item.poi = poi + '-' + index;
              {
                item.ruleList?.map((ruleItem, ruleItemIndex) => {
                  ruleItem.priority = ruleItemIndex + 1;
                  handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
                });
              }
            });
          }
          return handleData(newData, 0);
        };
        droopData(arr);
        setList(arr);
      } else {
        let obj = {
          ruleList: [
            {
              list: [],
            },
          ],
        };
        let arr = [obj];
        setList(arr);
      }
    } else {
      let obj = {
        ruleList: [
          {
            list: handleProps(propsList, propsRuleSets),
          },
        ],
      };
      let arr = [obj];
      const droopData = data => {
        let newData = data;
        function handleData(listItem, poi) {
          listItem?.map((item, index) => {
            item.poi = poi + '-' + index;
            {
              item.ruleList?.map((ruleItem, ruleItemIndex) => {
                ruleItem.priority = ruleItemIndex + 1;
                handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
              });
            }
          });
        }
        return handleData(newData, 0);
      };
      droopData(arr);
      setList(arr);
    }
  }, [ruleList]);

  useEffect(() => {
    change && change(list);
    list?.map(item => {
      if (item.type === 6) {
        setIsFiles(true);
      }
    });
  }, [list]);

  const handleProps = (propsList, propsRuleSets) => {
    propsList = propsList.sort(compare('stepNumber'));
    let newList = JSON.parse(JSON.stringify(propsList || []));
    let newRuleList = JSON.parse(JSON.stringify(propsRuleSets || []));
    let removeArr: any = [];
    let list1: any = [];
    newList?.map((item, index) => {
      let itemRuleList: any = [];
      newRuleList.map((itemRule, itemRuleIndex) => {
        if (item.nodeId === itemRule.fromNodeId) {
          newList.map((twoItem, twoItemIndex) => {
            if (itemRule.toNodeId === twoItem.nodeId) {
              removeArr.push(twoItem);
              let itemRuleList = handleRuleItemList(twoItem) || [];
              itemRuleList.unshift(twoItem);
              itemRule.list = itemRuleList;
              // newList.splice(twoItemIndex,1)
            }
          });
          itemRuleList.push(itemRule);
        }
      });
      if (itemRuleList.length) {
        item.ruleList = itemRuleList;
      }
      list1.push(item);
    });

    function handleRuleItemList(nextItem) {
      let ruleListList: any = [];
      function handleRuleItemList1(nextItem) {
        newList.map((twoItem, index) => {
          if (nextItem.nextNodeId === twoItem.nodeId) {
            removeArr.push(twoItem);
            ruleListList.push(twoItem);
            if (twoItem.nextNodeId) {
              handleRuleItemList1(twoItem);
            }
          }
        });
      }
      handleRuleItemList1(nextItem);
      return ruleListList;
    }

    removeArr.map(item => {
      list1.map((item1, index) => {
        if (item.nodeId === item1.nodeId) {
          list1.splice(index, 1);
        }
      });
    });
    return list1;
  };

  const compare = (name: string) => {
    return (a, b) => {
      let v1 = a[name];
      let v2 = b[name];
      if (v2 > v1) {
        return -1;
      } else if (v2 < v1) {
        return 1;
      } else {
        return 0;
      }
    };
  };

  const moveCard = (index, index1) => {
    let newList = JSON.parse(JSON.stringify(list));
    let dragCard = newList[index];

    newList = update(newList, {
      $splice: [
        [index, 1],
        [index1, 0, dragCard],
      ],
    });

    newList?.map((item, index) => {
      item.stepNumber = index;
    });

    setList(newList);
  };

  const handleHiddleModal = () => {
    userkeyList = '';
    controlId = [];
    systemObj = {};
    form.setFieldsValue({
      type: undefined,
      specifiedLevel: undefined,
      signType: undefined,
      labelId: undefined,
    });
    setType(1);
    setSelectObj(undefined);
    setVisible(false);
  };

  // 新增的确认
  const handleAddOkModal = () => {
    form.validateFields().then(value => {
      let listObj: any = JSON.parse(JSON.stringify(list));
      let obj = value;
      obj.stepName = typeObj[type || 1];
      obj.resFormControlIds = controlId;
      obj.id = listObj.length + 'add';
      if (type === 6) {
        paramForm.validateFields().then(value1 => {
          form.setFieldsValue({
            type: undefined,
            specifiedLevel: undefined,
            signType: undefined,
            labelId: undefined,
          });
          setType(1);
          let archiveControlParams: any = [];
          for (let key in value1) {
            if (value1.id) {
              archiveControlParams.push({
                resApprArchiveDemandId: key,
                resFormControlId: value1[key],
                id: value1.id,
              });
            } else {
              archiveControlParams.push({
                resApprArchiveDemandId: key,
                resFormControlId: value1[key],
              });
            }
          }

          obj.archiveControlParams = archiveControlParams;
          obj.ruleList = ruleItem[ruleItem.index]?.ruleList;

          let newList = JSON.parse(JSON.stringify(list));
          const droopData1 = data => {
            let newData = data;
            function handleData(listItem, poi) {
              listItem?.map((item, index) => {
                item.poi = poi + '-' + index;
                if (item.poi === ruleItem.poi) {
                  if (item?.ruleList[ruleItem.index].list) {
                    item?.ruleList[ruleItem.index]?.list?.push(obj);
                  } else {
                    item.ruleList[ruleItem.index].list = [];
                    item?.ruleList[ruleItem.index]?.list?.push(obj);
                  }
                }
                item.ruleList?.map((ruleItem, ruleItemIndex) => {
                  handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
                });
              });
            }
            return handleData(newData, 0);
          };
          droopData1(newList);
          setList(newList);
          setVisible(false);
        });
      } else {
        if (type === 3) {
          if (userkeyList && userkeyList.length) {
            obj.userCodeList = userkeyList.join(',');
          } else {
            message.warning('请选择指定成员');
            // return;
          }
        } else if (type === 5) {
          if (systemObj?.input && systemObj?.audo) {
            obj.relationResFormControlId = systemObj?.input;
            obj.sysLabelId = systemObj?.audo;
          } else {
            message.warning('请选择系统标签以及标签参数');
            // return;
          }
        }

        let newList = JSON.parse(JSON.stringify(list));
        const droopData1 = data => {
          let newData = data;
          function handleData(listItem, poi) {
            listItem?.map((item, index) => {
              item.poi = poi + '-' + index;
              if (item.poi === ruleItem.poi) {
                if (item.ruleList[ruleItem.index]?.list) {
                  item?.ruleList[ruleItem.index]?.list?.push(obj);
                } else {
                  item.ruleList[ruleItem.index].list = [];
                  item?.ruleList[ruleItem.index]?.list?.push(obj);
                }
              }
              item.ruleList?.map((ruleItem, ruleItemIndex) => {
                handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
              });
            });
          }
          return handleData(newData, 0);
        };
        droopData1(newList);
        setList(newList);

        form.setFieldsValue({
          type: undefined,
          specifiedLevel: undefined,
          signType: undefined,
          labelId: undefined,
        });
        setType(1);
        setVisible(false);
      }
    });
  };

  const handleObjList = value1 => {
    let newList = JSON.parse(JSON.stringify(list));
    if (type === 6) {
      paramForm.validateFields().then(value => {
        handleHiddleModal();
        setType(1);
        setVisible(false);
        let archiveControlParams: any = [];
        for (let key in value) {
          if (value.id) {
            archiveControlParams.push({
              resApprArchiveDemandId: key,
              resFormControlId: value[key],
              id: value.id,
            });
          } else {
            archiveControlParams.push({
              resApprArchiveDemandId: key,
              resFormControlId: value[key],
            });
          }
        }
        value1.archiveControlParams = archiveControlParams;
        const droopData1 = data => {
          let newData = data;
          function handleData(listItem, poi) {
            listItem.map((item, index) => {
              item.poi = poi + '-' + index;
              if (item.poi === selectObj?.poi) {
                item = Object.assign(item, value1);
              }
              item.ruleList?.map((ruleItem, ruleItemIndex) => {
                handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
              });
            });
          }
          return handleData(newData, 0);
        };
        droopData1(newList);
        setList(newList);

        form.setFieldsValue({
          type: undefined,
          specifiedLevel: undefined,
          signType: undefined,
          labelId: undefined,
        });
      });
    } else {
      handleHiddleModal();
      setType(1);
      setVisible(false);
      const droopData1 = data => {
        let newData = data;
        function handleData(listItem, poi) {
          listItem.map((item, index) => {
            item.poi = poi + '-' + index;
            if (item.poi === selectObj?.poi) {
              Object.assign(item, value1);
            }
            item.ruleList?.map((ruleItem, ruleItemIndex) => {
              handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
            });
          });
        }
        return handleData(newData, 0);
      };
      droopData1(newList);
      setList(newList);
      form.setFieldsValue({
        type: undefined,
        specifiedLevel: undefined,
        signType: undefined,
        labelId: undefined,
      });
    }
  };
  // 编辑的确认
  const handleEditOkModal = () => {
    form.validateFields().then(value => {
      value.resFormControlIds = controlId;
      // handleObjList(value);
      switch (type) {
        case 1:
          handleObjList(value);
          return true;
        case 2:
          if (value.labelId) {
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择标签');
            return false;
          }
        case 3:
          if (userkeyList && userkeyList.length) {
            value.userCodeList = userkeyList.join(',');
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择指定成员');
            return false;
          }
        case 4:
          handleObjList(value);
          return true;
        case 5:
          if (
            (systemObj?.input && systemObj?.audo) ||
            (systemObj?.input === 0 && systemObj?.audo === 0)
          ) {
            value.relationResFormControlId = systemObj?.input;
            value.sysLabelId = systemObj?.audo;
            handleObjList(value);
            return true;
          } else {
            message.warning('请选择系统标签以及标签参数');
            return false;
          }
        default:
          handleObjList(value);
          return true;
      }
    });
  };
  // 获取人员
  const handleGetUser = value => {
    userkeyList = value;
  };
  // 获取组件id列表
  const handleGetControlIds = (value: any): void => {
    controlId = value;
    // controlId
  };
  // 获取系统标签id
  const handleSystem = value => {
    systemObj = value;
    // systemObj
  };
  // AddshowModal
  const handleAddShowModal = (ruleItem, index) => {
    setRuleItem({ ...ruleItem, index });
    form.setFieldsValue({
      type: 1,
      specifiedLevel: undefined,
      signType: undefined,
      labelId: undefined,
    });
    setType(1);
    setEdit(false);
    setVisible(true);
  };
  // 编辑的showmodal
  const handleEditShowmodal = selectItem => {
    systemObj = {
      audo: selectItem.sysLabelId,
      input: selectItem.relationResFormControlId,
    };
    setSelectObj(selectItem);
    setType(selectItem.type);
    form.setFieldsValue(selectItem || {});

    async function getP() {
      let json = await getParam(selectItem.archiveId);
      if (json.status === 200) {
        setParam(json.obj);
      }
    }

    if (selectItem.type === 6) {
      getP();
      selectItem.archiveControlParams?.map(item => {
        let obj: any = {};
        obj[item.resApprArchiveDemandId] = item.resFormControlId;
        paramForm.setFieldsValue(obj);
      });
    }

    setEdit(true);
    setVisible(true);
  };
  // 删除
  const handleRemove = items => {
    Modal.confirm({
      title: '确定删除?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: () => {
        let newList = JSON.parse(JSON.stringify(list));
        const droopData1 = data => {
          let newData = data;
          function handleData(listItem, poi) {
            listItem?.map((item, index) => {
              item.poi = poi + '-' + index;
              if (item.poi === items.poi) {
                listItem.splice(index, 1);
                return;
              } else {
                item.ruleList?.map((ruleItem, ruleItemIndex) => {
                  handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
                });
              }
            });
          }
          return handleData(newData, 0);
        };
        droopData1(newList);
        setList(newList);
      },
    });
  };
  // 类型
  const rendType1 = () => {
    return (
      <>
        <Form.Item
          name="specifiedLevel"
          initialValue={1}
          style={{ marginTop: 4 }}
          label="指定级别"
          rules={[
            { required: type === 1 ? true : false, message: '请选择指定职级!' },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择级别"
            style={{ maxWidth: '12vw' }}
          >
            {levelList.map((item, index) => {
              return (
                <Option key={index} value={index + 1}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </>
    );
  };

  // 展示name的modal
  const handleShowName = selectItem => {
    setSelectObj(selectItem);
    nameForm.setFieldsValue({ name: selectItem.stepName });
    setName(selectItem.stepName);
  };

  // name modal的ok
  const handleName = () => {
    nameForm.validateFields().then(fromSubData => {
      let newList = JSON.parse(JSON.stringify(list));
      const droopData1 = data => {
        let newData = data;
        function handleData(listItem, poi) {
          listItem?.map((item, index) => {
            item.poi = poi + '-' + index;
            if (item.poi === selectObj?.poi) {
              item.stepName = fromSubData.name;
            }
            item.ruleList?.map((ruleItem, ruleItemIndex) => {
              handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
            });
          });
        }
        return handleData(newData, 0);
      };
      droopData1(newList);
      setList(newList);
      setSelectObj(undefined);
      setName(undefined);
    });
  };

  // 新增分支显示modal
  const handleShowBranch = (type, index: number, item) => {
    setRuleItem(item);
    setSelectRule({ rule: item.ruleList, index: item?.ruleList?.length || 1 });
    if (type === '新增') {
      setConditionVisable('新增');
    } else {
      setConditionVisable('编辑');
    }
  };

  //编辑分支
  const handleEditBranch = (item, index: number) => {
    let ruleItem = item?.ruleList[index];
    let obj = {
      name: ruleItem?.name,
      priority: ruleItem?.priority,
      resRuleCurdParams: ruleItem?.resRuleCurdParams,
      selectItem: item,
      index: index,
    };
    setSelectRule(obj);
    setConditionVisable('编辑');
  };

  // 条件分支的ok
  const handleCondition = () => {
    let conditionForm = ref?.current?.getvalue();

    function handleType(str) {
      switch (str) {
        case 'applicant':
          return 1;
        case 'number':
          return 2;
        case 'money':
          return 2;
        case 'positionMLevel':
          return 4;
        case 'select':
          return 4;
        case 'multiple':
          return 4;
        case 'text':
          return 5;
        case 'text':
          return 5;
        case 'areatext':
          return 5;
      }
    }
    conditionForm.validateFields().then(async value => {
      let newItem: IruleSets | any;
      let newList = JSON.parse(JSON.stringify(list));
      let resRuleCurdParamsArr: any = [];
      for (let key in value) {
        if (key === 'priority' || key === 'name') {
        } else {
          let resRuleCurdParams: any;
          resRuleCurdParams = {
            comparetor: value[key].comparetor,
            type: handleType(value[key].type.split('&&')[1]),
            refResFormControl: value[key].type.split('&&')[0],
            value: value[key].value,
            id: value.id,
          };
          if (value[key].unitType === 0 || value[key].unitType) {
            resRuleCurdParams.unitType = value[key].unitType;
          }

          if (value[key].type.indexOf('applicant') > -1) {
            resRuleCurdParams.value = {
              memberTagIds: value[key]?.value?.memberTagIds,
              userCodes: value[key]?.value?.userCodes,
            };
          }
          if (
            value[key].type.indexOf('select') > -1 ||
            value[key].type.indexOf('positionMLevel') > -1 ||
            value[key].type.indexOf('multiple') > -1
          ) {
            resRuleCurdParams.value = value[key]?.value.join('|');
          }
          resRuleCurdParamsArr.push(resRuleCurdParams);
        }
        newItem = {
          name: value.name,
          priority: value.priority,
          resRuleCurdParams: resRuleCurdParamsArr,
        };
      }

      if (conditionVisable === '新增') {
        if (!ruleItem?.ruleList || !ruleItem?.ruleList?.length) {
          let poi = ruleItem.poi;
          let pItem: any = {};
          let poiArr = poi.split('-');
          let poipStr = poiArr.pop();
          let ruleIndex = poi.split('-')[poi.split('-').length - 2];
          poipStr = poiArr.pop();
          poipStr = poiArr.join('-');
          const droopData = data => {
            let newData = data;
            function handleData(listItem, i) {
              listItem?.map((item, index) => {
                if (poipStr === item.poi) {
                  pItem = item;
                  item?.ruleList[ruleIndex]?.list.map((cItem, cItemIndex) => {
                    if (cItem.poi === poi) {
                      let myList = item.ruleList[ruleIndex].list.splice(
                        cItemIndex + 1,
                        item.ruleList[ruleIndex].list.length - 1,
                      );
                      let pList = item.ruleList[ruleIndex].list.splice(
                        0,
                        cItemIndex + 1,
                      );
                      newItem.list = myList;
                      newItem.isDefault = 0;
                      item.ruleList[ruleIndex].list = pList;
                    }
                  });
                }
                if (item.poi === poi) {
                  item.ruleList = [newItem];
                  item.ruleList.push({
                    ...newItem,
                    priority: undefined,
                    resRuleCurdParams: undefined,
                    list: [],
                    name: '默认条件',
                    isDefault: 1,
                  });
                } else {
                  {
                    item.ruleList?.map((ruleItem, ruleItemIndex) => {
                      {
                        handleData(
                          ruleItem?.list,
                          item.poi + '-' + ruleItemIndex,
                        );
                      }
                    });
                  }
                }
              });
            }
            return handleData(newData, 0);
          };

          droopData(newList);

          const droopData1 = data => {
            let newData = data;
            function handleData(listItem, poi) {
              listItem?.map((item, index) => {
                item.poi = poi + '-' + index;
                {
                  item.ruleList?.map((ruleItem, ruleItemIndex) => {
                    handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
                  });
                }
              });
            }
            return handleData(newData, 0);
          };
          droopData1(newList);

          setList(newList);
        } else {
          const droopData1 = data => {
            let newData = data;
            function handleData(listItem, poi) {
              listItem?.map((item, index) => {
                item.poi = poi + '-' + index;
                if (item.poi === ruleItem.poi) {
                  newItem.list = [];
                  newItem.isDefault = 0;
                  item.ruleList.splice(item.ruleList.length - 1, 0, newItem);
                }
                item.ruleList?.map((ruleItem, ruleItemIndex) => {
                  handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
                });
              });
            }
            return handleData(newData, 0);
          };
          droopData1(newList);

          setList(newList);
        }
      } else {
        const droopData2 = data => {
          let newData = data;
          function handleData(listItem, poi) {
            listItem?.map((item, index) => {
              item.poi = poi + '-' + index;
              if (item.poi === selectRule?.selectItem.poi) {
                newItem.list = item.ruleList[selectRule?.index].list;
                item.ruleList[selectRule?.index] = newItem;
              }

              item.ruleList?.map((ruleItem, ruleItemIndex) => {
                handleData(ruleItem?.list, item.poi + '-' + ruleItemIndex);
              });
            });
          }
          return handleData(newData, 0);
        };
        droopData2(newList);

        setList(newList);
      }
      setConditionVisable(undefined);
    });
  };

  // 删除条件分支
  const handleRemoveRule = (indexs, items) => {
    Modal.confirm({
      title: '确定删除该分支?',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger' as any,
      cancelText: '取消',
      onOk: async () => {
        let newList = JSON.parse(JSON.stringify(list));
        const droopData1 = data => {
          let newData = data;
          function handleData(listItem, poi, pItem, pItemRuleIndex) {
            listItem?.map((item, index) => {
              if (!item || item == 'undefined') {
                listItem.splice(index, 1);
                return;
              } else {
                item.poi = poi + '-' + index;
                if (item.poi === items.poi) {
                  item.ruleList.splice(indexs, 1);
                  if (item.ruleList?.length === 1) {
                    // let arr = pItem.ruleList[pItemRuleIndex].list.concat(
                    //   item.ruleList[0].list,
                    // );
                    // pItem.ruleList[pItemRuleIndex].list = pItem.ruleList[pItemRuleIndex].list;
                    item.ruleList = [];
                    return;
                  }
                }
                item.ruleList?.map((ruleItem, ruleItemIndex) => {
                  handleData(
                    ruleItem?.list,
                    item.poi + '-' + ruleItemIndex,
                    item,
                    ruleItemIndex,
                  );
                });
              }
            });
          }
          return handleData(newData, 0, {}, 0);
        };
        droopData1(newList);
        setList(newList);
      },
    });
  };

  const renderModalBottom = useMemo(() => {
    switch (type) {
      case 1:
        return (
          <>
            {rendType1()}
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="同时有多个上级时"
              initialValue={0}
              rules={[
                {
                  required: type === 1 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
                <br />
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="请选择标签审批方式"
              initialValue={0}
              rules={[
                {
                  required: type === 2 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="labelId"
              style={{ marginTop: 4 }}
              label="标签"
              rules={[
                { required: type === 2 ? true : false, message: '请选择标签!' },
              ]}
            >
              <Select
                placeholder="请选择标签"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {labelList?.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.labelName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </>
        );
      case 3:
        return (
          <Collapse>
            <Panel header="指定人员" key="指定人员">
              <MoveInOz
                renderUser={true}
                onlySelectUser={true}
                renderDefault={true}
                change={handleGetUser}
                selectKeys={
                  selectObj?.userCodeList
                    ? selectObj?.userCodeList.split(',')
                    : []
                }
              />
            </Panel>
          </Collapse>
        );
      case 4:
        return null;
      case 5:
        return (
          <>
            <Form.Item
              name="signType"
              style={{ marginTop: 4 }}
              label="同时有多个上级时"
              initialValue={0}
              rules={[
                {
                  required: type === 5 ? true : false,
                  message: '请选择或签或者会签!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>会签（ 须所有上级同意 ）</Radio>
                <br />
                <Radio value={1}>或签（ 一名上级同意即可 ）</Radio>
              </Radio.Group>
            </Form.Item>
            <SystemLabel
              {...props}
              change={handleSystem}
              selectObj={selectObj}
            />
          </>
        );

      case 6:
        return (
          <Form.Item
            name="archiveId"
            style={{ marginTop: 4 }}
            label="归档操作"
            rules={[{ required: true, message: '请选择标签!' }]}
          >
            <Select
              allowClear
              placeholder="请选择标签"
              onChange={async e => {
                let json = await getParam(e);
                if (json.status === 200) {
                  setParam(json.obj);
                }
              }}
            >
              {handleList?.map(item => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  }, [type, selectObj]);

  const droopData = data => {
    let newData = JSON.parse(JSON.stringify(data || []));
    function handleData(listItem, poi) {
      let show = true;
      return listItem?.map((item, index) => {
        if (item.type === 6 && !item.stepName) {
          item.stepName = '归档';
        }
        if (!item || item == 'undefined') {
          listItem.splice(index, 1);
          return;
        }
        item.poi = poi + '-' + index;
        item?.ruleList &&
          item?.ruleList[0]?.list?.map(oneItem => {
            if (oneItem?.ruleList?.length >= 2) {
              show = false;
            } else {
              show = true;
              return;
            }
          });

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: 'auto',
            }}
          >
            {item.stepName || item.type === 6 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Card
                  key={index}
                  index={index}
                  moveCard={moveCard}
                  {...item}
                  item={item}
                  handleEditShowmodal={handleEditShowmodal}
                  handleShowName={handleShowName}
                  handleRemove={handleRemove}
                  setCardIndex={setCardIndex}
                />
                {index < listItem.length - 1 ? (
                  <span className="add-condition">
                    <span>...</span>
                    <PlusOutlined
                      style={{
                        border: '2px solid #999',
                        fontSize: 22,
                        padding: 2,
                        height: 28,
                        width: 28,
                        textAlign: 'center',
                        lineHeight: 26,
                        borderRadius: '28px 28px',
                        margin: 3,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        handleShowBranch('新增', index, item);
                      }}
                    />
                    <span>...</span>
                  </span>
                ) : null}
              </div>
            ) : null}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {item.ruleList?.length > 1 ? (
                  <div
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '5px 5px',
                      width: '5em',
                      height: '1.5em',
                      textAlign: 'center',
                      lineHeight: '1.5em',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleShowBranch('新增', index, item);
                    }}
                  >
                    <a>新增条件</a>
                  </div>
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {item.ruleList?.map((ruleItem, ruleItemIndex) => {
                    // if (!ruleItem?.list?.length || !ruleItem?.list) {
                    //   show = true;
                    // }
                    item?.ruleList &&
                      ruleItem?.list?.map(oneItem => {
                        if (oneItem?.ruleList?.length >= 2) {
                          show = false;
                        } else {
                          show = true;
                          return;
                        }
                      });

                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        {item.stepName ? (
                          <div
                            style={{
                              position: 'relative',
                              backgroundColor: '#ff9102',
                              color: '#fff',
                              width: '130px',
                              padding: '2px',
                              height: '80px',
                              margin: '20px',
                              borderRadius: '5px 5px',
                            }}
                            onClick={() => {
                              ruleItem.isDefault != 1
                                ? handleEditBranch(item, ruleItemIndex)
                                : null;
                            }}
                          >
                            <p style={{ margin: '4px' }}>
                              <span style={{ float: 'left' }}>
                                {ruleItem.name}
                              </span>
                              {ruleItem.isDefault != 1 ? (
                                <span style={{ float: 'right' }}>
                                  优先级{ruleItem.priority}
                                </span>
                              ) : null}
                            </p>
                            <div style={{ clear: 'both' }} />
                            {ruleItem.isDefault === 1 ? (
                              <div style={{ fontSize: 10 }}>
                                未满足其他条件分支的情况，将使用默认流程
                              </div>
                            ) : null}
                            {ruleItem.isDefault != 1 &&
                            ruleItem?.resRuleCurdParams?.length ? (
                              <div
                                style={{ fontSize: 10, textAlign: 'center' }}
                              >
                                <p>点击查看需满足的条件</p>
                              </div>
                            ) : null}
                            {ruleItem.isDefault != 1 &&
                            !ruleItem?.resRuleCurdParams?.length ? (
                              <div
                                style={{ fontSize: 10, textAlign: 'center' }}
                              >
                                请设置条件
                              </div>
                            ) : null}
                            {ruleItem.isDefault != 1 ? (
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '0px',
                                  top: '-2px',
                                  cursor: 'pointer',
                                }}
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveRule(ruleItemIndex, item);
                                }}
                              >
                                <CloseOutlined />
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                          }}
                        >
                          {handleData(
                            ruleItem?.list,
                            item.poi + '-' + ruleItemIndex,
                          )}
                        </div>
                        {show ? (
                          <div
                            className="add-item"
                            onClick={() => {
                              handleAddShowModal(item, ruleItemIndex);
                            }}
                          >
                            <PlusOutlined
                              style={{
                                marginTop: 10,
                                fontSize: 40,
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return handleData(newData, 0);
  };

  const renderBranchBox = useMemo(() => {
    return droopData(list);
  }, [list, data]);

  return (
    <div style={{ overflowX: 'auto', minHeight: '150px', width: '80vw' }}>
      {renderBranchBox}
      <Modal
        // key={visible + ''}
        width="56vw"
        title="设置"
        visible={visible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          handleHiddleModal();
        }}
        onOk={edit ? handleEditOkModal : handleAddOkModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="选择类型"
            rules={[{ required: true, message: '请选择类型!' }]}
          >
            <Radio.Group
              onChange={e => {
                const { value } = e.target;
                setType(value);
              }}
            >
              <Radio value={1}>
                上级（自动设置通讯录中的上级领导为审批人）
              </Radio>{' '}
              <br />
              <Radio value={2}>标签</Radio> <br />
              <Radio value={3}>指定成员</Radio> <br />
              <Radio value={4}>申请人</Radio> <br />
              <Radio value={5}>系统标签</Radio> <br />
              {!isFiles || selectObj?.type === 6 ? (
                <Radio value={6}>归档</Radio>
              ) : null}
            </Radio.Group>
          </Form.Item>
          <Divider />
          {renderModalBottom}
          <Divider />
          {type === 6 ? null : (
            <Assembly
              {...props}
              apiList={getFormSimple}
              header="表单控件可编辑权限设置（支持多选）"
              change={handleGetControlIds}
              selectKeys={selectObj?.resFormControlIds || []}
            />
          )}
        </Form>
        {type === 6 ? (
          <Form form={paramForm}>
            {param?.map(item => {
              return (
                <Form.Item
                  key={item.id}
                  style={{
                    width: '40%',
                    marginLeft: '5%',
                    display: 'inline-block',
                  }}
                  label={item.controlShowName}
                  name={item.id}
                  rules={[
                    {
                      required: true,
                      message: '请输入' + item.controlShowName + '!',
                    },
                  ]}
                >
                  <Select allowClear>
                    {controlList?.map(control => {
                      return (
                        <Option value={control.id} key={control.id}>
                          {control.childName + '_' + control.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              );
            })}
          </Form>
        ) : null}
      </Modal>
      <Modal
        title="修改名称"
        visible={!!name}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
          setSelectObj(undefined);
          setName(undefined);
        }}
        onOk={handleName}
      >
        <Form form={nameForm}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入节点名称!' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="条件分支设置"
        key={!conditionVisable + ''}
        visible={!!conditionVisable}
        okText="确认"
        cancelText="返回"
        onCancel={() => {
          setConditionVisable(undefined);
        }}
        onOk={handleCondition}
        width="60vw"
      >
        <Condition
          key={!conditionVisable}
          {...props}
          ref={ref}
          selectRule={selectRule}
        />
      </Modal>
    </div>
  );
};
