import React from 'react';
import { FolderOutlined } from '@ant-design/icons';
import { MenuDataItem } from '@ant-design/pro-layout';

const IconMap = {
  folder: <FolderOutlined />,
};

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path: string) {
  return reg.test(path);
}

function formatter(data, parentPath: string) {
  return data?.map(item => {
    let { path, icon } = item;
    if (!isUrl(path)) {
      path = item.path;
    }
    const result = {
      ...item,
      icon: icon && IconMap[icon as string],
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = (menu: MenuDataItem[], path: string) =>
  formatter(menu, path + '/');
