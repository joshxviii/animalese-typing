
async function hasOffscreenDocument(path) {
	// Check all windows controlled by the service worker to see if one 
	// of them is the offscreen document with the given path
	const offscreenUrl = chrome.runtime.getURL('background.html');
	const matchedClients = await clients.matchAll();
	for (const client of matchedClients) {
	  if (client.url === offscreenUrl) {
		return true;
	  }
	}
	return false;
  }

async function load_audio(audio_path, volume) {
	if (!(await hasOffscreenDocument('background.html'))) {
		var audio_page = chrome.offscreen.createDocument({
			url: chrome.runtime.getURL('background.html'),
			reasons: ['AUDIO_PLAYBACK'],
			justification: 'audio playback'
		});
	}
	chrome.runtime.sendMessage({
		type: '',
		target: 'offscreen',
		path: audio_path,
		volume: volume,
		vol: vol
	});
}

async function unload_audio() {
	if ((await hasOffscreenDocument('background.html'))) {
		chrome.offscreen.closeDocument()
	}
}

unload_audio()




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
			'animalese/female/OK.mp3',
			'animalese/male/OK.mp3'
		]
		chrome.storage.local.get(['gender'], function (result) {
			if (typeof result.gender === 'undefined') result = { 'volume': "female" };
			if (result.gender == "female" && v_type != result.gender) {
				load_audio(mp3_OK[0], 0.6);
			}
			if (result.gender == "male" && v_type != result.gender) {
				load_audio(mp3_OK[1], 0.6);
			}
			v_type = result.gender;
		});


		//Store sound files
		if (v_type == "female") {
			mp3_animalese = [
				'animalese/female/a.mp3',
				'animalese/female/b.mp3',
				'animalese/female/c.mp3',
				'animalese/female/d.mp3',
				'animalese/female/e.mp3',
				'animalese/female/f.mp3',
				'animalese/female/g.mp3',
				'animalese/female/h.mp3',
				'animalese/female/i.mp3',
				'animalese/female/j.mp3',
				'animalese/female/k.mp3',
				'animalese/female/l.mp3',
				'animalese/female/m.mp3',
				'animalese/female/n.mp3',
				'animalese/female/o.mp3',
				'animalese/female/p.mp3',
				'animalese/female/q.mp3',
				'animalese/female/r.mp3',
				'animalese/female/s.mp3',
				'animalese/female/t.mp3',
				'animalese/female/u.mp3',
				'animalese/female/v.mp3',
				'animalese/female/w.mp3',
				'animalese/female/x.mp3',
				'animalese/female/y.mp3',
				'animalese/female/z.mp3'
			];

			mp3_vocals = [
				'vocals/female/0.mp3',
				'vocals/female/1.mp3',
				'vocals/female/2.mp3',
				'vocals/female/3.mp3',
				'vocals/female/4.mp3',
				'vocals/female/5.mp3',
				'vocals/female/6.mp3',
				'vocals/female/7.mp3',
				'vocals/female/8.mp3',
				'vocals/female/9.mp3',
				'vocals/female/10.mp3',
				'vocals/female/11.mp3'
			];
		}

		else if (v_type == "male") {
			mp3_animalese = [
				'animalese/male/a.mp3',
				'animalese/male/b.mp3',
				'animalese/male/c.mp3',
				'animalese/male/d.mp3',
				'animalese/male/e.mp3',
				'animalese/male/f.mp3',
				'animalese/male/g.mp3',
				'animalese/male/h.mp3',
				'animalese/male/i.mp3',
				'animalese/male/j.mp3',
				'animalese/male/k.mp3',
				'animalese/male/l.mp3',
				'animalese/male/m.mp3',
				'animalese/male/n.mp3',
				'animalese/male/o.mp3',
				'animalese/male/p.mp3',
				'animalese/male/q.mp3',
				'animalese/male/r.mp3',
				'animalese/male/s.mp3',
				'animalese/male/t.mp3',
				'animalese/male/u.mp3',
				'animalese/male/v.mp3',
				'animalese/male/w.mp3',
				'animalese/male/x.mp3',
				'animalese/male/y.mp3',
				'animalese/male/z.mp3'
			];

			mp3_vocals = [
				'vocals/male/0.mp3',
				'vocals/male/1.mp3',
				'vocals/male/2.mp3',
				'vocals/male/3.mp3',
				'vocals/male/4.mp3',
				'vocals/male/5.mp3',
				'vocals/male/6.mp3',
				'vocals/male/7.mp3',
				'vocals/male/8.mp3',
				'vocals/male/9.mp3',
				'vocals/male/10.mp3',
				'vocals/male/11.mp3'
			];
		}


		//Play sound when typing
		if (soundischecked) {
			if (request) var keycode = request.keycode;
			var randomPlay = function (min, max) {
				return Math.random() * (max - min) + min;
			}

			if (keycode >= 65 && keycode <= 90) {
				keycode = keycode - 65;
				load_audio(mp3_animalese[keycode], 0.6)
			}
			else if (keycode >= 48 && keycode <= 57) {
				keycode = keycode - 48;
				load_audio(mp3_vocals[keycode], 1.0)
			}
			else if (keycode == 189) {
				load_audio(mp3_vocals[10], 1.0)
			}
			else if (keycode == 187) {
				load_audio(mp3_vocals[11], 1.0)
			}
		}
	}
);


/*


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		//Assign and get volume
		chrome.storage.local.get(['volume'], function (result) {
			if (typeof result.volume === 'undefined') result = { 'volume': 0.5 };
			vol = result.volume;
		});

		//Assign Villager Voice Type
		mp3_OK = [
			'animalese/female/OK.mp3',
			'animalese/male/OK.mp3'
		]
		chrome.storage.local.get(['gender'], function (result) {
			if (typeof result.gender === 'undefined') result = { 'volume': "female" };
			if (result.gender == "female" && v_type != result.gender) {
				const audio = new Audio(mp3_OK[0])
				audio.currentTime = 0;
				audio.volume = 0.6 * vol;
				audio.play();
			}
			if (result.gender == "male" && v_type != result.gender) {
				const audio = new Audio(mp3_OK[1])
				audio.currentTime = 0;
				audio.volume = 0.6 * vol;
				audio.play();
			}
			v_type = result.gender;
		});


		


		//Store sound files
		
		if (v_type == "female") {
			mp3_animalese = [
				'animalese/female/a.mp3',
				'animalese/female/b.mp3',
				'animalese/female/c.mp3',
				'animalese/female/d.mp3',
				'animalese/female/e.mp3',
				'animalese/female/f.mp3',
				'animalese/female/g.mp3',
				'animalese/female/h.mp3',
				'animalese/female/i.mp3',
				'animalese/female/j.mp3',
				'animalese/female/k.mp3',
				'animalese/female/l.mp3',
				'animalese/female/m.mp3',
				'animalese/female/n.mp3',
				'animalese/female/o.mp3',
				'animalese/female/p.mp3',
				'animalese/female/q.mp3',
				'animalese/female/r.mp3',
				'animalese/female/s.mp3',
				'animalese/female/t.mp3',
				'animalese/female/u.mp3',
				'animalese/female/v.mp3',
				'animalese/female/w.mp3',
				'animalese/female/x.mp3',
				'animalese/female/y.mp3',
				'animalese/female/z.mp3'
			];

			mp3_vocals = [
				'vocals/female/1.mp3',
				'vocals/female/2.mp3',
				'vocals/female/3.mp3',
				'vocals/female/4.mp3',
				'vocals/female/5.mp3',
				'vocals/female/6.mp3',
				'vocals/female/7.mp3',
				'vocals/female/8.mp3',
				'vocals/female/9.mp3',
				'vocals/female/10.mp3',
				'vocals/female/11.mp3'
			];
		}

		else if (v_type == "male") {
			mp3_animalese = [
				'animalese/male/a.mp3',
				'animalese/male/b.mp3',
				'animalese/male/c.mp3',
				'animalese/male/d.mp3',
				'animalese/male/e.mp3',
				'animalese/male/f.mp3',
				'animalese/male/g.mp3',
				'animalese/male/h.mp3',
				'animalese/male/i.mp3',
				'animalese/male/j.mp3',
				'animalese/male/k.mp3',
				'animalese/male/l.mp3',
				'animalese/male/m.mp3',
				'animalese/male/n.mp3',
				'animalese/male/o.mp3',
				'animalese/male/p.mp3',
				'animalese/male/q.mp3',
				'animalese/male/r.mp3',
				'animalese/male/s.mp3',
				'animalese/male/t.mp3',
				'animalese/male/u.mp3',
				'animalese/male/v.mp3',
				'animalese/male/w.mp3',
				'animalese/male/x.mp3',
				'animalese/male/y.mp3',
				'animalese/male/z.mp3'
			];

			mp3_vocals = [
				'vocals/male/1.mp3',
				'vocals/male/2.mp3',
				'vocals/male/3.mp3',
				'vocals/male/4.mp3',
				'vocals/male/5.mp3',
				'vocals/male/6.mp3',
				'vocals/male/7.mp3',
				'vocals/male/8.mp3',
				'vocals/male/9.mp3',
				'vocals/male/10.mp3',
				'vocals/male/11.mp3'
			];
		}



		//Play sound when typing
		if (soundischecked) {
			if (request) var keycode = request.keycode;
			var randomPlay = function (min, max) {
				return Math.random() * (max - min) + min;
			}

			if (keycode >= 65 && keycode <= 90) {
				keycode = keycode - 65;
				const audio = new Audio(mp3_animalese[keycode]);
				audio.currentTime = 0;
				audio.volume = 0.6 * vol;
				audio.play();
			}
			else if (keycode >= 48 && keycode <= 57) {
				keycode = keycode - 48;
				const audio = new Audio(mp3_vocals[keycode])
				audio.currentTime = 0;
				audio.volume = 1.0 * vol;
				audio.play();
			}
			else if (keycode == 189) {
				const audio = new Audio(mp3_vocals[10])
				audio.currentTime = 0;
				audio.volume = 1.0 * vol;
				audio.play();
			}
			else if (keycode == 187) {
				const audio = new Audio(mp3_vocals[11])
				audio.currentTime = 0;
				audio.volume = 1.0 * vol;
				audio.play();
			}
		}
	}
);

*/