const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const fs = require('original-fs')
const exec = require('child_process').exec
const path = require('path')
const url = require('url')
const crypto = require('crypto')
const Store = require('electron-store')
const window = require('electron').BrowserWindow
// const http = require('http')
// const request = require('request')

const config = new Store()
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
				click: function() {
					gotoTellraw()
				}
			},
			{
				label: 'Knowledge Book Generator',
				click: function() {
					gotoKnowledge()
				}
			}
		]
	},
	{
		label: 'Dev',
		click: function() {
			MainWin.toggleDevTools()
		}
	}
]
const menuHome = Menu.buildFromTemplate(menuHomeTemplate)

// const hash = crypto.createHash('sha1')
let currentWin
let MainWin


app.setName('MC Tools')

function createWindow() {
    MainWin = new BrowserWindow({
        width: 1280,
		height: 720,
		icon: 'em_sw.ico',
		minHeight: 480,
		minWidth: 852
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
