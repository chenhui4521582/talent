import React, { useState, useMemo, useEffect } from 'react';
import { Collapse, Select, Radio, Divider, Row, Col } from 'antd';
import { ColumnProps } from 'antd/es/table';
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
}

// interface tsProps{
//   apiList: () => Promise<any>

// }

export default props => {
  // const { apiList } = props;
  const [list, setList] = useState<tsRolrLable[]>([]);
  const [selectId, setSelectId] = useState<string[]>([]);
  const [optionList, setOptionList] = useState<any>([]);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    console.log(props);
    const id = props.match.params.id;
    let res: GlobalResParams<tsRolrLable[]> = await getLableList();
    if (res.status === 200) {
      setList(res.obj);
    }
    let res1: GlobalResParams<any[]> = await getFormSimple(id);
    if (res.status === 200) {
      setOptionList(res.obj);
    }
  };

  const renderList = useMemo(() => {
    return (
      <Radio.Group
        style={{ height: 300, width: '20vw', overflowY: 'auto' }}
        onChange={e => {
          console.log(e);
        }}
      >
        {' '}
        {list.map(item => {
          return (
            <>
              <Radio style={{ marginTop: 6 }} value={item.id}>
                {item.labelName}
              </Radio>{' '}
              <br />
            </>
          );
        })}
      </Radio.Group>
    );
  }, [list]);

  const renderRight = useMemo(() => {
    return (
      <Select placeholder="请选择控件名称" style={{ minWidth: '17vh' }}>
        <Option value="1">1</Option>
      </Select>
    );
  }, []);

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
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </>
  );
};
