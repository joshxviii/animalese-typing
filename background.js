

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
	//console.log("reinject content scripts into all tabs");
	var manifest = chrome.runtime.getManifest();
	chrome.windows.getAll({},function(windows){
		for(var win in windows){
			chrome.tabs.query({}, function(tabs) {
			for (var i in tabs) {
				if ((typeof tabs[i].url === 'undefined') || tabs[i].url.contain) continue;
				var scripts = manifest.content_scripts[0].js;
				chrome.scripting.executeScript({
					target: {tabId: tabs[i].id},
					files: scripts
				}).catch(()=>{});
			}
		});
		}
	});
});
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
					case (isWhitespace(key) || key == "Control" || keycode == 16 || keycode == 32 || keycode == 20 || keycode == 18):break;//spacebar, shift, caps
	
					//Input characters
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

					//Special characters
					case (config!=1 && key == '~'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '@'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '#'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && isMoney(key)): 	play_audio(audio_special['$'], 0.6); break;
					case (config!=1 && key == '%'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '^'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '&'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '*'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '('): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == ')'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '['): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == ']'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '{'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '}'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '/'): 	play_audio(audio_special[key], 0.6); break;
					case (config!=1 && key == '\\'): 	play_audio(audio_special[key], 0.6); break;

					//Numbers & Vocal characters
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
					
					//Alphabet characters
					case (config!=2 && isAlpha(key)):
						const letter = getLetterSound(key);
						if (!letter) return;
						let audioPath = 'assets/audio/animalese/'+g_type+'/'+v_type+'/'+ letter.toLowerCase();
						//When typing in uppercase have a slighty higher and louder pitch with more variation
						if (isUpperCase(letter)) play_audio(audioPath, 0.7, 0.15, 1.6, 1, true);
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
// #endregion

// #region Regex checks
const getPhoneticMapping = (() => {
	const phonemeToRegexMap = {// firefox version needs the unicode for some reason
		'a': /[\u314b\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u0101\u0103\u0105\u01ce]/,
		'A': /[\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u0100\u0102\u0104\u01cd]/,
		'b': /[\u3153\u1e03\u1e05\u1e07]/,
		'B': /[\u1e02\u1e04\u1e06]/,
		'c': /[\u315c\u00e7\u0107\u0109\u010b\u010d]/,
		'C': /[\u00c7\u0106\u0108\u010a\u010c]/,
		'd': /[\u314d\u010f\u0111\u1e0b\u1e0d\u1e0f\u1e11\u1e13]/,
		'D': /[\u010e\u0110\u1e0a\u1e0c\u1e0e\u1e10\u1e12]/,
		'e': /[\u3137\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b\u1eb9\u1ebb\u1ebd\u1ebf\u1ec1\u1ec3\u1ec5\u1ec7\u011f]/,
		'E': /[\u3140\u00c8\u00c9\u00ca\u00cb\u0112\u0114\u0116\u0118\u011a\u1eb8\u1eba\u1ebc\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u011e]/,
		'f': /[\u314e\u1e9f]/,
		'F': /[]/,
		'g': /[\u314f\u011d\u011f\u0121\u0123\u1e21]/,
		'G': /[\u011c\u011e\u0120\u0122\u1e20]/,
		'h': /[\u3151\u0125\u021f\u1e23\u1e25\u1e27\u1e29\u1e2b\u1e96]/,
		'H': /[\u0124\u021e\u1e22\u1e24\u1e26\u1e28\u1e2a]/,
		'i': /[\u3147\u00ec\u00ed\u00ee\u00ef\u0129\u012b\u012d\u012f\u0131\u1ec9\u1ecb]/,
		'I': /[\u00cc\u00cd\u00ce\u00cf\u0128\u012a\u012c\u012e\u0130\u1ec8\u1eca]/,
		'j': /[\u3153\u0135\u01f0]/,
		'J': /[\u0134]/,
		'k': /[\u3155\u0137\u1e31\u1e33\u1e35\u0199]/,
		'K': /[\u0136\u1e30\u1e32\u1e34\u0198]/,
		'l': /[\u3157\u013a\u013c\u013e\u0140\u0142\u1e37\u1e39\u1e3b\u1e3d]/,
		'L': /[\u0139\u013b\u013d\u013f\u0141\u1e36\u1e38\u1e3a\u1e3c]/,
		'm': /[\u3158\u1e3f\u1e41\u1e43]/,
		'M': /[\u3159\u1e40\u1e42]/,
		'n': /[\u3150\u00f1\u0144\u0146\u0148\u0149\u014b\u1e45\u1e47\u1e49\u1e4b]/,
		'N': /[\u3152\u00d1\u0143\u0145\u0147\u014a\u1e44\u1e46\u1e48\u1e4a]/,
		'o': /[\u3148\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151\u01a1\u01eb\u01ed\u1ecd\u1ecf\u1ed1\u1ed3\u1ed5\u1ed7\u1ed9\u1edb\u1edd\u1edf\u1ee1\u1ee3]/,
		'O': /[\u3149\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u014c\u014e\u0150\u01a0\u01ea\u01ec\u1ecc\u1ece\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u1eda\u1edc\u1ede\u1ee0\u1ee2]/,
		'p': /[\u314a\u1e55\u1e57]/,
		'P': /[\u1e54\u1e56]/,
		'q': /[\u3131\u024b]/,
		'Q': /[\u3132]/,
		'r': /[\u3139\u0155\u0157\u0159\u0211\u0213\u1e59\u1e5b\u1e5d\u1e5f]/,
		'R': /[\u0154\u0156\u0158\u0210\u0212\u1e58\u1e5a\u1e5c\u1e5e]/,
		's': /[\u314c\u00df\u015b\u015d\u015f\u0161\u1e61\u1e63\u1e65\u1e67\u1e69\u1e9b]/,
		'S': /[\u015a\u015c\u015e\u0160\u1e60\u1e62\u1e64\u1e66\u1e68]/,
		't': /[\u3141\u0163\u0165\u0167\u1e6b\u1e6d\u1e6f\u1e71\u1e97]/,
		'T': /[\u0162\u0164\u0166\u1e6a\u1e6c\u1e6e\u1e70]/,
		'u': /[\u3145\u00f9\u00fa\u00fb\u00fc\u0169\u016b\u016d\u016f\u0171\u0173\u01b0\u1e73\u1e75\u1e77\u1e79\u1e7b\u1e7d\u1ee5\u1ee7\u1ee9\u1eeb\u1eed\u1eef\u1ef1]/,
		'U': /[\u3146\u00d9\u00da\u00db\u00dc\u0168\u016a\u016c\u016e\u0170\u0172\u01af\u1e72\u1e74\u1e76\u1e78\u1e7a\u1e7c\u1ee4\u1ee6\u1ee8\u1eea\u1eec\u1eee\u1ef0]/,
		'v': /[\u3161\u1e7f\u028b]/,
		'V': /[\u1e7e]/,
		'w': /[\u3134\u0175\u1e81\u1e83\u1e85\u1e87\u1e89\u1e98]/,
		'W': /[\u0174\u1e80\u1e82\u1e84\u1e86\u1e88]/,
		'x': /[\u315c\u1e8b\u1e8d]/,
		'X': /[\u1e8a\u1e8c]/,
		'y': /[\u3142\u00fd\u00ff\u0177\u0233\u1e8f\u1e99\u1ef3\u1ef5\u1ef7\u1ef9]/,
		'Y': /[\u3143\u00dd\u0176\u0232\u1e8e\u1ef2\u1ef4\u1ef6\u1ef8]/,
		'z': /[\u315b\u017a\u017c\u017e\u1e91\u1e93\u1e95\u0225]/,
		'Z': /[\u0179\u017b\u017d\u1e90\u1e92\u1e94]/
	};

	const charToPhoneme = {}; // set up map. runs once on startup.
	for (const [phoneme, regex] of Object.entries(phonemeToRegexMap)) {
		const source = regex.source.replace(/^\[|\]$/g, '');
		const chars = [];
		const unicodeMatches = source.matchAll(/\\u([0-9a-fA-F]{4})/g);
		for (const match of unicodeMatches) {
			const codePoint = parseInt(match[1], 16);
			chars.push(String.fromCodePoint(codePoint));
		}
		for (const char of chars) charToPhoneme[char] = phoneme;
	}
	return (char) => charToPhoneme[char] || null;
})();

function isAlpha(str) {return (str.length === 1)?(/\p{Letter}/gu).test(str.charAt(0)):false;}

const isUpperCase = str => str === str.toUpperCase();

function isMoney(str) {return (str.length === 1)?(/[$£€¥₩₱¢\u0024\u00a3\u20ac\u00a5\u20a9\u20b1\u00a2]/).test(str.charAt(0)):false;}

function isWhitespace(str) {return (str.length === 1)?(/\s/).test(str.charAt(0)):false;}

//Used for typing in other languages
function getLetterSound(key) {
	console.log(key);
	key = key.charAt(0);
	if ((/[a-zA-Z]/).test(key)) return key;// If basic letter return letter
	const letter = getPhoneticMapping(key)// If special letter check regexMap and return basic letter
	return letter;// Default case for unmatched keys
}
// #endregion

// #region Play sounds
//Update sound file paths
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

const file_type = ".aac";
let audioCtx = new AudioContext();;
let gainNode;
let buffer;
let source;
async function play_audio(audio_path, volume, random_pitch=0.0, pitch=0.0, cutoff_channel=0, use_profile=false) {

	console.log(audio_path);

	if (!audioCtx) audioCtx = new AudioContext();

	const response = await fetch(audio_path+file_type);
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
