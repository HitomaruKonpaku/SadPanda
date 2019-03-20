$(document).ready(onReady_Out)

function onReady_Out() {
  //
  console.log('SadPanda OUT ready!')
  //
  const menu = $('#nb')
  if (!menu) {
    return
  }
  //
  menu.append($('<div/>')
    .append($('<a/>')
      .html('Sign out')
      .attr('href', '#')
      .click(() => {
        chrome.runtime.sendMessage({ action: 'logout' })
      })
    ))
}
