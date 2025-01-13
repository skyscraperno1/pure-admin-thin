import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
};

type AuthData = {
  phone: string | number;
};
/**获取验证码 */
export const sendAuthCode = (data: AuthData) => {
  return http.request<Result>("post", "/get-card-list", { data });
};

/** 登录 */
export const loginApi = (data?: object) => {
  return http.request<Result>("post", "/back/auth/login", { data });
};

/** 登出 */
export const logoutApi = () => {
  return http.request<Result>("post", "/back/auth/logout");
};

/** 获取用户信息 */
export const getUserInfo = (data?: object) => {
  return http.request<Result>("get", "/back/admin/info", { data });
};
