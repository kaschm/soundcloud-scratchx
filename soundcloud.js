/* Extension using the SoundCloud API */
/* A co-creation by Mike Willard, Randy Jou, Kasia Chmielinski */

(function(ext) {
    	var sound = null;
        var soundcloud_id = 'f703c7a6871d553a7db785800792ccb8';
	
	$.getScript("https://connect.soundcloud.com/sdk/sdk-3.0.0.js", function(){
        SC.initialize({
            client_id: soundcloud_id,
            redirect_uri: ' '
        });
	});
    
    ext.sc_play = function(songID) {
        if( sound ) {
            sound.pause();
            sound = null;
        } else {
            SC.stream("/tracks/" + songID).then(function(obj){
            obj.play();
            sound = obj;
            });
        }
    };

    ext.sc_stop = function() {
    	if( sound ) {
    		sound.pause();
    		sound.seek(0);
    		sound = null;
    	}
    };

    ext.get_id = function(location, callback) {
        trackUrl = location;
        $.get(
          'http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=' + soundcloud_id,
          function (result) {
            console.log(result.id);
            track_id = result.id;
            callback(track_id);
          }
        ); 
        return track_id;
    };

    ext.get_title = function(location, callback) {
        trackUrl = location;
        $.get('http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=' + soundcloud_id, 
            function (result) {
                console.log(result.title);
                title_name = result.title;
                callback(title_name);
            }
            );
        return title_name;
    };

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name, default value
        ['R', 'Get ID for URL %s', 'get_id', 'https://soundcloud.com/robyn/stars-forever'], 
        ['R', 'Get Title for URL %s', 'get_title', 'https://soundcloud.com/robyn/stars-forever'],           
        [' ', 'Play / Pause Song ID: %s', 'sc_play', '7379697'],
		[' ', 'Stop Song', 'sc_stop']
			
        ]
    };

    // Register the extension
    ScratchExtensions.register('SoundCloud', descriptor, ext);
})({});
