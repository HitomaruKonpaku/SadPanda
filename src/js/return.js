const timer = setInterval(() => {
  const home = $('#userlinks > p.home > b')

  if (home.length && home.text().trim()) {
    chrome.runtime.sendMessage(
      {
        action: 'LOGIN_SUCCESS',
      },
      (result) => {
        clearInterval(timer)

        if (typeof result === 'string') {
          window.location.href = result
        }
      }
    )
  }
}, 1000)
