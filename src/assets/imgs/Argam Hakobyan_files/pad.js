var Pad = {
	show: function(){
		if(cur.padOpened) return Pad.close();

	//	if(location.pathname.substr(0, 6) == '/audio') return Page.Go(location.pathname);

		var left = $('#head_audio_lnk').offset().left - (250 - 23);
		var pad = $('.audio_pad').css('left', left + 'px');

		var _a = audio_player,
			result = '', aid;

		for(var i = 0; i < _a.audio_ids.length; i++){
			aid = _a.audio_ids[i];
			result += Pad.audio_tpl.replace(/\{aid\}/g, aid + '_pad').replace('{name}', _a.playList[aid].name).replace('{artist}', _a.playList[aid].artist)
		}
		$('#pad_result').html(result);
		pad.fadeIn(200);
		cur.padOpened = true;
		_a.findTrack();

		var cur_a = $('#pad_result .audio.cur');
		if(cur_a.length > 0){
			var top = cur_a.offset().top - $('#pad_result').offset().top;
			$('#pad_nano_wr').nanoScroller({ scrollTop: top - 136 });
			console.log(top)
		}
	},
	audio_tpl: '<div class="audio" onClick="playAudio(\'{aid}\');" id="audio{aid}">\
		<div class="play_but fl_l"></div>\
		<div class="audio_info">\
			<div class="audio_names">\
				<b id="artis{aid}">{artist}</b> – <span id="name{aid}">{name}</span>\
			</div>\
		</div>\
		<div class="clear"></div>\
	</div>',
	close: function(){
		$('.audio_pad').hide().stop();
		cur.padOpened = false;
	}
}