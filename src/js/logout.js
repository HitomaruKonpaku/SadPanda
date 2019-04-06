(function () {
  'use strict'

  $(document).ready(() => {
    if (!window.SadPanda.isLoggedIn) return
    console.log('SadPanda#LogOut')
    run()
  })

  function run() {
    loadCSS()
    loadUI()
  }

  function loadCSS() {
    const files = [
      'src/css/logout.css'
    ]
    files.forEach(v => {
      $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: chrome.runtime.getURL(v)
      }).appendTo('head')
    })
  }

  function loadUI() {
    const menu = $('#nb')
    // console.log(menu)
    menu.append($('<div/>')
      .append($('<a/>')
        .html('Sign out')
        .attr('href', '#')
        .click(() => {
          chrome.runtime.sendMessage({ action: 'logout' })
        })
      ))
  }

})()
