//keypress detect
chrome.runtime.sendMessage({type: 'update_values'});

document.addEventListener('keydown', function (e) {
	if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: (e.key.length==1)?e.key.charCodeAt(0):e.keyCode , input_type: e.target.type});
}, true);
var ifs = document.getElementsByTagName("iframe");
for (var i = 0; i < ifs.length; i++) {
	var fc = ifs[i].contentDocument || ifs[i].contentWindow;
	fc.addEventListener('keydown', function (e) {
		if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: (e.key.length==1)?e.key.charCodeAt(0):e.keyCode , input_type: e.target.type});
	}, true);
}
