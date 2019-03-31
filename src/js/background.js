chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  //
  const action = String(message.action).toLowerCase().trim()
  const data = Object(message.data)
  const tabId = sender.tab.id
  // LOGIN
  if (action === 'login') {
    deleteCookies();
    (async () => {
      try {
        //
        const res = await fetch(data.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data.data
        })
        //
        const content = await res.text()
        console.log(content)
        // Success
        if (content.includes('You are now logged in as')) {
          sendResponse({ success: 'You are now logged in!' })
          saveCookies()
          reload(tabId)
          return
        }
        // Fail
        if (content.includes('Username or password incorrect')) {
          sendResponse({ fail: 'Username or password incorrect!' })
        } else if (content.includes('You must already have registered for an account before you can log in')) {
          sendResponse({ fail: 'Username does not exist!' })
        } else {
          sendResponse({ fail: 'Error parsing login result page!' })
        }
      } catch (err) {
        console.error(err)
        sendResponse({ error: err.message })
      }
    })()
    return true
  }
  // LOGOUT
  if (action === 'logout') {
    deleteCookies()
    reload(tabId)
  }
})

function reload(tabId) {
  if (tabId) {
    chrome.tabs.reload(tabId)
    return
  }
  chrome.tabs.query({ active: true }, function (tabs) {
    if (!tabs || !tabs.length) return
    const id = tabs[0].id
    chrome.tabs.reload(id)
  })
}

function unixTime() {
  return Math.round((new Date()).getTime() / 1000)
}

function cookieExpireTime() {
  return unixTime() + 172800
}

function saveCookies() {
  chrome.cookies.getAll({ domain: '.e-hentai.org' }, function (cookies) {
    cookies.forEach(cookie => {
      if (['ipb_', 'uconfig'].some(v => cookie.name.includes(v))) {
        chrome.cookies.set({
          url: 'https://exhentai.org/',
          name: cookie.name,
          value: cookie.value,
          domain: '.exhentai.org',
          path: '/',
          expirationDate: cookieExpireTime()
        })
      }
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
