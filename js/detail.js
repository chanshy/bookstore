window.onload = function(){
	isLogin();
	loadInfo();
}


document.getElementById("buy").onclick = function(e){
	var currentuser = AV.User.current();
	if(currentuser){
		var count = document.getElementById("counter");
		if(count.value <= 0 ){
			count.style.borderColor = "red";
			count.insertAdjacentHTML("afterend","请选择数量!");
		}else{
			document.querySelector(".affirmorder").style.display = "block";	
			var addresses = new AV.Query("Addr");
			addresses.equalTo("userId",currentuser.id);
			addresses.find({
				success:function(results){
					if(results.length>0){
						loadAddress(results);
					}else{
						noAddress();
					}
					loadOrder(count.value);
				},
				error:function(error){
					alert("点击购买失败了!"+error.message);
				}
			});
		}
	}else{
		document.location.href="/login"
	}
}
//提交订单
document.getElementById("pushorder").onclick=function(){
	orderPush();
}
// 取消订单

document.getElementById("resetorder").onclick = function(){
	orderReset();
}

function tabInit(){
	var panels = document.querySelectorAll(".addresspanel");
	for(var i = 0;i<panels.length;i++){
		panels[i].onclick = function(e){
			for(var j=0;j<panels.length;j++){
				panels[j].classList.remove("addressactive");
			}
			e.currentTarget.classList.add("addressactive");
		}
	}
}
function loadInfo(){
	var para = getRequest();
	var obId = para.id;
	var book = new AV.Query("Products");
	book.equalTo("objectId",obId);
	book.find({
		success:function(results){
			if(results.length > 0){
				loadBookInfo(results);
			}else{
				alert("没有获取到数据！");
				window.history.go(-1)
			}
		},
		error:function(){
			alert("没有相关图书信息");
			window.history.go(-1);
		}
	});
}

function loadBookInfo(results){
	document.querySelector(".bookcover").src = results[0].attributes.ProCover;
	document.querySelector(".bookname").innerHTML = "<h1>"+results[0].attributes.BookName+"</h1>";
	document.querySelector(".bookauthor").innerHTML = results[0].attributes.BookAuthor;
	document.querySelector(".price").innerHTML = "¥" + results[0].attributes.ProPrice.toFixed(2);
	document.querySelector(".price").id = results[0].attributes.ProPrice;
	document.querySelector(".bookdesc").innerHTML = results[0].attributes.ProDesc;
}

function loadAddress(results){
	var paNode = querySelector(".addresslist");
	var len = results.length;
	for(var i=0;i<len;i=i+1){
		var dom = dom + "<li class=\"panel addresspanel\" addr=\""+results[i].attributes.city+""+results[i].attributes.village+""+""+results[i].attributes.recevier+""+""+results[i].attributes.phone+"\"><div class=\"addresstitle\">"+results[i].attributes.city+"（"+results[i].attributes.recevier+"）</div><div class=\"divider\"></div><div class=\"addressdetail\">"+results[i].attributes.village+"&nbsp;&nbsp;"+results[i].attributes.phone+"</div></li>";
		
	}
	paNode.innerHTML = dom;
	tabInit();
}

function noAddress(){
	document.querySelector(".addresslist").innerHTML = "<h2 class=\"noteinfo\">没有地址信息，点击管理地址添加！</h2>";
}

function loadOrder(count){
	var book = new AV.Query("Products");
	book.equalTo("objectId",getRequest().id);
	book.find({
		success:function(results){

			var tabtitle = document.querySelector("td.tabtitle");
			var tabprice = document.querySelector("td.tabprice");
			var tabcount = document.querySelector("td.tabcount");
			var tabsum = document.querySelector("td.tabsum");
			var domtitle = "<a href=\"\"><img src=\""+results[0].attributes.ProCover+"\"><p class=\"tabname\">"+results[0].attributes.BookName+"</p><p class=\"tabtext\">"+results[0].attributes.BookAuthor+"</p></a>";
			tabtitle.innerHTML = domtitle;
			tabprice.innerHTML = "¥"+results[0].attributes.ProPrice.toFixed(2);
			tabcount.innerHTML = count;
			tabsum.innerHTML = count*results[0].attributes.ProPrice.toFixed(2);
		}
	});
}
function orderPush(orderInfo){

	var order = AV.Object.extend("Order");
	var info = new order();
	info.set("userId",AV.User.current().id);
	info.set("bookId",getRequest());
	info.set("bookNum",parseInt(document.getElementById("counter").value));
	info.set("orderPrice",document.querySelector(".price").id);
	if(!document.querySelector(".addressactive")){
		alert("没有选择地址信息！");
		return;
	}
	info.set("orderAddr",document.querySelector(".addressactive").addr);
	info.save(null,{
		success:function(){
			addNote(document.querySelector(".orderinfo"),"<h3 class=\"noteinfo\">订单提交成功!</h3>");
			window.location.href = "../view/usercenteer.html";
		},
		error:function(){
			addNote(document.querySelector(".orderinfo"),"<h3 class=\"noteinfo\">订单提交失败!</h3>");
			window.location.reload();
		}
	})
}

function orderReset(){
	window.location.reload();
}

