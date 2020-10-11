((global, factory) => {
  factory(global)
})(this, global => {
  global.SadPanda = {
    isDev: false,
    isAuth: false,
    username: '',
    password: '',
    '': ''
  }

  if (!global.SadPanda.isDev) {
    console.debug = () => { }
  }

  console.debug('SadPanda#Inject')

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const action = String(message.action).trim().toUpperCase()
    if (action === 'RELOAD') {
      location.reload()
    }
  })

  const bodyLength = $('body').html().length
  global.SadPanda.isAuth = bodyLength > 0
})
