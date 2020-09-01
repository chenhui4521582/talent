import React, { useState, useMemo, useEffect } from 'react';
import { Collapse, Select, Radio, Divider, Row, Col } from 'antd';
import { getLableList } from '@/pages/Framework/services/system';
import { getFormSimple } from '../services/rule';
import { GlobalResParams } from '@/types/ITypes';

const { Panel } = Collapse;
const { Option } = Select;

interface tsRolrLable {
  id: number;
  labelName: string;
  status: number;
  updatedBy: string | null;
  remark?: string;
}

export default props => {
  // props.change
  const [list, setList] = useState<tsRolrLable[]>([]);
  const [selectI, setSelectI] = useState<string>();
  const [selectA, setSelectA] = useState<string>();
  const [optionList, setOptionList] = useState<any>([]);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const id = props.match.params.id;
    let res: GlobalResParams<tsRolrLable[]> = await getLableList();
    if (res.status === 200) {
      setList(res.obj);
    }
    let res1: GlobalResParams<any[]> = await getFormSimple(id);
    if (res1.status === 200) {
      setOptionList(res1.obj);
    }
  };

  useEffect(() => {
    props.selectObj?.relationResFormControlId
      ? setSelectI(props.selectObj?.relationResFormControlId + '')
      : '';
    props.selectObj?.sysLabelId
      ? setSelectA(props.selectObj?.sysLabelId + '')
      : '';
  }, [props.selectObj, optionList, list]);

  const renderList = useMemo(() => {
    return (
      <Radio.Group
        style={{ height: 300, width: '20vw', overflowY: 'auto' }}
        onChange={e => {
          const { target } = e;
          setSelectA(target.value);
          props.change({
            audo: target.value,
            input: selectI,
          });
        }}
        value={selectA}
      >
        {list.map(item => {
          return (
            <>
              <Radio style={{ marginTop: 6 }} value={item.id.toString()}>
                {item.labelName}
              </Radio>{' '}
              <br />
            </>
          );
        })}
      </Radio.Group>
    );
  }, [optionList, selectA, list, selectI]);

  const renderRight = useMemo(() => {
    return (
      <Select
        placeholder="请选择控件名称"
        style={{ minWidth: '32vh' }}
        onChange={value => {
          setSelectI(value.toString());
          props.change({
            audo: selectA,
            input: value.toString(),
          });
        }}
        value={selectI}
      >
        {optionList.map(item => {
          return (
            <Option value={item.id.toString()}>
              {item.childName + '-' + item.name}
            </Option>
          );
        })}
      </Select>
    );
  }, [optionList, selectA, list, selectI]);

  return (
    <>
      <Collapse>
        <Panel header="系统标签" key="系统标签">
          <Row>
            <Col>{renderList}</Col>
            <Col>
              <div
                style={{
                  display: 'inline-block',
                  width: '20vw',
                  height: 300,
                  borderLeft: '1px solid #d9d9d9',
                  overflowY: 'auto',
                  paddingLeft: 16,
                }}
              >
                <div style={{ marginBottom: 16 }}>需添加动态参数：1 个</div>
                {renderRight}
                <div style={{ marginTop: 16 }}>
                  {' '}
                  {list.map(item => {
                    if (item.id.toString() === selectA?.toString()) {
                      return <span>备注:{item.remark}</span>;
                    }
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </>
  );
};
