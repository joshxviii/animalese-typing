chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		if (sent_from("background.js", sender)) {
			if (request) {
				play_audio(request.path, request.volume * request.vol);
			}
		}
		else if (sent_from("popup.html", sender)) {
			if (request) {
				play_audio(request.path, request.volume * request.vol);
			}
		}
	}
);

function play_audio(audio_path, volume) {
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