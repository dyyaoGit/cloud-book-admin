var c

let promise = new Promise(resolve => {


  setTimeout(() => {
    c = 998
    resolve()
  },0)
})


promise.then(function () {
  console.log(c)
})

