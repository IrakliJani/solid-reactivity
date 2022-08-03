const executionStack = []

function createSignal(initialValue) {
  let value = initialValue
  let listeners = new Set()

  function read() {
    const listener = executionStack[executionStack.length - 1]
    if (listener) listeners.add(listener)

    return value
  }

  function write(fnOrValue) {
    if (typeof fnOrValue === 'function') {
      value = fnOrValue(value)
    } else {
      value = fnOrValue
    }

    listeners.forEach((listener) => listener())
  }

  return [read, write]
}

function createEffect(fn) {
  executionStack.push(fn)
  fn()
  executionStack.pop()
}

const [count, setCount] = createSignal(0)
const doubleCount = () => count() * 2
const increment = () => setCount((value) => value + 1)

const [anotherCount, setAnotherCount] = createSignal(0)
const incrementAnotherCount = () => setAnotherCount((value) => value + 1)

createEffect(() => {
  console.log('double count is: ', doubleCount())
})

createEffect(() => {
  console.log('another count is: ', anotherCount())
})

setInterval(() => {
  increment()
}, 1000)

setInterval(() => {
  incrementAnotherCount()
}, 500)