var path = require("path");
var Resolver = require("../lib/Resolver");
var DirectoryDescriptionFileFieldAliasPlugin = require("../lib/DirectoryDescriptionFileFieldAliasPlugin");
var ModulesInDirectoriesPlugin = require("../lib/ModulesInDirectoriesPlugin");
var ModuleAsFilePlugin = require("../lib/ModuleAsFilePlugin");
var ModuleAsDirectoryPlugin = require("../lib/ModuleAsDirectoryPlugin");
var DirectoryDescriptionFilePlugin = require("../lib/DirectoryDescriptionFilePlugin");
var DirectoryDefaultFilePlugin = require("../lib/DirectoryDefaultFilePlugin");
var FileAppendPlugin = require("../lib/FileAppendPlugin");
var SyncNodeJsInputFileSystem = require("../lib/SyncNodeJsInputFileSystem");
var should = require("should");

var browserModule = path.join(__dirname, "fixtures", "browser-module");

function p() {
	return path.join.apply(path, [browserModule].concat(Array.prototype.slice.call(arguments)));
};

describe("browserField", function() {
	var resolver;

	beforeEach(function() {
		resolver = new Resolver(new SyncNodeJsInputFileSystem());
		resolver.apply(
			new DirectoryDescriptionFileFieldAliasPlugin("package.json", "browser"),
			new ModulesInDirectoriesPlugin("node", ["node_modules"]),
			new ModuleAsFilePlugin("node"),
			new ModuleAsDirectoryPlugin("node"),
			new DirectoryDescriptionFilePlugin("package.json", ["main"]),
			new DirectoryDefaultFilePlugin(["index"]),
			new FileAppendPlugin(["", ".js"])
		);
	});

	it("should ignore", function(done) {
		resolver.resolve(p(), "./lib/ignore", function(err, result) {
			if(err) throw err;
			result.should.be.eql(false);
			done();
		})
	});
	it("should ignore", function() {
		resolver.resolveSync(p(), "./lib/ignore").should.be.eql(false);
		resolver.resolveSync(p(), "./lib/ignore.js").should.be.eql(false);
		resolver.resolveSync(p("lib"), "./ignore").should.be.eql(false);
		resolver.resolveSync(p("lib"), "./ignore.js").should.be.eql(false);
	});

	it("should replace a file", function() {
		resolver.resolveSync(p(), "./lib/replaced").should.be.eql(p("lib", "browser.js"));
		resolver.resolveSync(p(), "./lib/replaced.js").should.be.eql(p("lib", "browser.js"));
		resolver.resolveSync(p("lib"), "./replaced").should.be.eql(p("lib", "browser.js"));
		resolver.resolveSync(p("lib"), "./replaced.js").should.be.eql(p("lib", "browser.js"));
	});

	it("should replace a module with a file", function() {
		resolver.resolveSync(p(), "module-a").should.be.eql(p("browser", "module-a.js"));
		resolver.resolveSync(p("lib"), "module-a").should.be.eql(p("browser", "module-a.js"));
	});

	it("should replace a module with a module", function() {
		resolver.resolveSync(p(), "module-b").should.be.eql(p("node_modules", "module-c.js"));
		resolver.resolveSync(p("lib"), "module-b").should.be.eql(p("node_modules", "module-c.js"));
	});
});