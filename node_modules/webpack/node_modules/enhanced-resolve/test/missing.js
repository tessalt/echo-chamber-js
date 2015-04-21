var resolve = require("../");
var should = require("should");
var path = require("path");

describe("missing", function() {
	var testCases = [
		[path.join(__dirname, "fixtures"), "./missing-file", [
			path.join(__dirname, "fixtures", "missing-file"),
			path.join(__dirname, "fixtures", "missing-file.js"),
			path.join(__dirname, "fixtures", "missing-file.node"),
		]],
		[path.join(__dirname, "fixtures"), "missing-module", [
			path.join(__dirname, "fixtures", "node_modules", "missing-module"),
			path.join(__dirname, "..", "node_modules", "missing-module"),
		]],
		[path.join(__dirname, "fixtures"), "missing-module/missing-file", [
			path.join(__dirname, "fixtures", "node_modules", "missing-module"),
			path.join(__dirname, "..", "node_modules", "missing-module"),
		]],
		[path.join(__dirname, "fixtures"), "m1/missing-file", [
			path.join(__dirname, "fixtures", "node_modules", "m1", "missing-file"),
			path.join(__dirname, "fixtures", "node_modules", "m1", "missing-file.js"),
			path.join(__dirname, "fixtures", "node_modules", "m1", "missing-file.node"),
			path.join(__dirname, "..", "node_modules", "m1"),
		]],
		[path.join(__dirname, "fixtures"), "m1/a", [
			path.join(__dirname, "fixtures", "node_modules", "m1", "a"),
			path.join(__dirname, "fixtures", "node_modules", "m1", "a.node"),
			path.join(__dirname, "..", "node_modules", "m1"),
		]],
	];
	testCases.forEach(function(testCase) {
		it("should tell about missing file when trying to resolve " + testCase[1], function(done) {
			var callback = function(err, filename) {
				if(err) {
					err.missing.sort().should.containDeep(testCase[2].sort());
					callback.missing.sort().should.containDeep(testCase[2].sort());
					resolve(testCase[0], testCase[1], function(err) {
						err.missing.sort().should.containDeep(testCase[2].sort());
						done();
					});
					return;
				}
				callback.missing.sort().should.containDeep(testCase[2].sort());
				done();
			};
			callback.missing = [];
			resolve(testCase[0], testCase[1], callback);
		});
		it("should tell about missing file when trying to resolve sync " + testCase[1], function() {
			try {
				resolve.sync(testCase[0], testCase[1]);
			} catch(err) {
				err.missing.sort().should.containDeep(testCase[2].sort());
			}
		});
	});

});
