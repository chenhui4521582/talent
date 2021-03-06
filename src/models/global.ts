import { GlobalResParams } from '@/types/ITypes';
import { useEffect, useState } from 'react';
import {
  queryBusiness,
  IBusiness,
  queryJob,
  IJob,
  queryRole,
  listDepartment,
  IDepartment,
  listRank,
  listMRank,
  IRank,
  listTitle,
  ITitle,
  listCostCenter,
  ICost,
  listLabor,
  ILabor,
  listCompany,
  IResumeCompany,
  getOrganization,
  getDeleteGroup,
  getDefaultGroup,
  tsListItem,
  tsDeleteItem,
  tsDefaultItem,
  getlevelOr,
  tsLevelOr,
} from '@/services/global';

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
};

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
};

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
};

export const useDepartment = (level: number) => {
  const [departmentList, setDepartmentList] = useState<IDepartment[]>();
  useEffect(() => {
    async function fetchDepartment() {
      let res: GlobalResParams<IDepartment[]> = await listDepartment(level);
      setDepartmentList(res.obj);
    }
    fetchDepartment();
  }, []);
  return { departmentList };
};

export const useRankP = () => {
  const [rankList, setRankList] = useState<IRank[]>();
  useEffect(() => {
    async function fetchRank() {
      let res: GlobalResParams<IRank[]> = await listRank();
      setRankList(res.obj);
    }
    fetchRank();
  }, []);
  return { rankList };
};

export const useRankM = () => {
  const [rankList, setRankList] = useState<IRank[]>();
  useEffect(() => {
    async function fetchRank() {
      let res: GlobalResParams<IRank[]> = await listMRank();
      setRankList(res.obj);
    }
    fetchRank();
  }, []);
  return { rankList };
};

export const useTitle = () => {
  const [titleList, setTitleList] = useState<ITitle[]>();
  useEffect(() => {
    async function fetchTitle() {
      let res: GlobalResParams<ITitle[]> = await listTitle();
      setTitleList(res.obj);
    }
    fetchTitle();
  }, []);
  return { titleList };
};

export const useCost = () => {
  const [costList, setCostList] = useState<ICost[]>();
  useEffect(() => {
    async function fetchCost() {
      let res: GlobalResParams<ICost[]> = await listCostCenter();
      setCostList(res.obj);
    }
    fetchCost();
  }, []);
  return { costList };
};

export const useLabor = () => {
  const [laborList, setLaborList] = useState<ILabor[]>();
  useEffect(() => {
    async function fetchLabor() {
      let res: GlobalResParams<ILabor[]> = await listLabor();
      setLaborList(res.obj);
    }
    fetchLabor();
  }, []);
  return { laborList };
};

// 公司列表
export const useCompany = () => {
  const [companyList, setCompanyList] = useState<IResumeCompany[]>([]);
  useEffect(() => {
    async function fetchLabor() {
      let res: GlobalResParams<IResumeCompany[]> = await listCompany();
      setCompanyList(res.obj);
    }
    fetchLabor();
  }, []);
  return { companyList };
};

// 组织架构主体
export const useOrganization = () => {
  const [organizationJson, setOrganizationJson] = useState<tsListItem[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshs = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    async function fetchOrganization() {
      let res: GlobalResParams<tsListItem[]> = await getOrganization();
      setOrganizationJson(res.obj);
    }
    fetchOrganization();
  }, [refresh]);
  return { organizationJson, refresh: refreshs };
};
// 组织结构默认分组
export const usetDeleteOrganization = () => {
  const [deleteGroupJson, setDeleteGroupJson] = useState<tsDeleteItem[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshs = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    async function fetchOrganization() {
      let res: GlobalResParams<tsDeleteItem[]> = await getDeleteGroup();
      setDeleteGroupJson(res.obj);
    }
    fetchOrganization();
  }, [refresh]);
  return { deleteGroupJson, refreshDel: refreshs };
};

// 组织架构已删除人员
export const usetDefaultOrganization = () => {
  const [defaultGroupJson, setdefaultGroupJson] = useState<tsDefaultItem[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const refreshs = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    async function fetchOrganization() {
      let res: GlobalResParams<tsDefaultItem[]> = await getDefaultGroup();
      setdefaultGroupJson(res.obj);
    }
    fetchOrganization();
  }, [refresh]);
  return { defaultGroupJson, refreshDef: refreshs };
};

// 分层级获取组织架构 code:'' 标识一级业务线
export const useLevelOr = code => {
  const [list, setList] = useState<tsLevelOr[]>();
  useEffect(() => {
    async function fetchLabor() {
      let res: GlobalResParams<tsLevelOr[]> = await getlevelOr(code);
      setList(res.obj);
    }
    fetchLabor();
  }, []);
  return { list };
};
