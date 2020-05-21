import React from 'react';
import AdminBole from './Adminbole';
import { queryHrBole } from './services/bole';

export default () => {
  return (
    <AdminBole queryMethod={queryHrBole} />
  )
}