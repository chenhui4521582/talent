// 打卡地点设置
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Select, Form, Input } from 'antd';
import { Map, Marker, Circle } from 'react-amap';
import moment from 'moment';

import '../styles/scheduling.less';
const { Option } = Select;
export default props => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState<'edit' | 'add'>();
  const [inputValue, setInputValue] = useState<string>();
  const [optList, setOptList] = useState<any[]>([]);
  const [center, setCenter] = useState<any>();
  const [list, setList] = useState<any>([]);
  const [radius, setRadius] = useState<number>(500);

  const handleOk = () => {
    if (editType === 'edit') {
      setEditType(undefined);
      form.resetFields();
      return;
    }
    form.validateFields().then(value => {
      console.log(value);
      let newList = JSON.parse(JSON.stringify(list));
      console.log(value);
      newList.push(value);
      setList(newList);
      setEditType(undefined);
      form.resetFields();
      setCenter(undefined);
    });
  };

  const handleSearchChange = (val, isFocus = false) => {
    if (isFocus) {
      return;
    }
    const place = window.AMap.plugin('AMap.PlaceSearch', () => {
      let placeSearch = new window.AMap.PlaceSearch({
        input: 'tipinput',
        pageSize: 10,
        pageIndex: 1,
      });
      placeSearch.search(val, (status, result) => {
        const { info, poiList } = result;
        console.log(result);
        if (result.length) {
          return;
        }
        if (info !== 'OK') {
          return;
        }
        if (poiList.pois && Array.isArray(poiList.pois)) {
          console.log(poiList);
          setOptList(poiList.pois);
        }
      });
    });
  };

  const handleSelectChange = id => {
    const signAddrList = optList.find(item => item.id === id) || null;
    console.log(signAddrList);
    if (signAddrList) {
      setCenter(signAddrList);
      setInputValue(id);
      form.setFieldsValue({
        areaName: signAddrList.name,
        lng: signAddrList.location.lng,
        lat: signAddrList.location.lat,
      });
    }
  };

  const mapEvents = {
    ccreated: () => {
      let auto;
      window.AMap.plugin('AMap.Autocomplete', () => {
        auto = new window.AMap.Autocomplete({
          input: 'tipinput',
          pageSize: 10,
          pageIndex: 1,
          outPutDirAuto: true,
        });
      });
    },

    click: e => {
      if (editType === 'edit') {
        return;
      }
      const place = window.AMap.plugin('AMap.PlaceSearch', () => {
        let placeSearch = new window.AMap.PlaceSearch({
          input: 'tipinput',
          pageSize: 10,
          pageIndex: 1,
        });
        placeSearch.searchNearBy('', e.lnglat, 0, (status, result) => {
          const { info, poiList } = result;
          console.log(result);
          if (result.length) {
            return;
          }
          if (info !== 'OK') {
            return;
          }
          if (poiList.pois && Array.isArray(poiList.pois)) {
            console.log(poiList);
            setOptList(poiList.pois);
            setInputValue(poiList.pois[0].id);
            setCenter(poiList.pois[0]);
            form.setFieldsValue({
              areaName: poiList.pois[0].name,
              lng: poiList.pois[0].location.lng,
              lat: poiList.pois[0].location.lat,
            });
          }
        });
      });
    },
  };

  const renderList = useMemo(() => {
    console.log(list);
    return list.map((item, index) => {
      return (
        <div className="scheduling-box-one-item" key={index}>
          <span>{item.areaName}</span>
          <span>
            <a
              onClick={() => {
                setEditType('edit');
                setOptList([]);
                setInputValue(undefined);
                setCenter({
                  location: { ...item },
                });
                form.setFieldsValue(item);
              }}
            >
              查看地图
            </a>
          </span>
          <span>{item.lon}米</span>
          <span>
            <a
              style={{ marginLeft: 6 }}
              onClick={() => {
                let newList = JSON.parse(JSON.stringify(list));
                newList.splice(index, 1);
                setList(newList);
              }}
            >
              删除
            </a>
          </span>
        </div>
      );
    });
  }, [list]);

  return (
    <>
      <div style={{ minHeight: 40, display: 'inline-block' }}>
        <a
          style={{ padding: '0px 12px', lineHeight: '40px' }}
          onClick={() => {
            setEditType('add');
          }}
        >
          添加
        </a>
      </div>
      {list?.length ? (
        <div className="scheduling-box-one">{renderList}</div>
      ) : null}
      <Modal
        title={editType === 'edit' ? '修改打卡地点' : '新增打卡地点'}
        okText="确认"
        cancelText="取消"
        visible={!!editType}
        width="46vw"
        onOk={() => {
          handleOk();
        }}
        onCancel={() => {
          setEditType(undefined);
          form.resetFields();
          setCenter(undefined);
        }}
      >
        <div style={{ width: '43vw', height: '34vh' }}>
          <Select
            style={{ marginBottom: 10, width: 300 }}
            optionFilterProp="children"
            value={inputValue}
            showSearch
            placeholder="请输入地址"
            allowClear
            onSearch={handleSearchChange}
            onChange={handleSelectChange}
            onFocus={e => handleSearchChange('', true)}
            disabled={editType === 'edit' ? true : false}
          >
            {optList?.map(item => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <Map
            amapkey="85c4671059c4372b39b0f42cb5edab97"
            zoom={15}
            events={mapEvents}
            center={
              center ? [center?.location.lng, center?.location.lat] : undefined
            }
            plugins={['ToolBar', 'Scale']}
          >
            {center ? (
              <Marker position={[center.location.lng, center.location.lat]} />
            ) : null}
            {center ? (
              <Circle
                radius={radius}
                center={[center.location.lng, center.location.lat]}
                style={{ opacity: '0.1' }}
                bubble={true}
              />
            ) : null}
          </Map>
        </div>
        <Form form={form} style={{ marginTop: '10vh' }}>
          <Form.Item
            name="areaName"
            rules={[{ required: true, message: '请输入打卡名称!' }]}
            label="打卡名称"
            style={{ paddingLeft: 20 }}
          >
            <Input
              placeholder="请输入打卡名称"
              disabled={editType === 'edit' ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="lon"
            rules={[{ required: true, message: '请输入打卡名称!' }]}
            label="打卡范围"
            initialValue={500}
            style={{ paddingLeft: 20 }}
          >
            <Select
              onChange={e => {
                setRadius(e as number);
              }}
              disabled={editType === 'edit' ? true : false}
            >
              <Option value={500}>500米</Option>
              <Option value={1000}>1000米</Option>
            </Select>
          </Form.Item>
          <Form.Item name="lng" label="经度" style={{ display: 'none' }}>
            <Input disabled={editType === 'edit' ? true : false} />
          </Form.Item>
          <Form.Item name="lat" label="纬度" style={{ display: 'none' }}>
            <Input disabled={editType === 'edit' ? true : false} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
