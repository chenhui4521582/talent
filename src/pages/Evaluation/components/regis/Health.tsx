import React from 'react';
import { Form, Radio, Input } from 'antd';
import { newPageFormItemLayout } from '@/types/ITypes';

const { TextArea } = Input;
export default () => {
  return (
    <div>
      <Form.Item
        label="近半年内是否接受过全面体检"
        name={["healthModel","medicalExamination"]}
        rules={[{ required: true, message: '请选择近半年内是否接受过全面体检' }]}
        {...newPageFormItemLayout}
        extra="如选择是，请加以说明"
      >
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={2}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.healthModel?.medicalExamination !== currentValues.healthModel?.medicalExamination}
      >
        {({getFieldValue}) => {
          return getFieldValue('healthModel')?.medicalExamination === 1 ? (
            <Form.Item
              label="说明"
              name={["healthModel","medicalExaminationRemark"]}
              shouldUpdate
              rules={[{ required: true, message: '请填写说明' }]}
              {...newPageFormItemLayout}
            >
              <TextArea rows={4} />
            </Form.Item>
          ) : null
        }}
      </Form.Item>

      <Form.Item
        label="目前是否患有传染性疾病"
        name={["healthModel","infectiousDisease"]}
        rules={[{ required: true, message: '目前是否患有传染性疾病' }]}
        {...newPageFormItemLayout}
        extra="如选择是，请加以说明"
      >
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={2}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.healthModel?.infectiousDisease !== currentValues.healthModel?.infectiousDisease}
      >
        {({getFieldValue}) => {
          return getFieldValue('healthModel')?.infectiousDisease === 1 ? (
            <Form.Item
              label="说明"
              name={["healthModel","infectiousDiseaseRemark"]}
              shouldUpdate
              rules={[{ required: true, message: '请填写说明' }]}
              {...newPageFormItemLayout}
            >
              <TextArea rows={4} />
            </Form.Item>
          ) : null
        }}
      </Form.Item>

      <Form.Item
        label="是否患有其他影响工作的重大疾病"
        name={["healthModel","affectWorkDisease"]}
        rules={[{ required: true, message: '是否患有其他影响工作的重大疾病' }]}
        {...newPageFormItemLayout}
        extra="如选择是，请加以说明"
      >
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={2}>否</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.healthModel?.affectWorkDisease !== currentValues.healthModel?.affectWorkDisease}
      >
        {({getFieldValue}) => {
          return getFieldValue('healthModel')?.affectWorkDisease === 1 ? (
            <Form.Item
              label="说明"
              name={["healthModel","affectWorkDiseaseRemark"]}
              shouldUpdate
              rules={[{ required: true, message: '请填写说明' }]}
              {...newPageFormItemLayout}
            >
              <TextArea rows={4} />
            </Form.Item>
          ) : null
        }}
      </Form.Item>
    </div>
  )
}