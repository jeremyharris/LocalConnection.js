/**
 * LocalConnection
 *
 * Using cookies, LocalConnection allows callbacks to be triggered across browser
 * tabs and windows
 */
function LocalConnection(options) {

/**
 * Cookie name
 *
 * @var string
 */
	this.name = 'localconnection';

/**
 * Unique id for this transmitter
 *
 * @var integer
 */
	this.id = new Date().getTime();

/**
 * Whether or not localStorage is supported. Falls back to cookies if not.
 *
 * @var boolean
 */
	this.useLocalStorage = false;

/**
 * Log events to the console
 *
 * @var boolean
 */
	this.debug = false;

/**
 * List of actions set by addCallback
 *
 * @var array
 */
	this._actions= [];

/**
 * Initializes the transmitter
 *
 * @param opts Object
 */
	this.init = function(options) {
		// test for localStorage
		try {
			localStorage.setItem(this.id, this.id);
			localStorage.removeItem(this.id);
			this.useLocalStorage = true;
		} catch(e) {
			this.useLocalStorage = false;
		}
		for (var o in options) {
			this[o] = options[o];
		}
		this.clear();
	}

/**
 * Starts listening for events
 */
	this.listen = function() {
		if (this.useLocalStorage) {
			if (window.addEventListener) {
				window.addEventListener('storage', this.bind(this, this._check), false);
			} else {
				window.attachEvent('onstorage', this.bind(this, this._check));
			}
		} else {
			setInterval(this.bind(this, this._check), 100);
		}
	}

/**
 * Sends an event with arguments
 *
 * {{{
 * // on receiver
 * LocalConnection.addCallback('startVid', myfunction);
 * // on sender
 * LocalConnection.send('startVid', '#video');
 * }}}
 *
 * @param event string The event name as defined by the receiver
 * @param ...rest Other arguments as to be passed to the function
 */
	this.send = function(event) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this._write(event, args);
	}

/**
 * Adds a callback to a receive event
 *
 * {{{
 * // on receiver
 * function myfunction(vidid) {
 *     $(vidid).play();
 * }
 * LocalConnection.addCallback('startVid', myfunction);
 * // on sender
 * LocalConnection.send('startVid', '#video');
 * }}}
 *
 * @param event string The name of the event
 * @param func function The callback
 */
	this.addCallback = function(event, func, scope) {
		if (scope == undefined) {
			scope = this;
		}
		if (this._actions[event] == undefined) {
			this._actions[event] = [];
		}
		this._actions[event].push({f: func, s: scope});
	}

/**
 * Removes a callback
 *
 * @param event string The event to stop polling for
 */
	this.removeCallback = function(event) {
		for (var e in this._actions) {
			if (e == event) {
				delete this._actions[e];
				break;
			}
		}
	}

/**
 * Checks for new data
 */
	this._check = function() {
		var data = this._read();
		if (data.length > 0) {
			for (var e in data) {
				this._receive(data[e].event, data[e].args);
			}
		}
	}

/**
 * Called when data is received
 *
 * @param event string The event name
 * @param args array Arguments to pass to the event
 */
	this._receive = function(event, args) {
		if (this._actions[event] != undefined) {
			for (var func in this._actions[event]) {
				this.log('Triggering callback "'+event+'"', this._actions[event]);
				var callback = this._actions[event][func];
				callback.f.apply(callback.s, args);
			}
		}
	};

/**
 * Writes the cookie. Will append if there is already information
 *
 * @param event string Event name
 * @param args array Array of arguments
 */
	this._write = function(event, args) {
		var events = this._getEvents();
		var evt = {
			id: this.id,
			event: event,
			args: args
		};
		events.push(evt);
		this.log('Sending event', evt);
		if (this.useLocalStorage) {
			localStorage.setItem(this.name, JSON.stringify(events));
		} else {
			document.cookie = this.name + '=' + JSON.stringify(events) + "; path=/";
		}
		return true;
	}

/**
 * Reads the cookie
 *
 * Returns false if the cookie is empty (i.e., no new data). If new data is found,
 * it will return an array of events sent
 */
	this._read = function() {
		var events = this._getEvents();
		if (events == '') {
			return false;
		}
		var ret = [];
		// only return events from other connections
		for (var e in events) {
			if (events[e].id != this.id) {
				ret.push({
					event: events[e].event,
					args: events[e].args
				});
				events.splice(e, 1);
			}
		}
		if (this.useLocalStorage) {
			localStorage.setItem(this.name, JSON.stringify(events));
		} else {
			document.cookie = this.name + '=' + JSON.stringify(events) + "; path=/";
		}
		return ret;
	}

/**
 * Gets all queued events
 *
 * @return string
 */
	this._getEvents = function() {
		return this.useLocalStorage ? this._getLocalStorage() : this._getCookie();
	}

/**
 * Gets raw localStorage data
 *
 * @return string
 */
	this._getLocalStorage = function() {
		var events = localStorage.getItem(this.name);
		if (events == null) {
			return [];
		}
		return JSON.parse(events);
	}

/**
 * Gets raw cookie data
 *
 * @return string
 */
	this._getCookie = function() {
		var ca = document.cookie.split(';');
		var data;
		for (var i=0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(this.name+'=') == 0) {
				data = c.substring(this.name.length+1, c.length);
				break;
			}
		}
		data = data || '[]';
		return JSON.parse(data);
	}

/**
 * Clears all events
 */
	this.clear = function() {
		if (this.useLocalStorage) {
			localStorage.removeItem(this.name);
		} else {
			document.cookie = this.name + "=; path=/";
		}
	}

/**
 * Binds a function to a scope
 *
 * @param scope Object The scope
 * @param fn Function The function
 * @return Function
 */
	this.bind = function(scope, fn) {
		return function () {
			fn.apply(scope, arguments);
		};
	}

/**
 * Logs to the console if it exists
 */
	this.log = function() {
		if (!this.debug) {
			return;
		}
		if (console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	}

	this.init(options);

}
