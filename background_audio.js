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

let audioCtx;
let gainNode;
let buffer;
let source;

async function play_audio(audio_path, volume, random_pitch=0.0) {

	if (!audioCtx) {
		audioCtx = new AudioContext();
	}

	const response = await fetch(audio_path);
	buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());

	gainNode = audioCtx.createGain();
	gainNode.gain.value = volume * 0.8;
	gainNode.connect(audioCtx.destination);

	source = audioCtx.createBufferSource();
	source.connect(gainNode);
	source.buffer = buffer;

	if(random_pitch!=0) source.detune.value = (Math.random() * (300 + 300) - 300)*random_pitch;

	source.start();
}

function sent_from(sender_path, msg) {
	if ( "chrome-extension://" + msg.id + "/" + sender_path == msg.url) {
		return true;
	}
	else return false;
}
