const {ipcRenderer} = require('electron')

var textCount = 0

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
	$(template).find('select.select-template').attr({'id': 'picker' + textCount}).addClass('selectpicker').removeClass('select-template')
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

	if (option == 'tellraw') {
		cmd = `/tellraw ${$('#cmdSelector').val()} {"text":"","extra":${JSON.stringify(arr)}}`
	} else if (option == 'title') {
		cmd = `/title ${$('#cmdSelector').val()} title {"text":"","extra":${JSON.stringify(arr)}}`
	} else if (option == 'subtitle') {
		cmd = `/title ${$('#cmdSelector').val()} subtitle {"text":"","extra":${JSON.stringify(arr)}}`
	} else if (option == 'action_bar') {
		cmd = `/title ${$('#cmdSelector').val()} actionbar {"text":"","extra":${JSON.stringify(arr)}}`
	} else {
		cmd = 'INVALID SELECTOR'
	}

	$('#printJsonOutput').val(cmd)

	$('#jsonOutput').removeClass('hidden')

})

$('#printJsonOutput').click(function() {
	this.focus();
    this.select();
})