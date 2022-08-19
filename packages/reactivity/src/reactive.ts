import { isObject } from "@mini-vue/shared";
import { mutableHandlers } from "./baseHandlers";

export const reactiveMap = new WeakMap();

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}

export function reactive(target) {
  // 判断是否是对象
  if (!isObject(target)) {
    return;
  }

  // 此时已经是代理对象
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 判断weakmap是否存在代理对象
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
