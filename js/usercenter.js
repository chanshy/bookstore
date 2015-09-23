var current = AV.User.current();
if(current) {
	window.onload = function() {
		isLogin();
		tabInit();
		document.getElementById("userinfo").click();
	}
}else {
	window.location.href = '../view/login.html';
}

function tabInit(){
	var tabs = document.querySelectorAll('.managetab li');
	var len = tabs.length;
	for(var i = 0; i < len; i = i + 1) {
		tabs[i].onclick = function(e) {
			
			for(var j = 0; j < len; j = j + 1) {
				tabs[j].classList.remove('active');
			}
			e.currentTarget.classList.add('active');
			
			switch(e.currentTarget.id) {
				case 'userinfo' : 
					loadUserInfo();
					break;
				case 'orderinfo' : 
					loadOrderInfo();
					break;
				case 'addrinfo' : 
					loadAddrInfo();
					break;
				default : 
					break;
			}
		}
	}
}


//用户资料


function loadUserInfo(){
	var dom = '<h1>用户资料</h1><form class="infoform"><fieldset><label for="name">用户姓名</label><input type="text" id="username" value="'+current.attributes.username+'" onblur="nameCheck(this)" placeholder="输入姓名" name="name"></fieldset><fieldset><label for="icon">用户头像</label><input type="file" id="userIcon" class="upfile hide" name="icon" accept="image/jpg,image/png"><img src="'+ current.attributes.userIcon+'" class="usericon" id="iconimg"></fieldset><fieldset><label for="email">用户邮箱</label><input type="email" name="email" id="mail" value="'+current.attributes.email+'" placeholder="输入邮件地址"></fieldset><fieldset><label for="currentpwd">当前密码</label><input type="password" id="oldpwd" for="currentpwd" placeholder="输入当前密码"><label fro="futurepwd">新密码</label><input type="password" id="newpwd" name="futurepwd" placeholder="输入新密码" onblur = "pwdCheck(this)"></fieldset><input type="submit" id="changeuserinfo" value="保存"></form>';
	document.getElementById("show").innerHTML = dom;
	Initclick();
}

function Initclick(){
	removeNote();
	document.getElementById("userIcon").onchange = function(e){
		var file = e.target.files;
		if(file.length > 0) {
			var name = 'icon_' + current.id + '.' + file[0].name.substr(-3,3);

			var avFile = new AV.File(name,file[0]);
			avFile.save().then(function(file) {
				document.getElementById("iconimg").setAttribute("src",file.thumbnailURL(100, 100));
				current.set("userIcon",file.thumbnailURL(100,100));
				current.save();
			}, function(error) {
				alert(error.message);
			});
		}

	}

	document.getElementById("changeuserinfo").onclick = function(e) {
		e.preventDefault();
		var newpwd = document.getElementById("newpwd");
		var oldpwd = document.getElementById("oldpwd");
		if(newpwd.value != ''){
			AV.User.current().updatePassword(newpwd, oldpwd,{
				success: function(post){
			    	return;
			  	},
			  	error: function(user, err){
			  		alert(err.message);
			  		return;
			  	}
			});
		}

		var usericon = document.getElementById("iconimg").src;
		var username = document.getElementById("username").value;
		var email = document.getElementById("mail").value;
		current.set("username",username);
		current.set("email",email);
		current.save(null,{
			success: function() {
				window.location.reload();
			},
			error: function() {
				return;
			}
		});
		
	}
}

//订单信息

function loadOrderInfo(){
	var order = new AV.Query("Order");
	order.equalTo("userId",current.id);
	order.find({
		success: function(results) {
			if(results > 0) {
				loadOrderDom(results);
			}else {
				document.getElementById("show").innerHTML = '<h1 class="noteinfo">没有订单信息！</h1>';
			}
		},
		error: function() {
			window.location.reload();		
		}
	});
}

function loadOrderDom(results){

	var dom = '';
	var i =0;
	var len = results.length;
	for(; i < len;){
		var book = new AV.Query('Products');
		book.equalTo('objectId', results[i].attributes.bookid);
		book.find({
			success: function(orderBook) {
				dom = dom + '<tr class="tabinfo"><td class="tabtitle"><a href="../view/detail.html?id="'+orderBook[0].id+'><img src="'+orderBook.attributes.ProCover+'"><p class="tabname">'+orderBook[0].attributes.BookName+'</p><p class="tabtext">'+orderBook[0].attributes.BookAuthor+'</p></a></td><td class="tabprice">'+orderBook[0].attributes.BookPrice+'</td><td class="tabcount">'+results[i].attributes.bookNum+'</td><td class="tabsum">'+results[i].attributes.orderPrice+'</td><td class="tabstate">'+results[i].attributes.state+'</td><td class="tabdel"><input type="checkbox" id="'+results[i].id+'" class="check"></td></tr>';
				i = i + 1;
			}
		});
	}
	var dom1 = '<h1>订单信息</h1><table class="ordertable"><thead><tr class="tabhead"><th class="tabtitle">基本信息</th><th class="tabprice">单价</th><th class="tabcount">数量</th><th class="tabsum">合计</th><th class="tabstate">状态</th><th class="tabdel">选择</th></tr></thead><tbody><tr class="tableborder"><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
				
	dom = dom1 + dom + '</tbody></table><div class="orderop"><input type="submit" id="orderdelete" value="订单删除" ><input type="submit" id="orderchange" value="订单付款" ><div>';

	document.getElementById("show").innerHTML = dom;

	InitOrderOperate();
}

function InitOrderOperate(){
	document.getElementById("orderdelete").onclick = function(e) {
		e.preventDefault();
		var checks = document.querySelectorAll(".check");
		var i = 0;
		for(; i < checks.length;){
			if(checks[i].checked) {
				var orderId = checks[i].id;
				var order = AV.Query("Order");
				order.get(orderId, {
					success: function(post) {
						post.destroy();
						i = i + 1;
					}
				});
			}else{
				return;
			}
		}
		document.getElementById("orderinfo").click();

	}

	document.getElementById("orderchange").onclick = function(e) {
		e.preventDefault();
		var checks = document.querySelectorAll(".check");
		var i = 0;
		for(; i < checks.length;) {
			if(checks[i].checked) {
				var orderId = checks[i].id;
				var order = AV.Query("Order");
				order.get(orderId, {
					success: function(post) {
						post.set("state","已支付");
						post.save();
						i = i + 1;
					},
					error: function(err){
						alert('支付失败'+ err.message);
					}
				});
			}else{
				return;
			}
		}
		document.getElementById("orderinfo").click();

	}

}

function loadAddrInfo(){
	var addr = new AV.Query("Addr");
	addr.equalTo("userId",current.id);
	addr.find({
		success: function(results){
			if(results > 0) {
				loadAddrDom(results);
			}else {
				document.getElementById("show").innerHTML = '<h1 class="noteinfo">没有地址信息！</h1>';
			}
		},
		error: function(){
			window.location.reload();
		}
	})
}

function loadAddrDom(results){
	var dom = '';
	var len = results.length;
	for(var i = 0;i < len; i = i + 1) {
		dom = dom + '<li class="panel addresspanel" id="'+results[i].id+'"><div class="addresstitle">'+results[i].attributes.city+'('+results[i].attributes.recevier+')</div><div class="divider"></div><div class="addressdetail">'+results[i].attributes.village+'&nbps&nbps'+results[i].attributes.phone+'</div></li>';

	}
	var dom = '<h1>地址信息</h1><ul class="addresslist">' + dom + '<div id="addrIn"><input type="text" id="city" placeholder="请填写城市" class="addr"><input type="text" id="village" placeholder="详细地址" class="addr"><input type="text" id="recevie" placeholder="填写收件人" class="addr"><input type="text" id="number" placeholder="填写电话号码" class="addr"><input type="submit" id="addrenroll"></div><div class="orderop"><input type="submit" id="orderdelete" value="订单删除" ><input type="submit" id="orderchange" value="订单付款" ><div>';
	document.getElementById("show").innerHTML = dom;

	addrOperateInit()
}

function addrOperateInit(){

	var addrs = document.getElementsByClassName("addresspanel");
	for(var i = 0; i < addrs.length; i = i + 1) {
		addrs[i].onclick = function(e) {
			if(e.currentTarget.classList.contains("selected")){
				e.currentTarget.classList.remove("selected");
			}else{
				e.currentTarget.classList.add("selected");
			}
		}
	}
	document.getElementById("addrdelete").onclick = function(e) {
		e.preventDefault();
		var selects = document.getElementsByClassName(".selected");
		if(selects.length === 0){
			return;
		}
		var i = 0;
		for(;i<selects.length;){
			var addrId = selects[i].id;
			var addr = new AV.Query("Addr");
			addr.equalTo("objectId",addrId);
			addr.find({
				success: function(info) {
					info.destroy();
					i = i + 1;
				},
			});
		}
		document.getElementById("addrinfo").click();
	}

	document.getElementById("addradd").onclick= function() {
		document.getElementById("addrIn").style.display = "block";
		document.body.onclick = function(e) {
			e.stopProgagation();
			document.getElementById("addrIn").style.display = "none";
		}
	}
	document.getElementById(".addrenroll").onclick = function() {
		var city = document.getElementById("city").value;
		var village = document.getElementById("village").value;
		var recevie = document.getElementById("recevie").value;
		var phonenum = document.getElementById("number").value;
		if(city&&village&&recevie&&phonenum){
			var Addr = AV.Object.extend("Addr");
			var addr = new Addr();
			addr.set("city",city);
			addr.set("village",village);
			addr.set("recevier",recevie);
			addr.set("phone",phonenum);
			addr.save(null,{
				success: function() {
					document.getElementById("addrinfo").click();
				}
			});
		}
	}
}



