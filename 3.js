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

const [count, setCount] = createSignal(0)
console.log(count()) // 0
const increment = () => setCount((value) => value + 1)
       // equivalent of setCount(value() + 1)
increment()
console.log(count()) // 1