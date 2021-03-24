/*
Copyright 2012, Olivier Lalonde <olalonde@gmail.com>. All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the following
      disclaimer in the documentation and/or other materials provided
      with the distribution.
    * Neither the name of Olivier Lalonde nor the names of its
      contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var path = require('path'),
  util = require('util');
require('colors');
// @see http://nodejs.org/api/all.html#all_require_extensions

// first value of `extensions` property should be an extension the require registers
// aliases & extensions can also be used when calling require('better-require')(formats)
var supportedFormats = {
  'json': {
    require: 'require-json' 
	  , extensions: ['json']
  }
  , 'yaml': {
    require: 'require-yaml'
    , extensions: ['yaml', 'yml']
  }
  , 'csv': {
    require: 'require-csv'
  }
  , 'xml': {
    require: 'require-xml'
  }
  , 'ini': {
    require: 'require-ini'
  }
  , 'coffeescript': {
    require: 'coffeescript'
    , extensions: ['coffee']
    , aliases: ['coffee-script']
  }
  , 'livescript': {
    require: 'LiveScript'
    , extensions: ['ls']
    , aliases: ['LiveScript', 'live-script']
    }
  , 'six': {
    require: 'six'
  }
  , 'clojurescript': {
    require: 'clojure-script'
    , aliases: 'clojure-script'
    , extensions: 'cljs'
    , bundled: false
    , url: 'https://github.com/michaelsbradleyjr/node-clojurescript'
  }
  , 'dart': {
    require: 'Frog'
    , extensions: 'dart'
    , bundled: false
    , install: 'You will also need to install the Dart SDK http://www.dartlang.org/docs/getting-started/sdk/#download.'
    , url: 'https://github.com/kaisellgren/Frog/'
  }
  , 'typescript': {
   // require: 'require-typescript'
	//  require: path.resolve(__dirname, 'extensions', 'typescript.js')
	  require : "@frdl/custom-require/lib/extensions/typescript.js"
    , extensions: ['ts']
  }
};

module.exports = function (formats) {
  formats = formats || Object.keys(supportedFormats);

  if (!(formats instanceof Array)) {
    formats = formats.split(/ +/);
  }

  // # Format supportedFormats
  for (var key in supportedFormats) {
    var supportedFormat = supportedFormats[key];
    supportedFormat.name = supportedFormat.name || key;
    // ## Populate .extensions
    supportedFormat.extensions = supportedFormat.extensions || [];
    // string -> [string]
    if (typeof supportedFormat.extensions === 'string')
      supportedFormat.extensions = [supportedFormat.extensions];
    // add key to extensions
    if (supportedFormat.extensions.indexOf(key) === -1)
      supportedFormat.extensions.push(key);
    // ## Populate .aliases
    supportedFormat.aliases = supportedFormat.aliases || [];
    // string -> [string]
    if (typeof supportedFormat.aliases === 'string')
      supportedFormat.aliases = [supportedFormat.aliases];
    // add extensions to aliases
    supportedFormat.aliases = supportedFormat.aliases.concat(supportedFormat.extensions);
    // ## Populate install
    var install = supportedFormat.install || '';

    supportedFormat.install = function (filename) {
      var filename = path.basename(filename);
      return supportedFormat.name
      + ' depends on a heavy package and better-require does not install it by default. '
      + 'You need to install it by yourself before you can require ' + filename.grey + ':'
      + '\n\n'
      + ('npm install ' + supportedFormat.require  + '').blue
      + '\n\n'
      + (install ? install + ' ' : '')
      + (supportedFormat.url ? 'More install information at ' + supportedFormat.url : '')
      + '\n\n';
    }
  }

  for (var key in supportedFormats) {
    var supportedFormat = supportedFormats[key];
    formats.forEach(function (format) {
      if (supportedFormat.aliases.indexOf(format) !== -1) {
        requireFormat(supportedFormat);
      }
    });
  };
}

function requireFormat (format) {
  try {
    require(format.require);
  }
  catch (e) {
	
    format.extensions.forEach(function (extension) {
      require.extensions['.' + extension] = function(module, filename) {
		  try{
			  require(filename);
		  }catch(Fehler){
      //  var err = new Error(`${JSON.stringify(module)}` + ' required: ' + format.install(filename));
		    var err = new Error(format.install(filename));      
			  throw err;
		  }
      };
    });
	
  }
}