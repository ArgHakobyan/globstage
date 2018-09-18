//////Index one block height//////
function setHeiHeight() {
    "use strict";
  $('#promo_head').css({
    height: $(window).height() + 'px'
  });
}

$(document).ready(function () {
    "use strict";
  //////Add avatar//////
  $('.add_avatar').live('click', function () {
      "use strict";
    $('#add_avatar').removeClass("none");
  });
  $('#close_avatar').live('click', function () {
      "use strict";
    $('#add_avatar').addClass("none");
  });

    //////edit miniature//////
    $('.edit_miniature').live('click', function () {
        $('#edit_miniature').removeClass("none");
    });
    $('#close_miniature').live('click', function () {
        $('#miniature_crop').imgAreaSelect({remove: true});
        $('#edit_miniature').addClass("none");
    });

    //////delete avatar//////
    $('.delete_avatar').live('click', function () {
        $('#delete_avatar').removeClass("none");
    });
    $('#close_avatar_delete,#delete_avatar_cansle').live('click', function () {
        $('#delete_avatar').addClass("none");
    });

  //////Autorization//////
  $('.log_btn').live('click', function () {
      "use strict";
    $('#autorized').show().removeClass("none");
  });
  $('#closeau').live('click', function () {
      "use strict";
    $('#autorized').addClass("none");
    $('#log_email').val('');
    $('#log_password').val('');
    $('.error_aut').text('').hide();
    $('#loading').hide();
    $('#remember_me').attr('checked',false);
  });

    $('.reg_btn').live('click', function () {
        "use strict";
        $('#autorized_reg').removeClass("none");
    });
    $('#closeau_reg').live('click', function () {
        "use strict";
        $('#autorized_reg').addClass("none");
        $('#reg_name').val('');
        $('#reg_lastname').val('');
        $('#reg_email').val('');
        $('#reg_new_pass').val('');
        $('#reg_new_pass2').val('');
        $('#reg_error').text('').hide();
        $('#reg_loading').hide();
        $('#reg_form input').css('background', '#fff');
    });

    ///restore////
    $('.restore_btn').live('click', function () {
        "use strict";
        $('#autorized_restore').removeClass("none");
        $('#autorized').hide().addClass("none");
        $('#restore_email').val('');
    });
    $('#closeau_restore').live('click', function () {
        "use strict";
        $('#autorized_restore').addClass("none");
        $('#restore_form').show();
        $('.restore_form').height('325px');
        $('#restore_text').html('');

    });

    ///restore2////
    $('#closeau_restore2').live('click', function () {
       location.href=base_path;
    });
    $('#closeau_restore_badlink').live('click', function () {
        location.href=base_path;
    });



  //////Mobile menu in map page (01.html)//////
  $('.mobile_menu').live('click', function () {
      "use strict";
    $('.container-fluid.menu').removeClass("mobile");
  })
  $('#close_menu').live('click', function () {
      "use strict";
    $('.container-fluid.menu').addClass("mobile");
  })
  $('.container-fluid.menu a').live('click', function () {
      "use strict";
    $('.container-fluid.menu').addClass("mobile");
  })
});
//////Side menu//////
$(function(){
  function a(){e.toggleClass(j),d.toggleClass(i),f.toggleClass(k),g.toggleClass(l)
}
function b(){e.addClass(j),d.animate({left:"0px"},n),f.animate({left:o},n),g.animate({left:o},n)
}
function c(){e.removeClass(j),d.animate({left:"-"+o},n),f.animate({left:"0px"},n),g.animate({left:"0px"},n)
}var d=$(".pushy"),e=$("body"),f=$("#container"),g=$(".push"),h=$(".site-overlay"),i="pushy-left pushy-open",j="pushy-active",k="container-push",l="push-push",m=$(".menu-btn, .pushy a"),n=200,o=d.width()+"px";
if(cssTransforms3d=function(){
  var a=document.createElement("p"),b=!1,c={
    webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"
  };
  document.body.insertBefore(a,null);for(var d in c)void 0!==a.style[d]&&(a.style[d]="translate3d(1px,1px,1px)",b=window.getComputedStyle(a).getPropertyValue(c[d]));return document.body.removeChild(a),void 0!==b&&b.length>0&&"none"!==b
}())m.click(function(){a()}),h.click(function(){a()});
else{
  d.css({left:"-"+o}),f.css({"overflow-x":"hidden"});
  var p=!0;m.click(function(){p?(b(),p=!1):(c(),p=!0)}),h.click(function(){p?(b(),p=!1):(c(),p=!0)})
  }
});
