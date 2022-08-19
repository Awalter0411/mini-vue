export let activeEffect: undefined | ReactiveEffect = void 0;

const targetMap = new WeakMap();

class ReactiveEffect {
  // 默认是激活状态
  public active = true;
  // 使用parent 解决嵌套effect
  public parent: undefined | ReactiveEffect = void 0;
  constructor(public fn) {}

  run() {
    // 如果是非激活，只需要执行函数，不需要进行依赖收集
    if (!this.active) {
      return this.fn();
    }

    // 进行依赖收集
    this.parent = activeEffect;
    activeEffect = this;
    const result = this.fn();
    activeEffect = this.parent;

    return result;
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

// 收集依赖
export function track(target: object, type: string, key: string) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

// export function trigger() {}
