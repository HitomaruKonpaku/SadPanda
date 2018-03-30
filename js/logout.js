$(document).ready(() => {
	exSignOut()
})

function exSignOut() {
	var menu = $('#nb')
	if (!menu) {
		return
	}

	var img = $($('img', menu)[0]).clone()
	var a = $($('a', menu)[0]).clone()
		.html('Sign out')
		.attr('href', '#')
		.attr('id', 'haruhichanSignOut')
		.click(() => {
			console.log('Sign out...')
			chrome.runtime.sendMessage('deleteAllCookies', function () {
				chrome.runtime.sendMessage('reload', function () { })
			})
		})

	menu.append(img, a)
}