var audio_player = {
	cur: {},
	players: {},
	volume: 1,
	init: function(){
		var _a = audio_player;

		$('#noDisplayBL').append('<audio id="player_tag" autoload></audio>');
		this.player = $('#player_tag')[0];
		this.player.volume = 1;

		$(this.player).bind('timeupdate', _a.onTimeUpdate).bind('progress', _a.onProgress)
		.bind('ended', _a.onEnded).bind('canplay', _a.onCanPlay).bind('error', _a.onError);

		_a.inited = true;
	},
	prepare: function(aid){
		var _a = audio_player;

		if(!_a.inited) _a.init();

		aid = String(aid).replace('_pad', '');

		if(_a.aid == aid){
			if(_a.pause) _a.playAudio();
			else _a.pauseAudio();
		}else{
			var info = _a.getInfoFromDom(aid);

			if(_a.aid) _a.clearTrack(_a.aid);
			
			_a.player.src = info.url;
			_a.player.load();
			_a.aid = aid;
			_a.pauseTime = 0;
			_a.cur_inf = info;

			if(_a.noplay){
				_a.noplay = null;
				_a.pause = true;
			}else _a.playAudio();

			_a.getPlayList();

			for(var i in _a.players) $(_a.players[i].name).html('<b>'+info.artist+'</b> - '+info.name);
		}
	},
	clearTrack: function(aid){
		$('#audio'+aid+', #audio'+aid+'_pad').removeClass('cur paused inited');
		$('#player'+aid+', #player'+aid+'_pad').hide();
		$('#audio_time'+aid+', #audio_time'+aid+'_pad').html('');
	},
	initTrack: function(aid){
		var _a = audio_player;

		$('#audio' + aid+', #audio'+aid+'_pad').addClass('cur');
		$('#player' + aid+', #player'+aid+'_pad').show();
		$('#player' + aid + ' .volume_line'+', #player'+aid+'_pad .volume_line').css('width', (_a.volume * 100) + '%');
	},
	getPlayList: function(){
		var _a = audio_player;

		if(!_a.playList || !_a.playList[_a.aid]){

			_a.playList = {};
			_a.audio_ids = [];
			_a.cur_i = 0;

			var el = $('#audio' + _a.aid);
			if(el.length > 0){
				var first = el.hasClass('search') ? el.parent().children('.audio:first') : el;
				var total = 0, aid;
				while(first.length){
					total++;
					aid = first.attr('id').replace('audio', '');
					_a.playList[aid] = _a.getInfoFromDom(aid);
					_a.audio_ids.push(aid);
					first = first.next('.audio');
					if(total > 150) break;
				}
				_a.setPos();
			}

			if(el.parent().hasClass('profile_audios_wrap')){
				$.post('/?go=audio', {act: 'get_playlist', own: user_id}, function(d){
					d = JSON.parse(d);
					_a.audio_ids = [];
					for(var i = 0; i < d.length; i++){
						_a.playList[d[i].id] = d[i];
						_a.audio_ids.push(d[i].id);
					}
					_a.setPos();
				});
			}

		}else _a.setPos();
	},
	setPos: function(){
		var _a = audio_player;
		for(var i = 0; i < _a.audio_ids.length; i++){
			if(_a.aid == _a.audio_ids[i]){
				_a.cur_i = i;
				break;
			}
		}
	},
	playAudio: function(){
		var _a = audio_player;

		if(_a.pause){
			$('#audio' + _a.aid+', #audio'+_a.aid+'_pad').removeClass('paused').removeClass('inited');
			_a.pause = false;
			_a.player.currentTime = _a.pauseTime;
		}

		_a.player.play();
		_a.initTrack(_a.aid);

		$('#head_audio_lnk').attr('onClick', 'audio_player.showPad(event);');

		for(var i in _a.players) $(_a.players[i].play_but).addClass('playing');
	},
	pauseAudio: function(){
		var _a = audio_player;

		_a.pause = true;
		$('#audio' + _a.aid+', #audio'+_a.aid+'_pad').addClass('paused');
		_a.pauseTime = _a.player.currentTime;

		_a.player.pause();

		for(var i in _a.players) $(_a.players[i].play_but).removeClass('playing');
	},
	getInfoFromDom: function(aid){
		var _a = audio_player;

		if(_a.playList && _a.playList[aid]) return _a.playList[aid];

		return {
			artist: $('#artis'+aid).text(),
			name: $('#name'+aid).text(),
			url: $('#audio_src'+aid).val()
		};
	},
	addPlayer: function(id, opts){
		var _a = audio_player;
		_a.players[id] = opts;

		var plbut = $(opts.play_but).click(function(){
			_a.prepare(_a.aid);
		});

		$(opts.next_but).click(_a.nextTrack);
		$(opts.prev_but).click(_a.prevTrack);
		$(opts.progress_wrap).click(_a.progressClick);
		$(opts.volume_wrap).click(_a.volumeClick);

		if(!_a.aid){
			var first_id = String($('.audio:first').attr('id')).replace('audio', '');
			if(first_id){
				_a.noplay = true;
				_a.prepare(first_id);
				$('#audio'+_a.aid).addClass('inited');
			}
		}

		if(!_a.pause) plbut.addClass('playing');
		$(opts.name).html('<b>'+_a.cur_inf.artist+'</b> - '+_a.cur_inf.name);

		if(_a.repeat) $(opts.repeat_but).addClass('active');
		if(_a.random) $(opts.random_but).addClass('active');

		var vol_persent = Math.round(_a.volume * 100);
		$(opts.volume_line).css('width', vol_persent + '%');
		$(opts.mute_but).click(_a.mute);
		$(opts.unmute_but).click(_a.unmute);
		if(vol_persent == 0) $(opts.mute_but).addClass('active');
		if(vol_persent == 100) $(opts.unmute_but).addClass('active');

		$(opts.repeat_but).click(_a.repeatClick);
		$(opts.random_but).click(_a.randomClick);
		$(opts.time).click(_a.setTimeDir);

		_a.onProgress();
		_a.onTimeUpdate();
	},
	nextTrack: function(){
		var _a = audio_player, next = _a.cur_i + 1;
		if(next >= _a.audio_ids.length) next = 0;
		_a.clearTrack(_a.aid);
		_a.aid = null;
		_a.prepare(_a.audio_ids[next]);
	},
	prevTrack: function(){
		var _a = audio_player, prev = _a.cur_i - 1;
		if(prev < 0) prev = _a.audio_ids.length - 1;
		_a.clearTrack(_a.aid);
		_a.aid = null;
		_a.prepare(_a.audio_ids[prev]);
	},
	onTimeUpdate: function(){
		var _a = audio_player,
			curTime = Math.floor(_a.player.currentTime * 1000) / 1000,
			totalTime = Math.floor(_a.player.duration * 1000) / 1000;

		var percent = Math.ceil(curTime / totalTime * 100);
		percent = Math.min(100, Math.max(0, percent));

		var time = _a.makeTime();

		for(var i in _a.players){
			$(_a.players[i].progress).css('width', percent + '%');
			$(_a.players[i].time).html(time);
		}
		$('#player' + _a.aid + ' .play_line').css('width', percent + '%');
		$('#audio_time' + _a.aid).html(time);
	},
	onProgress: function(){
		var _a = audio_player;
			totalTime = Math.floor(_a.player.duration * 1000) / 1000,
			bufferedTime = 0;
		
		try { bufferedTime = (Math.floor(_a.player.buffered.end(0) * 1000) / 1000) || 0; } catch (e) {}

		var percent = (bufferedTime/totalTime) * 100;
		for(var i in _a.players) $(_a.players[i].load_line).css('width', percent + '%');

		$('#player' + _a.aid + ' .load_line').css('width', percent + '%');
	},
	findTrack: function(){
		var _a = audio_player;

		if(_a.aid && !_a.pause){
			_a.initTrack(_a.aid);
		}
	},
	progressClick: function(e){
		var _a = audio_player,
		el = $(this),
		width = el.width(),
		left = Math.max(0, Math.min(width, e.pageX - el.offset().left)),
		persent = left / width * 100;

		cancelEvent(e);

		_a.player.currentTime = persent * _a.player.duration / 100;

		if(_a.pause) _a.pauseTime = _a.player.currentTime;
	},
	onEnded: function(){
		var _a = audio_player;

		if(_a.repeat){
			_a.player.currentTime = 0;
			_a.player.play();
			return;
		}

		if(_a.random){
			var aid = _a.audio_ids[Math.floor(Math.random() * _a.audio_ids.length)];
			playAudio(aid);
			return;
		}

		_a.player.pause();
		_a.player.currentTime = 0;

		if(_a.audio_ids.length > 1) _a.nextTrack();
		else _a.pauseAudio();
	},
	volumeClick: function(e){
		var _a = audio_player,
			wrap = $(this),
			width = wrap.width(),
			left = Math.max(0, Math.min(width, e.pageX - wrap.offset().left)),
			percent = left / width;

		_a.player.volume = percent;
		_a.volume = percent;

		percent *= 100;

		cancelEvent(e);

		for(var i in _a.players){
			if(percent == 0) $(_a.players[i].mute_but).addClass('active');
			else $(_a.players[i].mute_but).removeClass('active');

			if(percent == 100) $(_a.players[i].unmute_but).addClass('active');
			else $(_a.players[i].unmute_but).removeClass('active');

			$(_a.players[i].volume_line).css('width', percent + '%');
		}
		$('#player' + _a.aid + ' .volume_line').css('width', percent + '%');
	},
	mute: function(){
		var _a = audio_player;

		_a.volume = 0;
		_a.player.volume = 0;

		for(var i in _a.players){
			$(_a.players[i].mute_but).addClass('active');
			$(_a.players[i].unmute_but).removeClass('active');
			$(_a.players[i].volume_line).css('width', '0px');
		}
		$('#player' + _a.aid + ' .volume_line').css('width', '0px');
	},
	unmute: function(){
		var _a = audio_player;

		_a.volume = 1;
		_a.player.volume = 1;

		for(var i in _a.players){
			$(_a.players[i].mute_but).removeClass('active');
			$(_a.players[i].unmute_but).addClass('active');
			$(_a.players[i].volume_line).css('width', '100%');
		}
		$('#player' + _a.aid + ' .volume_line').css('width', '100%');
	},
	repeatClick: function(){
		var _a = audio_player;

		if(_a.repeat){
			_a.repeat = false;
			for(var i in _a.players) $(_a.players[i].repeat_but).removeClass('active');
		}else{
			_a.repeat = true;
			for(var i in _a.players) $(_a.players[i].repeat_but).addClass('active');
		}
	},
	randomClick: function(){
		var _a = audio_player;

		if(_a.random){
			_a.random = false;
			for(var i in _a.players) $(_a.players[i].random_but).removeClass('active');
		}else{
			_a.random = true;
			for(var i in _a.players) $(_a.players[i].random_but).addClass('active');
		}
	},
	makeTime: function(){
		var _a = audio_player,
			time = _a.time_dir ? _a.player.currentTime : _a.player.duration - _a.player.currentTime;

		var s = parseInt(time % 60), m = parseInt((time / 60) % 60);

		if(isNaN(s)) s = 0;
		if(isNaN(m)) m = 0;

		if(s < 10) s = '0' + s;

		return (_a.time_dir ? '' : '-') + m + ':' + s;
	},
	setTimeDir: function(e){
		var _a = audio_player;

		cancelEvent(e);

		_a.time_dir = _a.time_dir ? false : true;
		_a.onTimeUpdate();
	},
	onCanPlay: function(){
		var _a = audio_player;
		_a.onTimeUpdate();
	},
	onError: function(){
		var _a = audio_player;
		// Box.pen({
		// 	name: 'rte',
			
		// });
		_a.onEnded();
	},
	showPad: function(e){
		cancelEvent(e);
		if($("div").is(".audio_pad")) Pad.show();
		else{
			
			
			Page.Loading('start');
			$.post('/?go=audio', {act: 'pad'}, function(d){

					Page.Loading('stop');

					$('body').append(d);

					audio_player.addPlayer('pad', {
						play_but: '#pad_play',
						prev_but: '#pad_prev',
						next_but: '#pad_next',
						name: '#pad_track_name',
						progress: '#pad_play_line',
						load_line: '#pad_load_line',
						progress_wrap: '#pad_player_progress_wr',
						volume_wrap: '#pad_volume_wrap',
						volume_line: '#pad_volume_line',
						repeat_but: '#pad_repeat',
						random_but: '#pad_rand',
						time: '#pad_player_time'
					});
					Pad.show();
					var blockScroll = false;
					$('#pad_nano_wr').nanoScroller().bind('scrolltop scrollend', function(e){
						blockScroll = e.type == 'scrolltop' ? 1 : 2;
					}).bind('update', function(){
						blockScroll = false;
					}).bind('mousewheel', function(e){
						if(blockScroll){
							if(blockScroll === 1 && e.wheelDelta > 0 || blockScroll == 2 && e.wheelDelta < 0) cancelEvent(e);
						}
					});

					$(window).click(function(e){
						if(cur.padOpened){
							var t = $(e.target);
							if(t.filter('.audio_pad').length == 0 && t.parents('.audio_pad').length == 0){
								Pad.close();
							}
						}
					});

					Page.Loading('stop');
				
			});
		}
	}
}