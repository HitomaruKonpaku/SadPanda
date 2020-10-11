((global, factory) => {
  if (global.SadPanda.isAuth) {
    return
  }
  factory(global)
})(this, global => {
  console.debug('SadPanda#LogIn')

  const htmlPath = 'src/html/login.html'
  const cssPaths = [
    'cdn/css/jquery.toast.min.css',
    'cdn/css/bootstrap.min.css',
    'src/css/login.css'
  ]
  const logoPath = 'src/img/sad-panda.jpg'

  jQuery(() => {
    // clearHead()
    loadStyles()
    loadBody()
  })

  function clearHead() {
    $('head').html('')
  }

  function loadStyles() {
    cssPaths.forEach(v => {
      $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: chrome.runtime.getURL(v)
      }).appendTo('head')
    })
  }

  function loadBody() {
    $('body').load(
      chrome.runtime.getURL(htmlPath),
      loadApp
    )
  }

  function loadApp() {
    const App = {
      data() {
        return {
          logoSrc: '',
          username: '',
          password: '',
          isRemember: false,
          isDisabled: false
        }
      },
      mounted() {
        this.logoSrc = chrome.runtime.getURL(logoPath)
        this.loadStorage()
        this.username = global.SadPanda.username || this.username || ''
        this.password = global.SadPanda.password || this.password || ''
      },
      methods: {
        loadStorage() {
          const isRemember = localStorage.getItem('exh_sddd')
          if (isRemember !== '1') {
            return
          }
          this.isRemember = true
          const username = localStorage.getItem('exh_user')
          const password = localStorage.getItem('exh_pass')
          this.username = username
          this.password = password

        },
        saveStorage() {
          if (this.isRemember) {
            localStorage.setItem('exh_user', this.username)
            localStorage.setItem('exh_pass', this.password)
            localStorage.setItem('exh_sddd', '1')
            return
          }
          localStorage.removeItem('exh_user')
          localStorage.removeItem('exh_pass')
          localStorage.removeItem('exh_sddd')
        },
        onSubmit() {
          this.login()
        },
        login() {
          this.isDisabled = true
          const username = encodeURIComponent(this.username)
          const password = encodeURIComponent(this.password)
          const url = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01'
          const params = new URLSearchParams()
          params.append('referer', 'https://forums.e-hentai.org/index.php')
          params.append('UserName', username)
          params.append('PassWord', password)
          params.append('CookieDate', 1)
          const body = params.toString()
          const message = {
            action: 'LOGIN',
            data: { url, body }
          }
          chrome.runtime.sendMessage(message, response => {
            const error = response.error
            if (error) {
              const message = error.message
              this.showErrorToast(message)
              const redirect = error.redirect
              if (redirect) {
                setTimeout(() => {
                  location.assign(redirect)
                })
                return
              }
              this.isDisabled = false
              return
            }
            this.saveStorage()
            const message = 'You are now logged in!'
            this.showSuccessToast(message)
          })
        },
        showSuccessToast(text) {
          $.toast(this.getToastOptions({
            text,
            icon: 'success',
            bgColor: 'var(--success)'
          }))
        },
        showErrorToast(text) {
          $.toast(this.getToastOptions({
            text,
            icon: 'error',
            bgColor: 'var(--danger)'
          }))
        },
        getToastOptions(config) {
          const options = {
            showHideTransition: 'fade',
            hideAfter: 3000,
            position: 'bottom-right',
            textColor: '#fff',
            loaderBg: 'transparent',
            ...config
          }
          return options
        }
      }
    }

    const app = Vue
      .createApp(App)
      .mount('#app')
    global.SadPanda.app = app
  }
})
