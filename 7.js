const executionStack = []

function createSignal(initialValue, { name }) {
  const state = {
    value: initialValue,
    effects: new Set()
  }

  function read() {
    const effect = executionStack[executionStack.length - 1]
    if (effect) {
      state.effects.add(effect)
    }

    return state.value
  }

  function write(fnOrValue) {
    if (typeof fnOrValue === 'function') {
      state.value = fnOrValue(state.value)
    } else {
      state.value = fnOrValue
    }

    for (const fn of [...state.effects.values()]) {
      state.effects.delete(fn)
      // console.log(`running effect from ${name}`)
      runEffect(fn)
    }
  }

  return [read, write]
}

function createEffect(fn) {
  runEffect(fn)
}

function runEffect(fn) {
  executionStack.push(fn)

  try {
    fn()
  } finally {
    executionStack.pop()
  }
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