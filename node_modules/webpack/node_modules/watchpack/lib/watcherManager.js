/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");

function WatcherManager() {
	this.directoryWatchers = {};
}

WatcherManager.prototype.getDirectoryWatcher = function(directory) {
	var DirectoryWatcher = require("./DirectoryWatcher");
	if(!this.directoryWatchers[directory]) {
		this.directoryWatchers[directory] = new DirectoryWatcher(directory, {});
		this.directoryWatchers[directory].on("closed", function() {
			delete this.directoryWatchers[directory];
		}.bind(this));
	}
	return this.directoryWatchers[directory];
};

WatcherManager.prototype.watchFile = function watchFile(p, startTime) {
	var directory = path.dirname(p);
	return this.getDirectoryWatcher(directory).watch(p, startTime);
};

WatcherManager.prototype.watchDirectory = function watchDirectory(directory, startTime) {
	return this.getDirectoryWatcher(directory).watch(directory, startTime);
};

module.exports = new WatcherManager();