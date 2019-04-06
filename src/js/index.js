(function () {
  'use strict'

  window.SadPanda = {}

  $(document).ready(() => {
    console.log('SadPanda#Index')
    const panda = $(`img[src="${document.URL}"]`)
    const isLoggedIn = !panda.length
    window.SadPanda.isLoggedIn = isLoggedIn
    // console.log(window.SadPanda)
  })

})()
