window.onload = function() {
	isLogin();
	tabInit();
	document.querySelector(".tab").click();
}

function tabInit() {
	var tabs = document.querySelectorAll(".tab");
	var len = tabs.length;
	for(var i=0;i<len;i=i+1){
		tabs[i].onclick = function(e){
			for(var j=0; j<len; j=j+1){
				tabs[j].classList.remove("active");
			}
			e.currentTarget.classList.add("active");
			var type = document.querySelector(".active span").id;
			var pros = new AV.Query("Products");
			if(type!=="全部"){
				pros.equalTo("ProTag",type);
			}
			pros.find({
				success:function(results){
					loadProducts(results);
				},
				error:function(){
					addNote(document.querySelector(".panellist"),"<h2 class=\"noteinfo\">没有数据！</h2>");
				}
			});
		}
	}
}

function loadProducts(results) {
	var list = document.querySelector(".panellist");
	if(results.length > 0) {

		var len = results.length;
		var dom = '';
		for(var i = 0; i < len; i = i + 1) {
			dom = dom + "<div class=\"panel\"><a href=\"../view/detail.html?id="+results[i].id+"\"><div class=\"panelmedia\"><img src=\""+ results[i].attributes.ProCover+"\"></div><div class=\"panelcontent\"><div class=\"bookname\">"+results[i].attributes.BookName+"</div><div class=\"bookauthor\"><small>"+results[i].attributes.BookAuthor+"</small></div><div class=\"bookprice\">¥"+results[i].attributes.ProPrice.toFixed(2)+"</div></div><div class=\"cover\"></div></a></div>";
		}
		list.innerHTML = dom;
	}else{
		list.innerHTML = "<h2 class=\"noteinfo\">没有数据！</h2>";
	}
}