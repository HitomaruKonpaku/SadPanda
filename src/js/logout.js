$(document).ready(onReady)

function onReady() {
  const menu = $('#nb')
  if (!menu) {
    return
  }

  menu.append($('<div/>')
    .append($('<a/>')
      .html('Sign out')
      .attr('href', '#')
      .click(() => {
        chrome.runtime.sendMessage({ action: 'logout' })
      })
    ))
}
