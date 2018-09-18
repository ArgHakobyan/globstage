$(document).ready(function(){
	// profile status
    $('.hidd_status_text').click(function(){
		$(this).hide();
		$('.new_status').show();
	});

	$('.save_status').click(function(){
		var text = $(this).prev('textarea').val();
		$.ajax({
			type: "POST",
			url: '/index.php?go=status',
			data: {text: text, public_id: ''},
			beforeSend:function(){
				$('.save_status').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function(response) {
				if(response==''){
					$('.hidd_status_text').html('<i class="fa fa-comments-o"></i> У меня пока нет статуса.');
				}else{
					$('.hidd_status_text').html(response);
				}
				$('.save_status').html('Сохранить');
				$('.new_status').hide();
				$('.hidd_status_text').show();
			}
		});
	});

	$('.new_status textarea').keypress(function(e){
		if(e.keyCode=='13') {
			var text = $(this).val();
			$.ajax({
				type: "POST",
				url: '/index.php?go=status',
				data: {text: text, public_id: ''},
				beforeSend: function () {
					$('.save_status').html('<img src="/img/loading_mini.gif"  />');
				},
				success: function (response) {
					if (response == '') {
						$('.hidd_status_text').html('<i class="fa fa-comments-o"></i> У меня пока нет статуса.');
					} else {
						$('.hidd_status_text').html(response);
					}
					$('.save_status').html('Сохранить');
					$('.new_status').hide();
					$('.hidd_status_text').show();
				}
			});
		}
	});

	// avatar load
	$("#uploadfile1").click(function(){
		$("#uploadfile").trigger("click");
	});
	$("#uploadfile").change(function(){
		var fd = new FormData(document.getElementById("photo_load_form"));
		var btn_text = $('#uploadfile1').text();
		$.ajax({
			type: "POST",
			url: '/index.php?go=editprofile&act=upload',
			data: fd,
			dataType: "json",
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType
			beforeSend: function () {
				$('#uploadfile1').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#uploadfile1').html(btn_text);
				if (response.error == 1) {
					$('#uploadfile_error').html(response.mesage);
				} else {
					$('.avatar img').attr('src',response.mesage);
					$('.user_img img').attr('src',response.mesage);
					$('#photo_load_form img').attr('src',response.mesage);
					$('.miniature_img img').attr('src',response.mesage);
					$('#add_avatar').addClass("none");
					$('.user_avatar ul li').removeClass("display_none");
				}
			}
		});
	});

	//edit miniature
	$('.edit_miniature').live('click', function () {
		$('#miniature_crop').imgAreaSelect({
			handles: true,
			aspectRatio: '4:6',
			minHeight: 100,
			minWidth: 160,
			x1: 0,
			y1: 0,
			x2: 100,
			y2: 160,
			onSelectEnd: function(img, selection){
				$('#mi_left').val(selection.x1);
				$('#mi_top').val(selection.y1);
				$('#mi_width').val(selection.width);
				$('#mi_height').val(selection.height);
			},
			onSelectChange: function(img, selection){
				if(!selection.width || !selection.height) return;
				var scaleX = 100 / selection.width;
				var scaleY = 100 / selection.height;
				var scaleX50 = 50 / selection.width;
				var scaleY50 = 50 / selection.height;
				$('#miniature_crop_100 img').css({
					width: Math.round(scaleX * $('#miniature_crop').width()),
					height: Math.round(scaleY * $('#miniature_crop').height()),
					marginLeft: -Math.round(scaleX * selection.x1),
					marginTop: -Math.round(scaleY * selection.y1)
				});
				$('#miniature_crop_50 img').css({
					width: Math.round(scaleX50 * $('#miniature_crop').width()),
					height: Math.round(scaleY50 * $('#miniature_crop').height()),
					marginLeft: -Math.round(scaleX50 * selection.x1),
					marginTop: -Math.round(scaleY50 * selection.y1)
				});
			},
		});
	});
	$("#save_miniature").click(function(){
		var btn_text = $(this).text();
		var form = $('#miniature_form');
		$.ajax({
			type: "POST",
			dataType: "json",
			url: form.attr('action'),
			data: form.serialize(),
			beforeSend: function () {
				$("#save_miniature").html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$("#save_miniature").html(btn_text);
				if(response.error==0){
					window.location.href = '/u'+response.user_id;
				}else{
					$('#miniature_error').html(response.mesage);
				}
			}
		});
	});
	// avatar delete
	$("#delete_avatar_ok").click(function(){
		var btn_text = $(this).text();
		var src = '/templates/Old/images/no_ava_200.jpg';
		$.ajax({
			type: "POST",
			url: '/index.php?go=editprofile&act=del_photo',
			beforeSend: function () {
				$("#delete_avatar_ok").html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$("#delete_avatar_ok").html(btn_text);
				$('.avatar img').attr('src',src);
				$('.user_img img').attr('src',src);
				$('#delete_avatar').addClass("none");
				$('.user_avatar ul li').addClass("display_none").filter(":first-child").removeClass("display_none");
			}
		});
	});

	// profile home
	$("#moreInfoTextShow").click(function(){
		$(this).hide();
		$('#moreInfoTextHide').show();
		$('#moreInfo').show();
	});
	$("#moreInfoTextHide").click(function(){
		$(this).hide();
		$('#moreInfoTextShow').show();
		$('#moreInfo').hide();
	});

	//profile stena

	$(".wall_attach_smile").click(function(){
		var src = $(this).attr('src');
		$('#smaile_modal').modal('hide');
		$('#attach_files').show();
		var attach_id = Math.floor(Math.random()*1000)+1;
		var smile = src.split('smiles/');
		var res_attach_id = 'smile_'+attach_id;
		$('#attach_files').append('<span id="attach_file_'+res_attach_id+'" class="attach_file"><img  src="'+src+'" class="wall_attach_smile fl_l" onClick="attach_delete(\''+res_attach_id+'\', \'smile|'+smile[1]+'||\')" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_smile_\')" onMouseOut="myhtml.title_close(\''+res_attach_id+'\')" id="wall_smile_'+res_attach_id+'" /></span>');
		$('#vaLattach_files').val($('#vaLattach_files').val()+'smile|'+smile[1]+'||');
	});

	$(document).live('click','.photo_modal',function(){
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=all_photos_box',
			beforeSend: function () {
				$('#photo_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#photo_modal .modal-body').html(response);
			}
		});
	});

	$('#photo_modal .modal-body').live('click','.pagination a',function(){
		var page = $(this).attr('data-page');
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=all_photos_box',
			data:{'page':page},
			beforeSend: function () {
				//$('#photo_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#photo_modal .modal-body').html(response);
			}
		});
		return false;
	});

	$("#photo_modal .modal-body").live('click','.wall_attach_photo',function(){
		var src = $(this).attr('src');
		var action_url = $(this).attr('action_url');
		$('#photo_modal').modal('hide');
		$('#attach_files').show();
		var attach_id = Math.floor(Math.random()*1000)+1;
		var res_attach_id = 'photo_'+attach_id;
		$('#attach_files').append('<span id="attach_file_'+res_attach_id+'" class="attach_file"><div class="wall_attach_photo fl_l"><div class="wall_attach_del" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_photo_\')" onMouseOut="myhtml.title_close(\''+res_attach_id+'\')" onClick="attach_delete(\''+res_attach_id+'\', \'photo_u|'+action_url+'||\')" id="wall_photo_'+res_attach_id+'"></div><img src="'+src+'" alt="" /></div></span>');
		$('#vaLattach_files').val($('#vaLattach_files').val()+'photo_u|'+action_url+'||');
	});

	$("#photo_modal .modal-body").live('click','#upload_photo',function(){
		$("#upload_photo_file").trigger("click");
	});

	$("#photo_modal .modal-body").live('change','#upload_photo_file',function(){
		var fd = new FormData(document.getElementById("upload_photo_form"));
		var btn_text = $('#upload_photo').text();
		$.ajax({
			type: "post",
			url: '/index.php?go=attach',
			data: fd,
			dataType: "json",
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType
			beforeSend: function () {
				$('#upload_photo').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#upload_photo').html(btn_text);
				if (response.error == 1) {
					$('#upload_photo_file_error').html(response.mesage);
				} else {
					var res = response.mesage.split('|||');
					var imgname = res[1].split('/');
					var src = res[1];
					var action_url = 'attach|'+imgname[6].replace('c_', '');
					$('#photo_modal').modal('hide');
					$('#attach_files').show();
					var attach_id = Math.floor(Math.random()*1000)+1;
					var res_attach_id = 'photo_'+attach_id;
					$('#attach_files').append('<span id="attach_file_'+res_attach_id+'" class="attach_file"><div class="wall_attach_photo fl_l"><div class="wall_attach_del" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_photo_\')" onMouseOut="myhtml.title_close(\''+res_attach_id+'\')" onClick="attach_delete(\''+res_attach_id+'\', \'photo_u|'+action_url+'||\')" id="wall_photo_'+res_attach_id+'"></div><img src="'+src+'" alt="" /></div></span>');
					$('#vaLattach_files').val($('#vaLattach_files').val()+'photo_u|'+action_url+'||');
				}
			}
		});
	});

	$(document).live('click','.video_modal',function(){
		$.ajax({
			type: "POST",
			url: '/index.php?go=videos&act=all_videos',
			beforeSend: function () {
				$('#video_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#video_modal .modal-body').html(response);
			}
		});
	});

	$('#video_modal .modal-body').live('click','.pagination a',function(){
		var page = $(this).attr('data-page');
		$.ajax({
			type: "POST",
			url: '/index.php?go=videos&act=all_videos',
			data:{'page':page},
			beforeSend: function () {
				//$('#photo_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#video_modal .modal-body').html(response);
			}
		});
		return false;
	});

	$("#video_modal .modal-body").live('click','.wall_attach_video',function(){
		var src = $(this).find('img').attr('src');
		var action_url = $(this).attr('action_url');
		$('#video_modal').modal('hide');
		$('#attach_files').show();
		var attach_id = Math.floor(Math.random()*1000)+1;
		var res_attach_id = 'video_'+attach_id;
		var aPslit = action_url.split('|');
		action_url = action_url.replace('http://'+location.host+'/uploads/videos/'+aPslit[2]+'/', '');
		$('#attach_files').append('<span id="attach_file_'+res_attach_id+'" class="attach_file"><div class="wall_attach_photo fl_l"><div class="wall_attach_del" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_video_\')" onMouseOut="myhtml.title_close(\''+res_attach_id+'\')" onClick="attach_delete(\''+res_attach_id+'\', \'video|'+action_url+'||\')" id="wall_video_'+res_attach_id+'"></div><img src="'+src+'" alt="" /></div></span>');
		$('#vaLattach_files').val($('#vaLattach_files').val()+'video|'+action_url+'||');
	});

	$(document).live('click','.audio_modal',function(){
		$.ajax({
			type: "POST",
			url: '/index.php?go=audio&act=allMyAudiosBox',
			beforeSend: function () {
				$('#audio_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#audio_modal .modal-body').html(response);
			}
		});
	});

	$('#audio_modal .modal-body').live('click','.pagination a',function(){
		var page = $(this).attr('data-page');
		$.ajax({
			type: "POST",
			url: '/index.php?go=audio&act=allMyAudiosBox',
			data:{'page':page},
			beforeSend: function () {
				//$('#audio_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#audio_modal .modal-body').html(response);
			}
		});
		return false;
	});

	$("#audio_modal .modal-body").live('click','.wall_attach_audio',function(){
		var action_url = $(this).attr('action_url');
		$('#audio_modal').modal('hide');
		$('#attach_files').show();
		var attach_id = Math.floor(Math.random()*1000)+1;
		var res_attach_id = 'audio_'+attach_id;
		var artist = $('#artis'+action_url).text();
		var name = $('#name'+action_url).text();
		$('#attach_files').append('<span id="attach_file_'+res_attach_id+'" class="attach_file fl_l" style="display:block;width:100%"><div class="audio_wall_attach"><div class="fl_l"><b>'+artist+'</b> &ndash; '+name+'</div><img src="/templates/Old/images/close_a.png" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_audio_\')" onClick="attach_delete(\''+res_attach_id+'\', \'audio|'+action_url+'||\')" id="wall_audio_'+res_attach_id+'" class="fl_l cursor_pointer" style="margin-left:5px;margin-top:1px" /></span></div>');
		$('#vaLattach_files').val($('#vaLattach_files').val()+'audio|'+action_url+'||');
		return false;
	});

	$(document).live('click','.doc_modal',function(){
		$.ajax({
			type: "POST",
			url: '/index.php?go=doc',
			beforeSend: function () {
				$('#doc_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#doc_modal .modal-body').html(response);
			}
		});
	});

	$('#doc_modal .modal-body').live('click','.pagination a',function(){
		var page = $(this).attr('data-page');
		$.ajax({
			type: "POST",
			url: '/index.php?go=doc',
			data:{'page':page},
			beforeSend: function () {
				//$('#audio_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#doc_modal .modal-body').html(response);
			}
		});
		return false;
	});

	$("#doc_modal .modal-body").live('click','.wall_attach_doc',function(){
		var name = $(this).attr('name');
		var id = $(this).attr('did');
		$('#doc_modal').modal('hide');
		$('#attach_files').show();
		var attach_id = Math.floor(Math.random()*1000)+1;
		var ln = name.length;
		if(ln > 50) name = name.substring(0, 12)+'..'+name.substring(ln-4, ln);
		var res_attach_id = 'doc_'+attach_id;
		$('#attach_files').append('<div style="padding-bottom:6px;padding-top:6px;display:block;width:100%" id="attach_file_'+res_attach_id+'" class="attach_file" ><div class="doc_attach_ic fl_l"></div><div class="doc_attach_text"><div class="fl_l">'+name+'</div><img class="fl_l cursor_pointer" style="margin-top:5px;margin-left:5px" src="/templates/Old/images/close_a.png" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_doc_\')" id="wall_doc_'+res_attach_id+'" onClick="attach_delete(\''+res_attach_id+'\', \'doc|'+id+'||\')" /></div><div class="clear"></div></div><div class="clear"></div>');
		$('#vaLattach_files').val($('#vaLattach_files').val()+'doc|'+id+'||');
		return false;
	});

	$("#doc_modal .modal-body").live('click','#upload_doc',function(){
		$("#upload_doc_file").trigger("click");
	});

	$("#doc_modal .modal-body").live('change','#upload_doc_file',function(){
		var fd = new FormData(document.getElementById("upload_doc_form"));
		var btn_text = $('#upload_doc').text();
		$.ajax({
			type: "post",
			url: '/index.php?go=doc&act=upload',
			data: fd,
			dataType: "json",
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType
			beforeSend: function () {
				$('#upload_doc').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#upload_doc').html(btn_text);
				if (response.error == 1) {
					$('#upload_doc_file_error').html(response.mesage);
				} else {
					var row = response.mesage.split('"');
					var name = row[0];
					var id = row[1];
					$('#doc_modal').modal('hide');
					$('#attach_files').show();
					var attach_id = Math.floor(Math.random()*1000)+1;
					var ln = name.length;
					if(ln > 50) name = name.substring(0, 12)+'..'+name.substring(ln-4, ln);
					var res_attach_id = 'doc_'+attach_id;
					$('#attach_files').append('<div style="padding-bottom:6px;padding-top:6px;display:block;width:100%" id="attach_file_'+res_attach_id+'" class="attach_file" ><div class="doc_attach_ic fl_l"></div><div class="doc_attach_text"><div class="fl_l">'+name+'</div><img class="fl_l cursor_pointer" style="margin-top:5px;margin-left:5px" src="/templates/Old/images/close_a.png" onMouseOver="myhtml.title(\''+res_attach_id+'\', \'Не прикреплять\', \'wall_doc_\')" id="wall_doc_'+res_attach_id+'" onClick="attach_delete(\''+res_attach_id+'\', \'doc|'+id+'||\')" /></div><div class="clear"></div></div><div class="clear"></div>');
					$('#vaLattach_files').val($('#vaLattach_files').val()+'doc|'+id+'||');
				}
			}
		});
	});

	// $('#wall_send').click(function(){
	// 	var btn_text = $(this).text();
	// 	var wall_text = $('#wall_text').val();
	// 	var attach_files = $('#vaLattach_files').val();

	// 	var for_user_id = location.href.split('http://'+location.host+'/u');
	// 	if (!isNaN(parseInt(for_user_id[1]))) {
	// 		 for_uid = for_user_id[1];
	// 	} else {
	// 		$.ajax({
	// 			"url": "/index.php?go=wall&act=get_uid",
	// 			"async": false,
	// 			"type": "POST",
	// 			"data": {"url": location.href},
	// 			"success": function(d){
	// 				window.for_uid_lskfnalskdjf = parseInt(d);
	// 			}
	// 		});
	// 	}

	// 	if (window.for_uid_lskfnalskdjf) {
	// 		for_uid = window.for_uid_lskfnalskdjf;
	// 		window.for_uid_lskfnalskdjf = 0;
	// 	}

	// 	var rec_num = parseInt($('#wall_rec_num').text())+1;
	// 	if(!rec_num){
	// 		rec_num = 1;
	// 	}
	// 	if(wall_text != 0 || attach_files != 0){
	// 		$.ajax({
	// 			type: "post",
	// 			url: '/index.php?go=wall&act=send',
	// 			data:{
	// 				wall_text: wall_text,
	// 				for_user_id: for_uid,
	// 				attach_files: attach_files,
	// 				vote_title: $('#vote_title').val(),
	// 				vote_answer_1: $('#vote_answer_1').val(),
	// 				vote_answer_2: $('#vote_answer_2').val(),
	// 				vote_answer_3: $('#vote_answer_3').val(),
	// 				vote_answer_4: $('#vote_answer_4').val(),
	// 				vote_answer_5: $('#vote_answer_5').val(),
	// 				vote_answer_6: $('#vote_answer_6').val(),
	// 				vote_answer_7: $('#vote_answer_7').val(),
	// 				vote_answer_8: $('#vote_answer_8').val(),
	// 				vote_answer_9: $('#vote_answer_9').val(),
	// 				vote_answer_10: $('#vote_answer_10').val()
	// 			},
	// 			beforeSend: function () {
	// 				$('#wall_send').html('<img src="/img/loading_mini.gif"  />');
	// 			},
	// 			success: function (response) {
	// 				$('#wall_send').html(btn_text);
	// 				$('#wall_records').html(response);
	// 				$('#wall_all_record').html('');
	// 				$('#wall_rec_num').text(rec_num)
	// 				$('#wall_text').val('');
	// 				$('#attach_files').hide();
	// 				$('#attach_files').html('');
	// 				$('#vaLattach_files').val('');
	// 			}
	// 		});
	// 	} else {
	// 		$('#wall_text').val('');
	// 		$('#wall_text').focus();
	// 	}
	// });

	//profile stena 2
	$(document).live('click','.wall_delete',function(){
		var rid = $(this).attr('rec-id');
		$.ajax({
			type: "post",
			url: '/index.php?go=wall&act=delet',
			data:{'rid':rid},
			success: function (response) {
				var rec_num = parseInt($('#wall_rec_num').text())-1;
				if(!rec_num){
					rec_num = '';
				}
				$('#wall_rec_num').text(rec_num);
				$('#wall_record_'+rid).fadeIn().remove();
				$('#wall_fast_block_'+rid).fadeIn().remove();
			}
		});
	});
	//add comment
	$(document).live('click','.add_comment_btn',function(){
		var btn_text = $(this).text();
		var rec_id = $(this).attr('rec_id');
		var author_id = $(this).attr('author_id');
		var wall_text = $('#fast_text_'+rec_id).val();
		if(wall_text != '') {
			$.ajax({
				type: "post",
				url: '/index.php?go=wall&act=send',
				data: {
					'wall_text': wall_text,
					'for_user_id': author_id,
					'rid': rec_id,
					'answer_comm_id': $('#answer_comm_id'+rec_id).val()
				},
				beforeSend: function () {
					$('#add_comment_btn_'+rec_id).html('<img src="/img/loading_mini.gif"  />');
				},
				success: function (response) {
					if(response == 'antispam_err'){
						alert('В день Вы можете отправить не более 2000 комментариев.');
						$('#fast_text_'+rec_id).val('');
						$('#fast_text_'+rec_id).focus();
						$('#add_comment_btn_'+rec_id).html(btn_text);
					}else if(response == 'err_privacy'){
						alert('Ошибка доступа');
						$('#fast_text_'+rec_id).val('');
						$('#fast_text_'+rec_id).focus();
						$('#add_comment_btn_'+rec_id).html(btn_text);
					}else{
						$('#add_comment_btn_'+rec_id).html(btn_text);
						$('#wall_fast_block_'+rec_id).html(response);
						$('#fast_text_'+rec_id).val('');
					}
				}
			});
		}else{
			$('#fast_text_'+rec_id).val('');
			$('#fast_text_'+rec_id).focus();
		}
		return false;
	});
	$(document).live('keypress','.add_comment_area',function(e){
		if(e.keyCode=='13' && !e.shiftKey) {
			var rec_id = $(this).attr('rec_id');
			$("#add_comment_btn_"+rec_id).trigger("click");
		}
	});
	//show all comment
	$(document).live('click','.wall_all_but_link',function(){
		var rec_id = $(this).attr('rec_id');
		var author_id = $(this).attr('author_id');
		$.ajax({
			type: "post",
			url: '/index.php?go=wall&act=all_comm',
			data: {
				'fast_comm_id': rec_id,
				'for_user_id': author_id
			},
			success: function (response) {
				if(response == 'err_privacy'){
					alert('Ошибка доступа');
				}else{
					$('#wall_fast_block_'+rec_id).html(response);
				}
			}
		});
		return false;
	});

	//delete comment
	$(document).live('click','.comm_del',function(){
		var comm_id = $(this).attr('comm_id');
		$.ajax({
			type: "post",
			url: '/index.php?go=wall&act=delet',
			data:{'rid':comm_id},
			success: function (response) {
				$('#wall_fast_comment_'+comm_id).html('<div>Комментарий успешно удален.123123</div>');
			}
		});
		return false;
	});

	// like
	$(document).live('click','.wall_add_like',function(){
		var rec_id = $(this).attr('rec_id');
		var user_id = $(this).attr('user_id');

		if($('#wall_like_cnt'+rec_id).text()) {
			var wall_like_cnt = parseInt($('#wall_like_cnt' + rec_id).text()) + 1;
		}else {
			$('#public_likes_user_block'+rec_id).show();
			$('#update_like'+rec_id).val('1');
			var wall_like_cnt = 1;
		}
		$('#wall_like_cnt'+rec_id).html(wall_like_cnt).css('color', '#7E937A','font-weight', 'bold');
		$('#wall_active_ic'+rec_id).addClass('public_wall_like_yes');
		$('#like_user'+user_id+'_'+rec_id).show();
		$('#like_text_num'+rec_id).text(parseInt($('#like_text_num'+rec_id).text())+1);

		$('.public_wall_like').addClass("wall_remove_like").removeClass("wall_add_like");
		$.ajax({
			type: "post",
			url: '/index.php?go=wall&act=like_yes',
			data:{rid: rec_id},
			success: function (response) {

			}
		});
	});

	// unlike
	$(document).live('click','.wall_remove_like',function(){
		var rec_id = $(this).attr('rec_id');
		var user_id = $(this).attr('user_id');

		var wall_like_cnt = parseInt($('#wall_like_cnt'+rec_id).text())-1;
		if(wall_like_cnt <= 0){
			var wall_like_cnt = '';
			$('#public_likes_user_block'+rec_id).hide();
		}
		$('#wall_like_cnt'+rec_id).html(wall_like_cnt).css('color', '#95adc0');
		$('#wall_active_ic'+rec_id).removeClass('public_wall_like_yes');
		$('#Xlike_user'+user_id+'_'+rec_id).hide();
		$('#like_user'+user_id+'_'+rec_id).hide();
		$('#like_text_num'+rec_id).text(parseInt($('#like_text_num'+rec_id).text())-1);

		$('.public_wall_like').addClass("wall_add_like").removeClass("wall_remove_like");
		$.ajax({
			type: "post",
			url: '/index.php?go=wall&act=like_no',
			data:{rid: rec_id},
			success: function (response) {

			}
		});
	});
//repost
	$(document).live('click','.repost_modal',function(){
		var rec_id = $(this).attr('rec_id');
		$('.repost_send').attr('rec_id',rec_id);
		$.ajax({
			type: "POST",
			url: '/index.php?go=repost&act=all',
			data:{rec_id: rec_id},
			beforeSend: function () {
				$('#repost_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#repost_modal .modal-body').html(response);
			}
		});
	});

	$('.repost_send').click(function(){
		var btn_text = $(this).text();
		var rec_id = $(this).attr('rec_id');
		var comm = $('#comment_repost').val();
		var type = $('#type_repost').val();
		var sel_group = $('#sel_group').val();
		var for_user_id = $('#for_user_id').val();
		var cas = '';
		if(type == 1){
			cas = 'for_wall';
		}else if(type == 2){
			cas = 'groups';
		}else if(type == 3){
			cas = 'message';
		}
		$.ajax({
			type: "POST",
			url: '/index.php?go=repost&act='+cas,
			data:{
				rec_id: rec_id,
				comm: comm,
				sel_group: sel_group,
				for_user_id: for_user_id
			},
			beforeSend: function () {
				$('.repost_send').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('.repost_send').html(btn_text);
				if(response == 1){
					alert('Эта запись уже есть на стене');
				}else{
					if(type == 1){
						$('#alert_modal .alert').html('Теперь эта запись появится в новостях у Ваших друзей.');
					}
					if(type == 2){
						$('#alert_modal .alert').html('Теперь эта запись появится на странице компании.');
					}
					if(type == 3){
						$('#alert_modal .alert').html('Ваше сообщение отправлено.');
					}
					$('#alert_modal').modal('show');
					$('#repost_modal').modal('hide')
				}
			}
		});
	});
	prevAnsweName = false;
	$(document).live('click','.answer_lnk',function(){
		var rec_id = $(this).attr('rec_id');
		var comm_id = $(this).attr('comm_id');
		var answer_name = $(this).attr('answer_name');
		var vlid = 'fast_text_'+rec_id;

		var nm = answer_name.split(' ');
		var x = $('#'+vlid).val().length;
		if(x <= 0 || prevAnsweName == $('#'+vlid).val()){
			$('#'+vlid).val(nm[0]+', ');
		}
		$('#answer_comm_id'+rec_id).val(comm_id);
		$('#answer_comm_for_'+rec_id).text(answer_name);
		prevAnsweName = nm[0]+', ';
		return false
	});
	//wall_tell
	$('.wall_tell').click(function(){
		var rec_id = $(this).attr('rec_id');
		$('#wall_tell_'+rec_id).hide();
		$('#wall_ok_tell_'+rec_id).fadeIn(150);
		$.ajax({
			type: "POST",
			url: '/index.php?go=wall&act=tell',
			data:{rid: rec_id},
			success: function (response) {
				if(response == 1){
					alert('Эта запись уже есть на стене');
				}
			}
		});
	});
	$(document).live('click','.link_comm',function(){
		var rec_id = $(this).attr('rec_id');
		$(this).hide();
		$('#add_comment_'+rec_id).show();
		return false
	});
	//alboms
	$('.creat_album_modal').click(function(){
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=create_page',
			beforeSend: function () {
				$('#creat_album_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#creat_album_modal .modal-body').html(response);
			}
		});
	});
	$('.creat_album').click(function(){
		var btntext=$(this).text();
		var name=$("#albums_name").val();
		var descr=$("#albums_descr").val();
		var privacy=$("#albums_privacy").val();
		if(name==''){
			$("#albums_name").focus();
			return;
		}
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=create',
			data:{name:name,descr:descr,privacy:privacy},
			beforeSend: function () {
				$('#creat_album_modal .creat_album').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#creat_album_modal .creat_album').html(btntext);
				if(response=='no_name'){
					alert('Поля не должны быть пустыми.');
				}else if(response=='no'){
					alert('Код ошибки: 1');
				}else if(response=='max'){
					alert('Привышен лимит альбомов.');
				}else{
					location.href=response;
				}
			}
		});
	});
	$('.edit_album_modal').click(function(){
		var id = $(this).attr('aid');
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=edit_page',
			data:{id: id},
			beforeSend: function () {
				$('#edit_album_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#edit_album_modal .modal-body').html(response);
			}
		});
	});
	$(document).live('click','.edit_album',function(){
		var btntext=$(this).text();
		var id=$('.albums_id').val();
		var name=$("#album_name_"+id).val();
		var descr=$("#albums_descr_"+id).val();
		var privacy=$("#albums_privacy_"+id).val();
		var privacy_comm=$("#albums_privacy_comment_"+id).val();
		if(name==''){
			$("#albums_name_"+id).focus();
			return;
		}
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=save_album',
			data:{id: id,name:name,descr:descr,privacy:privacy,privacy_comm:privacy_comm},
			beforeSend: function () {
				$('#edit_album_modal .edit_album').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#edit_album_modal .edit_album').html(btntext);
				if(response=='no_name'){
					alert('Поля не должны быть пустыми.');
				}else if(response=='no'){
					alert('Код ошибки: 1');
				}else{
					var row = response.split('|#|||#row#|||#|');
					$('#albums_name_'+id+' .albums_name_page').html(row[0]);
					$('#descr_'+id).html('<div style="padding-top:4px;">'+row[1]+'</div>');
					$('#edit_album_modal').modal('hide');
				}
			}
		});
	});
	$('.delete_album_modal').click(function(){
		var aid = $(this).attr('aid');
		var hash = $(this).attr('hash');
		$('.delete_album').attr('aid',aid).attr('hash',hash);
	});
	$('.delete_album').click(function(){
		var btntext = $(this).text();
		var id = $(this).attr('aid');
		var hash = $(this).attr('hash');
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=del_album',
			data:{id: id, hash: hash},
			beforeSend: function () {
				$('#delete_album_modal .delete_album').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				if(parseInt($('#albums_num').text()) == 1){
					location.reload();
				}
				$('#delete_album_modal .delete_album').html(btntext);
				$('#album_'+id).remove();
				$('#albums_num').text(parseInt($('#albums_num').text())-1);
				$('#delete_album_modal').modal('hide');
			}
		});
	});
	// albom upload file
	$("#albom_upload_file_btn").click(function(){
		$("#albom_upload_file").trigger("click");
	});
	$("#albom_upload_file").change(function(){
		var fd = new FormData(document.getElementById("albom_photo_load_form"));
		var btn_text = $('#albom_upload_file_btn').html();
		var action = $('#albom_photo_load_form').attr('action');
		var aid = $(this).attr('aid');
		$.ajax({
			type: "POST",
			url: action,
			data: fd,
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType
			beforeSend: function () {
				$('#albom_upload_file_btn').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#albom_upload_file_btn').html(btn_text);
				if(response == 'max_img'){
					alert('Привышен лимит фотографий в одном альбоме.');
				}else if(response == 'big_size'){
					alert('Привышен максимальный размер изображения.');
				}else if(response == 'bad_format'){
					alert('Неверный формат файла');
				}else if(response == 'hacking'){
					alert('Неизвестная ошибка');
				}else{
					location.href = '/albums/view/'+aid;
				}
			}
		});
	});
	$('.ic_cover').click(function(){
		var id = $(this).attr('id_cover');
		$.ajax({
			type: "get",
			url: '/index.php?go=albums&act=set_cover',
			data:{id: id},
			success: function (response) {
				$('.albums_new_cover').fadeOut();
				$('#albums_new_cover_'+id).fadeIn();
			}
		});
	});
	$('.ic_edit').click(function(){
		var id = $(this).attr('pid');
		$.ajax({
			type: "get",
			url: '/index.php?go=albums&act=editphoto',
			data:{id: id},
			beforeSend: function () {
				$('#edit_photo_modal .modal-body').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#edit_photo_modal .modal-body').html(
					'<div class="form-group">'+
						'<input type="hidden" class="photo_id" value="'+id+'">'+
						'<label for="descr_'+id+'">Описание фотографии</label>'+
						'<textarea class="form-control" id="descr_'+id+'">'+response+'</textarea>'+
					'</div>'
					);
			}
		});
	});
	$(document).live('click','.edit_photo',function(){
		var btntext=$(this).text();
		var id=$('.photo_id').val();
		var descr=$('#descr_'+id).val();
		$.ajax({
			type: "POST",
			url: '/index.php?go=albums&act=save_descr',
			data:{id: id, descr: descr},
			beforeSend: function () {
				$('#edit_photo_modal .edit_photo').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#edit_photo_modal .edit_photo').html(btntext);
				$('#edit_photo_modal').modal('hide');
			}
		});
	});
	$(document).live('click','.ic_del',function(){
		var pid = $(this).attr('pid');
		$('.delete_photo').attr('pid',pid);
		$('#delete_photo_modal').css('z-index',2020);
	});
	$('.delete_photo').click(function(){
		var btntext = $(this).text();
		var id = $(this).attr('pid');
		$.ajax({
			type: "get",
			url: '/index.php?go=albums&act=del_photo',
			data:{id: id},
			beforeSend: function () {
				$('#delete_photo_modal .delete_photo').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				if(parseInt($('#photo_num').text()) == 1){
					location.reload();
				}
				$('#delete_photo_modal .delete_photo').html(btntext);
				$('#a_photo_'+id).remove();
				$('#p_jid'+id).remove();
				$('#photo_num').text(parseInt($('#photo_num').text())-1);
				$('#delete_photo_modal').modal('hide');
				$('#show_photo_modal').modal('hide');
			}
		});
	});
	//show photo
	$(document).live('click','.show_photo',function(){
		var h = $(this).attr('h');
		var id = h.split('_');
		var uid = id[0].split('photo');
		var section = h.split('sec=');
		var fuser = h.split('wall/fuser=');
		var note_id = h.split('notes/id=');
		var msg_id = h.split('msg/id=');

		if(fuser[1])
			section[1] = 'wall';

		if(note_id[1]){
			section[1] = 'notes';
			fuser[1] = note_id[1];
		}

		if(msg_id[1]){
			section[1] = 'msg';
			fuser[1] = msg_id[1];
		}
		$('.photo_view').hide();
		if($('#photo_view_'+id[1])[0]){
			$('#photo_view_'+id[1]).show();
			//history.pushState({link:h}, null, h);
		} else {
			$.ajax({
				type: "post",
				url: '/index.php?go=photo',
				data: {uid: uid[1], pid: id[1], section: section[1], fuser: fuser[1]},
				beforeSend: function () {
					$('.load_photos').show();
				},
				success: function (response) {
					$('#show_photo_modal .modal-body').append(response);
					$('#photo_view_'+id[1]).show();
					$('.load_photos').hide();
					if(section[1] != 'loaded') {
						//history.pushState({link: h}, null, h);
					}
				}
			});
		}
	});
	$(document).live('click','#add_comm',function(){
		var btntext=$(this).text();
		var id=$(this).attr('pid');
		var comment = $('#textcom_'+id).val();
		if(comment != ''){
			$.ajax({
				type: "POST",
				url: '/index.php?go=photo&act=addcomm',
				data:{pid: id, comment: comment},
				beforeSend: function () {
					$('#add_comm').html('<img src="/img/loading_mini.gif"  />');
				},
				success: function (response) {
					$('#add_comm').html(btntext);
					if(response == 'err_privacy'){
						alert('Ошибка доступа');
					} else {
						$('#comments_'+id).append(response);
						$('.no_comeents').hide();
						$('#textcom_'+id).val('');
					}
				}
			});
		} else {
			$('#textcom_'+id).val('');
			$('#textcom_'+id).focus();
		}
	});
	$(document).live('click','.photo_comments_del',function(){
		var id = $(this).attr('pid');
		var hash = $(this).attr('hash');
		$.ajax({
			type: "POST",
			url: '/index.php?go=photo&act=del_comm',
			data:{hash: hash},
			success: function (response) {
				$('#comment_'+id).html('<div style="padding-bottom:5px;color:#777;">Комментарий успешно удален.</div>');
				$('#comment_all_'+id).html('<div style="padding-bottom:5px;color:#777;">Комментарий успешно удален.</div>');
			}
		});
	});
	$(document).live('click','.photo_all_comm',function(){
		var id = $(this).attr('pid');
		var num = $(this).attr('num');
		$.ajax({
			type: "POST",
			url: '/index.php?go=photo&act=all_comm',
			data:{pid: id, num: num},
			beforeSend: function () {
				$('.photo_all_comm_bg').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				$('#all_href_lnk_comm_'+id).html('').hide();
				$('#comments_'+id).prepend(response);
			}
		});
	});
	$(document).live('click','.photos_gradus',function(){
		var id = $(this).attr('pid');
		var pos = $(this).attr('pos');
		$.ajax({
			type: "POST",
			url: '/index.php?go=photo&act=rotation',
			data:{id: id, pos: pos},
			beforeSend: function () {
				$('#loading_gradus'+id).show();
			},
			success: function (response) {
				var rndval = new Date().getTime();
				$('#ladybug_ant'+id).attr('src', response+'?'+rndval);
				$('#loading_gradus'+id).hide();
			}
		});
	});
	$(document).live('click','.put_avatar',function(){
		var uid = $(this).attr('uid');
		var pid = $(this).attr('pid');
		var i_left = 50;
		var i_top = 50;
		var i_width = $('#ladybug_ant'+pid).width()-50;
		var i_height = $('#ladybug_ant'+pid).height()-50;
		$.ajax({
			type: "POST",
			url: '/index.php?go=photo&act=crop',
			data:{i_left: i_left, i_top: i_top, i_width: i_width, i_height: i_height, pid: pid},
			beforeSend: function () {
				$('.put_avatar').html('<img src="/img/loading_mini.gif"  />');
			},
			success: function (response) {
				location.href = '/u'+uid;
			}
		});
	});
	$('.accordion').click(function(){
		$('#collapseMenu').collapse('toggle');
	});

});

function toggleChevron(e) {
	$(e.target)
		.next('.accordion')
		.toggleClass('arrow-down arrow-up');
}
$('#collapseMenu').live('hidden.bs.collapse', toggleChevron);
$('#collapseMenu').live('shown.bs.collapse', toggleChevron);

var attach_delete = function(id, realId){
	$('#vaLattach_files').val($('#vaLattach_files').val().replace(realId, ''));
	$('#attach_file_'+id).remove();
	myhtml.title_close(id);
	count = $('.attach_file').size();
	if(!count){
		$('#attach_files').hide();
	}
};
var myhtml = {
	title: function(id, text, prefix_id, pad_left){
		if(!pad_left)
			pad_left = 5;

		$("body").append('<div id="js_title_'+id+'" class="js_titleRemove"><div id="easyTooltip">'+text+'</div><div class="tooltip"></div></div>');
		xOffset = $('#'+prefix_id+id).offset().left-pad_left;
		yOffset = $('#'+prefix_id+id).offset().top-32;

		$('#js_title_'+id)
			.css("position","absolute")
			.css("top", yOffset+"px")
			.css("left", xOffset+"px")
			.css("display","none")
			.css("z-index","1000")
			.fadeIn('fast');

		$('#'+prefix_id+id).mouseout(function(){
			$('.js_titleRemove').remove();
		});
	},
	title_close: function(id){
		$('#js_title_'+id).remove();
	},
	scrollTop: function(){
		$('.scroll_fix_bg').hide();
		$(window).scrollTop(0);
	}
};

var wall_like_users_five = function(rec_id, type){
	$('.public_likes_user_block').hide();
	if(!document.getElementById('like_cache_block'+rec_id) && $('#wall_like_cnt'+rec_id).text() && $('#update_like'+rec_id).val() == 0){
		if(type == 'uPages'){
			$.post('/index.php?go=wall&act=liked_users', {rid: rec_id}, function(data){
				$('#likes_users'+rec_id).html(data+'<span id="like_cache_block'+rec_id+'"></span>');
				$('#public_likes_user_block'+rec_id).show();
			});
		} else {
			$.post('/index.php?go=groups&act=wall_like_users_five', {rec_id: rec_id}, function(data){
				$('#likes_users'+rec_id).html(data+'<span id="like_cache_block'+rec_id+'"></span>');
				$('#public_likes_user_block'+rec_id).show();
			});
		}
	} else
	if($('#wall_like_cnt'+rec_id).text())
		$('#public_likes_user_block'+rec_id).show();
};

var wall_like_users_five_hide = function(){
	$('.public_likes_user_block').hide();
};
var photoPanel = function(id, f){
	if(f == 'show') {
		$('#albums_photo_panel_' + id).show();
	}else {
		$('#albums_photo_panel_' + id).hide();
	}
};

$(function(){
	if ($(window).scrollTop()>="700") $("#ToTop").fadeIn("fast")
	$(window).scroll(function(){
		if ($(window).scrollTop()<="700") $("#ToTop").fadeOut("fast")
		else $("#ToTop").fadeIn("fast")
	});
	$("#ToTop").click(function(){$("html,body").animate({scrollTop:0},"fast")});
	var h = $(window).height();
	if($('.left_column').height() > h){
		h = $('.left_column').height();
	}else if($('.right_column').height() > h){
		h = $('.right_column').height();
	}
	$('.basic.vp').css('min-height',h);

});

var Albums = {
	Drag: function(){
		$("#dragndrop.dragndrop_albums ul").sortable({
			cursor: 'move',
			opacity: 0.9,
			scroll: false,
			update: function(){
				var order = $(this).sortable("serialize");
				$.post("/index.php?go=albums&act=save_pos_albums", order, function(){});
			}
		});
	}
};
var Photo = {
	Drag: function(){
		$("#dragndrop.dragndrop_photo ul").sortable({
			cursor: 'move',
			scroll: false,
			update: function(){
				var order = $(this).sortable("serialize");
				$.post("/index.php?go=albums&act=save_pos_photos", order);
			}
		});
	}
};

Albums.Drag();
Photo.Drag();

interval = setInterval(geoFindMe,60000);

function geoFindMe() {

	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(success, error);
	}else{
		clearInterval(interval);
	}

	function success(position) {
		lat= position.coords.latitude;
		lng= position.coords.longitude;
		$.ajax({
			type: "post",
			url: '/index.php?go=location',
			data:{latitude: lat, longitude: lng,ajax:true,web:true},
			success: function (response) {

			}
		});
	};

	function error() {
		clearInterval(interval);
	};

}



