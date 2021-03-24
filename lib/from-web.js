/*
MIT License

Copyright (c) 2018 Tiago Danin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  (c) Inspired by https://github.com/TiagoDanin/Require-From-Web
*/
const axios = require('axios')
const fromString = require('./from-string')

module.exports = async (url, options, code) => {
	if (typeof url !== 'string') {
		throw new TypeError('Expected a string')
	}

	const response = await axios({
		method: 'GET',
		url,
		...options
	})
	let string = response.data.toString()
	if (code) {
		string += '\n' + code
	}
/*
	const _module = new module.constructor()
	_module.filename = url
	_module._compile(string, url)

	return _module.exports
	*/
	return fromString(string, url);
}