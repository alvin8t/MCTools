const {ipcRenderer} = require('electron')

$('html').fadeIn(1000)

ipcRenderer.on('printPage', function(event) {
	// window.print()
	swal({
		title: 'Not Supported',
		text: 'Printing is not Supported on this page',
		type: 'warning'
	})
})

$('#sendReminder').click(function() {
	ipcRenderer.send('sendReminder', 'clicked')
})

$('#newLoan').click(function() {
	ipcRenderer.send('newLoan', 'clicked')
})

$('#showLoans').click(function () {
	ipcRenderer.send('showLoans', 'clicked')
})

$('.navbar-brand').click(function() {
	ipcRenderer.send('goHome', 'clicked')
})
