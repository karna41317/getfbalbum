function statusChangeCallback(response) {
	if (response.status === 'connected') {
		downloadAlbum();
	} else if (response.status === 'not_authorized') {
		var msg = 'To use this free tool, please log ' + 'into this app.';
		$('.form-disabled').on('click', function(event) {
			event.preventDefault();
			alert(msg);
		});
		$('#status').html(msg);
		$('.fb-login-button').css('display', 'inline-block');
	} else {
		var msg = 'To use this free tool, please log ' + 'into Facebook.';
		$('.form-disabled').on('click', function(event) {
			event.preventDefault();
			alert(msg);
		});
		$('#status').html(msg);
		$('.fb-login-button').css('display', 'inline-block');
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId: '1328011563917636',
		cookie: true,
		xfbml: true,
		version: 'v2.6'
	});
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
};


(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function downloadAlbum() {
	FB.api('/me', function(response) {
		$('#status').html('Thanks for using this tool, ' + response.name);
	});
	$('#form').removeClass('form-disabled').off('click');
	$('#form').on('submit', function(event) {
		event.preventDefault();
		$('#results').show();
		var id;
		var str = $('#album_url').val();
		if (str.indexOf("album_id=") >= 0) {
			id = str.split('album_id=')[1];
		} else if (str.indexOf('set=a.')) {
			id = str.split('set=a.')[1];
			id = id.split('.')[0];
		}
		FB.api(id + '/?fields=photos.limit(100){images}', function(response) {
			var count = Object.keys(response.photos.data).length;
			var dynamicItems = '';
			var sizeSmallest;
			var sizeBiggest;
			var list = $('#list').html('');
			$.each(response.photos.data, function(index, val) {
				sizeSmallest = val.images[val.images.length - 1];
				sizeBiggest = val.images[0];
				dynamicItems += '<a download class="download" href="' + sizeBiggest.source + '"><img src="' + sizeSmallest.source + '" width="' + sizeSmallest.width + '" height="' + sizeSmallest.height + '" alt=""></a>';
			});
			list.append(dynamicItems);
			$('#download_all .count').html('(' + count + ')');
			$('#download_single').show();
			$('#download_all').show().click(function(event) {
				event.preventDefault();
				$('.download').each(function(index, el) {
					document.getElementsByClassName("download")[index].click();
				});
			});

		});
	});
}

$(function() {
	var howto = $('#howto');
	howto.siblings().hide();
	$('a[href="#readmore"]').on('click', function(event) {
		event.preventDefault();
		howto.siblings().toggle('fast');
	});
});