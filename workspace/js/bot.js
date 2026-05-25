function updateBotDB(){
	let id_user = sessionStorage.getItem('id_user');
	if(sessionStorage.getItem("userrole") == "admin")
		id_user = $("#bot_name").data("user-id");

	let bot_name = $("#bot_name").val();
	let bot_desc = $("#bot_desc").val();

	let bot_token = $(".bot_token").val();

	let user = sessionStorage.getItem("username");

	let cmds = [];
	let cmd_list = $(".cmd_field");
	cmd_list.each(function(i,el){
		let cmd_id = $(el).data("id");
		let name = $(el).find(".cmd_name").val();
		let desc = $(el).find(".cmd_desc input").val();
		let answer_text = $(el).find("textarea.answer_text").val();

		let btns = []
		let btn_list = $(el).find(".btn_row");
		

		if(btn_list.length > 0){
			btn_list.each(function(j,btn){
				let btn_id = $(btn).data("id");
				let btn_text = $(btn).find(".btn_row_text").val();
				let callback = '';
				let type = "url";
				if( $(btn).find(".btn_action").val() == 'cmd'){
					type = 'cmd';
					callback = $(btn).find(".action_cmd").val();
				}else{
					type = 'url';
					callback = $(btn).find(".action_url").val();
				}

				btns.push([type,btn_text,callback, btn_id])
			})
		}else{
			btns = 0;
		}
		if(name != undefined)
			cmds.push([name, desc, answer_text, btns, cmd_id]);

	})
	$.ajax({
		url:"php/update_bot.php",
		method:"POST",
		data:{id_user:id_user,user:user,bot_id:bot_id,bot_name:bot_name,bot_token:bot_token,bot_desc:bot_desc, cmds:cmds},
		success:function(data){
		}
	})
}

$(window).on('load', function () {

	$(".save_bot").click(function(){
		if ($(".error_field").length > 0){
			$("#error-notice-form").modal({});
			$("#error-notice-form .error_feedback").text("Для корректной работы бота необходимо заполнить все поля");
		}
		else if($('.action_url.nonvalid').length > 0)
		{
			$("#error-notice-form").modal({});
			$("#error-notice-form .error_feedback").text("Введённые ссылки не являются валидными");
		}
		else
		{

			let id_user = sessionStorage.getItem('id_user');
			if(sessionStorage.getItem("userrole") == "admin")
				id_user = $("#bot_name").data("user-id");

			let bot_name = $("#bot_name").val();
			let bot_desc = $("#bot_desc").val();

			let bot_token = $(".bot_token").val();

			let user = sessionStorage.getItem("username");

			let cmds = [];
			let cmd_list = $(".cmd_field");
			cmd_list.each(function(i,el){
				let cmd_id = $(el).data("id");
				let name = $(el).find(".cmd_name").val();
				let desc = $(el).find(".cmd_desc input").val();
				let answer_text = $(el).find("textarea.answer_text").text();
				answer_text = answer_text.replaceAll("<br>","\\n");
				answer_text = answer_text.replaceAll("'",'"');
				// answer_text = answer_text.replaceAll('"',"\\'");
			// answer_text= answer_text.replaceAll("<p>","\n");
			// answer_text= answer_text.replaceAll("</p>","");
			// answer_text= answer_text.replaceAll("&nbsp;"," ");
			// answer_text = answer_text.replaceAll("<div>","");
			// answer_text = answer_text.replaceAll("</div>","");

				let btns = []
				let btn_list = $(el).find(".btn_row");

				if(btn_list.length > 0){
					btn_list.each(function(j,btn){
						let btn_id = $(btn).data("id");
						let btn_text = $(btn).find(".btn_row_text").val();
						let callback = '';
						let type = "url";
						if( $(btn).find(".btn_action").val() == 'cmd'){
							type = 'cmd';
							callback = $(btn).find(".action_cmd").val();
						}else{
							type = 'url';
							callback = $(btn).find(".action_url").val();
						}

						btns.push([type,btn_text,callback, btn_id])
					})
				}else{
					btns = 0;
				}

				if(name != undefined) cmds.push([name, desc, answer_text, btns, cmd_id]);

			})

			$.ajax({
				url:"php/save_bot.php",
				method:"POST",
				data:{id_user:id_user,user:user,bot_id:bot_id,bot_name:bot_name,bot_token:bot_token, cmds:cmds},
				success:function(data){
				}
			})

			updateBotDB();
			$.ajax({
				url:"php/update_bot.php",
				method:"POST",
				data:{id_user:id_user,user:user,bot_id:bot_id,bot_name:bot_name,bot_token:bot_token,bot_desc:bot_desc, cmds:cmds},
				success:function(data){
				}
			})
		} 
		
	})
	$(".start_bot_user").off('click');
	$(".stop_bot_user").off('click');
	let id_user = sessionStorage.getItem('id_user');
	
	$(".start_bot_user").click(function(){
		let obj = this;
		if(sessionStorage.getItem("userrole") == "admin")
			id_user = $("#bot_name").data("user-id");
		$.ajax({
			url:"ssh_query/start_bot.php",
			method:"POST",
			data:{uid:id_user,bid:bot_id},
			success:function(data){
				$(".start_bot_user").addClass("hidden");
				$(".stop_bot_user").removeClass("hidden");
			}
		})
	})

	$(".stop_bot_user").click(function(){
		let obj = this;

		$.ajax({
			url:"ssh_query/stop_bot.php",
			method:"POST",
			data:{uid:id_user,bid:bot_id},
			success:function(data){
				$(".start_bot_user").removeClass("hidden");
				$(".stop_bot_user").addClass("hidden");
			}
		})
	})
} )
