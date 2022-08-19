import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

export const mutableHandlers = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 收集依赖
    track(target, "get", key);
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, recevier);
    // 旧值和新值是否一样
    if (!oldValue !== value) {
      // 更新
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  },
};
