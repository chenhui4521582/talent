import React, { useState } from 'react';
import { Card, Upload, Row, Col, Progress, notification, Popover, Divider } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { GlobalResParams } from '@/types/ITypes';
import { importRoster } from './services/staff';

const Dragger = Upload.Dragger;

export default () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const customRequest = async (files) => {
    let res: GlobalResParams<string> = await importRoster({file: files.file});
    if(res.status === 200) {
      let list = {
        name: files.file.name,
        percent: 100,
        uploadStatus: res.msg,
        result: res.obj ? res.obj : [],
        statusColor: res.status === 200 ? 'normal' : 'exception'
      };
      setFileList([...fileList, list]);
    }else {
      notification['error']({
        message: res.msg,
        description: '',
      });
    }
  }
  const props = {
    name: 'file',
    multiple: true,
    action: '',
    accept:'.xlsx,.xls,.pdf,.txt',
    showUploadList: false,
    customRequest: customRequest
  };
  return (
    <Card style={{minHeight: 500}} title="批量导入">
      <Row>
        <Col span={16} offset={4}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">将文件拖拽至此区域</p>
          </Dragger>
          <div style={{maxHeight: 500,marginTop:50 }}>
            {fileList.map((item,i) => {
              return <div key={i}>
                <Row>
                  <Col span={7}><span>{item.name}</span></Col>
                  <Col span={12}>
                    <Progress
                      status={item.statusColor}
                      percent={item.percent}
                      format={
                        () => <a>{item.uploadStatus}{item.result.length > 0
                        ?
                        <Popover content={<div>{item.result.map(item => {return <p>{item}-员工编号已存在</p>})}</div>}>
                          <span>详情</span>
                        </Popover>
                        :
                        ''}</a>} />
                      </Col>
                </Row>
                <Divider />
              </div>
            })}
          </div>
        </Col>
      </Row>
    </Card>
  )
}