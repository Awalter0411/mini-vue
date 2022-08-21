import { isObject } from "@mini-vue/shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags } from "./reactive";

export const mutableHandlers = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 收集依赖
    track(target, "get", key);
    const res = Reflect.get(target, key, recevier);
    // 深度代理
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },
  set(target, key, value, recevier) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, recevier);
    // 旧值和新值是否一样
    if (!oldValue !== value) {
      // 更新
      trigger(target, "set", key);
    }
    return result;
  },
};
