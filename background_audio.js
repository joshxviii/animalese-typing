chrome.runtime.onMessage.addListener(
	async function (request, sender, sendResponse) {
		if (sent_from("background.js", sender)) {
			if (request.type == 'audio') {
				sound_profile = request.profile;
				play_audio(request.path, request.volume * request.vol, request.rand_pitch, request.pitch, request.cutoff_channel, request.use_profile);
			}
		}
		// else if (sent_from("popup.html", sender)) {
		// 	if (request.type == 'audio') {
		// 		play_audio(request.path, request.volume * request.vol, request.rand_pitch, request.pitch, request.cutoff_channel, request.use_profile);
		// 	}
		// }
	}
);

function sent_from(sender_path, msg) {
	if ( "chrome-extension://" + msg.id + "/" + sender_path == msg.url) {
		return true;
	}
	else return false;
}

var sound_profile;
let audioCtx;
let gainNode;
let buffer;
let source;
async function play_audio(audio_path, volume, random_pitch=0.0, pitch=0.0, cutoff_channel=0, use_profile=false) {

	if (!audioCtx) audioCtx = new AudioContext();

	const response = await fetch(audio_path);
	buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());

	//allow sounds on the same channel to cut eachother off.
	if (source && cutoff_channel!=0) {
		if (source.cutoff_channel == cutoff_channel) {
			gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime); 
			gainNode.gain.exponentialRampToValueAtTime(0.0005, audioCtx.currentTime + 0.03);
		}
	}

	//apply volume gain
	gainNode = audioCtx.createGain();
	gainNode.gain.value = volume * 0.9;
	gainNode.connect(audioCtx.destination);

	source = audioCtx.createBufferSource();
	source.connect(gainNode);
	source.buffer = buffer;
	source.cutoff_channel = cutoff_channel;

	//apply pitch variation and pitch shift
	if( !(random_pitch==0 && pitch==0) || use_profile) source.detune.value = ((parseFloat(((use_profile)?sound_profile.pitch_shift:0.0)) + pitch)*100.0) + ((Math.random() * (300 + 300) - 300)*(parseFloat(((use_profile)?sound_profile.pitch_variation:0)) + random_pitch));

	if(use_profile && sound_profile.intonation!=0) {
		source.playbackRate.setValueAtTime(source.playbackRate.value, audioCtx.currentTime);
		source.playbackRate.exponentialRampToValueAtTime(1 + (sound_profile.intonation*0.8), audioCtx.currentTime + 0.4);
	}

	source.start();
}