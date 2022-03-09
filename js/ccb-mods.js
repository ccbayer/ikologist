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
	const itemStr = localStorage.getItem(key);
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
    console.log(now.getTime() > item.expiry);
    console.log('the item has expired');
		localStorage.removeItem(key);
		return null;
	}
	return item.value;
}

let $form = $('form.password');
let $input = $form.find('input[type="password"]');
let $invalid = $form.find('.invalid');

$form.on('submit', function(e) {
    e.preventDefault();
    var
        value = $input.val()
    ;
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
        // setWithExpiry('is-permitted', 'true', 86400);
        Cookies.set('is-permitted', true, { expires: 1 });
        $input.attr('aria-invalid', 'false');
        $invalid.hide();
        window.location.replace('home-page.html');
    } else {
        $invalid.show();
        $input.attr('aria-invalid', 'true');
    }
});

$input.on('focus', function() {
    $invalid.hide();
});

document.addEventListener('DOMContentLoaded', function(event) {
    // var isPermitted = getWithExpiry('is-permitted');
    var isPermitted = Cookies.get('is-permitted');
    if(!isPermitted) {
        if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) != 'index.html') {
            window.location.replace('/index.html');
        }
    } else {
      // extend session by 5m
      // user is permitted and they returned to index, forward them to home 
      if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == 'index.html' || window.location.href === 'https://ikologist.com/') {
        window.location.replace('/home-page.html');
      }
    }
});