$(document).ready(() => {
  exSignOut()
})

function exSignOut() {
  let menu = $('#nb')
  if (!menu) {
    return
  }

  let img = $($('img', menu)[0]).clone()
  let a = $($('a', menu)[0]).clone()
    .html('Sign out')
    .attr('href', '#')
    .attr('id', 'haruhichanSignOut')
    .click(() => {
      console.log('Sign out...')
      chrome.runtime.sendMessage('deleteAllCookies', function () {
        chrome.runtime.sendMessage('reload', function () { })
      })
    })

  menu.append(img, a)
}
