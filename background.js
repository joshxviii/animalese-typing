
if (typeof soundischecked === 'undefined') soundischecked = true;

//Icon on and off
chrome.storage.local.get('isactive', function (result) {
	if (typeof result === 'undefined') result = { 'isactive': true };
	if (typeof result.isactive !== 'boolean') result.isactive = true;
	if (result.isactive) {
		chrome.browserAction.setIcon({ path: 'icon.png' });
	} else {
		chrome.browserAction.setIcon({ path: 'icon_off.png' });
	}
	soundischecked = result.isactive;
});




let vol;
chrome.storage.local.get(['volume'], function (result) {
	vol = result.volume;
});
let v_type;
chrome.storage.local.get(['gender'], function (result) {
	v_type = result.gender;
});




chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		//Assign and get volume
		chrome.storage.local.get(['volume'], function (result) {
			if (typeof result.volume === 'undefined') result = { 'volume': 0.5 };
			vol = result.volume;
		});

		//Assign Villager Voice Type
		mp3_OK = [
			document.getElementById('mp3-f-OK'),
			document.getElementById('mp3-m-OK')
		]
		chrome.storage.local.get(['gender'], function (result) {
			if (typeof result.gender === 'undefined') result = { 'volume': "female" };
			if (result.gender == "female" && v_type != result.gender) {
				mp3_OK[0].currentTime = 0;
				mp3_OK[0].volume = 0.6 * vol;
				mp3_OK[0].play();
			}
			if (result.gender == "male" && v_type != result.gender) {
				mp3_OK[1].currentTime = 0;
				mp3_OK[1].volume = 0.6 * vol;
				mp3_OK[1].play();
			}
			v_type = result.gender;
		});

		//Store sound files
		if (v_type == "female") {
			mp3_animalese = [
				document.getElementById('mp3-f-a'),
				document.getElementById('mp3-f-b'),
				document.getElementById('mp3-f-c'),
				document.getElementById('mp3-f-d'),
				document.getElementById('mp3-f-e'),
				document.getElementById('mp3-f-f'),
				document.getElementById('mp3-f-g'),
				document.getElementById('mp3-f-h'),
				document.getElementById('mp3-f-i'),
				document.getElementById('mp3-f-j'),
				document.getElementById('mp3-f-k'),
				document.getElementById('mp3-f-l'),
				document.getElementById('mp3-f-m'),
				document.getElementById('mp3-f-n'),
				document.getElementById('mp3-f-o'),
				document.getElementById('mp3-f-p'),
				document.getElementById('mp3-f-q'),
				document.getElementById('mp3-f-r'),
				document.getElementById('mp3-f-s'),
				document.getElementById('mp3-f-t'),
				document.getElementById('mp3-f-u'),
				document.getElementById('mp3-f-v'),
				document.getElementById('mp3-f-w'),
				document.getElementById('mp3-f-x'),
				document.getElementById('mp3-f-y'),
				document.getElementById('mp3-f-z')
			];

			mp3_vocals = [
				document.getElementById('mp3-f-0'),
				document.getElementById('mp3-f-1'),
				document.getElementById('mp3-f-2'),
				document.getElementById('mp3-f-3'),
				document.getElementById('mp3-f-4'),
				document.getElementById('mp3-f-5'),
				document.getElementById('mp3-f-6'),
				document.getElementById('mp3-f-7'),
				document.getElementById('mp3-f-8'),
				document.getElementById('mp3-f-9'),
				document.getElementById('mp3-f-10'),
				document.getElementById('mp3-f-11')
			];
		}
		else if (v_type == "male") {
			mp3_animalese = [
				document.getElementById('mp3-m-a'),
				document.getElementById('mp3-m-b'),
				document.getElementById('mp3-m-c'),
				document.getElementById('mp3-m-d'),
				document.getElementById('mp3-m-e'),
				document.getElementById('mp3-m-f'),
				document.getElementById('mp3-m-g'),
				document.getElementById('mp3-m-h'),
				document.getElementById('mp3-m-i'),
				document.getElementById('mp3-m-j'),
				document.getElementById('mp3-m-k'),
				document.getElementById('mp3-m-l'),
				document.getElementById('mp3-m-m'),
				document.getElementById('mp3-m-n'),
				document.getElementById('mp3-m-o'),
				document.getElementById('mp3-m-p'),
				document.getElementById('mp3-m-q'),
				document.getElementById('mp3-m-r'),
				document.getElementById('mp3-m-s'),
				document.getElementById('mp3-m-t'),
				document.getElementById('mp3-m-u'),
				document.getElementById('mp3-m-v'),
				document.getElementById('mp3-m-w'),
				document.getElementById('mp3-m-x'),
				document.getElementById('mp3-m-y'),
				document.getElementById('mp3-m-z')
			];

			mp3_vocals = [
				document.getElementById('mp3-m-0'),
				document.getElementById('mp3-m-1'),
				document.getElementById('mp3-m-2'),
				document.getElementById('mp3-m-3'),
				document.getElementById('mp3-m-4'),
				document.getElementById('mp3-m-5'),
				document.getElementById('mp3-m-6'),
				document.getElementById('mp3-m-7'),
				document.getElementById('mp3-m-8'),
				document.getElementById('mp3-m-9'),
				document.getElementById('mp3-m-10'),
				document.getElementById('mp3-m-11')
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
				mp3_animalese[keycode].currentTime = 0;
				mp3_animalese[keycode].volume = 0.6 * vol;
				mp3_animalese[keycode].play();
			}
			else if (keycode >= 48 && keycode <= 57) {
				keycode = keycode - 48;
				mp3_vocals[keycode].currentTime = 0;
				mp3_vocals[keycode].volume = 1.0 * vol;
				mp3_vocals[keycode].play();
			}
			else if (keycode == 189) {
				mp3_vocals[10].currentTime = 0;
				mp3_vocals[10].volume = 1.0 * vol;
				mp3_vocals[10].play();
			}
			else if (keycode == 187) {
				mp3_vocals[11].currentTime = 0;
				mp3_vocals[11].volume = 1.0 * vol;
				mp3_vocals[11].play();
			}
		}

	}
);










