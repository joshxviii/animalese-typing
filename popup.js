//Execute when popup is loaded
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('version').innerText = "v" + chrome.runtime.getManifest().version
	//Get saved values for everything on popup

	chrome.storage.local.get(['isactive'], function (result) {
		if (result.isactive==true) {
			document.getElementById('toggle').className = 'toggled-on';
			document.getElementById('unchecked').checked=true;
			chrome.action.setIcon({path: 'assets/images/icon.png'});
			document.getElementById('tooltiptext').innerText = "Disable"
			chrome.runtime.sendMessage("update");
		} 
		else {
			document.getElementById('toggle').className = 'toggled-off';
			document.getElementById('unchecked').checked=false;
			chrome.action.setIcon({path: 'assets/images/icon_off.png'});
			document.getElementById('tooltiptext').innerText = "Enable"
			chrome.runtime.sendMessage("update");
		}
	});

	chrome.storage.local.get(['volume'], function (result) {
		document.getElementById('volume').value = result.volume;
		vol = result.volume;
		chrome.runtime.sendMessage("update");
	});

	chrome.storage.local.get(['gender'], function (result) {
		if (result.gender=="female") {
			document.getElementById('status').className = 'background_f';
			document.getElementById('status').style.backgroundImage = "url('./assets/images/backgroundBubbleFemale.png')";
			document.getElementById('female').style.backgroundImage = "url('./assets/images/female_on.png')";
			document.getElementById('male').style.backgroundImage = "url('./assets/images/male.png')";
			chrome.runtime.sendMessage("update");
		}
		else if(result.gender=="male") {
			document.getElementById('status').className = 'background_m';
			document.getElementById('status').style.backgroundImage = "url('./assets/images/backgroundBubbleMale.png')";
			document.getElementById('male').style.backgroundImage = "url('./assets/images/male_on.png')";
			document.getElementById('female').style.backgroundImage = "url('./assets/images/female.png')";
			chrome.runtime.sendMessage("update");
		}
	});



	//Set values for anything altered on popup
	document.getElementById('female').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.set({'gender':"female"});
			document.getElementById('status').className = 'background_f';
			document.getElementById('female').style.backgroundImage = "url('./assets/images/female_on.png')";
			document.getElementById('male').style.backgroundImage = "url('./assets/images/male.png')";
			chrome.runtime.sendMessage("update");
	});

	document.getElementById('male').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.set({'gender':"male"});
			document.getElementById('status').className = 'background_m';
			document.getElementById('male').style.backgroundImage = "url('./assets/images/male_on.png')";
			document.getElementById('female').style.backgroundImage = "url('./assets/images/female.png')";
			chrome.runtime.sendMessage("update");
	});

	document.getElementById('volume').addEventListener('input', function (e) {
		chrome.storage.local.set({'volume' : document.getElementById('volume').value}, function () {
			document.getElementById('vol_percent').className = 'vol_active'
			document.getElementById('vol_percent').innerText = String( parseInt(document.getElementById('volume').value * 100) ) + "%"
			chrome.runtime.sendMessage("update");
		});
	});

	document.getElementById('volume').addEventListener('mouseup', function (e) {
		document.getElementById('vol_percent').className = 'vol_inactive'
	});


	document.getElementById('unchecked').addEventListener('change', function (e) {
		if(document.getElementById('unchecked').checked){
		  //toggle off
		  document.getElementById('toggle').className = 'toggled-on';
		  chrome.action.setIcon({ path : './assets/images/icon.png' });
		  if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=true;
		  chrome.storage.local.set({'isactive':true});
		  document.getElementById('tooltiptext').innerText = "Disable"
		  chrome.runtime.sendMessage("update");
	   }
	   else{
		  //toggle on
		  document.getElementById('toggle').className = 'toggled-off';
		  chrome.action.setIcon({ path : './assets/images/icon_off.png' });
		  if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=false;
		  chrome.storage.local.set({'isactive':false});
		  document.getElementById('tooltiptext').innerText = "Enable"
		  chrome.runtime.sendMessage("update");
	   }
	});
 
 

//End
});
