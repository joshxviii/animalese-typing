var female_voices = ['Sweet', 'Peppy', 'Uchi', 'Snooty'];
var male_voices = ['Jock', 'Lazy', 'Smug', 'Cranky'];

function disable() {
	chrome.action.setIcon({path: 'assets/images/icon_off.png'});
	document.getElementById('female').disabled = true;
	document.getElementById('male').disabled = true;
	chrome.storage.local.get(['gender'], function (g) {document.getElementById(g.gender).style.backgroundImage = "url('./assets/images/"+g.gender+".png')";});
	document.getElementById('v_type').disabled = true;
}

function enable() {
	chrome.action.setIcon({path: 'assets/images/icon.png'});
	document.getElementById('female').disabled = false;
	document.getElementById('male').disabled = false;
	chrome.storage.local.get(['gender'], function (g) {document.getElementById(g.gender).style.backgroundImage = "url('./assets/images/"+g.gender+"_on.png')";});
	document.getElementById('v_type').disabled = false;
}

function updateList() {
	chrome.storage.local.get(['f_voice','m_voice', 'gender'], function (result) {
		if(result.gender=="male") {
			document.getElementById('v_type').value = result.m_voice;
			var voice_list = male_voices;
		}
		else {
			document.getElementById('v_type').value = result.f_voice;
			var voice_list = female_voices;
		}
		for (let i = 0; i <= 3; i++) {
			document.getElementById('v_type').options[i].innerText = voice_list[i];
		}
	});

	chrome.runtime.sendMessage({type: 'update_values'});
}

function say_OK() {//send update notif to background for voice type/gender
	chrome.storage.local.get('gender', function (g) {
		chrome.runtime.sendMessage({type: 'type', key: 'OK', g_type: g.gender, v_type: document.getElementById('v_type').value});
	});
}
function say_Gwah() {//send update notif to background for config
	chrome.runtime.sendMessage({type: 'type', key: '!', config: document.getElementById('sound_config').value});
}


//Execute when popup is loaded
document.addEventListener('DOMContentLoaded', function() {
	updateList();
	document.getElementById('version').innerText = "v" + chrome.runtime.getManifest().version



	//Get saved values for everything on popup==================================================================
	let sound_profile;
	chrome.storage.local.get('sound_profile', function (result) {
		sound_profile = result.sound_profile;

		document.getElementById('pitch_variation').value = sound_profile.pitch_variation
		document.getElementById('pitch_variation_out').innerText = String( parseInt(document.getElementById('pitch_variation').value * 100) ) + "%"
	
		document.getElementById('pitch_shift').value = sound_profile.pitch_shift
		document.getElementById('pitch_shift_out').innerText =  ((document.getElementById('pitch_shift').value>0)?"+":"") + String( parseFloat(document.getElementById('pitch_shift').value) )
	
		document.getElementById('intonation').value = sound_profile.intonation
		document.getElementById('intonation_out').innerText =  ((document.getElementById('intonation').value>0)?"+":"") + String( parseFloat(document.getElementById('intonation').value))
	});

	chrome.storage.local.get(['isactive'], function (result) {
		if (result.isactive==true) {
			document.getElementById('disable').checked=false;
			enable();
		} 
		else {
			document.getElementById('disable').checked=true;
			disable();
		}
	});
	chrome.storage.local.get(['volume'], function (result) {
		document.getElementById('volume').value = result.volume;
		vol = result.volume;
	});
	chrome.storage.local.get(['gender'], function (result) {
			if (result.gender=="female") {
				document.getElementById('v_type').className = 'voice_f';
				document.getElementById('status').className = 'background_f';
				document.getElementById('status').style.backgroundImage = "url('./assets/images/backgroundBubbleFemale.png')";
				document.getElementById('female').style.backgroundImage = "url('./assets/images/female_on.png')";
				document.getElementById('male').style.backgroundImage = "url('./assets/images/male.png')";
			}
			else if(result.gender=="male") {
				document.getElementById('v_type').className = 'voice_m';
				document.getElementById('status').className = 'background_m';
				document.getElementById('status').style.backgroundImage = "url('./assets/images/backgroundBubbleMale.png')";
				document.getElementById('male').style.backgroundImage = "url('./assets/images/male_on.png')";
				document.getElementById('female').style.backgroundImage = "url('./assets/images/female.png')";
			}
	});
	chrome.storage.local.get(['sound_config'], function (result) {
		document.getElementById('sound_config').value = result.sound_config;
	});


	//Set values for anything altered on popup=================================================================
	document.getElementById('female').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.get(['f_voice'], function (result) {
			if(result.f_voice) document.getElementById('v_type').value = result.f_voice;
		});
		chrome.storage.local.set({'gender':"female"});
		document.getElementById('v_type').className = 'voice_f';
		document.getElementById('status').className = 'background_f';
		document.getElementById('female').style.backgroundImage = "url('./assets/images/female_on.png')";
		document.getElementById('male').style.backgroundImage = "url('./assets/images/male.png')";
		updateList();
		say_OK()
	});
	document.getElementById('male').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.get(['m_voice', 'gender'], function (result) {
			if(result.m_voice) document.getElementById('v_type').value = result.m_voice;
		});
		chrome.storage.local.set({'gender':"male"});
		document.getElementById('v_type').className = 'voice_m';
		document.getElementById('status').className = 'background_m';
		document.getElementById('male').style.backgroundImage = "url('./assets/images/male_on.png')";
		document.getElementById('female').style.backgroundImage = "url('./assets/images/female.png')";
		updateList();
		say_OK()
	});
	document.getElementById('volume').addEventListener('input', function (e) {
		chrome.storage.local.set({'volume' : document.getElementById('volume').value}, function () {
			document.getElementById('vol_percent').className = 'vol_active'
			document.getElementById('vol_percent').innerText = String( parseInt(document.getElementById('volume').value * 100) ) + "%"
		});
		chrome.runtime.sendMessage({type: 'update_values'});
	});
	document.getElementById('volume').addEventListener('mouseup', function (e) {
		document.getElementById('vol_percent').className = 'vol_inactive'
	});
	document.getElementById('v_type').addEventListener('change', function (e) {
		chrome.storage.local.get(['gender'], function (result) {
			if (result.gender == "female") chrome.storage.local.set({'f_voice' : document.getElementById('v_type').value});
			if (result.gender == "male") chrome.storage.local.set({'m_voice' : document.getElementById('v_type').value});
		});
		chrome.storage.local.set({'voice_type' : document.getElementById('v_type').value});
		say_OK()
	});

	document.getElementById('sound_config').addEventListener('change', function (e) {
		chrome.storage.local.set({'sound_config' : document.getElementById('sound_config').value});
		say_Gwah()
	});

	document.getElementById('disable').addEventListener('change', function (e) {
		if(document.getElementById('disable').checked){
			//toggle off
			disable()
			if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=false;
			chrome.storage.local.set({'isactive':false});
		}
		else{
			//toggle on
			enable()
			if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=true;
			chrome.storage.local.set({'isactive':true});
			chrome.runtime.sendMessage({type: 'type', key: '&'});
		}
	});

	document.getElementById('profile_editor').addEventListener('click', function (e) {
		document.getElementById('overlay').classList.toggle("show");
		chrome.runtime.sendMessage({type: 'type', key: 'Enter'});
	});

	document.getElementById('exit_editor').addEventListener('click', function (e) {
		document.getElementById('overlay').classList.toggle("show");
		chrome.runtime.sendMessage({type: 'update_values'});
		chrome.runtime.sendMessage({type: 'type', key: 'Enter'});
	});


	document.getElementById('pitch_variation').addEventListener('input', function (e) {
		sound_profile.pitch_variation = document.getElementById('pitch_variation').value
		document.getElementById('pitch_variation_out').innerText = String( parseInt(document.getElementById('pitch_variation').value * 100) ) + "%"
		
		chrome.storage.local.set({'sound_profile' : sound_profile});
	});

	document.getElementById('pitch_shift').addEventListener('input', function (e) {
		let value = document.getElementById('pitch_shift').value
		sound_profile.pitch_shift = value
		document.getElementById('pitch_shift_out').innerText = ((value>0)?"+":"") + String( parseFloat(value))

		chrome.storage.local.set({'sound_profile' : sound_profile});
	});

	document.getElementById('intonation').addEventListener('input', function (e) {
		let value = document.getElementById('intonation').value
		sound_profile.intonation = value
		document.getElementById('intonation_out').innerText = ((value>0)?"+":"") + String( parseFloat(value * 1 ))

		chrome.storage.local.set({'sound_profile' : sound_profile});
	});
});

//End

