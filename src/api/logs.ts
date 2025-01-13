import { http } from "@/utils/http";

export interface LoginLogPageDto {
  /** IP地址 */
  ip: string;
  /** 姓名 */
  name: string;
  /** 第几页 */
  pageNum: number;
  /** 每页条数 */
  pageSize: number;
  /** 状态：0-失败，1-成功 */
  status: 0 | 1;
  /** 类型：0-前台，1-后台 */
  type: 0 | 1;
}

export interface LoginLogItem {
  /** ID */
  id: number;
  /** IP地址 */
  ip: string;
  /** 消息 */
  msg: string;
  /** 用户名 */
  name: string;
  /** 状态：0-失败，1-成功 */
  status: 0 | 1;
  /** 时间戳 */
  time: number;
  /** 类型：0-前台，1-后台 */
  type: 0 | 1;
  /** 用户ID */
  userId: number;
}

type Result<T = any> = {
  code: number;
  data: {
    total: number;
    list: Array<T>;
  };
};
export const getLogs = (data: LoginLogPageDto) => {
  return http.request<Result<LoginLogItem>>("post", "/back/loginlog/list", {
    data
  });
};
