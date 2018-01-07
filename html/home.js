const {ipcRenderer} = require('electron')

$('html').fadeIn(1000)

$('#gotoTellraw').click(function() {
	ipcRenderer.send('gotoTellraw', 'clicked')
})