import { http } from "@/utils/http";

export interface AdminDto {
  /** ID */
  id?: number;
  /** 昵称 */
  name: string;
  /** 密码 */
  password: string;
  /** 手机号 */
  phone: string;
}

export interface AdminItem {
  /** ID */
  id: number;
  /** 昵称 */
  name: string;
  /** 手机号 */
  phone: string;
  /** 创建时间 */
  createTime: number;
  /** 最后登录时间 */
  lastLoginTime: number;
}

export interface ModifyPasswordDto {
  /** 新密码 */
  newPassword: string;
  /** 旧密码 */
  oldPassword: string;
}

type Result<T = any> = {
  code: number;
  data: T;
};

/**
 * 添加管理员
 */
export const addAdmin = (data: AdminDto) => {
  return http.request<Result<any>>("post", "/back/admin/add", {
    data
  });
};

/**
 * 删除管理员
 */
export const deleteAdmin = (ids: number[]) => {
  return http.request<Result<any>>("post", "/back/admin/delete", {
    data: ids
  });
};

/**
 * 获取管理员角色
 */
export const getAdminRole = (adminId: number) => {
  return http.request<Result<any>>("post", "/back/admin/getadminrole", {
    params: { adminId }
  });
};

/**
 * 获取管理员列表
 */
export const getAdminList = () => {
  return http.request<Result<AdminItem[]>>("post", "/back/admin/list");
};

/**
 * 修改密码
 */
export const modifyPassword = (data: ModifyPasswordDto) => {
  return http.request<Result<any>>("post", "/back/admin/modifypassword", {
    data
  });
};

/**
 * 设置管理员角色
 */
export const setAdminRole = (adminId: number) => {
  return http.request<Result<any>>("post", "/back/admin/setadminrole", {
    params: { adminId }
  });
};

/**
 * 更新管理员信息
 */
export const updateAdmin = (data: AdminDto) => {
  return http.request<Result<any>>("post", "/back/admin/update", {
    data
  });
};
