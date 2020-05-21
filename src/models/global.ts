import { GlobalResParams } from '@/types/ITypes';
import { useEffect, useState } from 'react';
import { queryBusiness, IBusiness, queryJob, IJob, queryRole } from '@/services/global';

export const useBusiness = () => {
  const [businessList, setBusinessList] = useState<IBusiness[]>(); 
  useEffect(() => {
    async function fetchBusiness() {
      let res: GlobalResParams<IBusiness[]> = await queryBusiness();
      setBusinessList(res.obj);
    }
    fetchBusiness();
  }, []);
  return { businessList };
} 

export const useJob = () => {
  const [jobList, setJobList] = useState<IJob[]>(); 
  useEffect(() => {
    async function fetchJob() {
      let res: GlobalResParams<IJob[]> = await queryJob();
      setJobList(res.obj);
    }
    fetchJob();
  }, []);
  return { jobList };
}

export const useRole = (type: number) => {
  const [roleList, setRoleList] = useState<any[]>(); 
  useEffect(() => {
    async function fetchRole() {
      let res: GlobalResParams<any[]> = await queryRole(type);
      setRoleList(res.obj);
    }
    fetchRole();
  }, []);
  return { roleList };
}

