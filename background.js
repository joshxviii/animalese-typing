//Joshua Sherry
//5-1-2023
//dagexviii.dev@gmail.com
//https://github.com/joshxviii/animalese-typing

console.log("Start");

//Assign variables that dont exsist
chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'isactive'], async function (result) {
	if (typeof result.isactive === 'undefined') chrome.storage.local.set({'isactive':true});
	if (typeof result.voice_type === 'undefined') chrome.storage.local.set({'voice_type':"voice_1"});
	if (typeof result.f_voice === 'undefined') chrome.storage.local.set({'f_voice':"voice_1",'m_voice':"voice_1"});
	if (typeof result.gender === 'undefined') chrome.storage.local.set({'gender':"female"});
	if (typeof result.volume === 'undefined') chrome.storage.local.set({'volume':0.5});
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
	await chrome.storage.local.get(['gender', 'voice_type', 'volume', 'f_voice', 'm_voice', 'isactive'], async function (result) {

		vol = result.volume;
		v_type = result.voice_type;
		g_type = result.gender;

		soundischecked = result.isactive;

		if(request.type == 'type') {
			if (await load_page()) {
				ready_audio_lists();
				//Play sound when typing when audio.html is loaded
				if (soundischecked) {
					if (request.ok) {
						send_audio(request.ok, 0.6);
					}
					var keycode = request.keycode;
					var key = request.key;
					var input_type = request.input_type;
					if (input_type == 'password') { //do not play animalese if password field is focused
						send_audio(ogg_back, 0.4);
						//send_audio(ogg_animalese[randomPlay(0,25)], 0.6)
					}
					else {
						switch (true) {
							case (keycode == 8):
								send_audio(ogg_back, 0.6);
								break;
		
							case (keycode >= 48 && keycode <= 57):
								if (key == '!') {
									send_audio(ogg_gwah, 0.6);
								}
								else {
									send_audio(ogg_vocals[parseInt(key)], 1.0)
								}
								break;
		
							case (keycode == 187 && key == '='):
								send_audio(ogg_vocals[11], 1.0);
								break;
		
							case (keycode == 189 && key == '-'):
								send_audio(ogg_vocals[10], 1.0);
								break;
		
							case (keycode >= 65 && keycode <= 90):
								send_audio(ogg_animalese[keycode - 65], 0.6, true);
								break;
		
							case (keycode == 191):
								if (key == '?') {
									send_audio(ogg_deksa, 1.0);
								}
								break;
		
							default:
								break;
						}
					}
				}
			}
		}
	});
});
//End



async function hasOffscreenDocument(path) {
	// Check all windows controlled by the service worker to see if one 
	// of them is the offscreen document with the given path
	const offscreenUrl = chrome.runtime.getURL(path);
	const matchedClients = await clients.matchAll();
	for (const client of matchedClients) {
		if (client.url === offscreenUrl) {
		return true;
		}
	}
	return false;
}

async function load_page() {
	while (!(await hasOffscreenDocument('audio.html'))) {
		await chrome.offscreen.createDocument({
			url: 'audio.html',
			justification: 'ignored',
			reasons: ['AUDIO_PLAYBACK'],
		});
	}
	return true
}

function send_audio(audio_path, volume, rand_pitch) {
	chrome.runtime.sendMessage({
		type: 'audio',
		target: 'offscreen',
		path: audio_path,
		volume: volume,
		vol: vol,
		rand_pitch: rand_pitch
	});
}
function randomPlay(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

async function unload_page() {
	if ((await hasOffscreenDocument('audio.html'))) {
		chrome.offscreen.closeDocument();
	}
}

function ready_audio_lists() {
	//Store sound files
	ogg_animalese = [
		'assets/audio/animalese/'+g_type+'/'+v_type+'/a.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/b.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/c.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/d.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/e.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/f.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/g.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/h.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/i.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/j.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/k.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/l.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/m.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/n.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/o.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/p.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/q.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/r.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/s.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/t.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/u.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/v.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/w.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/x.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/y.ogg',
		'assets/audio/animalese/'+g_type+'/'+v_type+'/z.ogg'
	];
	ogg_vocals = [
		'assets/audio/vocals/'+g_type+'/'+v_type+'/0.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/1.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/2.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/3.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/4.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/5.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/6.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/7.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/8.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/9.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/10.ogg',
		'assets/audio/vocals/'+g_type+'/'+v_type+'/11.ogg'
	];
	ogg_deksa = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Deska.ogg';
	ogg_gwah = 'assets/audio/animalese/'+g_type+'/'+v_type+'/Gwah.ogg';
	ogg_back = "assets/audio/sfx/backspace.ogg";
}