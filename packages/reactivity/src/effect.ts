export let activeEffect: undefined | ReactiveEffect = void 0;

const targetMap = new WeakMap();

class ReactiveEffect {
  // 默认是激活状态
  public active = true;
  // 使用parent 解决嵌套effect
  public parent: undefined | ReactiveEffect = void 0;
  // 解决分支切换清空effect
  public deps: Set<ReactiveEffect>[] = [];
  constructor(public fn) {}

  run() {
    // 如果是非激活，只需要执行函数，不需要进行依赖收集
    if (!this.active) {
      return this.fn();
    }

    // 调用回调函数，进行依赖收集
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
// 一个effect对应多个属性，一个属性对应多个effect
export function track(target: object, type: string, key: string) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key) as Set<ReactiveEffect>;
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  const shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    // 一个属性对应多个effect
    dep.add(activeEffect);
    // 一个effect对应多个属性
    activeEffect.deps.push(dep);
  }
}

export function trigger(
  target: object,
  type: string,
  key: string,
  value,
  oldValue
) {
  const depsMap = targetMap.get(target);
  // 触发的值不在模板中使用
  if (!depsMap) return;

  const effects = depsMap.get(key) as Set<ReactiveEffect>;
  effects &&
    effects.forEach((effectFn) => {
      // 防止无限递归
      if (effectFn !== activeEffect) {
        effectFn.run();
      }
    });
}
