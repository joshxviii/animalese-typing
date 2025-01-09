//keypress detect
chrome.runtime.sendMessage({type: 'update_values'});

let useFallback=false;
document.addEventListener('input', function (e) {
	if(useFallback){
		let keyFallback = e.data===null ? "" :( (typeof e.data === 'undefined') ? "" : e.data.slice(-1));
		chrome.runtime.sendMessage({ type: 'type', key: keyFallback ,  keycode: (keyFallback.length==1)?keyFallback.charCodeAt(0):keyFallback.keyCode , input_type: e.target.type});
	}
}, true);
document.addEventListener('keydown', function (e) {
	if (e.key == "Process" || typeof e.key === 'undefined') useFallback = true;
	else {useFallback = false; if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: (e.key.length==1)?e.key.charCodeAt(0):e.keyCode , input_type: e.target.type})};
}, true);

var ifs = document.getElementsByTagName("iframe");
for (var i = 0; i < ifs.length; i++) {
	var fc = ifs[i].contentDocument || ifs[i].contentWindow;
	fc.addEventListener('input', function (e) {
		if(useFallback){
			let keyFallback = e.data===null ? "" :( (typeof e.data === 'undefined') ? "" : e.data.slice(-1));
			chrome.runtime.sendMessage({ type: 'type', key: keyFallback ,  keycode: (keyFallback.length==1)?keyFallback.charCodeAt(0):keyFallback.keyCode , input_type: e.target.type});
		}
	}, true);
	fc.addEventListener('keydown', function (e) {
		if (e.key == "Process" || typeof e.key === 'undefined') useFallback = true;
		else {useFallback = false; if (!e.ctrlKey) chrome.runtime.sendMessage({ type: 'type', key: e.key ,  keycode: (e.key.length==1)?e.key.charCodeAt(0):e.keyCode , input_type: e.target.type})};
	}, true);
}
