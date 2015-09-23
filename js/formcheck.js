// 用户名验证
function nameCheck(that){
	var text = that.value;
	var reg = new RegExp("^[\\u4e00-\\u9fa5a-zA-Z0-9_]{1,16}$");
	var result = reg.test(text);
	if(result){
		removeNote();
		return;
	}else{
		var note = "<p class=\"noteinfo\">请输入16位以下有效字符</p>";
		removeNote();
		addNote(that,note);
	}
}

//首次密码验证
function pwdCheck(that){
	var text = that.value;

	//数字正则
	var regNum = new RegExp("^[1-9]{6,16}\\d*$");


	var reg = new RegExp("^[\\u4e00-\\u9fa5a-zA-Z0-9;',./~!@#$%^&*()_+|{}:<>?]{6,16}$");
	var result = reg.test(text);
	if(result){
		removeNote();
		if(regNum.test(text)){
			addNote(that,"<p class=\"noteinfo\">你的密码太弱了！</p>");
			return;
		}else{
			removeNote();
			return;
		}
		return;
	}else{
		removeNote();
		var note = "<p class=\"noteinfo\">请输入8-16位有效密码</p>";
		addNote(that,note);
	}
}


//第二次密码验证
function pwdConfirm(that){
	var pwdValue = document.querySelector(".pwd").value;
	var pwdConfirm = that.value;

	if(pwdConfirm === pwdValue){
		removeNote();
		return;
	}else{
		removeNote();
		addNote(that,"<p class=\"noteinfo\">两次输入密码不一致</p>");
	}
}

// 邮件验证

function emailCheck(that){

	var email = that.value;
	var reg = new RegExp("[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?");
	if(reg.test(email)){
		removeNote();
		return;
	}else{
		removeNote();
		addNote(that,"<p class=\"noteinfo\">输入有效的邮箱！</p>");
	}

}

//消息提示

function addNote(that,text){
	that.parentElement.insertAdjacentHTML("afterend",text);
}

function removeNote(){

	var el = document.querySelector(".noteinfo");
	if(el){
		el.remove();
	}
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