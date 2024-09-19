"use strict"

let n = 0
for (let i = 0; ; i++) {
  for (let j = 0; j < 1000000000000; j++) n += j
  const currentDateTime = new Date()
  console.log(`${i}\t${currentDateTime.toLocaleString()}`)
}
