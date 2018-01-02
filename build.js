'use strict'

var builder = require('electron-builder'),
targets = builder.Platform;

builder.build({
	targets: targets.WINDOWS.createTarget(),
	signingHashAlgorithms: ['md5', 'sha-256'],
	config: {
		'appId': 'net.mccontent.mctools',
		'productName': 'MC Tools',
		'asar': true,
		'icon': 'em_sw.ico',
		'directories': {
			'output': 'builds'
		},
		'nsis': {
			'installerIcon': 'em_pa.ico',
			'uninstallerIcon': 'em_pa.ico'
		}
	}
}).then(() => {
	console.log('Done');
}).catch((error) => {
	throw error;
});
