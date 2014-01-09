var APP = {};

APP.flickr = function(api_key){

	var current_userid = '';

	var createphotoURL = function(farm_id, server_id, id, secret) {
		return "http://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_m.jpg";
	};

	return {
		getPublicFeed: function(){
			var url = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			var arg = {
				format: 'json'
			};
			$.getJSON(url, arg)
			.done(function(data){
				$("#public_feed").children("li").remove();
				var items = data["items"];
				_.each(items, function(e,i,l){
					var img_url = e.media.m;
					var author_regex = /[(](.*)[)]/g;
					var author_name = author_regex.exec(e.author)[1];
					var title = e.title;
					$("#public_feed").append(
						$("<li>")
						.append($("<div>").addClass("image").css("background-image", "url(" + img_url + ")"))
						.append($("<p>").addClass("title").text(title))
						.append($("<p>").addClass("author_name").attr("data-id", e.author_id).append(
							$("<a>").attr("href", "#").text(author_name))
						)
					);
				});
			});
		},

		getUserPublicPhotos: function(){
			var userid = 0;
			if(arguments.length === 1) {
				userid = arguments[0];
				current_userid = userid;
			}else {
				userid = current_userid;
			}
			var url = "https://api.flickr.com/services/rest/?jsoncallback=?";
			var arg = {
				method: 'flickr.people.getPublicPhotos',
				api_key: 'a54d41a82d0c73aa6a6da55103b2af7d',
				user_id: userid,
				format: 'json'
			};
			$.getJSON(url, arg)
			.fail(function( jqxhr, textStatus, error ) {
				console.log(jqxhr);
		    var err = textStatus + ", " + error;
		    console.log( "Request Failed: " + err );
			})
			.done(function(data){
				//clean up photo grid
				$("#public_feed").children("li").remove();

				var photos = data.photos.photo;
				_.each(photos, function(e,i,l){
					var img_url = createphotoURL(e.farm, e.server, e.id, e.secret);
					$("#public_feed").append(
						$("<li>")
						.append($("<div>").addClass("image").css("background-image", "url(" + img_url + ")"))
						.append($("<p>").addClass("title").text(e.title))
					);
				});
			});
		},

		getUserFriendPublicPhotos: function(){
			var url = "https://api.flickr.com/services/feeds/photos_friends.gne?jsoncallback=?";
			var arg = {
				user_id: current_userid,
				display_all: 1,
				friends: 1,
				format: 'json'
			};
			$.getJSON(url, arg)
			.done(function(data){
				if(data.items.length < 1) {
					$("#error").addClass("visible").text("No friends :(");
				}
				$("#public_feed").children("li").remove();
				var items = data["items"];
				_.each(items, function(e,i,l){
					var img_url = e.media.m;
					var author_regex = /[(](.*)[)]/g;
					var author_name = author_regex.exec(e.author)[1];
					var title = e.title;
					$("#public_feed").append(
						$("<li>")
						.append($("<div>").addClass("image").css("background-image", "url(" + img_url + ")"))
						.append($("<p>").addClass("title").text(title))
						.append($("<p>").addClass("author_name").attr("data-id", e.author_id).append(
							$("<a>").attr("href", "#").text(author_name))
						)
					);
				});
			});
		}
	};
};

window.onload = function(){
	APP.var_flickr = APP.flickr('a54d41a82d0c73aa6a6da55103b2af7d');
	APP.var_flickr.getPublicFeed();

	$(document).on("click", function(){
		$("#error").removeClass("visible");
	});

	$("#logo").on("click", function(e){
		$("#user").removeClass("active");
		APP.var_flickr.getPublicFeed();
	});

	$("#public_feed").on("click", ".author_name",function(e){
		$("#user").addClass("active");
		$("#username").addClass("active").text($(this).text());
		$("#friend_feed").removeClass("active");
		APP.var_flickr.getUserPublicPhotos($(this).attr("data-id"));
	});

	$("#username").on("click", function(e){
		$("#username").toggleClass("active");
		$("#friend_feed").toggleClass("active");
		APP.var_flickr.getUserPublicPhotos();
	});

	$("#friend_feed").on("click", function(e){
		$("#username").toggleClass("active");
		$("#friend_feed").toggleClass("active");
		APP.var_flickr.getUserFriendPublicPhotos();
	});
};