/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var EventEmitter = require("events").EventEmitter;
var async = require("async");
var chokidar = require("chokidar");
var fs = require("graceful-fs");
var path = require("path");

var watcherManager = require("./watcherManager");

var FS_ACCURENCY = 10000;


function DirectoryWatcher(path, options) {
	EventEmitter.call(this);
	this.path = path;
	this.files = {};
	this.directories = {};
	this.watcher = chokidar.watch(path, {
		ignoreInitial: true,
		persistent: true,
		followSymlinks: false,
		depth: 0,
		atomic: false,
		ignorePermissionErrors: true
	});
	this.watcher.on("add", this.onFileAdded.bind(this));
	this.watcher.on("addDir", this.onDirectoryAdded.bind(this));
	this.watcher.on("change", this.onChange.bind(this));
	this.watcher.on("unlink", this.onFileUnlinked.bind(this));
	this.watcher.on("unlinkDir", this.onDirectoryUnlinked.bind(this));
	this.watcher.on("error", this.onWatcherError.bind(this));
	this.initialScan = true;
	this.nestedWatching = false;
	this.initialScanRemoved = [];
	this.doInitialScan();
	this.watchers = {};
	this.refs = 0;
}
module.exports = DirectoryWatcher;

DirectoryWatcher.prototype = Object.create(EventEmitter.prototype);
DirectoryWatcher.prototype.constructor = DirectoryWatcher;

DirectoryWatcher.prototype.setFileTime = function setFileTime(path, mtime, initial, type) {
	var now = Date.now();
	var old = this.files[path];
	this.files[path] = [initial ? Math.min(now, mtime) : now, mtime];
	if(!old) {
		if(mtime) {
			if(this.watchers[path]) {
				this.watchers[path].forEach(function(w) {
					if(!initial || w.checkStartTime(mtime, initial)) {
						w.emit("change", mtime);
					}
				});
			}
		}
	} else if(!initial && mtime && type !== "add") {
		if(this.watchers[path]) {
			this.watchers[path].forEach(function(w) {
				w.emit("change", mtime);
			});
		}
	} else if(!initial && !mtime) {
		if(this.watchers[path]) {
			this.watchers[path].forEach(function(w) {
				w.emit("remove");
			});
		}
	}
	if(this.watchers[this.path]) {
		this.watchers[this.path].forEach(function(w) {
			if(!initial || w.checkStartTime(mtime, initial)) {
				w.emit("change", path, mtime);
			}
		});
	}
};

DirectoryWatcher.prototype.setDirectory = function setDirectory(path, exist, initial) {
	var old = this.directories[path];
	if(!old) {
		if(exist) {
			if(this.nestedWatching) {
				this.createNestedWatcher(path);
			} else {
				this.directories[path] = true;
			}
		}
	} else {
		if(!exist) {
			if(this.nestedWatching)
				this.directories[path].close();
			delete this.directories[path];
			if(!initial && this.watchers[this.path]) {
				this.watchers[this.path].forEach(function(w) {
					w.emit("change", path, w.data);
				});
			}
		}
	}
};

DirectoryWatcher.prototype.createNestedWatcher = function(path) {
	this.directories[path] = watcherManager.watchDirectory(path, 1);
	this.directories[path].on("change", function(path, mtime) {
		if(this.watchers[this.path]) {
			this.watchers[this.path].forEach(function(w) {
				if(w.checkStartTime(mtime, false)) {
					w.emit("change", path, mtime);
				}
			});
		}
	}.bind(this));
};

DirectoryWatcher.prototype.setNestedWatching = function(flag) {
	if(this.nestedWatching !== !!flag) {
		this.nestedWatching = !!flag;
		if(this.nestedWatching) {
			Object.keys(this.directories).forEach(function(path) {
				this.createNestedWatcher(path);
			}, this);
		} else {
			Object.keys(this.directories).forEach(function(path) {
				this.directories[path].close();
				this.directories[path] = true;
			}, this);
		}
	}
};

DirectoryWatcher.prototype.watch = function watch(path, startTime) {
	this.watchers[path] = this.watchers[path] || [];
	this.refs++;
	var watcher = new Watcher(this, path, startTime);
	watcher.on("closed", function() {
		var idx = this.watchers[path].indexOf(watcher);
		this.watchers[path].splice(idx, 1);
		if(this.watchers[path].length === 0) {
			delete this.watchers[path];
			if(this.path === path)
				this.setNestedWatching(false);
		}
		if(--this.refs <= 0)
			this.close();
	}.bind(this));
	this.watchers[path].push(watcher);
	if(path === this.path) {
		this.setNestedWatching(true);
		var data = false;
		Object.keys(this.files).forEach(function(file) {
			var d = this.files[file];
			if(!data)
				data = d;
			else
				data = [Math.max(data[0], d[0]), Math.max(data[1], d[1])];
		}, this);
	} else {
		var data = this.files[path];
	}
	process.nextTick(function() {
		if(data) {
			if(data[0] > startTime)
				watcher.emit("change", data[1]);
		} else if(this.initialScan && this.initialScanRemoved.indexOf(path) >= 0) {
			watcher.emit("remove");
		}
	}.bind(this));
	return watcher;
};

DirectoryWatcher.prototype.onFileAdded = function onFileAdded(path, stat) {
	if(path.indexOf(this.path) !== 0) return;
	if(/[\\\/]/.test(path.substr(this.path.length + 1))) return;

	if(!stat) {
		return fs.stat(path, function(err, stat) {
			if(err) return this.onWatcherError(err);
			this.onFileAdded(path, stat);
		}.bind(this));
	}
	this.setFileTime(path, +stat.mtime, false, "add");
};

DirectoryWatcher.prototype.onDirectoryAdded = function onDirectoryAdded(path, stat) {
	if(path.indexOf(this.path) !== 0) return;
	if(/[\\\/]/.test(path.substr(this.path.length + 1))) return;
	this.setDirectory(path, true, false);
};

DirectoryWatcher.prototype.onChange = function onChange(path, stat) {
	if(path.indexOf(this.path) !== 0) return;
	if(/[\\\/]/.test(path.substr(this.path.length + 1))) return;
	if(!stat) {
		return fs.stat(path, function(err, stat) {
			if(err) {
				if(err.code === "ENOENT")
					return this.setFileTime(path, null, false, "change");
				else
					return this.onWatcherError(err);
			}
			this.onChange(path, stat);
		}.bind(this));
	}
	var mtime = +stat.mtime;
	if(FS_ACCURENCY > 1 && mtime % 1 !== 0)
		FS_ACCURENCY = 1;
	else if(FS_ACCURENCY > 10 && mtime % 10 !== 0)
		FS_ACCURENCY = 10;
	else if(FS_ACCURENCY > 100 && mtime % 100 !== 0)
		FS_ACCURENCY = 100;
	else if(FS_ACCURENCY > 1000 && mtime % 1000 !== 0)
		FS_ACCURENCY = 1000;
	else if(FS_ACCURENCY > 2000 && mtime % 2000 !== 0)
		FS_ACCURENCY = 2000;
	this.setFileTime(path, mtime, false, "change");
};

DirectoryWatcher.prototype.onFileUnlinked = function onFileUnlinked(path) {
	if(path.indexOf(this.path) !== 0) return;
	if(/[\\\/]/.test(path.substr(this.path.length + 1))) return;
	this.setFileTime(path, null, false, "unlink");
	if(this.initialScan) {
		this.initialScanRemoved.push(path);
	}
};

DirectoryWatcher.prototype.onDirectoryUnlinked = function onDirectoryUnlinked(path) {
	if(path.indexOf(this.path) !== 0) return;
	if(/[\\\/]/.test(path.substr(this.path.length + 1))) return;
	this.setDirectory(path, false, false);
	if(this.initialScan) {
		this.initialScanRemoved.push(path);
	}
};

DirectoryWatcher.prototype.onWatcherError = function onWatcherError(err) {
};

DirectoryWatcher.prototype.doInitialScan = function doInitialScan() {
	fs.readdir(this.path, function(err, items) {
		if(err) {
			this.initialScan = false;
			return;
		}
		async.forEach(items, function(item, callback) {
			var itemPath = path.join(this.path, item);
			fs.stat(itemPath, function(err, stat) {
				if(!this.initialScan) return;
				if(err) {
					return callback();
				}
				if(stat.isFile()) {
					if(!this.files[itemPath])
						this.setFileTime(itemPath, +stat.mtime, true);
				} else if(stat.isDirectory()) {
					if(!this.directories[itemPath])
						this.setDirectory(itemPath, true, true);
				}
				return callback();
			}.bind(this));
		}.bind(this), function(err) {
			this.initialScan = false;
			this.initialScanRemoved = null;
		}.bind(this));
	}.bind(this));
};

DirectoryWatcher.prototype.getTimes = function() {
	var obj = {};
	var selfTime = 0;
	Object.keys(this.files).forEach(function(file) {
		var data = this.files[file];
		if(data[1]) {
			var time = Math.max(data[0], data[1]);
			obj[file] = time;
			if(time > selfTime)
				selfTime = time;
		}
	}, this);
	obj[this.path] = selfTime;
	return obj;
};

DirectoryWatcher.prototype.close = function() {
	this.initialScan = false;
	this.watcher.close();
	if(this.nestedWatching) {
		Object.keys(this.directories).forEach(function(dir) {
			this.directories[dir].close();
		}, this);
	}
	this.emit("closed");
};

function Watcher(directoryWatcher, path, startTime) {
	EventEmitter.call(this);
	this.directoryWatcher = directoryWatcher;
	this.path = path;
	this.startTime = startTime && +startTime;
	this.data = 0;
}

Watcher.prototype = Object.create(EventEmitter.prototype);
Watcher.prototype.constructor = Watcher;

Watcher.prototype.checkStartTime = function checkStartTime(mtime, initial) {
	if(typeof this.startTime !== "number") return !initial;
	var startTime = this.startTime && Math.floor(this.startTime / FS_ACCURENCY) * FS_ACCURENCY;
	return startTime <= mtime;
}

Watcher.prototype.close = function close() {
	this.emit("closed");
};
