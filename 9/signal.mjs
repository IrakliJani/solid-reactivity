const executionStack = []

function subscribeToSignal(runningEffect, subscriptions) {
  subscriptions.add(runningEffect.run)
  runningEffect.dependencies.add(subscriptions)
}

function cleanupEffect(runningEffect) {
  for (const dependency of [...runningEffect.dependencies.values()]) {
    dependency.delete(runningEffect.run)
  }
  runningEffect.dependencies.clear()
}

export function createSignal(initialValue) {
  const state = {
    value: initialValue,
    effects: new Set()
  }

  function read() {
    const runningEffect = executionStack[executionStack.length - 1]
    if (runningEffect) {
      subscribeToSignal(runningEffect, state.effects)
    }

    return state.value
  }

  function write(fnOrValue) {
    if (typeof fnOrValue === 'function') {
      state.value = fnOrValue(state.value)
    } else {
      state.value = fnOrValue
    }

    for (const effect of [...state.effects.values()]) {
      effect()
    }
  }

  return [read, write]
}

export function createEffect(fn) {
  const run = () => {
    executionStack.push(runningEffect)
    cleanupEffect(runningEffect)

    try {
      fn()
    } finally {
      executionStack.pop()
    }
  }

  const runningEffect = {
    run,
    dependencies: new Set()
  }

  run()
}
