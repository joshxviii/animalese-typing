//Joshua Sherry
//5-1-2023
//dagexviii.dev@gmail.com
//https://github.com/joshxviii/animalese-typing

console.log("animalese-typing start");

function isAlpha(str) {return (str.length === 1)?(/[a-zA-Z]/).test(str.charAt(0)):false;}

function isMoney(str) {return (str.length === 1)?(/[$£€¥₩₱¢]/).test(str.charAt(0)):false;}

function isWhitespace(str) {return (str.length === 1)?(/\s/).test(str.charAt(0)):false;}

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
var config=0; // sound configuration setting. 0 = all sounds. 1 = animalese only. 2 = sndfx only.
var soundischecked=false;
var sound_profile = new AnimaleseSoundProfile();
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

chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
	  chrome.runtime.setUninstallURL('');
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
				if (!soundischecked) return;
				let input_type = request.input_type;
				if (request.config) config = request.config;
				if (request.g_type) {
					g_type = request.g_type; 
					v_type = request.v_type;
					update_paths()
				}
				if (input_type == 'password') { //do not play animalese if password field is focused
					send_audio(audio_special["default"], 0.2, 0.4);
					return;
				}
				else {
					let keycode = request.keycode;
					let key = request.key;
					switch (true) {
						case (isWhitespace(key) || keycode == 16 || keycode == 32 || keycode == 20 || keycode == 18):break;//spacebar, shift, caps
						
						case (config!=1 && key.startsWith("Arrow"))://arrow keys
							send_audio(audio_arrows[(keycode-37)%4], 0.4);
						break;
						case (config!=1 && key == "Backspace" || key == "Delete" )://backspace, delete
							send_audio(audio_special['back'], 1.0)
						break;
						case (config!=1 && key == "Enter")://enter
							send_audio(audio_special['enter'], 0.2)
						break;
						case (config!=1 && key == "Tab")://tab
							send_audio(audio_special['tab'], 0.5)
						break;
						case (key == '?'):
							if (config!=1) send_audio(audio_special[key], 0.6)
							if (config!=2) send_audio(audio_deksa, 0.6, 0.2, 0.0, 1, true);
						break;
						case (key == '!'):
							if (config!=1) send_audio(audio_special[key], 0.6)
							if (config!=2) send_audio(audio_gwah, 0.6, 0.2, 0.0, 1, true);
						break;

						case (config!=1 && key == '~'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '@'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '#'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && isMoney(key)): 	send_audio(audio_special['$'], 0.6); break;
						case (config!=1 && key == '%'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '^'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '&'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '*'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '('): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == ')'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '['): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == ']'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '{'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '}'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '/'): 	send_audio(audio_special[key], 0.6); break;
						case (config!=1 && key == '\\'): 	send_audio(audio_special[key], 0.6); break;

						case (config!=2 && parseInt(key) >= 1 && parseInt(key) <= 9):
							send_audio(audio_vocals[parseInt(key)-1], 1.0);
						break;
						case (config!=2 && parseInt(key) == 0):
							send_audio(audio_vocals[9], 1.0);
						break;
						case (config!=2 && keycode == 45):
							send_audio(audio_vocals[10], 1.0);
						break;
						case (config!=2 && keycode == 61):
							send_audio(audio_vocals[11], 1.0);
						break;

						case (config!=2 && key == 'OK'): send_audio(audio_ok, 0.6, 0.0, 0.0, 1, true); break;
						case (config!=2 && isAlpha(key)):
							let audioPath = 'assets/audio/animalese/'+g_type+'/'+v_type+'/'+ key.toLowerCase();
							//When typing in caps have a slighty higher and louder pitch with more variation
							if (isUpperCase(key)) send_audio(audioPath, 0.7, 0.15, 1.6, 1, true);
							else send_audio(audioPath, 0.5, 0.0, 0, 1, true);
						break;

						default:
							//Default sound to play
							send_audio(config!=1 && audio_special["default"], 0.4, 0.4);
						break;
					}
				}
			break;
		}
	
});
//End

let creating;
async function hasOffscreenDocument(path) {
	const offscreenUrl = chrome.runtime.getURL(path);
	const existingContexts = await chrome.runtime.getContexts({
	  contextTypes: ['OFFSCREEN_DOCUMENT'],
	  documentUrls: [offscreenUrl]
	});
  
	if (existingContexts.length > 0) {
	  return;
	}

	if (creating) await creating;
	else {
		creating = chrome.offscreen.createDocument({
			url: 'audio.html',
			justification: 'ignored',
			reasons: ['AUDIO_PLAYBACK'],
		});
	}
	await creating;
	creating = null;
	update_values();
}

const file_type = ".aac"
async function send_audio(audio_path, volume, rand_pitch, pitch, cutoff_channel, use_profile) {
	await hasOffscreenDocument('audio.html');
	
	chrome.runtime.sendMessage({
		type: 'audio',
		target: 'offscreen',
		profile: sound_profile,
		path: audio_path+file_type,
		volume: volume,
		vol: vol,
		rand_pitch: rand_pitch,
		pitch: pitch,
		cutoff_channel: cutoff_channel,
		use_profile: use_profile
	});
}

async function update_paths() {
	//Store sound files
	audio_vocals = [
		'assets/audio/vocals/'+g_type+'/'+v_type+'/0',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/1',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/2',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/3',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/4',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/5',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/6',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/7',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/8',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/9',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/10',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/11'
	];
	audio_arrows = [
		'assets/audio/sfx/arrow_left',
		'assets/audio/sfx/arrow_up',
		'assets/audio/sfx/arrow_right',
		'assets/audio/sfx/arrow_down'
	];
	audio_deksa = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Deska';
	audio_gwah = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Gwah';
	audio_ok = 'assets/audio/animalese/'+g_type+'/'+v_type+'/OK';
	audio_special = {
		"default": 'assets/audio/sfx/default',
		"back": 'assets/audio/sfx/backspace',
		"enter": 'assets/audio/sfx/enter',
		"tab": 'assets/audio/sfx/tab',
		"?": 'assets/audio/sfx/question',
		"~": 'assets/audio/sfx/tilde',
		"!": 'assets/audio/sfx/exclamation',
		"@": 'assets/audio/sfx/at',
		"#": 'assets/audio/sfx/pound',
		"$": 'assets/audio/sfx/dollar',
		"%": 'assets/audio/sfx/percent',
		"^": 'assets/audio/sfx/caret',
		"&": 'assets/audio/sfx/ampersand',
		"*": 'assets/audio/sfx/asterisk',
		"(": 'assets/audio/sfx/parenthesis_open',
		")": 'assets/audio/sfx/parenthesis_closed',
		"[": 'assets/audio/sfx/bracket_open',
		"]": 'assets/audio/sfx/bracket_closed',
		"{": 'assets/audio/sfx/brace_open',
		"}": 'assets/audio/sfx/brace_closed',
		"/": 'assets/audio/sfx/slash_forward',
		"\\": 'assets/audio/sfx/slash_back'
	}
}