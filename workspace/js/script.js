
var bot_id = -1;
var output = "";
$(window).on('load', function () {
	function validateURL(textval) {
		// var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|ru|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		var urlregex = /^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|ru|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		return urlregex.test(textval);
	}

	$(document).click(function (e) {
		if (($(e.target).hasClass('cmd_field') || $(e.target).parents('.cmd_field').length > 0) && $(e.target).parents('.manage_bots_container').length == 0) {
			$(".cmd_field").css("transform", "translate(0, 0)");
			$(".cmd_field").css({ '--opacity': "0", "--transform": "translate(0px,0px)" });
			// $(".cmd_field").css("box-shadow", "0px 2px 0px 0px rgb(0 0 0 / 30%)");
			$(".cmd_field").removeClass("active");
			if ($(e.target).hasClass('cmd_field')) {
				$(e.target).css("transform", "translate(-10px, -10px)");
				$(e.target).css({ '--opacity': "1", "--transform": "translate(10px,10px)" });
				// $(e.target).css("box-shadow", "10px 12px 3px 1px rgb(0 0 0 / 30%)");
				$(e.target).addClass("active");
			} else {
				$(e.target).parents('.cmd_field').css("transform", "translate(-10px, -10px)");
				$(e.target).parents('.cmd_field').css({ '--opacity': "1", "--transform": "translate(10px,10px)" });
				// $(e.target).parents('.cmd_field').css("box-shadow", "10px 12px 3px 1px rgb(0 0 0 / 30%)");
				$(e.target).parents('.cmd_field').addClass("active");
			}

		} else {
			$(".cmd_field").css("transform", "translate(0, 0)");
			// $(".cmd_field").css("box-shadow", "0px 2px 0px 0px rgb(0 0 0 / 30%)");
			$(".cmd_field").removeClass("active");
			$(".cmd_field").css({ '--opacity': "0", "--transform": "translate(0px,0px)" });
		}
	})
	// ADMIN


	function setAdminBtns() {
		$(".start_bot").click(function () {
			let obj = this;
			$.ajax({
				url: "ssh_query/start_bot.php",
				method: "POST",
				data: { uid: $(this).data("user"), bid: $(this).data("id") },
				success: function (data) {
					// output = data;
					$(obj).parent().find(".users_bot_row_info__bot_status").html("<div class='bot_status_enabled'>Включен</div>");
				}
			})
		})

		$(".stop_bot").click(function () {
			let obj = this;

			$.ajax({
				url: "ssh_query/stop_bot.php",
				method: "POST",
				data: { uid: $(this).data("user"), bid: $(this).data("id") },
				success: function (data) {
					$(obj).parent().find(".users_bot_row_info__bot_status").html("<div class='bot_status_disabled'>Выключен</div>");
				}
			})
		})
		$(".kill_pm").click(function(){
			$.ajax({
				url: "ssh_query/kill_pm.php",
				method: "POST",
				success: function (data) {
				}
			})
		});
	}
	function getAdminBots() {
		$.ajax({
			url: "php/admin_get_bots.php",
			success: function (data) {
				$(".manage_bots_container").html(data);
				setAdminBtns();
				setEvent_addBot();
			}
		})
	}

	$(".btn_run_cmd").click(function () {
		$.ajax({
			url: "ssh_query/run_cmd.php",
			data: { cmd: $("prompt_command_text").val() },
			success: function (data) {
			}
		})
	})

	// /ADMIN

	if (sessionStorage.getItem('userrole') == 'admin') {
		$(".bots_list").addClass("hidden");
		$(".admin_container").removeClass("hidden");
		getAdminBots();
	}

	function setEvent_toggleOption() {
		$(".answer_checkbox").off('change');
		$(".answer_checkbox").change(function () {
			if (this.checked) {
				if ($(this).attr('value') == 'opt_answer_pic')
					$(this).parents().eq(5).find(".answer_pic").removeClass("hidden");
				if ($(this).attr('value') == 'opt_answer_menu')
					$(this).parents().eq(5).find(".answer_menu").removeClass("hidden");
			} else {
				if ($(this).attr('value') == 'opt_answer_pic')
					$(this).parents().eq(5).find(".answer_pic").addClass("hidden");
				if ($(this).attr('value') == 'opt_answer_menu')
					$(this).parents().eq(5).find(".answer_menu").addClass("hidden");
			}
		});
	}
	function setEvent_addBtn() {
		$(".add_btn").off("click");

		$(".add_btn").click(function () {
			$(this).parent().append("<div class='btn_row'><input value='Кнопка' class='text-field btn_row_text' placeholder='Текст в кнопке'><div class='btn_action_container'><select class='text-field btn_action' value='url'><option value='url'>Переход по URL</option><option value='cmd'>Команда</option></select><input class='text-field action_cmd hidden' placeholder='Команда'><input class='text-field action_url' value='google.com' placeholder='Ссылка URL'></div><i class='fa-solid fa-trash'></i></div>");
			let cmd_id = $(this).parent().parent().data("id");
			$.ajax({
				url: "php/add_btn.php",
				method: "POST",
				data: { cmd_id: cmd_id },
				success: function (data) {
					updateBotDB();
					// setTimeout(getBot,200);
				}
			})

			$(this).parent().find(".btn_row .btn_action").off('change');
			$(this).parent().find(".btn_row .btn_action").change(function () {
				if ($(this).val() == 'cmd') {
					$(this).parents().eq(0).find(".action_url").addClass("hidden");
					$(this).parents().eq(0).find(".action_cmd").removeClass("hidden");
				}
				if ($(this).val() == 'url') {
					$(this).parents().eq(0).find(".action_cmd").addClass("hidden");
					$(this).parents().eq(0).find(".action_url").removeClass("hidden");
				}
			})
			$(this).parent().find(".btn_row .action_url").off('change');
			$(this).parent().find(".action_url").change(function(){
				let link  = $(this).val();
				if(!validateURL(link)){
					$(this).addClass("nonvalid");
				}else{
					$(this).removeClass("nonvalid");
				}
			})
			$(".btn_row .fa-trash").off("click");

			$(".btn_row .fa-trash").click(function () {
				$(this).parent().remove();
				let btn_id = $(this).data("id");
				$.ajax({
					url: "php/del_btn.php",
					method: "POST",
					data: { btn_id: btn_id },
					success: function (data) {
						// getBot();
					}
				})
			})
		})

		$(".btn_row .fa-trash").off("click");

		$(".btn_row .fa-trash").click(function () {
			$(this).parent().remove();
			let btn_id = $(this).data("id");
			$.ajax({
				url: "php/del_btn.php",
				method: "POST",
				data: { btn_id: btn_id },
				success: function (data) {
					// getBot();
				}
			})
		})
	}
	function setCheckInputs(){
		$("#bot_name").change(function(){
			$(this).val($(this).val().replaceAll(" ", ""));
		})
		$(".text-field").change(function(){
			if(!$(this).hasClass("medium-editor-element")){
				let text  = "";
				
				if($(this).hasClass("medium-editor-hidden")){
					text  = $(this).val().trim().replaceAll("\\n","");
					if(text == ''){
						$(this).parent().find("div.answer_text").addClass("error_field");
					}else{
						$(this).parent().find("div.answer_text").removeClass("error_field");
					}
				}else{
					text  = $(this).val().trim();
					if(text == ''){
						$(this).addClass("error_field");
					}else{
						$(this).removeClass("error_field");
					}
				}
			}
			
		})
	}

	function getBot() {
		$.ajax({
			url: "php/get_bot.php",
			method: "POST",
			data: { bot_id: bot_id },
			success: function (data) {
				$(".constructor_content").html(data);
				$(".export_script").attr("download","bots/"+$("#bot_name").data('user-id')+"/"+bot_id+"/index.js");
				$(".export_script").attr("href","bots/"+$("#bot_name").data('user-id')+"/"+bot_id+"/index.js");

				setCheckInputs();

				setEvent_addCmd();
				setEvent_addBtn();
				setTextEditor();
				// $(".cmd_field").click(function(){
				// 	$(".cmd_field").css("transform","translate(0, 0)");
				// 	$(".cmd_field").css("box-shadow", "0px 2px 0px 0px rgb(0 0 0 / 30%)");

				// 	$(this).css("transform","translate(-10px, -10px)");
				// 	$(this).css("box-shadow", "10px 12px 3px 1px rgb(0 0 0 / 30%)");
				// })


				if ($("#bot_status").data("status") == "On") {

					$(".start_bot_user").addClass("hidden");
					$(".stop_bot_user").removeClass("hidden");
				}
				else {
					$(".start_bot_user").removeClass("hidden");
					$(".stop_bot_user").addClass("hidden");
				}

				function setAnswerInputHeight(obj) {
					$(obj).css({ "overflow": "unset", "height": "auto" });
					let this_height = $(obj).height();
					if (this_height > 200) {
						$(obj).height("200");
						$(obj).css({ "overflow-x": "hidden", "overflow-y": "scroll" })
					} else {
						$(obj).height(this_height);
					}
				}

				$("div.answer_text").each(function (i, el) {
					setAnswerInputHeight(this);
				})

				$("div.answer_text").bind("DOMSubtreeModified", function () {
					let this_val = $(this).html();

					let this_text = this_val.replaceAll("<br>", "\\n");
					if (this_text.indexOf("<p>") == 0) {
						this_text = this_text.slice(3, this_text.length);
					}
					this_text = this_text.replaceAll("<p><br></p>", "\\n\\n");
					this_text = this_text.replaceAll("<p>", "\\n");
					this_text = this_text.replaceAll("</p>", "");
					this_text = this_text.replaceAll("&nbsp;", " ");
					this_text = this_text.replaceAll("<div>", "\\n");
					this_text = this_text.replaceAll("</div>", "");
					// this_text = this_text.replaceAll("'",'"');
					// this_text = this_text.replaceAll('"',"\\'");


					this_text = this_text.replace(/<p(.|\n)*?>/g, '');
					this_text = this_text.trim();

					this_val = this_val.trim();
					// $(this).parent().find("textarea.answer_text").attr("te-text","\\n"+this_text);

					$(this).parent().find("textarea.answer_text").text(this_text);
					$(this).parent().find("textarea.answer_text").val(this_text);
					$(this).parent().find("textarea.answer_text").change();

					setAnswerInputHeight(this);
				});

				$(".add_cmd").click(function () {


					setEvent_addCmd();

					$.ajax({
						url: "php/add_command.php",
						method: "POST",
						data: { bot_id: bot_id },
						success: function (data) {
							// let cmd_number = $(".cmd_field").length + 1;
							// $(".constructor").append("<div class='cmd_field' data-id="+data['id']+"><div class='cmd_field_number'>"+cmd_number+"</div><div class='cmd_field_main'><input class='text-field cmd_name' value='start'><div class='cmd_desc'><input class='text-field' value='Описание команды'></div><i class='fa-solid fa-trash'></i></div><h4>Ответ</h4> <div class='answer_container'><textarea class='answer_text text-field' value='Текст' placeholder='Текст ответа команды'>Текст</textarea><input type='file' class='answer_pic text-field hidden' value='' multiple accept='.png, .jpg, .jpeg'><select class='answer_menu text-field hidden' value=''><option value=''>Выбор меню</option><option value=''>Меню1</option><option value=''>Меню2</option></select></div><h4>Кнопки</h4> <div class='btn_container'><div class='add_btn button add_button'>Добавить кнопку</div><div class='btn_header'><h4>Текст</h4><h4>Действие</h4></div></div></div>");
							updateBotDB();
							setTimeout(getBot, 500);
						}
					})


					$(function () {
						var dd = new DropDown($($('.dd')[$('.dd').length - 1]));
						$(document).click(function () {
							// all dropdowns
							$('.wrapper-dropdown-1').removeClass('active');
						});
					});
					setEvent_addBtn();
					setEvent_toggleOption();
				})


				$(".btn_action").change(function () {
					if ($(this).val() == 'cmd') {
						$(this).parents().eq(0).find(".action_url").addClass("hidden");
						$(this).parents().eq(0).find(".action_cmd").removeClass("hidden");
					}
					if ($(this).val() == 'url') {
						$(this).parents().eq(0).find(".action_cmd").addClass("hidden");
						$(this).parents().eq(0).find(".action_url").removeClass("hidden");
					}
				});
				
				$(".action_url").change(function(){
					let link  = $(this).val();
					if(!validateURL(link)){
						$(this).addClass("nonvalid");
					}else{
						$(this).removeClass("nonvalid");
					}
				})
			}
		})
}

function setEvent_addBot() {
	$(".bots_btns .fa-gear").off("click");

	$(".bots_btns .fa-gear").click(function () {
		if (sessionStorage.getItem("userrole") == "admin")
			$(".admin_container").addClass("hidden")
		else
			$(".bots_list").addClass("hidden");
		$(".constructor").removeClass("hidden");

		bot_id = $(this).data('id');
		getBot();
	})


	$(".bots_btns .fa-trash").off("click");

	$(".bots_btns .fa-trash").click(function () {
		let id = $(this).data('id');
		$.ajax({
			url: "php/del_bot.php",
			method: "POST",
			data: { id: id },
			success: function (data) {
			}
		})
		$(this).parent().parent().remove();
	})
}
function setEvent_addCmd() {
	$(".cmd_field_main .fa-trash").off('click');
	$(".cmd_field_main .fa-trash").click(function () {
		$(this).parent().parent().remove();

		$.ajax({
			url: "php/del_command.php",
			method: "POST",
			data: { id: $(this).parent().parent().data('id') },
			success: function (data) {
			}
		})
	});
}

function getBots() {
	let id_user = sessionStorage.getItem('id_user');

	$.ajax({
		url: "php/get_bots.php",
		method: 'POST',
		data: { id_user: id_user },
		success: function (data) {
			$(".bots_container").html(data);
			setEvent_addBot();
		}
	})
}

getBots();


	//$(".fa-trash").click(function(){
	//	$(this).parent().parent().remove();
	//})
	// $(".select-field").change(function(){
	// 	$(this).parent().parent().append("text");
	// })
$(".answer_checkbox").change(function () {
})
setEvent_addCmd();
setEvent_addBtn();

setEvent_addBot();



setEvent_toggleOption();

$(".back_arrow").click(function () {


	if (sessionStorage.getItem("userrole") == "admin")
		$(".admin_container").removeClass("hidden");
	else
		$(".bots_list").removeClass("hidden");
	$(".constructor").addClass("hidden");
});

$(".insctruction").click(function(){
	$(".constructor").addClass("hidden");
	$(".info_container").removeClass("hidden");
});

$(".info_back_arrow").click(function(){
	$(".constructor").removeClass("hidden");
	$(".info_container").addClass("hidden");
})

$(".add_bot").click(function () {
	let id_user = sessionStorage.getItem('id_user');
	$.ajax({
		url: "php/add_bot.php",
		method: "POST",
		data: { id_user: id_user },
		success: function (data) {
			getBots();
		}
	})
		// $(this).parent().append("<div class='bots_row'><input class='text-field' placeholder='Название бота'><input class='text-field action_url' placeholder='Описание бота'><div class='bots_btns'><i class='fa-solid fa-gear'></i><i class='fa-solid fa-trash'></i></div></div>");

	setEvent_addBot();
});

$(".btn_row .fa-trash").click(function () {
	$(this).parent().remove();
})
	// DD BTN
function DropDown(el) {
	this.dd = el;
	this.opts = this.dd.find('ul.dropdown > li');
	this.val = [];
	this.index = [];
	this.initEvents();
}
DropDown.prototype = {
	initEvents: function () {
		var obj = this;

		obj.dd.on('click', function (event) {
			if ($(this).hasClass('active')) {
				$('.wrapper-dropdown-1').removeClass('active');
			} else {
				$('.wrapper-dropdown-1').removeClass('active');
				$(this).toggleClass('active');
			}
			event.stopPropagation();
		});

		obj.opts.children('label').on('click', function (event) {
			var opt = $(this).parent(),
			chbox = opt.children('input'),
			val = chbox.val(),
			idx = opt.index();

			($.inArray(val, obj.val) !== -1) ? obj.val.splice($.inArray(val, obj.val), 1) : obj.val.push(val);
			($.inArray(idx, obj.index) !== -1) ? obj.index.splice($.inArray(idx, obj.index), 1) : obj.index.push(idx);

		});
	},
	getValue: function () {
		return this.val;
	},
	getIndex: function () {
		return this.index;
	}
}

$(function () {
	var dd = new DropDown($('.dd'));
	$(document).click(function () {
			// all dropdowns
		$('.wrapper-dropdown-1').removeClass('active');
	});
});

$("button#logout").click(function () {
	window.location.href = "../";
	sessionStorage.clear();
	})																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																				   // 
});
