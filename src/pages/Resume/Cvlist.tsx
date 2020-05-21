import React from 'react';
import Cvowner from './Cvowner';
import { queryResume } from './services/cvlist';

export default () => {
  return (
    <Cvowner name="简历列表" queryMethod={queryResume} />
  )
}