import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { GlobalResParams } from '@/types/ITypes';

export const useRes = () => {
  const [globalRes, setGlobalRes] = useState<GlobalResParams<string> | undefined>();
  useEffect(() => {
    if (globalRes) {
      if (globalRes.status === 200) {
        notification['success']({
          message: globalRes.msg,
          description: '',
        });
      } else {
        notification['error']({
          message: globalRes.msg,
          description: '',
        });
      }
      setGlobalRes(undefined);
    }
  }, [globalRes])
  return { setGlobalRes };
}