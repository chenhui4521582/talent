import React, { useEffect, useState } from 'react';
import PDFObject from 'pdfobject';
import { history } from 'umi';
import { Row, Col, Button } from 'antd';
import { getResumePDFUrl } from './services/print';

export default props => {
  const options = {
    height: '900px',
    page: '1',
    pdfOpenParams: {
      view: 'FitV',
      pagemode: 'thumbs',
      search: 'lorem ipsum',
    },
  };
  const resumeId = props.location.query.resumeId;
  const resumeStatus = props.location.query.resumeStatus;
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  useEffect(() => {
    async function fetchUrl() {
      let res = await getResumePDFUrl(resumeId, resumeStatus);
      if (res.obj) {
        let url = res.obj.split(':')[1];
        PDFObject.embed(url, '#pdf', options);
      } else {
        setIsEmpty(true);
      }
    }
    fetchUrl();
  }, []);
  const handleReset = () => {
    history.goBack();
  };
  return (
    <div>
      {isEmpty ? (
        <p
          style={{
            marginTop: 300,
            textAlign: 'center',
            marginBottom: 350,
            color: '#1890ff',
            fontSize: 20,
          }}
        >
          简历暂时无法预览，请通过修改进行查看
        </p>
      ) : (
        <div id="pdf" style={{ minHeight: '800px' }}></div>
      )}
      <Row style={{ marginTop: 20 }}>
        <Col offset={12}>
          <Button onClick={handleReset}>返回</Button>
        </Col>
      </Row>
    </div>
  );
};
