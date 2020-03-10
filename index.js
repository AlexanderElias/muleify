const Transform = require('./lib/transform');
const Sitemap = require('./lib/sitemap');
const Global = require('./lib/global');
const Observey = require('observey');
const Servey = require('servey');
const Porty = require('porty');
const Path = require('path');
const Fsep = require('fsep');

const LB = Global.lb;
const IGNOREABLES = Global.ignoreables;

const directory = async function (input, output, options) {
	let before = [];
	let after = [];

	const paths = await Fsep.walk({
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	});

	paths.forEach(path => {
		if (LB.test(path)) {
			before.push(path);
		} else {
			after.push(path);
		}
	});

	await Promise.all(before.map(async path => {
		return Transform(Path.join(input, path), Path.join(output, path), options);
	}));

	await Promise.all(after.map(async path => {
		return Transform(Path.join(input, path), Path.join(output, path), options);
	}));

};

const file = async function (input, output, options) {
	await Transform(input, output, options);
};

exports.packer = async function (input, output, options) {

	input = Path.resolve(process.cwd(), input);

	if (!Fsep.existsSync(input)) {
		throw new Error(`Input path does not exist ${input}`);
	}

	output = Path.resolve(process.cwd(), output);

	Global.input = input; // TODO find a way to remove this

	const stat = await Fsep.stat(input);

	if (stat.isFile()) {
		await file(input, output, options);
	} else if (stat.isDirectory()) {
		await directory(input, output, options);
	} else {
		throw new Error(`Input is not a file or direcotry ${input}`);
	}
};

exports.watcher = async function (path, options) {
	const observer = new Observey({ path: path });
	await observer.open();
	return observer;
};

exports.server = async function (path, options) {
	const port = await Porty.find(8080);

	const server = new Servey({
		port: port,
		cache: false,
		cors: options.cors,
		hostname: 'localhost',
		routes: [
			{
				path: '*',
				method: 'get',
				handler: async function (context) {
					return await context.tool.static({
						folder: path,
						spa: options.spa,
						path: context.url.pathname
					});
				}
			}
		]
	});

	await server.open();

	return server;
};

exports.encamp = async function (input, output) {
	const data = await Fsep.readFile(input);
	await Fsep.scaffold(output, JSON.parse(data));
};

exports.map = async function (input, output, options) {
	const paths = await Fsep.walk({
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	});

	const sitemap = await Sitemap(paths, options.domain);
	const path = Path.join(output, 'sitemap.xml');

	await Fsep.outputFile(path, sitemap);
};

exports.sass = async function () {
	return await Terminal({
		cmd: 'npm',
		args: ['i', '--no-save', 'node-sass'],
		cwd: __dirname
	});
};
