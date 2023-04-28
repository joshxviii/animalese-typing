unload_page()

chrome.storage.local.get(['gender'], function (result) {
	if (!result.gender) {
		chrome.storage.local.set({'gender':"female"});
	}
});

if (typeof soundischecked === 'undefined') soundischecked = true;

//Assign variables
let vol;
chrome.storage.local.get(['volume'], function (result) {
	vol = result.volume;
});
let v_type;
chrome.storage.local.get(['gender'], function (result) {
	v_type = result.gender;
});



//Listen for inputs
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		load_page()

		//Icon on and off
		chrome.storage.local.get('isactive', function (result) {
			if (typeof result === 'undefined') result = { 'isactive': true };
			if (typeof result.isactive !== 'boolean') result.isactive = true;
			if (result.isactive) {
				chrome.action.setIcon({ path : './assets/images/icon.png' });
			} else {
				chrome.action.setIcon({ path : './assets/images/icon_off.png' });
			}
			soundischecked = result.isactive;
		});

		//Assign and get volume
		chrome.storage.local.get(['volume'], function (result) {
			if (typeof result.volume === 'undefined') result = { 'volume': 0.5 };
			vol = result.volume;
		});

		//Assign villager voice type
		mp3_OK = [
			'assets/audio/animalese/female/OK.mp3',
			'assets/audio/animalese/male/OK.mp3'
		]
		chrome.storage.local.get(['gender'], function (result) {
			if (typeof result.gender === 'undefined') result = { 'volume': "female" };
			if (result.gender == "female" && v_type != result.gender) {
				send_audio(mp3_OK[0], 0.6);
			}
			if (result.gender == "male" && v_type != result.gender) {
				send_audio(mp3_OK[1], 0.6);
			}
			v_type = result.gender;
		});


		//Store sound files
		if (v_type == "female") {
			mp3_animalese = [
				'assets/audio/animalese/female/a.mp3',
				'assets/audio/animalese/female/b.mp3',
				'assets/audio/animalese/female/c.mp3',
				'assets/audio/animalese/female/d.mp3',
				'assets/audio/animalese/female/e.mp3',
				'assets/audio/animalese/female/f.mp3',
				'assets/audio/animalese/female/g.mp3',
				'assets/audio/animalese/female/h.mp3',
				'assets/audio/animalese/female/i.mp3',
				'assets/audio/animalese/female/j.mp3',
				'assets/audio/animalese/female/k.mp3',
				'assets/audio/animalese/female/l.mp3',
				'assets/audio/animalese/female/m.mp3',
				'assets/audio/animalese/female/n.mp3',
				'assets/audio/animalese/female/o.mp3',
				'assets/audio/animalese/female/p.mp3',
				'assets/audio/animalese/female/q.mp3',
				'assets/audio/animalese/female/r.mp3',
				'assets/audio/animalese/female/s.mp3',
				'assets/audio/animalese/female/t.mp3',
				'assets/audio/animalese/female/u.mp3',
				'assets/audio/animalese/female/v.mp3',
				'assets/audio/animalese/female/w.mp3',
				'assets/audio/animalese/female/x.mp3',
				'assets/audio/animalese/female/y.mp3',
				'assets/audio/animalese/female/z.mp3'
			];
			mp3_vocals = [
				'assets/audio/vocals/female/0.mp3',
				'assets/audio/vocals/female/1.mp3',
				'assets/audio/vocals/female/2.mp3',
				'assets/audio/vocals/female/3.mp3',
				'assets/audio/vocals/female/4.mp3',
				'assets/audio/vocals/female/5.mp3',
				'assets/audio/vocals/female/6.mp3',
				'assets/audio/vocals/female/7.mp3',
				'assets/audio/vocals/female/8.mp3',
				'assets/audio/vocals/female/9.mp3',
				'assets/audio/vocals/female/10.mp3',
				'assets/audio/vocals/female/11.mp3'
			];
			mp3_deksa = 'assets/audio/animalese/female/Deska.mp3';
			mp3_gwah = 'assets/audio/animalese/female/Gwah.mp3';
		}

		else if (v_type == "male") {
			mp3_animalese = [
				'assets/audio/animalese/male/a.mp3',
				'assets/audio/animalese/male/b.mp3',
				'assets/audio/animalese/male/c.mp3',
				'assets/audio/animalese/male/d.mp3',
				'assets/audio/animalese/male/e.mp3',
				'assets/audio/animalese/male/f.mp3',
				'assets/audio/animalese/male/g.mp3',
				'assets/audio/animalese/male/h.mp3',
				'assets/audio/animalese/male/i.mp3',
				'assets/audio/animalese/male/j.mp3',
				'assets/audio/animalese/male/k.mp3',
				'assets/audio/animalese/male/l.mp3',
				'assets/audio/animalese/male/m.mp3',
				'assets/audio/animalese/male/n.mp3',
				'assets/audio/animalese/male/o.mp3',
				'assets/audio/animalese/male/p.mp3',
				'assets/audio/animalese/male/q.mp3',
				'assets/audio/animalese/male/r.mp3',
				'assets/audio/animalese/male/s.mp3',
				'assets/audio/animalese/male/t.mp3',
				'assets/audio/animalese/male/u.mp3',
				'assets/audio/animalese/male/v.mp3',
				'assets/audio/animalese/male/w.mp3',
				'assets/audio/animalese/male/x.mp3',
				'assets/audio/animalese/male/y.mp3',
				'assets/audio/animalese/male/z.mp3'
			];
			mp3_vocals = [
				'assets/audio/vocals/male/0.mp3',
				'assets/audio/vocals/male/1.mp3',
				'assets/audio/vocals/male/2.mp3',
				'assets/audio/vocals/male/3.mp3',
				'assets/audio/vocals/male/4.mp3',
				'assets/audio/vocals/male/5.mp3',
				'assets/audio/vocals/male/6.mp3',
				'assets/audio/vocals/male/7.mp3',
				'assets/audio/vocals/male/8.mp3',
				'assets/audio/vocals/male/9.mp3',
				'assets/audio/vocals/male/10.mp3',
				'assets/audio/vocals/male/11.mp3'
			];
			mp3_deksa = 'assets/audio/animalese/male/Deska.mp3';
			mp3_gwah = 'assets/audio/animalese/male/Gwah.mp3';
		}
		mp3_back = "assets/audio/sfx/backspace.mp3"

		//Play sound when typing
		if (soundischecked) {
			if (request) {
				var keycode = request.keycode;
				var key = request.key;
            }
			var randomPlay = function (min, max) {
				return Math.random() * (max - min) + min;
			}

			switch (true) {
				case (keycode == 8):
					send_audio(mp3_back, 0.6)
					break;

				case (keycode >= 48 && keycode <= 57):
					if (key == '!') {
						send_audio(mp3_gwah, 0.6)
					}
					else {
						send_audio(mp3_vocals[parseInt(key)], 1.0)
					}
					break;

				case (keycode == 187 && key == '='):
					send_audio(mp3_vocals[11], 1.0)
					break;

				case (keycode == 189 && key == '-'):
					send_audio(mp3_vocals[10], 1.0)
					break;

				case (keycode >= 65 && keycode <= 90):
					send_audio(mp3_animalese[keycode - 65], 0.6)
					break;

				case (keycode == 191):
					if (key == '?') {
						send_audio(mp3_deksa, 1.0)
					}
					break;

				default:
					break;
			}

		}
	}
);


async function hasOffscreenDocument(path) {
	// Check all windows controlled by the service worker to see if one 
	// of them is the offscreen document with the given path
	const offscreenUrl = chrome.runtime.getURL('audio.html');
	const matchedClients = await clients.matchAll();
	for (const client of matchedClients) {
		if (client.url === offscreenUrl) {
		return true;
		}
	}
	return false;
}

async function load_page() {
	if (!(await hasOffscreenDocument('audio.html'))) {
		var audio_page = chrome.offscreen.createDocument({
			url: chrome.runtime.getURL('audio.html'),
			reasons: ['AUDIO_PLAYBACK'],
			justification: 'audio playback'
		});
	}
}

function send_audio(audio_path, volume) {
	chrome.runtime.sendMessage({
		type: '',
		target: 'offscreen',
		path: audio_path,
		volume: volume,
		vol: vol
	});
}

async function unload_page() {
	if ((await hasOffscreenDocument('audio.html'))) {
		chrome.offscreen.closeDocument()
	}
}





