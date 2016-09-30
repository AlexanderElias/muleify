const Fsep = require('fsep');
const Fs = require('fs');
const When = require('when');
const Globals = require('./lib/globals');
const Config = require('./lib/config');
const PathHelper = require('./lib/helper-path');
const PathHandler = require('./lib/handler-path');

exports.pack = function (options) {
	Globals.options = options;
	Globals.paths = PathHelper.roots(options.path);

	return Fsep.ensureDir(Globals.paths.src).then(function () {
		return Fsep.ensureDir(Globals.paths.dist);
	}).then(function () {
		return directory(Globals.paths.src, Config.ignoreables);
	}).catch(function (error) { throw error; });
};

exports.packFile = function (options) {
	var root = options.file.slice(0, options.file.indexOf('src'));

	Globals.paths = PathHelper.roots(root);
	Globals.options = options;

	return Fsep.ensureDir(Globals.paths.src).then(function () {
		return Fsep.ensureDir(Globals.paths.dist);
	}).then(function () {
		return file(options.file, Globals.paths.src, Config.ignoreables);
	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function directory (src, ignoreables) {
	const options = {
		path: src,
		filters: ignoreables,
		ignoreDot: true
	};

	var pathsByExtension = {};

	return Fsep.walk(options).then(function (paths) {

		for (var i = 0, l = paths.length; i < l; i++) {
			var path = paths[i];

			var pathData = PathHelper.parse(path, src);
			var extension = pathData.extensionFull;
			var absolute = pathData.absolute;

			if (pathData.extension === 'l.html') Globals.layout = Fs.readFileSync(absolute, 'binary');
			else {
				if (!pathsByExtension[extension]) pathsByExtension[extension] = [];
				pathsByExtension[extension].push(path);
			}
		}

		var promises = [];

		for (var ext in pathsByExtension) {
			if (pathsByExtension.hasOwnProperty(ext)) promises.push(PathHandler(pathsByExtension[ext]));
		}

		return When.all(promises);

	}).catch(function (error) { throw error; });
}

function file (pathChange, src, ignoreables) {
	const options = {
		path: src,
		filters: ignoreables,
		ignoreDot: true
	};

	pathChange = PathHelper.parse(pathChange, src);
	var pathChanges = [];

	return Fsep.walk(options).then(function (paths) {

		for (var i = 0; i < paths.length; i++) {
			var pathCurrent = PathHelper.parse(paths[i], src);

			if (pathCurrent.extension === 'l.html') Globals.layout = Fs.readFileSync(pathCurrent.absolute, 'binary');

			if (pathChange.extensionLast === 'html' && pathCurrent.extensionLast === 'html') pathChanges.push(pathCurrent.relative);
			else if (pathChange.extensionFull === pathCurrent.extensionFull) pathChanges.push(pathCurrent.relative);
		}

		return PathHandler(pathChanges);

	}).catch(function (error) { throw error; });
}
