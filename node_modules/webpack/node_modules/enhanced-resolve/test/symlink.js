var resolve = require("../");
var should = require("should");
var path = require("path");
var fs = require("fs");

var tempPath = path.join(__dirname, "temp");

describe("symlink", function() {
	var isAdmin = true;
	try {
		fs.mkdirSync(tempPath);
		fs.symlinkSync(path.join(__dirname, "..", "lib", "node.js"), path.join(tempPath, "test"), "file");
		fs.symlinkSync(path.join(__dirname, "..", "lib"), path.join(tempPath, "test2"), "dir");
	} catch(e) {isAdmin=false;}
	try {
		fs.unlinkSync(path.join(tempPath, "test"));
	} catch(e) {isAdmin=false;}
	try {
		fs.unlinkSync(path.join(tempPath, "test2"));
	} catch(e) {isAdmin=false;}
	try {
		fs.rmdirSync(tempPath);
	} catch(e) {isAdmin=false;}

	if(isAdmin) {
		before(function() {
			// Create some cool symlinks
			try {
				fs.mkdirSync(tempPath);
				fs.symlinkSync(path.join(__dirname, "..", "lib", "node.js"), path.join(tempPath, "node.js"), "file");
				fs.symlinkSync(path.join(__dirname, "..", "lib"), path.join(tempPath, "lib"), "dir");
				fs.symlinkSync(path.join(__dirname, ".."), path.join(tempPath, "this"), "dir");
				fs.symlinkSync(path.join("..", "..", "lib", "node.js"), path.join(tempPath, "node.relative.js"), "file");
				fs.symlinkSync(path.join(".", "node.relative.js"), path.join(tempPath, "node.relative.sym.js"), "file");
			} catch(e) {}
		});
		
		after(function() {
			fs.unlinkSync(path.join(tempPath, "node.js"));
			fs.unlinkSync(path.join(tempPath, "node.relative.js"));
			fs.unlinkSync(path.join(tempPath, "node.relative.sym.js"));
			fs.unlinkSync(path.join(tempPath, "lib"));
			fs.unlinkSync(path.join(tempPath, "this"));
			fs.rmdirSync(tempPath);
		});
		
		[
			[tempPath, "./node.js", "with a symlink to a file"],
			[tempPath, "./node.relative.js", "with a relative symlink to a file"],
			[tempPath, "./node.relative.sym.js", "with a relative symlink to a symlink to a file"],
			[tempPath, "./lib/node.js", "with a symlink to a directory 1"],
			[tempPath, "./this/lib/node.js", "with a symlink to a directory 2"],
			[tempPath, "./this/test/temp/node.js", "with multiple symlinks in the path 1"],
			[tempPath, "./this/test/temp/lib/node.js", "with multiple symlinks in the path 2"],
			[tempPath, "./this/test/temp/this/lib/node.js", "with multiple symlinks in the path 3"],
			[path.join(tempPath, "lib"), "./node.js", "with symlinked directory as context 1"],
			[path.join(tempPath, "this"), "./lib/node.js", "with symlinked directory as context 2"],
			[path.join(tempPath, "this"), "./test/temp/lib/node.js", "with symlinked directory as context and in path"],
			[path.join(tempPath, "this", "lib"), "./node.js", "with symlinked directory in context path"],
			[path.join(tempPath, "this", "test"), "./temp/node.js", "with symlinked directory in context path and symlinked file"],
			[path.join(tempPath, "this", "test"), "./temp/lib/node.js", "with symlinked directory in context path and symlinked directory"],
		].forEach(function(pathToIt) {
			it("should resolve symlink to itself " + pathToIt[2], function(done) {
				resolve(pathToIt[0], pathToIt[1], function(err, filename) {
					if(err) return done(err);
					should.exist(filename);
					filename.should.have.type("string");
					filename.should.be.eql(path.join(__dirname, "..", "lib", "node.js"));
					done();
				});
			});
			it("should resolve symlink to itself sync " + pathToIt[2], function() {
				var filename = resolve.sync(pathToIt[0], pathToIt[1]);
				should.exist(filename);
				filename.should.have.type("string");
				filename.should.be.eql(path.join(__dirname, "..", "lib", "node.js"));
			});
		});
	} else {
		it("cannot test symlinks because we have no permission to create them");
	}
});