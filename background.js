//Joshua Sherry
//5-1-2023
//dagexviii.dev@gmail.com
//https://github.com/joshxviii/animalese-typing

console.log("animalese-typing start");

// #region On install
//Assign variables that dont exsist
class AnimaleseSoundProfile {
	constructor(pitch_shift = 0.0, pitch_variation = 0.2, intonation = 0.0) {
		this.pitch_variation = pitch_variation;
		this.pitch_shift = pitch_shift;
		this.intonation = intonation;
	}
}
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
	injectAnimaleseAllTabs();
	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
	  chrome.runtime.setUninstallURL('');
	}
});
function injectAnimaleseAllTabs() {
	//console.log("reinject content scripts into all tabs");
	var manifest = chrome.runtime.getManifest();
	chrome.windows.getAll({},function(windows){
		for(var win in windows){
			chrome.tabs.query({}, function(tabs) {
			for (var i in tabs) {
				if (typeof tabs[i].url === 'undefined') continue;
				var scripts = manifest.content_scripts[0].js;
				chrome.scripting.executeScript({
					target: {tabId: tabs[i].id},
					files: scripts
				}).catch(()=>{});
			}
		});
		}
	});
};
chrome.tabs.onUpdated.addListener(function(id,changeInfo,tab){
	if (changeInfo.url === undefined && changeInfo.status == 'complete' && tab.status == 'complete') {
		chrome.scripting.executeScript({
			target: {tabId: id},
			files: chrome.runtime.getManifest().content_scripts[0].js
		}).catch(()=>{});
	}
});
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
// #endregion

// #region Process Inputs
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
						
						//Input characters
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
						
						//Special characters
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
						
						//Numbers & Vocal characters
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
						
						//Alphabet characters
						case (config!=2 && isAlpha(key)):
							let audioPath = 'assets/audio/animalese/'+g_type+'/'+v_type+'/'+ getAlphaSound(key);
							//When typing in uppercase have a slighty higher and louder pitch with more variation
							if (isUpperCase(key)) send_audio(audioPath, 0.7, 0.15, 1.6, 1, true);
							else send_audio(audioPath, 0.5, 0.0, 0, 1, true);
						break;

						default:
							//Default sound
							send_audio(config!=1 && audio_special["default"], 0.4, 0.4);
						break;
					}
				}
			break;
		}
	
});
// #endregion

// #region Regex checks
const regexMap = [
    { letter: "a", regex: /[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u0101\u0103\u0105\u01ce]/ },
    { letter: "b", regex: /[\u1e03\u1e05\u1e07]/ },
    { letter: "c", regex: /[\u00e7\u0107\u0109\u010b\u010d]/ },
    { letter: "d", regex: /[\u010f\u0111\u1e0b\u1e0d\u1e0f\u1e11\u1e13]/ },
    { letter: "e", regex: /[\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b\u1eb9\u1ebb\u1ebd\u1ebf\u1ec1\u1ec3\u1ec5\u1ec7\u011f]/ },
    { letter: "f", regex: /[\u1e1f]/ },
    { letter: "g", regex: /[\u011d\u011f\u0121\u0123\u1e21]/ },
    { letter: "h", regex: /[\u0125\u021f\u1e23\u1e25\u1e27\u1e29\u1e2b\u1e96]/ },
    { letter: "i", regex: /[\u00ec\u00ed\u00ee\u00ef\u0129\u012b\u012d\u012f\u0131\u1ec9\u1ecb]/ },
    { letter: "j", regex: /[\u0135\u01f0]/ },
    { letter: "k", regex: /[\u0137\u1e31\u1e33\u1e35\u0199]/ },
    { letter: "l", regex: /[\u013a\u013c\u013e\u0140\u0142\u1e37\u1e39\u1e3b\u1e3d]/ },
    { letter: "m", regex: /[\u1e3f\u1e41\u1e43]/ },
    { letter: "n", regex: /[\u00f1\u0144\u0146\u0148\u0149\u014b\u1e45\u1e47\u1e49\u1e4b]/ },
    { letter: "o", regex: /[\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151\u01a1\u01eb\u01ed\u1ecd\u1ecf\u1ed1\u1ed3\u1ed5\u1ed7\u1ed9\u1edb\u1edd\u1edf\u1ee1\u1ee3]/ },
    { letter: "p", regex: /[\u1e55\u1e57]/ },
    { letter: "q", regex: /[\u024b]/ },
    { letter: "r", regex: /[\u0155\u0157\u0159\u0211\u0213\u1e59\u1e5b\u1e5d\u1e5f]/ },
    { letter: "s", regex: /[\u00df\u015b\u015d\u015f\u0161\u1e61\u1e63\u1e65\u1e67\u1e69\u1e9b]/ },
    { letter: "t", regex: /[\u0163\u0165\u0167\u1e6b\u1e6d\u1e6f\u1e71\u1e97]/ },
    { letter: "u", regex: /[\u00f9\u00fa\u00fb\u00fc\u0169\u016b\u016d\u016f\u0171\u0173\u01b0\u1e73\u1e75\u1e77\u1e79\u1e7b\u1e7d\u1ee5\u1ee7\u1ee9\u1eeb\u1eed\u1eef\u1ef1]/ },
    { letter: "v", regex: /[\u1e7f\u028b]/ },
    { letter: "w", regex: /[\u0175\u1e81\u1e83\u1e85\u1e87\u1e89\u1e98]/ },
    { letter: "x", regex: /[\u1e8b\u1e8d]/ },
    { letter: "y", regex: /[\u00fd\u00ff\u0177\u0233\u1e8f\u1e99\u1ef3\u1ef5\u1ef7\u1ef9]/ },
    { letter: "z", regex: /[\u017a\u017c\u017e\u1e91\u1e93\u1e95\u0225]/ },
];

function isAlpha(str) {return (str.length === 1)?(/\p{Letter}/gu).test(str.charAt(0)):false;}

const isUpperCase = str => str === str.toUpperCase();

function isMoney(str) {return (str.length === 1)?(/[$£€¥₩₱¢]/).test(str.charAt(0)):false;}

function isWhitespace(str) {return (str.length === 1)?(/\s/).test(str.charAt(0)):false;}

//Used for typing in other languages
function getAlphaSound(key) {
	key = key.toLowerCase().charAt(0);
    for (const { letter, regex } of regexMap) if (regex.test(key)) return letter;
    return key;// Default case for unmatched keys
}
// #endregion

// #region Play sounds
async function send_audio(audio_path, volume, rand_pitch, pitch, cutoff_channel, use_profile) {
	await hasOffscreenDocument('audio.html');
	chrome.runtime.sendMessage({
		type: 'audio',
		target: 'offscreen',
		profile: sound_profile,
		path: audio_path,
		volume: volume,
		vol: vol,
		rand_pitch: rand_pitch,
		pitch: pitch,
		cutoff_channel: cutoff_channel,
		use_profile: use_profile
	});
}
// #endregion

//Update sound file paths
async function update_paths() {
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
	audio_deksa = 	'assets/audio/animalese/'+g_type+'/'+v_type+'/Deska';
	audio_gwah = 	'assets/audio/animalese/'+g_type+'/'+v_type+'/Gwah';
	audio_ok = 		'assets/audio/animalese/'+g_type+'/'+v_type+'/OK';
	audio_special = {
		"default": 	'assets/audio/sfx/default',
		"back": 	'assets/audio/sfx/backspace',
		"enter": 	'assets/audio/sfx/enter',
		"tab": 		'assets/audio/sfx/tab',
		"?": 		'assets/audio/sfx/question',
		"~": 		'assets/audio/sfx/tilde',
		"!": 		'assets/audio/sfx/exclamation',
		"@": 		'assets/audio/sfx/at',
		"#": 		'assets/audio/sfx/pound',
		"$": 		'assets/audio/sfx/dollar',
		"%": 		'assets/audio/sfx/percent',
		"^": 		'assets/audio/sfx/caret',
		"&": 		'assets/audio/sfx/ampersand',
		"*": 		'assets/audio/sfx/asterisk',
		"(": 		'assets/audio/sfx/parenthesis_open',
		")": 		'assets/audio/sfx/parenthesis_closed',
		"[": 		'assets/audio/sfx/bracket_open',
		"]": 		'assets/audio/sfx/bracket_closed',
		"{": 		'assets/audio/sfx/brace_open',
		"}": 		'assets/audio/sfx/brace_closed',
		"/": 		'assets/audio/sfx/slash_forward',
		"\\": 		'assets/audio/sfx/slash_back'
	}
}