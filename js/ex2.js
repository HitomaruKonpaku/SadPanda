$(document).ready(() => {
    $('body').load(chrome.extension.getURL('html/ex.html'), function () {
        var app = new Vue({
            el: '#app',
            data: {
                message: 'Sign in',
                user: null,
                pass: null,
                remember: false,
                disable: false,
                githubMark: chrome.extension.getURL('img/GitHub-Mark-Light-64px.png')
            },
            methods: {
                login: function () {
                    var vm = this

                    this.disableLoginForm('Logging in...')

                    var username = encodeURIComponent(this.user)
                    var password = encodeURIComponent(this.pass)

                    $.ajax('https://forums.e-hentai.org/index.php?act=Login&CODE=01', {
                        methods: 'POST',
                        data: 'referer=https://forums.e-hentai.org/index.php&UserName=' + username + '&PassWord=' + password + '&CookieDate=1',
                    })
                        .done(function (x) {
                            console.log(x)
                            if (x.indexOf('Username or password incorrect') != -1) {
                                // displayError('Login failure!')
                                vm.resetLoginForm()
                            } else if (x.indexOf('You must already have registered for an account before you can log in') != -1) {
                                // displayError('No account exists with name "' + username + '"')
                                vm.resetLoginForm()
                            } else if (x.indexOf('You are now logged in as:') != -1) {
                                console.log('SUCCESS')
                                chrome.runtime.sendMessage('cookieDataSet', onReturnMessage)
                            } else {
                                // displayError('Error parsing login result page!')
                                vm.resetLoginForm()
                            }
                        })
                        .fail(function () {
                            //  displayError('Error sending POST request to forums.e-hentai.org!')
                            resetLoginForm()
                        })



                },
                loadData: function () {
                    var loadSaved = localStorage.getItem('exh_sddd')
                    if (loadSaved == '1') {
                        this.remember = true
                    } else {
                        return // We're not reviving!
                    }

                    var savedUser = localStorage.getItem('exh_user')
                    var savedPass = localStorage.getItem('exh_pass')
                    if (savedUser != null && savedPass != null) {
                        this.user = savedUser
                        this.pass = savedPass
                    }
                },
                saveData: function () {
                    if (remember == true) {
                        localStorage.setItem('exh_user', this.user)
                        localStorage.setItem('exh_pass', this.pass)
                        localStorage.setItem('exh_sddd', '1')
                    } else {
                        localStorage.removeItem('exh_user')
                        localStorage.removeItem('exh_pass')
                        localStorage.removeItem('exh_sddd')
                    }
                },
                disableLoginForm: function (msg) {
                    this.disable = true
                    this.message = msg
                },
                resetLoginForm: function () {
                    this.disable = false
                    this.message = 'Sign in'
                },
                reloadPage: function () {
                    chrome.runtime.sendMessage('reload')
                },
            },
            mounted: function () {
                this.loadData()
            }
        })
    })
})