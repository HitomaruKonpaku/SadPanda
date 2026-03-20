const ex = 'https://exhentai.org/'
const eh = 'https://e-hentai.org/'
let storeId = '0'

chrome.runtime.onInstalled.addListener(async () => {
  await prepareTabs(true)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const action = String(message.action).trim().toUpperCase()
  switch (action) {
    case 'IS_LOGGED_IN':
      isLoggedIn().then(sendResponse)
      return true
    case 'LOGIN':
      chrome.storage.session.set({
        loggingIn: true,
        originalUrl: message.originalUrl || '',
        loginTimestamp: Date.now(),
      })
      return false
    case 'LOGIN_SUCCESS':
      handleLoginSuccess(sendResponse)
      return true
    case 'LOGOUT':
      logout()
      return false
    case 'RELOAD':
      if (sender.tab?.id) {
        chrome.tabs.reload(sender.tab.id)
      }
      return false
  }
})

async function handleLoginSuccess(sendResponse) {
  const data = await chrome.storage.session.get([
    'loggingIn',
    'originalUrl',
    'loginTimestamp',
  ])
  if (data.loggingIn && Date.now() - data.loginTimestamp < 5 * 60 * 1000) {
    await chrome.storage.session.set({ loggingIn: false })
    await saveCookies()
    sendResponse(data.originalUrl || true)
  } else {
    sendResponse(true)
  }
}

async function prepareTabs(reload) {
  const foundTabs = await chrome.tabs.query({ url: `${ex}*` })

  for (const tab of foundTabs) {
    for (const store of await chrome.cookies.getAllCookieStores()) {
      if (store.tabIds.includes(tab.id)) {
        storeId = store.id
      }
    }
    if (reload) {
      await chrome.tabs.reload(tab.id)
    }
  }
}

async function isLoggedIn() {
  await prepareTabs()

  const memberId = await chrome.cookies.get({
    url: eh,
    name: 'ipb_member_id',
    storeId,
  })
  const passHash = await chrome.cookies.get({
    url: eh,
    name: 'ipb_pass_hash',
    storeId,
  })

  if (
    !memberId ||
    !passHash ||
    memberId.value === '0' ||
    memberId.value === '1' ||
    passHash.value === '0' ||
    passHash.value === '1'
  ) {
    return false
  }

  await saveCookies()

  return true
}

async function logout() {
  await prepareTabs()
  await deleteCookies()
  await prepareTabs(true)
}

function unixTime() {
  return Math.round(new Date().getTime() / 1000)
}

function cookieExpireTime() {
  return unixTime() + 172800
}

function getDomain(url) {
  return url.replace('https://', '.').replace('/', '')
}

async function saveCookies() {
  const allCookies = await chrome.cookies.getAll({
    domain: getDomain(eh),
    storeId,
  })

  for (const cookie of allCookies) {
    if (cookie.name.startsWith('ipb_') || cookie.name.startsWith('uconfig')) {
      await chrome.cookies.set({
        url: ex,
        domain: getDomain(ex),
        path: '/',
        name: cookie.name,
        value: cookie.value,
        expirationDate: cookieExpireTime(),
        storeId,
      })
    }
  }
}

async function deleteCookies() {
  await chrome.cookies.remove({ url: ex, name: 'yay', storeId })
  await chrome.cookies.remove({ url: ex, name: 'ipb_anonlogin', storeId })
  await chrome.cookies.remove({ url: ex, name: 'ipb_member_id', storeId })
  await chrome.cookies.remove({ url: ex, name: 'ipb_pass_hash', storeId })
  await chrome.cookies.remove({ url: ex, name: 'ipb_session_id', storeId })

  await chrome.cookies.remove({ url: eh, name: 'ipb_anonlogin', storeId })
  await chrome.cookies.remove({ url: eh, name: 'ipb_member_id', storeId })
  await chrome.cookies.remove({ url: eh, name: 'ipb_pass_hash', storeId })
  await chrome.cookies.remove({ url: eh, name: 'ipb_session_id', storeId })
}
