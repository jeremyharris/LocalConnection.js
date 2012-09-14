var player;

// create a connection
var t = new LocalConnection({
	name: 'video_playas',
	debug: true
});

// add callback so other tabs can tell this tab to pause
function pauseVideo() {
	player.pauseVideo();
}
t.addCallback('pause', this.pauseVideo, this);

// listen for events from other tabs/windows
t.listen();

// called by the youtube api
function onYouTubePlayerReady(playerId) {
	// add youtube callback
	player = document.getElementById('youtubeplayer');
	player.addEventListener('onStateChange', 'stateChange');
}

// state change callback for youtube player
function stateChange(state) {
	// is this video playing? if so, send a pause event
	if (state == 1) {
		console.log('sending', t);
		t.send('pause');
	}
}
