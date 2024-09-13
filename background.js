

//Joshua Sherry
//5-1-2023
//dagexviii.dev@gmail.com
//https://github.com/joshxviii/animalese-typing

console.log("animalese-typing start");

function isAlpha(str) {
	return (str.length === 1)?(/[a-zA-Z]/).test(str.charAt(0)):false;
}

const file_type = ".aac";
const isUpperCase = str => str === str.toUpperCase();

class AnimaleseSoundProfile {
	constructor(pitch_shift = 0.0, pitch_variation = 0.2, intonation = 0.0) {
		this.pitch_variation = pitch_variation;
		this.pitch_shift = pitch_shift;
		this.intonation = intonation;
	}
}


//Assign variables that dont exsist
var vol=0.5;
var v_type="voice_1";
var g_type="female";
var config=0;
var soundischecked=false;
var sound_profile = new AnimaleseSoundProfile()
chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'sound_config', 'sound_profile', 'isactive'], async function (result) {
	if (typeof result.isactive === 'undefined') {chrome.storage.local.set({'isactive':true}); }
	if (typeof result.voice_type === 'undefined') {chrome.storage.local.set({'voice_type':v_type});}
	if (typeof result.f_voice === 'undefined') {chrome.storage.local.set({'f_voice':v_type,'m_voice':v_type});}
	if (typeof result.gender === 'undefined') {chrome.storage.local.set({'gender':g_type});}
	if (typeof result.volume === 'undefined') {chrome.storage.local.set({'volume':vol});}
	if (typeof result.sound_config === 'undefined') {chrome.storage.local.set({'sound_config':config});}
	if (typeof result.sound_profile === 'undefined') {chrome.storage.local.set({'sound_profile':sound_profile});}

	update_values();

	if (typeof result.isactive !== 'boolean') result.isactive = true;
	if (result.isactive) {
		chrome.action.setIcon({ path : './assets/images/icon.png' });
	} else {
		chrome.action.setIcon({ path : './assets/images/icon_off.png' });
	}
	
});

//Listen for inputs
async function update_values() {
	await chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'sound_config', 'sound_profile', 'isactive'], async function (result) {
		vol = result.volume;
		v_type = result.voice_type;
		g_type = result.gender;
		config = result.sound_config;
		sound_profile = result.sound_profile;
		soundischecked = result.isactive;
	});
	update_paths();
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	switch (request.type) {
		case 'update_values':
			await update_values();
		break;
		case 'type':
			if (!soundischecked) return;// exit early if disabled.
			let input_type = request.input_type;
			if (request.config) config = request.config;
			if (request.g_type) {
				g_type = request.g_type; 
				v_type = request.v_type;
				update_paths()
			}
			if (input_type == 'password') { //do not play animalese if password field is focused
				play_audio(audio_special["default"], 0.2, 0.4);
				return;
			}
			else {
				let keycode = request.keycode;
				let key = request.key;
				switch (true) {
					case (keycode == 16 || keycode == 32 || keycode == 20 || keycode == 18):break;//spacebar, shift, caps
						
					case (config!=1 && key.startsWith("Arrow"))://arrow keys
						play_audio(audio_arrows[(keycode-37)%4], 0.4);
					break;
					case (config!=1 && key == "Backspace" || key == "Delete" )://backspace, delete
						play_audio(audio_special['back'], 1.0)
					break;
					case (config!=1 && key == "Enter")://enter
						play_audio(audio_special['enter'], 0.2)
					break;
					case (config!=1 && key == "Tab")://tab
						play_audio(audio_special['tab'], 0.5)
					break;
					case (key == '?'):
						if (config!=1) play_audio(audio_special[key], 0.6)
						if (config!=2) play_audio(audio_deksa, 0.6, 0.2, 0.0, 1, true);
					break;
					case (key == '!'):
						if (config!=1) play_audio(audio_special[key], 0.6)
						if (config!=2) play_audio(audio_gwah, 0.6, 0.2, 0.0, 1, true);
					break;
					case (config!=1 && key == '~'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '@'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '#'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '$'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '%'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '^'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '&'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '*'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '('): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == ')'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '['): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == ']'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '{'): play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '}'): play_audio(audio_special[key], 0.6); break;

					case (config!=2 && parseInt(key) >= 1 && parseInt(key) <= 9):
						play_audio(audio_vocals[parseInt(key)-1], 1.0);
					break;
					case (config!=2 && parseInt(key) == 0):
						play_audio(audio_vocals[9], 1.0);
					break;
					case (config!=2 && keycode == 45):
						play_audio(audio_vocals[10], 1.0);
					break;
					case (config!=2 && keycode == 61):
						play_audio(audio_vocals[11], 1.0);
					break;

					case (config!=2 && key == 'OK'): play_audio(audio_ok, 0.6, 0.0, 0.0, 1, true); break;
					case (config!=2 && isAlpha(key) ):
						let audioPath = 'assets/audio/animalese/'+g_type+'/'+v_type+'/'+ key.toLowerCase() +''+file_type;
						//When typing in caps have a slighty higher and louder pitch with more variation
						if (isUpperCase(key)) play_audio(audioPath, 0.7, 0.15, 1.6, 1, true);
						else play_audio(audioPath, 0.5, 0.0, 0, 1, true);
					break;

					default:
						//Default sound to play
						play_audio(config!=1 && audio_special["default"], 0.4, 0.4);
					break;
				}
			}
		break;
	}
});

//End

async function update_paths() {
	//Store sound files
	audio_vocals = [
		'assets/audio/vocals/'+g_type+'/'+v_type+'/0'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/1'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/2'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/3'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/4'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/5'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/6'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/7'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/8'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/9'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/10'+file_type,
		'assets/audio/vocals/'+g_type+'/'+v_type+'/11'+file_type
	];
	audio_arrows = [
		'assets/audio/sfx/left'+file_type,
		'assets/audio/sfx/up'+file_type,
		'assets/audio/sfx/right'+file_type,
		'assets/audio/sfx/down'+file_type
	];
	audio_deksa = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Deska'+file_type;
	audio_gwah = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Gwah'+file_type;
	audio_ok = 'assets/audio/animalese/'+g_type+'/'+v_type+'/OK'+file_type;
	audio_special = {
		"default": 'assets/audio/sfx/default'+file_type,
		"back": 'assets/audio/sfx/backspace'+file_type,
		"enter": 'assets/audio/sfx/enter'+file_type,
		"tab": 'assets/audio/sfx/tab'+file_type,
		"?": 'assets/audio/sfx/question'+file_type,
		"~": 'assets/audio/sfx/tilde'+file_type,
		"!": 'assets/audio/sfx/exclamation'+file_type,
		"@": 'assets/audio/sfx/at'+file_type,
		"#": 'assets/audio/sfx/pound'+file_type,
		"$": 'assets/audio/sfx/dollar'+file_type,
		"%": 'assets/audio/sfx/percent'+file_type,
		"^": 'assets/audio/sfx/caret'+file_type,
		"&": 'assets/audio/sfx/ampersand'+file_type,
		"*": 'assets/audio/sfx/asterisk'+file_type,
		"(": 'assets/audio/sfx/parenthesis_open'+file_type,
		")": 'assets/audio/sfx/parenthesis_closed'+file_type,
		"[": 'assets/audio/sfx/bracket_open'+file_type,
		"]": 'assets/audio/sfx/bracket_closed'+file_type,
		"{": 'assets/audio/sfx/brace_open'+file_type,
		"}": 'assets/audio/sfx/brace_closed'+file_type
	}
}

let audioCtx = new AudioContext();;
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
	gainNode.gain.value = volume * vol * 0.95;
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
