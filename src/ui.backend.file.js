MM.UI.Backend.File = Object.create(MM.UI.Backend, {
	id: {value: "file"}
});

MM.UI.Backend.File.init = function(select) {
	MM.UI.Backend.init.call(this, select);

	this._format = this._node.querySelector(".format");
	this._format.appendChild(MM.Format.JSON.buildOption());
	this._format.appendChild(MM.Format.FreeMind.buildOption());
	this._format.appendChild(MM.Format.MMA.buildOption());
	this._format.appendChild(MM.Format.Mup.buildOption());
	this._format.appendChild(MM.Format.Plaintext.buildOption());
	this._format.value = localStorage.getItem(this._prefix + "format") || MM.Format.JSON.id;
	this._filePath = "";//保存文件路径名
}

MM.UI.Backend.File.show = function(mode) {
	MM.UI.Backend.show.call(this, mode);
	
	this._go.innerHTML = (mode == "save" ? "Save" : "Browse");
}

MM.UI.Backend.File._action = function() {
	localStorage.setItem(this._prefix + "format", this._format.value);
	
	MM.UI.Backend._action.call(this);
}

MM.UI.Backend.File.save = function() {
	var format = MM.Format.getById(this._format.value);
	var json = MM.App.map.toJSON();
	var data = format.to(json);

	if(MM.App.electronVer){
		const { dialog } = require('electron').remote;
		var name = this._filePath || "";
		if(name === "" || this._mode === "save"){
			name = MM.App.map.getName() + "." + format.extension;
			var filePath = dialog.showSaveDialogSync({
				defaultPath: name,
				properties: ['showOverwriteConfirmation'],
				filters: [
					{ name: 'my-mind', extensions: ['mymind'] },
					{ name: 'FreeMind', extensions: ['mm'] },
					{ name: 'Mind Map Architect', extensions: ['mma'] },
					{ name: 'MindMup', extensions: ['mup'] },
					{ name: 'Plain Text', extensions: ['txt'] },
					{ name: 'All Files', extensions: ['*'] }
					]
				});
				if (!filePath) 
				{ 
					this._mode = "";
					MM.App.io.hide();
					return; }
				name = filePath;	
		}
	}
	else
		name = MM.App.map.getName() + "." + format.extension;
	this._backend.save(data, name).then(
		this._saveDone.bind(this),
		this._error.bind(this)
	);
}

MM.UI.Backend.File.load = function() {
	this._backend.load().then(
		this._loadDone.bind(this),
		this._error.bind(this)
	);
}

MM.UI.Backend.File._loadDone = function(data) {
	try {
		var format = MM.Format.getByName(data.name) || MM.Format.JSON;
		this._format.value = format.id;
		var json = format.from(data.data);
		if(MM.App.electronVer)
			this._filePath = data.name;
	} catch (e) { 
		this._error(e);
	}

	MM.UI.Backend._loadDone.call(this, json);
}

MM.UI.Backend.File._saveDone = function(data){
	if(MM.App.electronVer)
		this._filePath = data.filePath;
	this._mode = "";
	MM.UI.Backend._saveDone.call(this);
}
