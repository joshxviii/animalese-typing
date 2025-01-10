var female_voices = ['Sweet', 'Peppy', 'Big sister', 'Snooty'];
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
		document.getElementById('pitch_variation_out').value = String( parseInt(document.getElementById('pitch_variation').value * 100) ) + "%"
	
		document.getElementById('pitch_shift').value = sound_profile.pitch_shift
		document.getElementById('pitch_shift_out').value =  ((document.getElementById('pitch_shift').value>0)?"+":"") + String( parseFloat(document.getElementById('pitch_shift').value).toFixed(1))
	
		document.getElementById('intonation').value = sound_profile.intonation
		document.getElementById('intonation_out').value =  ((document.getElementById('intonation').value>0)?"+":"") + String( parseFloat(document.getElementById('intonation').value).toFixed(1))
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

	document.getElementById('disable').addEventListener('input', async function (e) {
		if(document.getElementById('disable').checked){
			//toggle off
			disable()
			chrome.storage.local.set({'isactive':false});
			await chrome.runtime.sendMessage({type: 'update_values'});
		}
		else{
			//toggle on
			enable()
			chrome.storage.local.set({'isactive':true});
			await chrome.runtime.sendMessage({type: 'update_values'});
			await chrome.runtime.sendMessage({type: 'type', key: '&'});
		}
	});




	//Set values for Editor
	function updateProfile() {
		chrome.storage.local.set({'sound_profile' : sound_profile});
		chrome.runtime.sendMessage({type: 'update_values'});
	}

	document.getElementById('profile_editor').addEventListener('click', function (e) {
		document.getElementById('overlay').classList.toggle("show");
		chrome.runtime.sendMessage({type: 'type', key: 'Enter'});
	});

	document.getElementById('exit_editor').addEventListener('click', function (e) {
		document.getElementById('overlay').classList.toggle("show");
		chrome.runtime.sendMessage({type: 'type', key: 'Enter'});
	});

	//EDITOR INPUTS======
	let pitch_variation = document.getElementById('pitch_variation');
	let pitch_variation_out = document.getElementById('pitch_variation_out')
	pitch_variation_out.addEventListener('click', function (e) {pitch_variation_out.select()})
	pitch_variation_out.addEventListener('focusout', function (e) {updatePitchVariation()});
	pitch_variation_out.addEventListener('keydown', function (e) {if (e.key=="Enter") updatePitchVariation()})
	pitch_variation.addEventListener('input', function (e) {
		sound_profile.pitch_variation = pitch_variation.value
		pitch_variation_out.value = String( parseInt(pitch_variation.value * 100) ) + "%"
		updateProfile()
	});
	function updatePitchVariation() {
		let value = parseFloat(pitch_variation_out.value)
		if (!isNaN(value)) {
			value = ((value<100)?((value>0)?value:0):100)
			pitch_variation_out.value = String( value.toFixed(0) ) + "%"
		}
		else {
			value = 20.0;
			pitch_variation_out.value = String( value.toFixed(0) ) + "%";
		}
		sound_profile.pitch_variation = value*0.01;
		pitch_variation.value = value*0.01;
		pitch_variation_out.blur();

		updateProfile();
	}




	let pitch_shift = document.getElementById('pitch_shift');
	let pitch_shift_out = document.getElementById('pitch_shift_out')
	pitch_shift_out.addEventListener('click', function (e) {pitch_shift_out.select()})
	pitch_shift_out.addEventListener('focusout', function (e) {updatePitchShift()})
	pitch_shift_out.addEventListener('keydown', function (e) {if (e.key=="Enter") updatePitchShift()})
	pitch_shift.addEventListener('input', function (e) {
		let value = pitch_shift.value
		sound_profile.pitch_shift = value
		pitch_shift_out.value = ((value>0)?"+":"") + String( parseFloat(value).toFixed(1))
		updateProfile()
	});
	function updatePitchShift() {
		let value = parseFloat(pitch_shift_out.value)
		if (!isNaN(value)) {
			value = ((value<12)?((value>-12)?value:-12):12)
			pitch_shift_out.value = ((value>0)?"+":"") + String( value.toFixed(1) )
		}
		else {
			value = 0.0;
			pitch_shift_out.value = value.toFixed(1);
		}
		sound_profile.pitch_shift = value
		pitch_shift.value = value
		pitch_shift_out.blur();

		updateProfile();
	}




	let intonation = document.getElementById('intonation');
	let intonation_out = document.getElementById('intonation_out')
	intonation_out.addEventListener('click', function (e) {intonation_out.select()})
	intonation_out.addEventListener('focusout', function (e) {updateIntonation()})
	intonation_out.addEventListener('keydown', function (e) {if (e.key=="Enter") updateIntonation()})
	intonation.addEventListener('input', function (e) {
		let value = intonation.value
		sound_profile.intonation = value
		intonation_out.value = ((value>0)?"+":"") + String( parseFloat(value * 1 ).toFixed(1))
		updateProfile();
	});
	function updateIntonation() {
		let value = parseFloat(intonation_out.value)
				
		if (!isNaN(value)) {
			value = ((value<1.0)?((value>-0.5)?value:-0.5):1)
			intonation_out.value = ((value>0)?"+":"") + String( value.toFixed(1) )
		}
		else {
			value = 0.0;
			intonation_out.value = value.toFixed(1);
		}
		sound_profile.intonation = value
		intonation.value = value
		intonation_out.blur();

		updateProfile();
	}

});

//End