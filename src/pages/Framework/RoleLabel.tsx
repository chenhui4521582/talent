import React, { useState, useEffect, useMemo } from 'react';
import { getLableList, getLableMemberList } from './services/role';
import { GlobalResParams } from '@/types/ITypes';
import { Card, Input, Table, Popconfirm, Modal, Divider } from 'antd';
import { ColumnProps } from 'antd/es/table';
import './style/role.less';

const { Search } = Input;

interface tsRolrLable {
  id: number;
  labelName: string;
  status: number;
  updatedBy: string | null;
}

interface tsUser {
  department: string;
  departmentCode: string;
  id: number;
  labelId: null | number;
  memberType: number;
  name: string;
  userCode?: string;
}

const columns: ColumnProps<tsUser>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
];

export default () => {
  const [dataList, setDataList] = useState<tsRolrLable[]>([]);
  const [mount, setMount] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<tsRolrLable>();
  const [removeLableVisible, setRemoveLableVisible] = useState<boolean>(false);
  const [changeLableVisible, setChangeLableVisible] = useState<boolean>(false);
  const [changeOrAdd, setChangeOrAdd] = useState<'add' | 'change'>();
  const [userList, setUserList] = useState<tsUser[]>();

  useEffect(() => {
    getApilableList();
  }, []);

  const getApilableList = async () => {
    let json: GlobalResParams<tsRolrLable[]> = await getLableList();
    if (json.status === 200) {
      setDataList(json.obj);
      setMount(true);
    }
  };

  const searchChange = (e): void => {
    console.log(e);
  };

  const handleSelectRole = async (item: tsRolrLable) => {
    setSelectItem(item);
    let json: GlobalResParams<tsUser[]> = await getLableMemberList(item.id);
    if (json.status === 200) {
      setUserList(json.obj);
    }
  };

  const renderRoleLable = useMemo(() => {
    return dataList.map(item => {
      return (
        <div
          className={
            item.id === selectItem?.id ? 'role-select-item' : 'role-item'
          }
          key={item.id}
          onClick={e => {
            handleSelectRole(item);
          }}
        >
          {item.labelName}
          {item.id === selectItem?.id ? (
            <Popconfirm
              key={changeLableVisible + '' + removeLableVisible}
              icon={<></>}
              onConfirm={() => {}}
              onCancel={() => {}}
              placement="bottomLeft"
              cancelButtonProps={{ style: { display: 'none' } }}
              okButtonProps={{ style: { display: 'none' } }}
              okText=""
              cancelText=""
              title={
                <div style={{ marginLeft: '-11px' }}>
                  <div
                    className="alert-hover"
                    onClick={() => {
                      setChangeLableVisible(true);
                      setChangeOrAdd('change');
                    }}
                  >
                    修改名称
                  </div>
                  <div
                    className="alert-hover"
                    onClick={() => {
                      setRemoveLableVisible(true);
                    }}
                  >
                    删除
                  </div>
                </div>
              }
            >
              <span className="more">⋮</span>
            </Popconfirm>
          ) : null}
        </div>
      );
    });
  }, [dataList, selectItem, removeLableVisible, changeLableVisible]);

  const renderRight = useMemo(() => {
    const tableTitle = (
      <div className="table-title">
        <span
          onClick={() => {
            // setMoveInVisible(true);
          }}
        >
          从其他部门移入
        </span>
        <Divider type="vertical" />
        <span
          onClick={() => {
            // setRemoveUserVisible(true);
          }}
        >
          移除
        </span>
      </div>
    );

    {
      return selectItem ? (
        <div className="role-right">
          {`${selectItem?.labelName}(${userList?.length})`}
          <Table
            title={() => {
              return tableTitle;
            }}
            style={{ width: '60vw' }}
            columns={columns}
            dataSource={userList}
            rowSelection={rowSelection}
          />
        </div>
      ) : null;
    }
  }, [userList, selectItem]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <Card title="角色标签管理" className="role">
      <div style={{ width: '20%' }} className="role-left">
        {mount ? (
          <Search
            type="search"
            placeholder="请搜索"
            onChange={searchChange}
            style={{ marginBottom: 30 }}
          />
        ) : null}
        <div className="role-title">
          所有标签名
          <span
            onClick={() => {
              setChangeLableVisible(true);
              setChangeOrAdd('add');
            }}
          >
            +
          </span>
        </div>
        {renderRoleLable}
      </div>
      {renderRight}

      <Modal
        title="删除标签"
        visible={removeLableVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setRemoveLableVisible(false);
        }}
        onOk={() => {
          setRemoveLableVisible(false);
        }}
      >
        <h3>确认删除？</h3>
        <div>删除标签不会导致包含部门或成员从组织架构删除</div>
      </Modal>
      <Modal
        title={changeOrAdd === 'add' ? '新建标签' : '修改名称'}
        visible={changeLableVisible}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setChangeLableVisible(false);
        }}
        onOk={() => {
          setChangeLableVisible(false);
        }}
      >
        <div>标签名称</div>
        {changeOrAdd === 'add' ? (
          <Input placeholder="如：行政/财务/华南区/领导" />
        ) : (
          <Input
            placeholder="如：行政/财务/华南区/领导"
            defaultValue={selectItem?.labelName}
          />
        )}
      </Modal>
    </Card>
  );
};
