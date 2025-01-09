import { defineStore } from "pinia";
import {
  // type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  // type DataInfo,
  type DataInfo1,
  setToken,
  removeToken,
  userKey
} from "@/utils/auth";
import { loginApi } from "@/api/login";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): any => ({
    // 电话
    phone: storageLocal().getItem<DataInfo1>(userKey)?.phone ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo1>(userKey)?.username ?? "",
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_PHONE(phone: string) {
      this.phone = phone;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<any>((resolve, reject) => {
        loginApi(data)
          .then(res => {
            if (res.code === 200) {
              setToken(res.msg);
              resolve(res);
            } else {
              reject(res.msg);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
