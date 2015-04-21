var CachedInputFileSystem = require("../lib/CachedInputFileSystem");
var should = require("should");

describe("CachedInputFileSystem", function() {
	this.timeout(3000);
	var fs;
	
	beforeEach(function() {
		fs = new CachedInputFileSystem({
			stat: function(path, callback) {
				setTimeout(callback.bind(null, null, {path: path}), 100);
			}
		}, 1000);
	});
	afterEach(function() {
		fs.purge();
	});

	
	it("should join accesses", function(done) {
		fs.stat("a", function(err, result) {
			result.a = true;
		});
		fs.stat("a", function(err, result) {
			should.exist(result.a);
			done();
		});
	});
	
	it("should cache accesses", function(done) {
		fs.stat("a", function(err, result) {
			result.a = true;
			var sync = true;
			fs.stat("a", function(err, result) {
				should.exist(result.a);
				sync.should.be.eql(true);
				setTimeout(function() {
					fs.stat("a", function(err, result) {
						should.not.exist(result.a);
						result.b = true;
						sync = true;
						fs.stat("a", function(err, result) {
							should.not.exist(result.a);
							should.exist(result.b);
							done();
						});
						sync = false;
					});
				}, 1100);
			});
			sync = false;
		});
	});
	
	it("should recover after passive periods", function(done) {
		fs.stat("a", function(err, result) {
			result.a = true;
			setTimeout(function() {
				fs.stat("a", function(err, result) {
					should.exist(result.a);
					setTimeout(function() {
						fs.stat("a", function(err, result) {
							should.not.exist(result.a);
							result.b = true;
							setTimeout(function() {
								fs.stat("a", function(err, result) {
									should.not.exist(result.a);
									should.exist(result.b);
									done();
								});
							}, 500);
						});
					}, 600);
				});
			}, 500);
		});
	});
	
	it("should restart after timeout", function(done) {
		fs.stat("a", function(err, result) {
			result.a = true;
			setTimeout(function() {
				fs.stat("a", function(err, result) {
					should.not.exist(result.a);
					result.b = true;
					setTimeout(function() {
						fs.stat("a", function(err, result) {
							should.not.exist(result.a);
							should.exist(result.b);
							done();
						});
					}, 50);
				});
			}, 1100);
		});
	});

});