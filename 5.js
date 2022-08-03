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
const increment = () => setCount((value) => value + 1)

createEffect(() => {
  console.log('count is: ', count())
})

setInterval(() => {
  increment()
}, 1000)
