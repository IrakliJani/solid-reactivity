import { createEffect, createSignal } from "./signal.mjs"

const [count, setCount] = createSignal(0)
const increment = () => setCount((value) => value + 1)

const [anotherCount, setAnotherCount] = createSignal(0)
const incrementAnotherCount = () => setAnotherCount((value) => value + 1)

const [toggle, setToggle] = createSignal(true)
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