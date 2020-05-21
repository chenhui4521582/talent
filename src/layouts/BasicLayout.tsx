import React, { useState, useEffect } from 'react';
import ProLayout, { MenuDataItem } from '@ant-design/pro-layout';
import { Link, IRouteComponentProps } from 'umi';
import logo from '@/assets/logo.svg';
import { Dropdown, Spin, Menu } from 'antd';
import { queryMenus, IMenusparams, queryCurrent, ICurrentUserParams } from '@/services/global';
import {
  FolderOutlined, LogoutOutlined, UserOutlined, EditOutlined
} from '@ant-design/icons';
import styles from './BasicLayout.less';
import ChangeInfo from '@/components/BasicLayout/ChangeInfo';
import ChangePwd from '@/components/BasicLayout/ChangePwd';
import { GlobalResParams } from '@/types/ITypes';
import { getMenuData } from '@/utils/menu';
import { removeToken, getToken } from '@/utils/cookies';

interface KeyParams {
  key: string;
}

export default (props: IRouteComponentProps) => {
  const projectRoutes = '/' + props.location.pathname.split('/')[1];
  const [menus, setMenus] = useState<MenuDataItem[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<ICurrentUserParams>();
  const [modalName, setModalName] = useState<string>('');
  useEffect(() => {
    async function fetchMenus() {
      let response: GlobalResParams<IMenusparams> = await queryMenus({projectRoutes});
      setMenus(response.obj?.menuList);
      setProjectName(response.obj?.projectName);
    };
    fetchMenus();
  }, []);

  async function fetchCurrent() {
    let response: GlobalResParams<ICurrentUserParams> = await queryCurrent();
    setCurrentUser(response.obj);
  };

  useEffect(() => {
    if (getToken('ods_token_front')) {
      fetchCurrent();
    } else {
      window.location.href = document.location.protocol + '//mp.jdd-hub.com/account/login';
    }
  }, []);

  const handleMenuClick = ({ key }: KeyParams) => {
    if (key === 'logout') {
      removeToken('ods_token_front');
      window.location.href = document.location.protocol + '//mp.jdd-hub.com/account/login';
    } else {
      setModalName(key);
    }
  };

  const dropdownMenu = (
    <Menu style={{width: 160}} onClick={handleMenuClick}>
      <Menu.Item key="account">
        <UserOutlined />账户信息
      </Menu.Item>
      <Menu.Item key="changPwd">
        <EditOutlined />修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />退出登录
      </Menu.Item>
    </Menu>
  );
  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: icon && <FolderOutlined style={{marginRight: 10}} />,
      children: children && loopMenuItem(children),
    }));
  return (
    <div>
      <ProLayout
        style={{
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
        title={projectName}
        logo={logo}
        menuItemRender={(menuItemProps: any, defaultDom) => {
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        menuDataRender={() =>getMenuData(menus, projectRoutes)}
        rightContentRender={() => {
          if (currentUser) {
            return (
              <div style={{marginRight: 20}}>
                <Dropdown overlay={dropdownMenu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <span><UserOutlined /> {currentUser.userName}</span>
                  </span>
                </Dropdown>
              </div>
            )
          } else {
            return (
              <Spin size="small" style={{ marginLeft: 8, marginRight: 20 }} />
            )
          }
        }}
      >
        {props.children}
      </ProLayout>
      <ChangeInfo
        modalName={modalName}
        currentUser={currentUser}
        setModalName={setModalName}
        fetchCurrent={fetchCurrent}
      />
      <ChangePwd
        modalName={modalName}
        setModalName={setModalName}
      />
    </div>
  );
};
