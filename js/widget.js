
/* slide pic*/

function slide(){
	var slides = document.querySelectorAll(".slidecontent");
	var contarin = document.querySelector(".slidecontainer"); 
	var num = slides.length;
	var i = 0;
	document.querySelector(".slideright").onclick = function(e){
		i = i + 1;
		if(i < num){
			contarin.style.marginLeft = "-" + i*1000 +"px";
		}else{
			i = 0;
			contarin.style.marginLeft = "0px";
		}
	}

	document.querySelector(".slideleft").onclick = function(e){
		i = i - 1;
		if(i>=0){
			contarin.style.marginLeft = "-" + i*1000 +"px";
		}else{
			i = num - 1;
			contarin.style.marginLeft = "-" + i*1000 + "px";
		}
	}	
}

/*验证当前用户*/

function isLogin(){
	var current = AV.User.current();
	if(current){
		loginPageInit(current);
	}else{
		return;
	}
}
function loginPageInit(current){
	var sideuser = document.querySelector("#sidemenu li:nth-child(4)");
	var navuser = document.querySelector(".toolbar-widget:last-child");
	sideuser.children[0].remove();
	navuser.children[0].remove();
	var sidedom = "<a href=\"\" onclick=\"logout()\" class=\"logout\"><img src=\""+current.attributes.userIcon+"\"><span>登出</span></a>";
	sideuser.insertAdjacentHTML("beforeend",sidedom);
	var navdom = "<a href=\"../view/usercenter.html?"+current.id+"\" class=\"usercenter\"><img src=\""+current.attributes.userIcon+"\"></>";
	navuser.insertAdjacentHTML("beforeend",navdom);
}
function logoutPageInit(){
	var sideuser = document.querySelector("#sidemenu li:nth-child(4)");
	var navuser = document.querySelector(".toolbar-widget:last-child");
	sideuser.children[0].remove();
	navuser.children[0].remove();
	sideuser.insertAdjacentHTML("beforeend","<a href=\"../view/login.html\"><i class=\"iconfont icon-login\"></i>登录</a>");
	navuser.insertAdjacentHTML("beforeend","<a href=\"../view/login.html\" class=\"btn btn-default\">登录</a>");
}

function logout(){
	AV.User.logOut();
	logoutPageInit();
}

/* URL参数获取*/
function getRequest() {
  
  var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

/* sidebar */

document.getElementById("menu").onclick = function(e){
	var sideBar = document.getElementById("sidebar");
	sideBar.classList.add("active");
}

document.getElementById("sidemenu").onclick = function(e){
	e.stopPropagation();
}
document.getElementById("sidebar").onclick = function(e){
	e.target.classList.remove("active");
}

/* 提示信息*/
function addNote(that,text){
	that.parentElement.insertAdjacentHTML("afterend",text);
}

function removeNote(){

	var el = document.querySelector(".noteinfo");
	if(el){
		el.remove();
	}
}
