const executionStack = []

function createSignal(initialValue, { name }) {
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
      // console.log(`running effect from ${name}`)
      effect()
    }
  }

  return [read, write]
}

function createEffect(fn) {
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

const [count, setCount] = createSignal(0, { name: 'count' })
const increment = () => setCount((value) => value + 1)

const [anotherCount, setAnotherCount] = createSignal(0, { name: 'anotherCount' })
const incrementAnotherCount = () => setAnotherCount((value) => value + 1)

const [toggle, setToggle] = createSignal(true, { name: 'toggle' })
const flipToggle = () => setToggle((value) => !value)

createEffect(() => {
  if (toggle()) {
    console.log(`count: ${count()}`)
  } else {
    console.log(`anotherCount: ${anotherCount()}`)
  }
})

setInterval(() => {
  increment()
}, 1000)

setInterval(() => {
  incrementAnotherCount()
}, 200)

setInterval(() => {
  flipToggle()
}, 3000)