
//Execute when popup is loaded
document.addEventListener('DOMContentLoaded', function() {

	//Get saved values for everything on popup
	if (chrome.extension.getBackgroundPage()) {
		
		chrome.storage.local.get(['volume'], function (result) {
		document.getElementById('volume').value = result.volume;
		vol = result.volume;
		});
		
		if (chrome.extension.getBackgroundPage().soundischecked) {
		  document.getElementById('toggle').className = 'toggled-on';
		 document.getElementById('unchecked').checked=true;
		 chrome.browserAction.setIcon({path: 'assests/textures/icon.png'});
		} 
		else {
		  document.getElementById('toggle').className = 'toggled-off';
		 document.getElementById('unchecked').checked=false;
		 chrome.browserAction.setIcon({path: 'assests/textures/icon_off.png'});
		}
	  
		chrome.storage.local.get(['gender'], function (result) {
			if(result.gender=="female") {
				document.getElementById('female').style.backgroundImage = "url('./assests/textures/female_on.png')";
				document.getElementById('male').style.backgroundImage = "url('./assests/textures/male.png')";
			}
			else if(result.gender=="male") {
				document.getElementById('male').style.backgroundImage = "url('./assests/textures/male_on.png')";
				document.getElementById('female').style.backgroundImage = "url('./assests/textures/female.png')";
			}
			//If the extension is loaded for the first time default to female voice type
			else {
				document.getElementById('female').style.backgroundImage = "url('./assests/textures/female_on.png')";
				document.getElementById('male').style.backgroundImage = "url('./assests/textures/male.png')";
			}
		});
	} 


	//Set values for anything altered on popup
	document.getElementById('female').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.set({'gender':"female"});
			document.getElementById('female').style.backgroundImage = "url('./assests/textures/female_on.png')";
			document.getElementById('male').style.backgroundImage = "url('./assests/textures/male.png')";
			chrome.runtime.sendMessage(null);
	});

	document.getElementById('male').addEventListener('click', function (e) {
		chrome.storage.local.get(['volume'], function (result) {
			vol = result.volume;
		});
		chrome.storage.local.set({'gender':"male"});
			document.getElementById('male').style.backgroundImage = "url('./assests/textures/male_on.png')";
			document.getElementById('female').style.backgroundImage = "url('./assests/textures/female.png')";
			chrome.runtime.sendMessage(null);
	});

	document.getElementById('volume').addEventListener('change', function (e) {
		chrome.storage.local.set({'volume' : document.getElementById('volume').value}, function () {
		chrome.runtime.sendMessage(null);
		});
	});

	//Turning extension on and off
	document.getElementById('unchecked').addEventListener('change', function (e) {
		if(document.getElementById('unchecked').checked){
		  //toggle off
		  document.getElementById('toggle').className = 'toggled-on';
		  chrome.browserAction.setIcon({path: 'assests/textures/icon.png'});
		  if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=true;
		  chrome.storage.local.set({'isactive':true});
	   }
	   else{
		  //toggle on
		  document.getElementById('toggle').className = 'toggled-off';
		  chrome.browserAction.setIcon({path: 'assests/textures/icon_off.png'});
		  if (chrome.extension.getBackgroundPage()) chrome.extension.getBackgroundPage().soundischecked=false;
		  chrome.storage.local.set({'isactive':false});
	   }
	});
 
 

//End
});


