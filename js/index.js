

window.onload = function(){
	dataRequest();
	loadAddvertise();
	slide();
	isLogin();
}

function loadAddvertise(){
	var coverQuery = new AV.Query("Act");
	coverQuery.find({
		success: function(covers) {
			loadCovers(covers);
		}
	});
}


function dataRequest(){
	
	// var products =AV.Object.extend("Products");
	var query = new AV.Query("Products");
	query.limit(20);
	query.find({
		success:function(results){
			loadDom(results);
		},
		error:function(){
			loadError();
		}
	});
}

function loadCovers(covers) {
	var len = covers.length;
	var imgs = document.getElementsByClassName('coverimg');
	for(var i = 0; i < len; i = i + 1) {
		imgs[i].src = covers[i].attributes.imageUrl;
	}
}

function loadDom(results){
    var length = results.length;
	var dom = '';
	for(var i = 0; i < length; i = i + 1){
		dom = dom + "<div class=\"panel\"><a href=\"./view/detail.html?id="+results[i].id+"\"><div class=\"panelmedia\"><img src=\""+ results[i].attributes.ProCover+"\"></div><div class=\"panelcontent\"><div class=\"bookname\">"+results[i].attributes.BookName+"</div><div class=\"bookauthor\"><small>"+results[i].attributes.BookAuthor+"</small></div><div class=\"bookprice\">¥"+results[i].attributes.ProPrice.toFixed(2)+"</div></div><div class=\"cover\"></div></a></div>";
	}
	document.querySelector(".panellist").insertAdjacentHTML("beforeend",dom);
}

function loadError(){
	var dom = "<h1>页面加载出错了</h1>";
	document.querySelector(".panellist").insertAdjacentHTML("beforeend",dom);

}