var user;
window.onload = function(){
	$("#login_btn").click(function(){
		$("#login-form").modal({});
		$(".error").text("");
	})
	$("#reg_btn").click(function(){
		$("#reg-form").modal({});
		$(".error").text("");
		return false;
	})


	// LOGIN


	$("#sub_login_btn").click(function(){
		let login = $("#login").val();
		let pass = $("#pass").val();
		$(".error").text("");
		if(login == '' || pass == ''){
			$("#login-form .error").text("Заполните форму")
		}else{
			$.ajax({
				url:"php/login.php",
				method:"POST",
				dataType:"json",
				data:{login:login,pass:pass},
				success:function(data){
					if(data != null && data['id'] > 0){
						sessionStorage.setItem("id_user",data['id']);
						sessionStorage.setItem("username",data['name']);
						sessionStorage.setItem("userrole",data['role']);
						sessionStorage.setItem("auth",1);

						window.location.href = 'workspace';
					}else{
						$(".error").text("Введены неверные логин или пароль")
					}
					
				},
				done:function(){
				}
			})
			
		}
		
		return false;
	})
	$("#sub_reg_btn").click(function(){
		let login = $("#reg_login").val();
		let pass = $("#reg_pass").val();
		$(".error").text("");
		if(login == '' || pass == ''){
			$("#reg-form .error").text("Заполните форму")
		}else{
			$.ajax({
				url:"php/reg_user.php",
				method:"POST",
				data:{login:login,pass:pass},
				success:function(data){
					if(data == "True"){
						$("#reg-notice-form").modal({});
					}else{
						$("#reg-form .error").text("Указанный логин уже занят!")
					}
				}
			})
		}
		
		return false;
	})
	$(".btn_try").click(function(){
		if(sessionStorage.getItem("auth")==0 || sessionStorage.getItem("auth") == null){
			$("#login-form").modal({});
			return false;
		}
	})

	$(".login_reg_link").click(function(){
		$("#reg-form").modal({});
		$(".error").text("");
		return false;
	})
	$(".reg_login_link").click(function(){
		$("#login-form").modal({});
		$(".error").text("");
		return false;
	})

	
}
