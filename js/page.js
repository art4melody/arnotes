var elements = {};

var addImageHandler = function(data, alt) {
	var active_id = $('#main-tab .active a').attr('href').substring(1);
	var editor = elements[active_id].editor;
	var value = '![' + alt + '](' + data + ')' + "\n";
	$('#listImage').modal('hide');
	editor.insert(value);
	editor.focus();
}

var autocompile = true;

var compile = function(e) {
	var active_id = $('#main-tab .active a').attr('href').substring(1);
	var editor = elements[active_id].editor;
	var preview = elements[active_id].preview;
	var st = elements[active_id].status;

	var startTime = new Date().getTime();
	var html = marked(editor.getSession().getValue());
	endTime = new Date().getTime();	
	preview.html(html);

	var period = (endTime - startTime);
	var message = '<strong>Processing time:</strong> ' + period + ' ms';
	// not responsive
	// turn off binding
	if (period > 30) {
		if (autocompile) {
			message += '<br/>Slow processing. Auto-compilation turned off.';
			editor.getSession().removeListener('change', compile);
			autocompile = false;
		}
	} else {
		if (!autocompile) {
			message += '<br/>Fast processing. Auto-compilation turned back on.';
			editor.getSession().on('change', compile);
			autocompile = true;
		}
	}
	st.html(message);
}

$(document).ready(function(){
	var converter = new Showdown.converter();
	marked.setOptions({
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		langPrefix: 'language-',
		highlight: function(code, lang) {
			
		}
	});
	
    $('.note-preview').slimScroll({
        height: '100%'
    });
	
	$('.note-text').each(function(s, e) {
		var id = $(e).attr('id');
		id = id.substring(0, id.length - 5);
		var text_id = id + '_text';
		var preview_id = id + '_preview';
		var status_id = id + '_status';
		var textarea = $('#' + text_id);
		var preview = $('#' + preview_id);
		var status = $('#' + status_id);

		var editor = ace.edit(textarea.get(0));
		editor.setTheme("ace/theme/chrome");
		editor.getSession().setMode("ace/mode/markdown");
		editor.getSession().on('change', compile);
		
		elements[id] = { 
			'textarea': textarea,
			'preview': preview,
			'status': status,
			'editor': editor
		};
	});
	
	$('#main-tab a[data-toggle="tab"]').on('shown', function (e) {
		var active_id = $(e.target).attr('href').substring(1);
		if (elements[active_id] !== undefined) {
			var editor = elements[active_id].editor;
			editor.focus();
		}
	});
});