var b = document.documentElement;
b.setAttribute('data-useragent', navigator.userAgent);
b.setAttribute('data-platform', navigator.platform);
var toastr = require('./toastr.min.js');

$(function() {
    getMusic = function(url){
        return $.get(url, function(data) {
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
                    $('.library').append('<p class="song">' + trackName + '</p>');
                    $('.queue-library').append('<a class="edit" href="#" onclick="edit(' + trackNumber + ')">' + '<p class="song">' + trackName + '</p></a>');
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
                        index = 0;
                        loadTrack(index);
                        audio.play();
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
                        index = 0;
                        loadTrack(index);
                        audio.play();
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
                    playing = true;
                    npTitle.text(song.name);
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
        };
        getMusic("/api/music");

        edit = function(id) {
            $('.queue-library').addClass('hidden');
            $('#info').removeClass('hiddden');
            $.get('/api/edit/' + id, function(data) {
                $('#info').html(
                    '<div id="edit">' +
                        '<form id="updateForm" class="col-md-8" method="post">' +
                            '<div class="form-group">' +
                                '<lable>NAME</lable>' +
                                '<input class="form-control" type="text" name="name" value="' + data.name +
                                '"></input>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<button type=submit class="form-control btn btn-primary">UPDATE</button> <br><br>' +
                                '<button id="delete" class="form-control btn btn-secondary">DELETE</button> <br><br>' +
                                '<button id="cancel" class="form-control btn btn-default">CANCEL</button> <br><br>' +
                            '</div>' +
                        '</form>' +
                    '</div>'
                );

                $('#updateForm').submit(function(e) {

                    e.preventDefault();
                    var updatedName = {
                        name: $('input[name=name]').val()
                    };

                    $.post('/api/update/' + data.id, updatedName, function(resp) {
                        $('#info').addClass('hidden');
                        $('.queue-library').removeClass('hidden');
                        toastr.info('Song updated!', 'Success');
                    });
                });

                $('#delete').click(function(e) {
                    $.post('/api/delete/' + data.id, function(resp) {
                        $('#info').addClass('hidden');
                        $('.queue-library').removeClass('hidden');
                        toastr.info('Song deleted!', 'Success');
                        e.preventDefault();
                    });
                });

                $('#cancel').click(function(e) {
                    $('#info').addClass('hidden');
                    $('.queue-library').removeClass('hidden');
                    e.preventDefault();
                });
            });
        };

        $('#playback').addClass('active');
        $('#library-section, #queue-section').addClass('hidden');

        $('#library').click(function(e) {
            e.preventDefault();
            $(this).addClass('active');
            $('#playback, #queue').removeClass('active');
            $('#playback-section, #queue-section').addClass('hidden');
            $('#library-section').removeClass('hidden');
        });

        $('#playback').click(function(e) {
            e.preventDefault();
            $(this).addClass('active');
            $('#library, #queue').removeClass('active');
            $('#library-section, #queue-section').addClass('hidden');
            $('#playback-section').removeClass('hidden');
        });

        $('#queue').click(function(e) {
            e.preventDefault();
            $(this).addClass('active');
            $('#playback, #library').removeClass('active');
            $('#playback-section, #library-section').addClass('hidden');
            $('#queue-section').removeClass('hidden');
        });
});
