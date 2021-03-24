'use strict';

const path = require('path'); 



exports = requireFromString;


function requireFromString(code, filename, opts, Module) {
 //  var path = require('path');	
	if (typeof filename === 'object') {
		opts = filename;
		filename = undefined;
	}
	

	if (typeof Module === 'undefined') {
		try{
             var Module = require('module');     
		}catch(Fehler){
			throw Fehler;
		}
	}
	
	
	try{
	     var parent = module.parent;
	}catch(Fehler){
		console.error(Fehler);
		 var parent = module || exports;
	}
	
	opts = opts || {};
	filename = filename || '';

	opts.appendPaths = opts.appendPaths || [];
	opts.prependPaths = opts.prependPaths || [];

	if (typeof code !== 'string') {
		throw new Error('code must be a string, not ' + typeof code);
	}

	var paths = ('function'===typeof Module._nodeModulePaths)
	? Module._nodeModulePaths(path.dirname(filename))
	: [path.dirname(filename)];

	
	var m = new Module(filename, parent);
	m.filename = filename;
	m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
	m._compile(code, filename);

	var exports = m.exports;
	parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);

	return exports;
}