function createSignal(initialValue) {
  let value = initialValue

  function read() {
    return value
  }

  function write(newValue) {
    value = newValue
  }

  return [read, write]
}

const [count, setCount] = createSignal(0)
console.log(count()) // 0
const increment = () => setCount((count() + 1))
increment()
console.log(count()) // 1