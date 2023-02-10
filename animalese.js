
//keypress detect
document.addEventListener('keydown', function (e) {
	if (!e.ctrlKey) chrome.runtime.sendMessage({ keycode: e.keyCode });
}, true);
var ifs = document.getElementsByTagName("iframe");
for (var i = 0; i < ifs.length; i++) {
	var fc = ifs[i].contentDocument || ifs[i].contentWindow;
	fc.addEventListener('keydown', function (e) {
		if (!e.ctrlKey) chrome.runtime.sendMessage({ keycode: e.keyCode });
	}, true);
}



