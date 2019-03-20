$(document).ready(onReady_In)

function onReady_In() {
  //
  console.log('SadPanda IN ready!')
  //
  const panda = $(`img[src="${document.URL}"]`)
  const pandaLength = panda.length
  if (!pandaLength) {
    return
  }
  //
  createApp()
}

function createApp() {
  // Load CSS
  [
    'cdn/css/bootstrap.min.css',
    'src/css/login.css'
  ].forEach(v => {
    $('<link/>', {
      rel: 'stylesheet',
      type: 'text/css',
      href: chrome.extension.getURL(v)
    }).appendTo('head')
  })
  // Load form
  $('body').load(chrome.extension.getURL('src/html/login.html'), loadApp)
}

function loadApp() {
  // Vue app
  const app = new Vue({
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
    computed: {},
    mounted: function () {
      this.loadStorage()
      this.popToastSuccess('Ready!')
    },
    methods: {
      popToast({ level, message }) {
        const toast = {
          type: level,
          body: message,
          timeout: 5000
        }
        this.$vueOnToast.pop(toast)
      },
      popToastSuccess(message) {
        const level = 'success'
        this.popToast({ level, message })
      },
      popToastError(message) {
        const level = 'error'
        this.popToast({ level, message })
      },
      loadStorage() {
        const remember = localStorage.getItem('exh_sddd')
        if (remember === '1') {
          this.remember = true
        } else {
          return
        }
        const username = localStorage.getItem('exh_user')
        const password = localStorage.getItem('exh_pass')
        if (username) {
          this.username = username
        }
        if (password) {
          this.password = window.atob(password)
        }
      },
      saveStorage() {
        if (this.remember) {
          localStorage.setItem('exh_user', this.username)
          localStorage.setItem('exh_pass', window.btoa(this.password))
          localStorage.setItem('exh_sddd', '1')
          return
        }
        localStorage.removeItem('exh_user')
        localStorage.removeItem('exh_pass')
        localStorage.removeItem('exh_sddd')
      },
      login() {
        //
        this.disabled = true
        //
        const username = encodeURIComponent(this.username)
        const password = encodeURIComponent(this.password)
        //
        const url = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01'
        const dataObject = {
          referer: 'https://forums.e-hentai.org/index.php',
          UserName: username,
          PassWord: password,
          CookieDate: 1
        }
        const data = Object.keys(dataObject)
          .map(v => [v, dataObject[v]].join('='))
          .join('&')
        // Send message to background script
        chrome.runtime.sendMessage({
          action: 'login',
          data: { url, data }
        }, res => {
          // Success
          if (res.success) {
            this.saveStorage()
            this.popToastSuccess(res.success)
            return
          }
          // Error or Fail
          this.popToastError(res.error || res.fail)
          this.enableUI()
        })
      },
      enableUI() {
        this.disabled = false
        this.$nextTick(() => { this.$refs.username.select() })
      }
    }
  })
  console.log(app)

  // Custom
  $('.toast-container')
    .removeClass('vot-top-right')
    .addClass('vot-top-left')
}
