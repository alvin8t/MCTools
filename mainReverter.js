const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('original-fs')
const exec = require('child_process').exec
const path = require('path')
const url = require('url')
const Store = require('electron-store')
const window = require('electron').BrowserWindow
const asar = require('asar')
const request = require('request')

const APP_VERSION = '0.0.2'

const menuHomeTemplate = [
	{
		label: 'Tools',
		submenu: [
			// {
			// 	label: 'Loot Table Generator',
			// 	click: function() {
			// 		gotoLTG()
			// 	}
			// },
			{
				label: 'Tellraw Generator',
				accelerator: '',
				click: function() {
					gotoTellraw()
				}
			},
			// {
			// 	label: 'Knowledge Book Generator (UNFINISHED)',
			// 	click: function() {
			// 		gotoKnowledge()
			// 	}
			// }
		]
	},
	{
		label: 'Dev',
		submenu: [
			{
				label: 'Toggle Dev Tools',
				accelerator: 'F12',
				click: function() {
					MainWin.toggleDevTools()
				}
			},
			{
				label: 'Force Reload',
				accelerator: 'Ctrl+R',
				click: function() {
					MainWin.reload()
				}
			}
		]
	}
]
const menuHome = Menu.buildFromTemplate(menuHomeTemplate)

let currentWin
let MainWin

const appdataPath = app.getPath('appData')

app.setName('MC Tools')

function createWindow() {
	MainWin = new BrowserWindow({
        width: 1280,
		height: 720,
		icon: 'em_sw.ico',
		minHeight: 480,
		minWidth: 852,
		backgroundColor: '#000000'
    })
	Menu.setApplicationMenu(menuHome)
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, '/html/home.html'),
		protocol: 'file:',
		slashes: true
	}))

	currentWin = 'home'

	MainWin.on('closed', () => {
    	MainWin = null
    	app.quit()
	})
}

app.on('ready', createWindow)

function gotoTellraw(override=false) {
	if (currentWin == 'tellraw' && override == false) return
	
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, '/html/tellraw.html'),
		protocol: 'file:',
		slashes: true
	}))

	currentWin = 'tellraw'
}

ipcMain.on('getGenAsset', function (event, args) {
	// console.log(`Generator Asset ${args} Requested! Fetching!`)
	var asset = args
	// console.log(appdataPath).
	if (!fs.existsSync(path.join(appdataPath, `\\.mctools\\genFiles`))) {
		console.log(`Failed to fetch resource ${args}: Generator Files Directory not found`)
		dialog.showMessageBox({
			type: 'error',
			title: 'Failed to locate Template Files',
			message: 'We failed to locate the required files to structure the commands for this generator! Please place the files back, reinstall MCTools, or update MCTools to the latest version (as this should fix this)! [ERR 3]'
		})
		return false
	}
	
	if (!fs.existsSync(path.join(appdataPath, `\\.mctools\\genFiles\\${asset}.json`))) {
		console.log(`Failed to fetch resource ${args}: File not found`)
		dialog.showMessageBox({
			type: 'error',
			title: 'Failed to locate Template Files',
			message: 'We failed to locate the required files to structure the commands for this generator! Please place the files back, reinstall MCTools, or update MCTools to the latest version (as this should fix this)! [ERR 2]'
		})
		return false
	}

	// fs.readFileSync(path.join(appdataPath, `\\.mctools\\genFiles\\${asset}.json`), function(error, data) {
	// 	if (error) {
	// 		console.log('error reading file\n' + error)
	// 		dialog.showMessageBox({
	// 			type: 'error',
	// 			title: 'Failed to locate Template Files',
	// 			message: 'We failed to locate the required files to structure the commands for this generator! Please place the files back, reinstall MCTools, or update MCTools to the latest version (as this should fix this)! [ERR 1]'
	// 		})
	// 		return false
	// 	}
	// 	event.returnValue = JSON.parse(data.toString())
	// 	console.log(data.toString())
	// })

	event.returnValue = JSON.parse(fs.readFileSync(path.join(appdataPath, `\\.mctools\\genFiles\\${asset}.json`)))

	// console.log(`Fetched resource ${args} without errors`)
})
