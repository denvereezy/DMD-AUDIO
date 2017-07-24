var b = document.documentElement;
b.setAttribute('data-useragent', navigator.userAgent);
b.setAttribute('data-platform', navigator.platform);

jQuery(function($) {

    var supportsAudio = !!document.createElement('audio').canPlayType;

    if (supportsAudio) {
        $.get("/api/music", function(data) {
            var time;
            $(".duration_dial").knob({
                'change': function(value) {
                    audio.currentTime = value;
                },
                format: function(value) {
                    return time;
                }
            });
            $(".vol_dial").knob({
                change: function(value) {
                    audio.volume = '0.' + Math.floor(value);
                }
            });
            var index = 0,
                playing = false,
                mediaPath = '/',
                extension = '',
                tracks = data,
                buildPlaylist = $.each(tracks, function(key, value) {
                    var trackNumber = value.id,
                        trackName = value.name,
                        trackLength = value.length;
                    if (trackNumber.toString().length === 1) {
                        trackNumber = '0' + trackNumber;
                    } else {
                        trackNumber = '' + trackNumber;
                    }
                    $('#plList').append('<li><div class="plItem"><div class="plNum">' + trackNumber + '.</div><div class="plTitle">' + trackName + '</div>');
                }),
                trackCount = tracks.length,
                npAction = $('#npAction'),
                npTitle = $('#npTitle'),
                audio = $('#audio1').bind('play', function() {
                    playing = true;
                    npAction.text('Now Playing...');
                }).bind('pause', function() {
                    playing = false;
                    npAction.text('Paused...');
                }).bind('ended', function() {
                    npAction.text('Paused...');
                    if ((index + 1) < trackCount) {
                        index++;
                        loadTrack(index);
                        audio.play();
                    } else {
                        audio.pause();
                        index = 0;
                        loadTrack(index);
                    }
                }).get(0),
                btnPrev = $('#previous').click(function() {
                    if ((index - 1) > -1) {
                        index--;
                        loadTrack(index);
                        if (playing) {
                            audio.play();
                        }
                    } else {
                        audio.pause();
                        index = 0;
                        loadTrack(index);
                    }
                }),
                btnNext = $('#next').click(function() {
                    if ((index + 1) < trackCount) {
                        index++;
                        loadTrack(index);
                        if (playing) {
                            audio.play();
                        }
                    } else {
                        audio.pause();
                        index = 0;
                        loadTrack(index);
                    }
                }),
                btnPlay = $('#play').click(function() {
                    if (playing) {
                        audio.pause();
                    } else {
                        audio.play();
                    }
                    var $this = $(this);
                    $this.toggleClass('btn-cmd');
                    if ($this.hasClass('btn-cmd')) {
                        $('#play').html('<i class="fa fa-play">');
                    } else {
                        $('#play').html('<i class="fa fa-pause">');
                    }
                }),
                btnStop = $('#stop').click(function() {
                    audio.pause();
                    audio.currentTime = 0;
                }),
                volume_down = $('#volume_down').click(function() {
                    var vol = Math.min(audio.volume - 0.005, 1);
                    $(".vol_dial").val(vol * 100).trigger('change');
                    audio.volume = Math.min(audio.volume - 0.005, 1);
                }),
                volume_off = $('#volume_off').click(function() {
                    var $this = $(this);
                    $this.toggleClass('btn-volume');
                    if ($this.hasClass('btn-volume')) {
                        audio.volume = 0;
                        $('#volume_off').html('<i class="fa fa-volume-down">');
                    } else {
                        audio.volume = 1;
                        $('#volume_off').html('<i class="fa fa-volume-up">');
                    }

                    var vol = 0;
                    $(".vol_dial").val(vol).trigger('change');
                    audio.volume = 0;
                }),
                volume_up = $('#volume_up').click(function() {
                    var vol = Math.min(audio.volume + 0.005, 1);
                    $(".vol_dial").val(vol * 100).trigger('change');
                    audio.volume = Math.min(audio.volume + 0.005, 1);
                }),
                repeat = $('#repeat').click(function() {
                    audio.loop = true;
                }),
                single = $('#single').click(function() {
                    audio.loop = false;
                }),
                random = $('#random').click(function() {
                    var song = tracks[Math.floor(Math.random() * tracks.length)];
                    audio.src = song.song;
                    audio.play();
                }),
                li = $('#plList li').click(function() {
                    var id = parseInt($(this).index());
                    if (id !== index) {
                        playTrack(id);
                    }
                }),
                loadTrack = function(id) {
                    $('.plSel').removeClass('plSel');
                    $('#plList li:eq(' + id + ')').addClass('plSel');
                    npTitle.text(tracks[id].name);
                    index = id;
                    audio.src = tracks[id].song;
                },
                playTrack = function(id) {
                    loadTrack(id);
                    audio.play();
                },
                currentTime = audio.addEventListener('timeupdate', function() {
                    var currentTime = audio.currentTime;
                    var sec = new Number();
                    var min = new Number();
                    sec = Math.floor(currentTime);
                    min = Math.floor(sec / 60);
                    min = min >= 10
                        ? min
                        : '0' + min;
                    sec = Math.floor(sec % 60);
                    sec = sec >= 10
                        ? sec
                        : '0' + sec;

                    $('.duration_dial').val(currentTime).trigger('change');
                    time = min + ":" + sec;
                }, false);
            extension = audio.canPlayType('audio/mpeg')
                ? '.mp3'
                : audio.canPlayType('audio/ogg')
                    ? '.ogg'
                    : '';
            loadTrack(index);
        });
    }

    $.get('/api/music', function(data) {
        $.each(data, function(key, data){
            $('.library').append(
                '<p class="song">' + data.name + '</p>'
            );
        });
    });

    $('#submit').attr('disabled', true);

    $('#file').change(function(){
        $('#submit').removeAttr('disabled');
    });
});
