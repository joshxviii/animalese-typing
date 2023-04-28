chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		//alert(request.path + request.volume + request.time)
		if (request.path) {
			const audio = new Audio(request.path)
			audio.currentTime = 0;
			audio.volume = request.volume * request.vol;
			audio.play();
		}
	}
);