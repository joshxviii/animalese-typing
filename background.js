

//Joshua Sherry
//5-1-2023
//dagexviii.dev@gmail.com
//https://github.com/joshxviii/animalese-typing

console.log("animalese typing start");

const file_type = ".aac";

//Assign variables that dont exsist
chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'sound_config', 'isactive'], async function (result) {
	if (typeof result.isactive === 'undefined') chrome.storage.local.set({'isactive':true});
	if (typeof result.voice_type === 'undefined') chrome.storage.local.set({'voice_type':"voice_1"});
	if (typeof result.f_voice === 'undefined') chrome.storage.local.set({'f_voice':"voice_1",'m_voice':"voice_1"});
	if (typeof result.gender === 'undefined') chrome.storage.local.set({'gender':"female"});
	if (typeof result.volume === 'undefined') chrome.storage.local.set({'volume':0.5});
	if (typeof result.sound_config === 'undefined') chrome.storage.local.set({'sound_config':0});
	if (typeof soundischecked === 'undefined') soundischecked = true;

	if (typeof result.isactive !== 'boolean') result.isactive = true;
	if (result.isactive) {
		chrome.action.setIcon({ path : './assets/images/icon.png' });
	} else {
		chrome.action.setIcon({ path : './assets/images/icon_off.png' });
	}
	
});

//Listen for inputs
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
	await chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'sound_config', 'isactive'], async function (result) {

		vol = result.volume;
		v_type = result.voice_type;
		g_type = result.gender;
		config = result.sound_config;
		soundischecked = result.isactive;

		if(request.type == 'type') {
			ready_audio_lists();
			//Play sound when typing when audio.html is loaded
			if (soundischecked) {
				if (config!=2 && request.ok) {
					play_audio(request.ok+file_type, 0.6);
				}
				if (input_type == 'password') { //do not play animalese if password field is focused
					play_audio(audio_special["default"], 0.2, 0.4);
				}
				else {
					var keycode = request.keycode;
					var key = request.key;
					var input_type = request.input_type;
					switch (true) {
						case (keycode == 16 || keycode == 32):
							break;
						case (config!=1 && keycode == 8):
							play_audio(audio_special['back'], 0.6)
							break;
						case (config!=1 && keycode == 13):
							play_audio(audio_special['enter'], 0.6)
							break;
						case (config!=1 && keycode == 9):
							play_audio(audio_special['tab'], 0.6)
							break;
						case (key == '?'):
							if (config!=2) play_audio(audio_deksa, 0.6);
							if (config!=1) play_audio(audio_special[key], 0.6)
							break;
						case (key == '!'):
							if (config!=2) play_audio(audio_gwah, 0.6);
							if (config!=1) play_audio(audio_special[key], 0.6)
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
						case (config!=2 && keycode == 173):
							play_audio(audio_vocals[10], 1.0);
							break;
						case (config!=2 && keycode == 61):
							play_audio(audio_vocals[11], 1.0);
							break;
	
						case (config!=2 && keycode >= 65 && keycode <= 90):
							play_audio(audio_animalese[keycode - 65], 0.6, 0.2);
							break;
	
						default:
							play_audio(config!=1 && audio_special["default"], 0.4, 0.4);
							break;
					}
				}
			}
		}
	});
});
//End

function ready_audio_lists() {
	//Store sound files
	audio_animalese = [
		'assets/audio/animalese/'+g_type+'/'+v_type+'/a'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/b'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/c'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/d'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/e'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/f'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/g'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/h'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/i'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/j'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/k'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/l'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/m'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/n'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/o'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/p'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/q'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/r'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/s'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/t'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/u'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/v'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/w'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/x'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/y'+file_type,
		'assets/audio/animalese/'+g_type+'/'+v_type+'/z'+file_type
	];
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
	audio_deksa = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Deska'+file_type;
	audio_gwah = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Gwah'+file_type;
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
	gainNode.gain.value = volume * vol * 0.8;
	gainNode.connect(audioCtx.destination);

	source = audioCtx.createBufferSource();
	source.connect(gainNode);
	source.buffer = buffer;

	if(random_pitch!=0) source.detune.value = (Math.random() * (300 + 300) - 300)*random_pitch;

	source.start();
}
