function createSignal(initialValue) {
  let value = initialValue

  function read() {
    return value
  }

  function write(fnOrValue) {
    if (typeof fnOrValue === 'function') {
      value = fnOrValue(value)
    } else {
      value = fnOrValue
    }
  }

  return [read, write]
}

function createEffect(fn) {
  fn()
}

const [count, setCount] = createSignal(0)
const increment = () => setCount((value) => value + 1)

createEffect(() => {
  console.log(count())
})

setInterval(() => {
  increment()
}, 1000)
