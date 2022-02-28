// assumes jquery exists on the page
var key = forge.random.getBytesSync(16);
var cipher = forge.cipher.createCipher('AES-CBC', key);
var iv = forge.random.getBytesSync(16);
var hash = '496b6f2d6372656174697665';

function setWithExpiry(key, value, ttl) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

$('form.password').on('submit', function(e) {
    e.preventDefault();
    $this = $(this);
    value = $this.find('input[type="password"]').val();
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(value));
    cipher.finish();
    var encrypted = cipher.output;
    // outputs encrypted hex

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(encrypted);
    var result = decipher.finish(); // check 'result' for true/false
    // outputs decrypted hex
    if(decipher.output.toHex() === hash) {
        setWithExpiry('is-permitted', 'true', 86400);
        window.location.replace('home-page.html');
    }
});

document.addEventListener('DOMContentLoaded', function(event) {
    var isPermitted = getWithExpiry('is-permitted');
    if(!isPermitted) {
        if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) != 'index.html') {
            window.location.replace('index.html');
        }
    } else {
      // user is permitted and they returned to index, forward them to home 
      if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == 'index.html' || window.location.href === 'https://ikologist.com/') {
        window.location.replace('home-page.html');
      }
    }
});