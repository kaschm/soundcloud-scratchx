/* Extension using the SoundCloud API */
/* A co-creation by Mike Willard, Randy Jou, Kasia Chmielinski */

(function(ext) {
    	var sound = null;
        var sc_songID = 0;
        var soundcloud_id = 'f703c7a6871d553a7db785800792ccb8';
        var titleName = 'No Song';
        var userName = 'No Song'
	
	$.getScript("https://connect.soundcloud.com/sdk/sdk-3.0.0.js", function(){
        SC.initialize({
            client_id: soundcloud_id,
            redirect_uri: ' '
        });
	});

    ext.sc_load = function(songID, title_name) {
        sc_songID = songID; 
        SC.get('/tracks/' + sc_songID).catch(function(error) {
            alert('That song does not exist ('+ error.message + '). Try another song.');
        });
        
        $.get('http://api.soundcloud.com/tracks/' + songID + '?client_id=' + soundcloud_id, 
            function (result) {
                console.log(result.title);
                title_name = result.title;
                titleName = title_name;
                console.log(result.user.username);
                user_name = result.user.username;
                userName = user_name;
        });
    };

    ext.sc_play = function() {
            SC.stream("/tracks/" + sc_songID).then(function(obj){
            obj.play();
            sound = obj;
        });
    };


    ext.sc_pause = function() {
        if( sound ) {
            sound.pause();
            sound = null; 
        }
    };

    ext.sc_stop = function() {
    	if( sound ) {
    		sound.pause();
    		sound.seek(0);
    		sound = null;
    	} else {
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

    ext.get_info = function() {
        alert('TITLE: '+ titleName +', ARTIST: ' + userName);
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
        [' ', 'Load Song ID: %s', 'sc_load', '93497911'],
        ['R', 'Get ID for URL: %s', 'get_id', 'http://soundcloud.com/b-sett/lost-in-thought-b-sett'],
        [' ', 'Play Song', 'sc_play'],
        [' ', 'Pause Song', 'sc_pause'],
		[' ', 'Stop Song', 'sc_stop'],
        [' ', 'Show Info for Current Song', 'get_info']

        ]
    };

    // Register the extension
    ScratchExtensions.register('SoundCloud', descriptor, ext);
})({});
