chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		if (sent_from("background.js", sender)) {
			if (request.type == 'audio') {
				play_audio(request.path, request.volume * request.vol, request.rand_pitch);
			}
		}
		else if (sent_from("popup.html", sender)) {
			if (request.type == 'audio') {
				play_audio(request.path, request.volume * request.vol, request.rand_pitch);
			}
		}
	}
);

function play_audio(audio_path, volume, rand_pitch) {
	const audio = new Audio(audio_path)
	audio.currentTime = 0;
	audio.volume = volume;
	audio.play();
}

function sent_from(sender_path, msg) {
	if ( "chrome-extension://" + msg.id + "/" + sender_path == msg.url) {
		return true;
	}
	else return false;
}