chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message)
  const action = String(message.action).trim().toUpperCase()
  switch (action) {
    case 'LOGIN':
      login(message, sender, sendResponse)
      return true
    case 'LOGOUT':
      logout(sender)
      return
  }
})

async function login(message, sender, sendResponse) {
  deleteCookies()
  const url = message.data.url
  const body = message.data.body
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })
    const content = await response.text()
    console.log(content)
    if (content.includes('You are now logged in as')) {
      sendResponse({})
      setTimeout(() => {
        saveCookies()
        const tabId = sender.tab.id
        chrome.tabs.sendMessage(tabId, { action: 'RELOAD' })
      })
      return
    }
    if (content.includes('Username or password incorrect')) {
      throw new Error('Username or password incorrect!')
    }
    sendResponse({
      error: {
        message: 'Authentication error!',
        redirect: 'https://forums.e-hentai.org/index.php?act=Login&CODE=01'
      }
    })
  } catch (error) {
    sendResponse({
      error: {
        name: error.name,
        message: error.message
      }
    })
  }
}

function logout(sender) {
  deleteCookies()
  const tabId = sender.tab.id
  chrome.tabs.sendMessage(tabId, { action: 'RELOAD' })
}

function unixTime() {
  return Math.round((new Date()).getTime() / 1000)
}

function cookieExpireTime() {
  return unixTime() + 172800
}

function saveCookies() {
  chrome.cookies.getAll({ domain: '.e-hentai.org' }, function (cookies) {
    console.log(cookies)
    cookies.forEach(cookie => {
      if (!['ipb_', 'uconfig'].some(v => cookie.name.includes(v))) {
        return
      }
      const cookieNew = {
        url: 'https://exhentai.org/',
        name: cookie.name,
        value: cookie.value,
        domain: '.exhentai.org',
        path: '/',
        // expirationDate: cookieExpireTime()
        expirationDate: cookie.expirationDate
      }
      chrome.cookies.set(cookieNew)
    })
  })
}

function deleteCookies() {
  //
  const ex = 'https://exhentai.org/'
  const eh = 'http://e-hentai.org/'
  //
  chrome.cookies.remove({ url: ex, name: 'yay' })
  chrome.cookies.remove({ url: ex, name: 'ipb_anonlogin' })
  chrome.cookies.remove({ url: ex, name: 'ipb_member_id' })
  chrome.cookies.remove({ url: ex, name: 'ipb_pass_hash' })
  chrome.cookies.remove({ url: ex, name: 'ipb_session_id' })
  //
  chrome.cookies.remove({ url: eh, name: 'ipb_anonlogin' })
  chrome.cookies.remove({ url: eh, name: 'ipb_member_id' })
  chrome.cookies.remove({ url: eh, name: 'ipb_pass_hash' })
  chrome.cookies.remove({ url: eh, name: 'ipb_session_id' })
}
