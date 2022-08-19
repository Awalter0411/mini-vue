import { track } from "./effect";
import { ReactiveFlags } from "./reactive";

export const mutableHandlers = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, "get", key);
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    return Reflect.set(target, key, value, recevier);
  },
};
