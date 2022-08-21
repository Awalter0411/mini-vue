import { isFunction } from "@mini-vue/shared";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
  public getter;
  public setter;
  public effect;
  public _dirty = true;
  public __v_isReadonly = true;
  public __v_isRef = true;
  public _value;
  public dep = new Set();
  constructor(getter, setter) {
    // 将用户的getter放到effect中，收集起来
    this.effect = new ReactiveEffect(getter, () => {
      // 稍后依赖的属性变化会执行此调度函数
      if (!this._dirty) {
        this._dirty = true;
        // 触发更新
        triggerEffects(this.dep);
      }
    });
    this.getter = getter;
    this.setter = setter;
  }
  get value() {
    // 收集依赖
    trackEffects(this.dep);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}

export function computed(getterOrOptions) {
  const isOnlyGetter = isFunction(getterOrOptions);

  let getter;
  let setter;

  if (isOnlyGetter) {
    getter = getterOrOptions;
    setter = () => console.warn("no setter");
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}
