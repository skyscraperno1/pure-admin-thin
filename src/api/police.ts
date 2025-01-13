import { http } from "@/utils/http";

export interface PoliceDto {
  /** ID */
  id?: number;
  /** 姓名 */
  name: string;
  /** 手机 */
  phone: string;
  /** 警官证 */
  policeCard: string;
  /** 警局ID */
  policeStationId: number;
  /** 职务（刑侦、经侦等部门） */
  position: string;
  /** 区域ID */
  regionId: string;
}

export interface PolicePageDto {
  /** 姓名 */
  name?: string;
  /** 第几页 */
  pageNum: number;
  /** 每页条数 */
  pageSize: number;
  /** 手机号 */
  phone?: string;
}

type Result<T = any> = {
  code: number;
  data: T;
};

type PageResult<T = any> = {
  code: number;
  data: {
    total: number;
    list: Array<T>;
  };
};

/**
 * 新增警员
 */
export const addPolice = (data: PoliceDto) => {
  return http.request<Result<any>>("post", "/back/police/add", {
    data
  });
};

/**
 * 删除警员
 */
export const deletePolice = (ids: number[]) => {
  return http.request<Result<any>>("post", "/back/police/delete", {
    params: { ids }
  });
};

/**
 * 获取警员列表
 */
export const getPoliceList = (data: PolicePageDto) => {
  return http.request<PageResult<PoliceDto>>("post", "/back/police/list", {
    data
  });
};

/**
 * 更新警员信息
 */
export const updatePolice = (data: PoliceDto) => {
  return http.request<Result<any>>("post", "/back/police/update", {
    data
  });
};
