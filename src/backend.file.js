const { dialog } = require('electron').remote;

MM.Backend.File = Object.create(MM.Backend, {
	id: {value: "file"},
	label: {value: "File"},
	input: {value:document.createElement("input")}
});

MM.Backend.File.save = function(data, name) {
	/*var link = document.createElement("a");
	link.download = name;
	link.href = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(data)));
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);*/
	var promise = new Promise();

	var fs = require('fs');
	fs.writeFile(name, data, 'utf8', (err)=>{
		if(err) 
			promise.reject(err);
		else
			promise.fulfill({filePath:name});
	});

	return promise;
}

MM.Backend.File.load = function() {
	var promise = new Promise();

	this.input.type = "file";

	/*this.input.onchange = function(e) {
		var file = e.target.files[0];
		if (!file) { return; }

		var reader = new FileReader();
		reader.onload = function() { promise.fulfill({data:reader.result, name:file.name}); }
		reader.onerror = function() { promise.reject(reader.error); }
		reader.readAsText(file);
	}.bind(this);

	this.input.click();*/
	var files = dialog.showOpenDialogSync({
		properties: ['openFile'],
		filters: [
			{ name: 'my-mind', extensions: ['mymind'] },
			{ name: 'FreeMind', extensions: ['mm'] },
			{ name: 'Mind Map Architect', extensions: ['mma'] },
			{ name: 'MindMup', extensions: ['mup'] },
			{ name: 'Plain Text', extensions: ['txt'] },
			{ name: 'All support files', extensions: ['mymind','mm','mma','mup','txt'] },
			{ name: 'All Files', extensions: ['*'] }
	  ]
	  });
	  if (!files) { return; }
	  var file = files[0];
	
	  var fs = require('fs');
	  fs.readFile(file,'utf8',function(err,buffer){
		if(err)
			{ promise.reject(reader.error); }
		else
			promise.fulfill({data:buffer, name:file});
	  });

	return promise;
}
