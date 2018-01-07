const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('original-fs')
const exec = require('child_process').exec
const path = require('path')
const url = require('url')
const Store = require('electron-store')
const window = require('electron').BrowserWindow
const asar = require('asar')
const request = require('request')
// const http = require('http')
// const request = require('request')

const config = new Store()
const APP_VERSION = '0.0.3'

const appdataPath = app.getPath('appData')

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


app.setName('MC Tools')

function createWindow() {

	// console.log(appdataPath).
	if (!fs.existsSync(path.join(appdataPath, '\\.mctools\\genFiles'))){
		fs.mkdirSync(path.join(appdataPath, '\\.mctools'))
		fs.mkdirSync(path.join(appdataPath, '\\.mctools\\genFiles'))
		asar.extractAll(path.join(__dirname, 'gen_assets/as.set'), path.join(appdataPath, '\\.mctools\\genFiles\\'))
	}

	// console.log('Extracted Generator Files')
	// request('https://raw.githubusercontent.com/alvin8t/MCTools/master/version.json', function(error, response, body) {
	// // request('http://localhost/version.json', function(error, response, body) {
	// 	// console.log('Connecting to update server..')
	// 	if (!error && response.statusCode == '200') {
	// 		// console.log(`Got response from update server [${response && response.statusCode}]`)
	// 		fs.readFile(path.join(appdataPath, '\\.mctools\\genFiles\\version.json'), function(fail, data) {
	// 			// console.log(`Reading data from Local version file! Data:\n` + data.toString())
	// 			if (!fail) {
	// 				var serverVersion = JSON.parse(body)
	// 				var localVersion = JSON.parse(data.toString())
	// 				// var localVersion = []
	// 				// localVersion['version'] = APP_VERSION
	// 				if (serverVersion.version !== localVersion.version) {
	// 					var minSerVer = serverVersion['min_version'].split('.')
	// 					var minLocVer = localVersion['min_version'].split('.')
	// 					// var minLocVer = []
	// 					// minLocVer['version'] = APP_VERSION
	// 					var serVer = serverVersion['version'].split('.')
	// 					// var locVer = localVersion['version'].split('.')
	// 					var locVer = APP_VERSION.split('.')
	// 					console.log(`${serVer}\n\n${locVer}`)
	// 					if (serVer[0] <= locVer[0] && serVer[1] <= locVer[1] && serVer[2] <= locVer[2]) {
	// 						// console.log('Local version is either higher or same as server version!')
	// 					} else {
	// 						// UPDATE
	// 						// console.log(`Update Available for as.set from SERVER Checking versions...\n${minSerVer}\n${minLocVer}`)
	// 						if (minSerVer[0] <= minLocVer[0] && minSerVer[1] <= minLocVer[1] && minSerVer[2] <= minLocVer[2]) {
	// 							// UPDATE
	// 							// console.log('Update found, requirements met! Updating...')
	// 						} else {
	// 							// DON'T UPDATE LOCAL IS OUTDATED!
	// 							// console.log(`Update FAILED! Local is outdated! (Server: ${minSerVer} | Local: ${minLocVer})`)
	// 						}
	// 					}
	// 				} else {
	// 					// console.log('Server and Local version are the same! No further update needed!')
	// 				}
	// 			} else {
	// 				// console.log('Error whilst trying to read the local version file!\n' + error)
	// 			}
	// 		})
	// 	} else {
	// 		// console.log(`Failed connecting to update server! Error Attached [${response && response.statusCode}]\n<--->\n${error}\n<--->`)
	// 	}
	// 	// console.log(`Update check complete!`)
	// })

    MainWin = new BrowserWindow({
        width: 1280,
		height: 720,
		icon: 'em_sw.ico',
		minHeight: 480,
		minWidth: 852,
		backgroundColor: '#E75858'
    })
	Menu.setApplicationMenu(menuHome)
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, 'html/home.html'),
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

function gotoLTG() {
	if (currentWin == 'ltf') return
	
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, 'html/ltg.html'),
		protocol: 'file:',
		slashes: true
	}))

	currentWin = 'ltg'
}

function gotoTellraw() {
	if (currentWin == 'tellraw') return
	
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, 'html/tellraw.html'),
		protocol: 'file:',
		slashes: true
	}))

	currentWin = 'tellraw'
}

function gotoKnowledge() {
	if (currentWin == 'knowledge') return
	
	MainWin.loadURL(url.format({
		pathname: path.join(__dirname, 'html/knowledge.html'),
		protocol: 'file:',
		slashes: true
	}))

	currentWin = 'knowledge'
}

ipcMain.on('getGenAsset', function (event, args) {
	var asset = args
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
	// fs.readFileSync(path.join(__dirname, 'gen_assets/' + asset + '.json'), function(error, data) {
	// 	if (error) {
	// 		console.log('error reading file\n' + error)
	// 		dialog.showMessageBox({
	// 			type: 'error',
	// 			title: 'Failed to locate Template Files',
	// 			message: 'We failed to locate the required files to structure the commands for this generator! Please place the files back, reinstall MCTools, or update MCTools to the latest version (as this should fix this)!'
	// 		})
	// 		return false
	// 	}
	// 	event.returnValue = JSON.parse(data.toString())
	// 	// console.log(data.toString())
	// })
	event.returnValue = JSON.parse(fs.readFileSync(path.join(appdataPath, `\\.mctools\\genFiles\\${asset}.json`)))
})
