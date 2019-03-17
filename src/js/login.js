$(document).ready(() => {
  if (!isLoggedIn()) {
    return
  }
  exSignIn()
})

function isLoggedIn() {
  let panda = $(`img[src="${document.URL}"]`)
  let check = panda.length
  return check
}

function exSignIn() {
  $('body').load(chrome.extension.getURL('src/html/login.html'), () => {
    let vue = new Vue({
      el: '#app',
      data: {
        username: '',
        password: '',
        remember: false,
        disabled: false,
        image: {
          logo: {
            github: chrome.extension.getURL('src/img/GitHub-Mark-Light-64px.png')
          }
        }
      },
      mounted: function () {
        window.SadPanda = this
        this.storageLoad()
        this.toastSuccess('Ready!')
      },
      computed: {
        toastCustomConfig: function () {
          return {
            positionClass: 'vot-top-center'
          }
        }
      },
      methods: {
        toastPop: function (level, message) {
          let toast = {
            type: level,
            body: message,
            timeout: 5000
          }
          this.$vueOnToast.pop(toast)
        },
        toastSuccess: function (message) {
          this.toastPop('success', message)
        },
        toastError: function (message) {
          this.toastPop('error', message)
        },
        login: function () {
          this.uiDisable()

          let username = encodeURIComponent(this.username)
          let password = encodeURIComponent(this.password)

          let url = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01'
          let data = 'referer=https://forums.e-hentai.org/index.php&UserName=' + username + '&PassWord=' + password + '&CookieDate=1'

          $.post(url, data)
            .done((res) => {
              chrome.runtime.sendMessage(res)

              if (res.indexOf('You are now logged in as:') != -1) {
                vue.toastSuccess('You are now logged in!')
                chrome.runtime.sendMessage('cookieDataSet', vue.loginSuccess)
                return
              }

              if (res.indexOf('Username or password incorrect') != -1) {
                vue.toastError('Login failure!')
              } else if (res.indexOf('You must already have registered for an account before you can log in') != -1) {
                vue.toastError('No account exists with name "' + username + '"')
              } else {
                vue.toastError('Error parsing login result page!')
                chrome.runtime.sendMessage('cookieDataSet', vue.loginSuccess)
              }
            })
            .fail(() => {
              vue.toastError('Error sending POST request to forums.e-hentai.org!')
            })
            .always(() => {
              vue.uiEnable()
            })
        },
        loginSuccess: function (status) {
          if (status == 'ok') {
            this.storageSave()
            this.reload()
            return
          }

          this.toastError(status)
        },
        uiDisable: function () {
          this.disabled = true
        },
        uiEnable: function () {
          this.disabled = false
        },
        storageLoad: function () {
          let loadSaved = localStorage.getItem('exh_sddd')
          if (loadSaved == '1') {
            this.remember = true
          } else {
            return
          }

          let savedUser = localStorage.getItem('exh_user')
          let savedPass = localStorage.getItem('exh_pass')
          if (savedUser != null && savedPass != null) {
            this.username = savedUser
            this.password = savedPass
          }
        },
        storageSave: function () {
          if (this.remember == true) {
            localStorage.setItem('exh_user', this.username)
            localStorage.setItem('exh_pass', this.password)
            localStorage.setItem('exh_sddd', '1')
            return
          }

          localStorage.removeItem('exh_user')
          localStorage.removeItem('exh_pass')
          localStorage.removeItem('exh_sddd')
        },
        reload: function () {
          chrome.runtime.sendMessage('reload')
        }
      }
    })
  })
}
