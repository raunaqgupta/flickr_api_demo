var APP = {};

APP.flickr = function(api_key){
	return {
		getPublicFeed: function(){
			var url = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			var arg = {
				format: 'json'
			};
			$.getJSON(url, arg)
			.done(function(data){
				var items = data["items"];
				_.each(items, function(e,i,l){
					console.log(e);
				});
			});
		},

		getUserPublicPhotos: function(user_id){},
		getUserFriendPublicPhotos: function(user_id){}
	};
};

window.onload = function(){
	APP.var_flickr = APP.flickr('a54d41a82d0c73aa6a6da55103b2af7d');
	APP.var_flickr.getPublicFeed();
};