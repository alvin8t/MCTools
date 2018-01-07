const {ipcRenderer} = require('electron')

var textCount = 0

var bs64AlphNum = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

var colors = ipcRenderer.sendSync('getGenAsset', 'colors')
var tellraw_options = ipcRenderer.sendSync('getGenAsset', 'tellraw_op')

var defaultTaken = false
$.each(colors, function(key, value) {
	var select = document.getElementById('templateGenColor1')
	var option = document.createElement('option')
	option.setAttribute('value', value['name'])
	if (defaultTaken == false && value['default'] == true) {
		option.setAttribute('selected', 'true')
		defaultTaken = true
	}
	option.innerHTML = value['color']
	select.appendChild(option)
})
defaultTaken = false
$.each(tellraw_options, function(key, value) {
	var select = document.getElementById('cmdType')
	var option = document.createElement('option')
	option.setAttribute('value', key)
	if (defaultTaken == false && value['default'] == true) {
		option.setAttribute('selected', 'true')
		defaultTaken = true
	}
	option.innerHTML = value['name']
	select.appendChild(option)
})

addAddOptionCmdType()

$('#cmdType').addClass('selectpicker')
$('#cmdType').selectpicker('render')

$('.formatting').click(function() {
	if (this.classList.contains('btn-danger') == true) {
		this.classList.remove('btn-danger')
		this.classList.add('btn-success')
		$(this).attr({'active': 'true'})
	} else {
		this.classList.remove('btn-success')
		this.classList.add('btn-danger')
		$(this).attr({'active': 'false'})
	}
})

$('#addText').click(function() {
	var template = $('.template-text').clone(true).addClass('generatorText').removeClass('template-text')
	$(template).find('select.select-template').attr({'id': 'picker' + textCount}).addClass('selectpicker color').removeClass('select-template')
	
	$(template).appendTo('#main-gen')
	$('#picker' + textCount).selectpicker('render')
	textCount++
})

$('.deleteText').click(function() {
	$(this).parent().parent().remove()
})

$('#genJSON').click(function() {
	var noData = false
	var jsonData = {}
	var jsonDataLength = 0
	$('#main-gen>div.generatorText').each(function() {
		var appendJson = {}
		appendJson['text'] = $(this).find('input.textInput').val()
		appendJson['color'] = $(this).find('option:selected').val()
		if ($(this).find('button.boldF').attr('active') == 'true') {
			appendJson['bold'] = 'true'
		}
		if ($(this).find('button.italicF').attr('active') == 'true') {
			appendJson['italic'] = 'true'
		}
		if ($(this).find('button.underlineF').attr('active') == 'true') {
			appendJson['underline'] = 'true'
		}
		if ($(this).find('button.strikeF').attr('active') == 'true') {
			appendJson['strikethrough'] = 'true'
		}
		if ($(this).find('button.obfuscatedF').attr('active') == 'true') {
			appendJson['obfuscated'] = 'true'
		}
		jsonData[jsonDataLength] = appendJson
		jsonDataLength++
	})

	if (jsonDataLength == 0) {
		if (noData == false) {
			swal({
				title: 'Not data',
				text: 'You need at least one text field, even if it\'s going to be blank... you still need it!',
				type: 'error',
				showCancelButton: false,
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'K den',
				confirmButtonClass: 'btn btn-success',
				buttonsStyling: false,
			})
		}
		return false
	}

	var option = $('#cmdType').find('option:selected').val()
	var cmd = ''

	var arr = new Array(jsonData.length);
	for (let key in jsonData) {
		arr[parseInt(key)] = jsonData[key];
	}

	// if (option == 'tellraw') {
	// 	cmd = `/tellraw ${$('#cmdSelector').val()} {"text":"","extra":${JSON.stringify(arr)}}`
	// } else if (option == 'title') {
	// 	cmd = `/title ${$('#cmdSelector').val()} title {"text":"","extra":${JSON.stringify(arr)}}`
	// } else if (option == 'subtitle') {
	// 	cmd = `/title ${$('#cmdSelector').val()} subtitle {"text":"","extra":${JSON.stringify(arr)}}`
	// } else if (option == 'action_bar') {
	// 	cmd = `/title ${$('#cmdSelector').val()} actionbar {"text":"","extra":${JSON.stringify(arr)}}`
	// } else if (option == 'raw') {
	// 	cmd = `{"text":"","extra":${JSON.stringify(arr)}}`
	// } else {
	// 	cmd = 'INVALID SELECTOR'
	// }

	var tellrawJson = JSON.stringify(arr)

	if (option == 'raw') {
		cmd = `{"text":"","extra":${tellrawJson}}`
	} else if (option == 'raw_escaped') {
		var tmp = `{"text":"","extra":${tellrawJson.replace(/[\\]/g, '\\\\')}}`
		cmd = tmp.replace(/[\"]/g, '\\"')
	} else {
		if (tellraw_options[option]) {
			var tmpSplit = tellraw_options[option]['command'].split('$')
			$.each(tmpSplit, function (key, value) {
				var appendCmd
				appendCmd = value.replace('{{ selector }}', $('#cmdSelector').val().trim()).replace('{{ json_text_format }}', JSON.stringify(arr).trim())
				cmd += appendCmd
			})
		} else {
		}
	}

	$('#printJsonOutput').val(cmd)

	$('#jsonOutput').removeClass('hidden')

})

$('#printJsonOutput').click(function() {
	this.focus()
    this.select()
})

var calPreview

$('#tellrawPreview').on('change', function() {
	if ($('#tellrawPreview').is(':checked') == true) {
		calPreview = setInterval(function() {
			genPreview()
		}, 100)
	} else {
		clearInterval(calPreview)
		$('#previewWindow').html('')
	}
})

function genPreview() {
	var jsonData = {}
	var jsonDataLength = 0
	var bold = false
	var italic = false
	var underline = false
	var strike = false
	var obfuscated = false

	$('#main-gen>div.generatorText').each(function() {
		var appendJson = {}

		appendJson['text'] = $(this).find('input.textInput').val().replace("\\n", "<br />")
		appendJson['color'] = $(this).find('option:selected').val()
		
		if ($(this).find('button.boldF').attr('active') == 'true') {
			appendJson['bold'] = true
		} else {
			appendJson['bold'] = false
		}
		if ($(this).find('button.italicF').attr('active') == 'true') {
			appendJson['italic'] = true
		} else {
			appendJson['italic'] = false
		}
		if ($(this).find('button.underlineF').attr('active') == 'true') {
			appendJson['underline'] = true
		} else {
			appendJson['underline'] = false
		}
		if ($(this).find('button.strikeF').attr('active') == 'true') {
			appendJson['strike'] = true
		} else {
			appendJson['strike'] = false
		}
		if ($(this).find('button.obfuscatedF').attr('active') == 'true') {
			appendJson['obfuscated'] = true
		} else {
			appendJson['obfuscated'] = false
		}
		jsonData[jsonDataLength] = appendJson
		jsonDataLength++
	})
	
	if (jsonDataLength == 0) return

	var html = ''

	var arr = new Array(jsonData.length);
	for (let key in jsonData) {
		arr[parseInt(key)] = jsonData[key];
	}

	$('#previewWindow').html('')
	$.each(arr, function (index) {
		var values = arr[index]

		var classData = ''

		classData += `text-${values.color}`

		if (values.bold == true) {
			classData += ` bold`
		}

		if (values.italic == true) {
			classData += ` italic`
		}

		if (values.underline == true && values.strike == true) {
			classData += ` strikeunderline`
		} else {
			if (values.underline == true) {
				classData += ` underline`
			}

			if (values.strike == true) {
				classData += ` strike`
			}
		}

		if (values.obfuscated == true) {
			var obfPre = values['text'].split('')
			var newText = ''
			$.each(obfPre, function(index) {
				if (obfPre.index == ' ') {
					newText += ' '
				} else {
					newText += bs64AlphNum[Math.floor(Math.random() * bs64AlphNum.length)]
				}
			})
			values['text'] = newText

		}
		var span = document.createElement('span')
		span.className = 'preview-text mono-font previewText ' + classData
		span.innerHTML = values.text
		$(span).appendTo('#previewWindow')
	})

}

function addAddOptionCmdType() {
	var selectRaw = document.getElementById('cmdType')
	var optionRaw = document.createElement('option')
	optionRaw.setAttribute('value', 'raw')
	optionRaw.innerHTML = 'Raw'
	selectRaw.appendChild(optionRaw)

	var selectRawE = document.getElementById('cmdType')
	var optionRawE = document.createElement('option')

	optionRawE.setAttribute('value', 'raw_escaped')
	optionRawE.innerHTML = 'Raw [Escaped]'
	selectRawE.appendChild(optionRawE)
}
