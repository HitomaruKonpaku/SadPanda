((global, factory) => {
  factory(global)
})(this, global => {
  console.debug('SadPanda#LogOut')

  global.SadPanda.logout = () => logout()

  const cssPaths = ['src/css/logout.css']

  jQuery(() => {
    if (!global.SadPanda.isAuth) {
      return
    }
    loadStyles()
    loadMenu()
  })

  function logout() {
    chrome.runtime.sendMessage({ action: 'LOGOUT' })
  }

  function loadStyles() {
    cssPaths.forEach(v => {
      $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: chrome.runtime.getURL(v)
      }).appendTo('head')
    })
  }

  function loadMenu() {
    const menu = $('#nb')
    menu.append($('<div/>')
      .append($('<a/>')
        .html('Sign out')
        .attr('href', '#')
        .click(() => {
          logout()
        })
      ))
  }
})
