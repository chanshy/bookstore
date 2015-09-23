
document.getElementById("regform").onsubmit = function(e){
	e.preventDefault();
	document.getElementById("reg").click();
}
document.getElementById("reg").onclick = function(e){
	var username = document.querySelector(".user").value;
	var pwd = document.querySelector(".pwd").value;
	var pwdConfirm = document.querySelector(".pwdconfirm").value;
	var email = document.querySelector(".email").value;
	regCheck(username,pwd,pwdConfirm,email);
	regUser(username,pwd,email);
}
function regUser(username,pwd,email){

	var user = new AV.User();
	user.set("username", username);
	user.set("password", pwd);
	user.set("email", email);
	user.signUp(null, {
  		success: function(user) {
    		window.location.href = "/view/login.html";
  		},
  		error: function(user, error) {
    		// 失败了
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
}
function regCheck(username,pwd,pwdConfirm,email){
	
	if(username&&pwd&&pwdConfirm&&email){
		var check = document.getElementById("treaty");
		if(check.checked){
			removeNote();
			return;
		}else{
			removeNote();
			addNote(check,"<p class=\"noteinfo\">请选择阅读并同意用户协议！</p>");
		}
	}else{
		removeNote();
		addNote(document.getElementById("reg"),"<p class=\"noteinfo\">输入信息有误！</p>");
	}
}