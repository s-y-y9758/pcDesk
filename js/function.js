
var selectedAll = [];//被点击的元素
var isMove = false;

//右键菜单所要执行的函数存在一个对象里
var contextCallback = {
	del:function() {
		
		var delArr =[];
		var selectedAll = document.querySelectorAll('.active');
		for(var i = 0; i < selectedAll.length; i++) {
			data.list.splice(getDataFromElId(selectedAll[i].id),1);
		}
		view(_IP);
	},
	rename:function() {
			var li = Selected[0];
			var nowTxt = li.querySelector('p');
			var nowInputBox = li.querySelector('input');
			nowTxt.style.display = 'none';
			nowInputBox.style.display = 'block';
			setTimeout(function() {
				nowInputBox.focus();
				nowInputBox.select();
			},100);
			nowInputBox.addEventListener('blur',function() {
				whenBlur(li);
			});
			
	},
	copy:function() {
		selectedAll = document.querySelectorAll('.active');
	},
	paste:function() {
		var beCopyChildren = [];//被点击下的所有子级
		var infoSelf = info(selectedAll);//被点击的元素自己的数据
		for(var i = 0 ;i < selectedAll.length; i++) {
			beCopyChildren = beCopyChildren.concat(getAllChildren(selectedAll[i].id));
		}
		var copiedChildren = [];
		for(var i = 0; i < beCopyChildren.length; i++) {
			copiedChildren.concat(copiedChildren.push(copying(beCopyChildren[i])));
		} 
		var copiedSelf = copying(infoSelf);
		var nowId = getId(data.list);
		changeId(copiedSelf);
		changeId(copiedChildren);
		function changeId(change) {
			change.forEach(function(value) {
				value.lastId = value.id;
				value.id = nowId;
				nowId++;
			})
		}
		for(var i = 0; i < copiedSelf.length; i++) {	
			copiedSelf[i].name = getCopyName(copiedSelf[i].name)
			copiedSelf[i].pid = _IP;
		}
		
		function getCopyName(name) {
			var dataNew = [];
			name = name + '-副本'
			data.list.filter(function(value) {
				if(value.name.substring(0,name.length) == name) {
				  	dataNew.push(value.name);
				}
			})
			console.log(dataNew)
			if(dataNew.length == 0) {
				return name
			} else {
				return name + dataNew.length
			}
			
		}
		var allCopy = copiedSelf.concat(copiedChildren);
		for(var i = 0; i < copiedChildren.length; i++) {
			for(var j = 0; j < allCopy.length; j++) {
				if(copiedChildren[i].pid == allCopy[j].lastId) {
					copiedChildren[i].pid = allCopy[j].id;
				}
			}
		}
		for(var i = 0; i < allCopy.length; i++) {
			data.list.push(allCopy[i]);
		}
		view(_IP);
	},
	createFile:function() {
		allFileName(data.list,'新建文件夹','file');
	},
	changeBg:function(){
		var bg = document.querySelector('#bg')
		var bgImg = [
		'img/bg1.jpg'
		,'img/bg2.jpg'
		// ,'img/bg3.jpg'
		,'img/bg10.jpg'
		// ,'img/bg5.jpg'
		,'img/bg6.jpg'
		,'img/bg7.png'
		,'img/bg8.jpg'
		,'img/bg9.jpg'
		]
		var nub = Math.round((Math.random())*6);
		bg.style.backgroundImage = "url(" + bgImg[nub] + ")";
		
	},
	sortTime:function() {
		var timeSortArr = [];
		timeSortArr = getChildren(_IP);
		timeSortArr.sort(function(a,b) {
			return b.id - a.id;
		})
		
		for(var i = 0; i < timeSortArr.length; i++) {
			changeList(timeSortArr[i]);
		}
		
		view(_IP);
	},
	sortName:function() {
		var nameSortArr = getChildren(_IP);
		var typeAll = ['file','video','audio','image','text'];
		
		typeAll.forEach(function(value,index) {
			getType(value);
			getType(value).forEach(function(valueIn) {
				changeList(valueIn);
			})
		})
		function getType(type) {
			var typeList = nameSortArr.filter(function(value) {
				if(value.type == type) {
					return true;
				}
			})
			return typeList;
		}
		
		view(_IP);
	},
	loading:function() {
		var upload = document.querySelector('#upload');
		upload.click();
		upload.onchange = function() {
			var type = upload.files[0].type.split('/')[0];
			switch(type) {
				case 'video':
				createVideo(upload.files[0]);
				break;
				case 'audio':
				createAudio(upload.files[0]);
				break;
				case 'image':
				createImage(upload.files[0]);
				break;
				case 'text':
				createText(upload.files[0]);
				break;
			}
		}
		function createVideo(filed) {
			var reader = new FileReader();
			var type = upload.files[0].type.split('/')[0];
			reader.onload = function(e) {
				allFileName(data.list,filed.name,type,e.target.result);
				upload.value = '';
			}
			reader.readAsDataURL(filed);
		};
		function createAudio(filed) {
			var reader = new FileReader();
			var type = upload.files[0].type.split('/')[0];
			reader.onload = function(e) {
				allFileName(data.list,filed.name,type,e.target.result);
				upload.value = '';
			}
			reader.readAsDataURL(filed);
		}
		function createImage(filed) {
			var reader = new FileReader();
			var type = upload.files[0].type.split('/')[0];
			reader.onload = function(e) {
				allFileName(data.list,filed.name,type,e.target.result);
				upload.value = '';
			}
			reader.readAsDataURL(filed);
		}
		function createText(filed) {
			var reader = new FileReader();
			var type = upload.files[0].type.split('/')[0];
			reader.onload = function(e) {
				allFileName(data.list,filed.name,type,e.target.result);
				upload.value = '';
			}
			reader.readAsText(filed);
		}
	}
}


//除文件夹外每种类型文件的打开显示
var openMedie = {
	video:function(src) {
		Element.imgWrap.style.display = 'block';
		var video = document.createElement('video')
		video.src = src;
		video.onloadedmetadata = function() {//判断视频是否加载完成	
			Element.kong.style.display = 'none';
			video.setAttribute('controls','');
			video.width = video.videoWidth;
			video.height = video.videoHeight;					
			video.className = 'videos';
			Element1.p2.appendChild(video);
		};
		Element2.span.addEventListener('click',function() {
			Element.imgWrap.style.display = 'none';
			Element1.p2.innerHTML = '';
		})
	},
	audio:function(src) {
			var audio = document.createElement('audio');
			Element.imgWrap.style.display = 'block';
			audio.src = src;
			audio.onloadedmetadata = function() {//判断音频是否加载完成
				Element.kong.style.display = 'none';
				audio.setAttribute('controls','');					
				audio.className = 'videos';
				Element1.p2.appendChild(audio);
			};
			Element2.span.addEventListener('click',function() {
				Element.imgWrap.style.display = 'none';
				Element1.p2.innerHTML = '';
			})
	},
	image:function(src) {
			var imgBody = new Image();
			imgBody.src = src;
			Element1.p2.appendChild(imgBody);
			Element.imgWrap.style.display = 'block';
			Element.kong.style.display = 'none';
			var width = css(Element1.p2,'width')- 40;
			var height = css(Element1.p2,'height') - 40;
			if(imgBody.width >= width) {
				imgBody.style.width = width + 'px';
			}
			if(imgBody.height >= height){
				imgBody.style.height = height + 'px';
			}
			Element2.span.addEventListener('click',function() {
				Element.imgWrap.style.display = 'none';
				Element1.p2.innerHTML = '';
			})
	},
	text:function(src) {
			Element1.p2.classList.add('forTextIn');
			Element.kong.style.display = 'none';
			Element1.p2.innerHTML = src;
			Element.imgWrap.style.display = 'block';
			Element2.span.addEventListener('click',function() {
				Element.imgWrap.style.display = 'none';
				Element1.p2.innerHTML = '';
			})
		
	}
}


/**
 * 在数组对象里找到我传进去的数据，并把它提到第一位
 * @param  {[object]} nowNumber [元素]
 * @return {[void]}          []
 */

function changeList(nowNumber) {
	var nowObj;
	data.list.forEach(function(value,index) {
		if(nowNumber.id == value.id) {
			nowObj = value;
			data.list.splice(index,1);
		}
	})
	data.list.unshift(nowObj);
}

/**
 * 失去焦点之后的重命名处理
 * @param  {[element]} el [元素]
 * @return {[void]}          []
 */

function whenBlur(el) {
	//数组用来找是否有重名，返回true或者false，而不是直接在里面做事情;
	var txt = el.querySelector('p');
	var inputBox = el.querySelector('input');
	if(inputBox.value.trim('') == '') {
		Element.nameSame.style.display = 'block';
		Element1.hint.innerHTML = '请输入内容';
		Element1.close.addEventListener('mousedown',function(e) {
			e.stopPropagation();
		})
		Element1.close.addEventListener('click',function(e) {
			e.stopPropagation();
			Element.nameSame.style.display = 'none';
		})
		inputBox.focus();
		return;
	}
	if(ifNameSame(inputBox.value,el,_IP)) {
		Element.nameSame.style.display = 'block';
		Element1.hint.innerHTML = '名字重复，请重新输入';
		Element1.close.addEventListener('mousedown',function(e) {
			e.stopPropagation();
		})
		Element1.close.addEventListener('click',function(e) {
			e.stopPropagation();
			Element.nameSame.style.display = 'none';
		})
		inputBox.focus();
		return;
		
	} else {
		var info = getInfo(el.id);
		info.name = inputBox.value;
		info.index = undefined;
		txt.innerHTML = inputBox.value;
		txt.style.display = 'block';
		inputBox.style.display = 'none';
	}
}

/**
 * 向数组里添加内容，并重新渲染，添加的内容由传入的参数决定，都是新建的
 * @param  {[Array]} dataList [数组]
 * @param  {[string]} name [当前文件的名称]
 * @param  {[string]} type [当前文件的类型]
 * @param  {[string]} src [当前文件的路径地址]
 * @return {[void]}          []
 */

function allFileName(dataList,name,type,src) {
	var id = getId(dataList);
	var arrFileNames = [];
	var index;
	if(type == 'file'
	|| type == 'video'
	|| type == 'audio'
	|| type == 'image'
	|| type == 'text') {
		dataList.filter(function(value) {
			// if(value.type == type 
			// 	&& value.pid == _IP
			// 	&& value.name == name) {
			// 		arrFileNames.push(value.name);
			// }
			// if(value.type == type 
			// 	&& value.pid == _IP
			// 	&& value.name.substring(0,name.length) == name
			// 	&& value.name.slice(name.length,name.length+1) == '('	
			// 	&& value.name.slice(value.name.length-1,value.name.length) == ')'			
			// 	&& !isNaN(value.name.slice(name.length+1,value.name.length-1))
			// 	&& Number(value.name.slice(name.length+1,value.name.length-1)) != 1) {
			// 		arrFileNames.push(value.name);
			// }
			if(value.type == type 
			  && value.pid == _IP
			  // && value.name.substring(0,name.length) == name
			  && value.name.match(/^新建文件夹$|^新建文件夹\(\d\)$/)) {
			  	//value.name.match(/^(新建文件夹|新建文件夹\(\d\))$/) 因为括号在正则里有特殊的含义所以要转义;
			  	arrFileNames.push(value.name);
			}
		})
	};
	
	arrFileNames.sort(function(a,b) {
		a = a.length < name.length?0:a.slice(name.length+1,a.length-1);
		b = b.length < name.length?0:b.slice(name.length+1,b.length-1);
		return a - b;
	})
	var nameIn = nameReturn(arrFileNames,name);
	function nameReturn(arrFileName,name) {
		if(arrFileName.length == 0 || arrFileName[0] != name) {
			return name;
		};
		
		for(var i = 1; i < arrFileName.length; i++) {
			if(name + '(' + (i + 1) + ')' !== arrFileName[i]) {
				return name = name + '(' + (i+1) + ')';
			}
		};
		return name + '(' + (arrFileName.length + 1) + ')';
		
	}
	if(src) {
		data.list.push({
			id:id,
			pid:_IP,
			name:nameIn,
			type:type,
			src:src
		})
	} else {
		data.list.push({
			id:id,
			pid:_IP,
			name:nameIn,
			type:type
		})
	}
	view(_IP);
}

/**
 * 判断是否存在重名文件
 * @param  {[string]} str [字符串]
 * @param  {[element]} _this [当前文件]
 * @param  {[number]} pid [当前所在页面的父级]
 * @return {[boolean]}          []
 */

function ifNameSame(str,_this,pid) {
	var child = getChildren(pid);
	var nowChild = 
	child.filter(function(value) {
						if(str.trim('') == value.name
						&& value.type == _this.type
					 	&& Number(_this.id) != value.id) {
							return true;
						}
					});
	if(nowChild.length > 0) {
		return true;
	};
	return false;
}

/**
 * 桌面文件的渲染
 * @param  {[number]} id [当前要看的那一层父级]
 * @return {[void]}          []
 */

function view(IP,nowList) {
	var wrapUl = document.querySelector('#wrap>ul');
	var bg = document.querySelector("#bg");
	var wrap = document.querySelector("#wrap");
	var body = document.querySelector('body');
	var nav = document.querySelector('#nav');
	var html = document.querySelector('html');
	var height = document.documentElement.clientHeight;
	var width = document.documentElement.clientWidth;
	var li = document.getElementsByClassName('.file');
	var wrapP = wrapUl.getElementsByTagName('p');
	var hasMove = false;
	var lastEl;
	wrapUl.innerHTML = '';
	_IP = IP;
	
	var dataList = getChildren(IP);
	//点进文件夹之后才显示面包屑导航
	changeLiColor();
	if(IP > 0) {
		wrap.style.height = height*0.8 + 'px';
		wrap.style.background = '#fff';
		bg.style.display = 'none';
		Element.dateOut.style.display = 'none';
		nav.style.display = 'block';
		body.className = 'change';
		wrap.className = 'border';
		html.className = 'bgName';
		body.style.height = height*0.8 + 'px';
		body.style.marginTop = height*0.15 + 'px';
		body.style.marginBottom = height*0.05 + 'px';
	} else {
		wrap.style.height = '';
		wrap.className = '';
		nav.style.display = 'none';
		bg.style.display = 'block';
		Element.dateOut.style.display = 'block';
		body. className = '';
		html.className = '';
		body.style.marginTop = 0;
		body.style.marginBottom = 0;
		body.style.height = height + 'px';
	}
	dataList.forEach(function(value,index) {
		var createFile = document.createElement('li');
		var li = wrapUl.getElementsByTagName('li');
		createFile.id = value.id;
		createFile.type = value.type;

		
		//文件夹的各种操作事件
		
		createFile.addEventListener('contextmenu',function() {			
			if(lastEl) {
				whenBlur(lastEl);
			}
			Selected = [];
			Selected.push(createFile);
			lastEl = Selected[0];
		})
		
		createFile.addEventListener('mousedown',function(e) {
			e.stopPropagation();
			hideMenu();
			var choosed = wrapUl.querySelectorAll('.active');
			if(!e.ctrlKey) {//单选
				if(!this.classList.contains('active')) {
					removeActive();
				}
				this.classList.add('active');
			} else {//按住ctrl就多选
				if(this.classList.contains('active')) {
					this.classList.remove('active');
				} else {
					this.classList.add('active');
				}
			}
		})
		
		createFile.addEventListener('click',function(e) {
			e.stopPropagation();
		})

		createFile.addEventListener('mousedown',function(e) {
			e.stopPropagation();
			e.preventDefault();
			var arrActive = wrapUl.querySelectorAll('.active,.hover');
			var allLi = wrapUl.querySelectorAll('.file:not(.active)');//找到不具有某个class的元素
			var arrActiveClone = [];
			var nowClone = null;
			var startX = e.clientX;
			var startY = e.clientY;
			var _this = this;
			var isMove = false;
			document.addEventListener('mousemove',move);
			document.addEventListener('mouseup',end);
			
			function move(e) {
				var endX = e.clientX;
				var endY = e.clientY; 
				var disX = endX - startX;
				var disY = endY - startY;
				if(disX > 5 || disY > 5) {
					isMove = true;
				}
				if(isMove) {
					if(arrActiveClone.length == 0) {
						for(var i = 0; i < arrActive.length; i++) {
							arrActiveClone.push(arrActive[i].cloneNode(true));
							if(arrActive[i] == _this) {
								nowClone = arrActiveClone[arrActiveClone.length-1];
							}
							css(arrActiveClone[i],'opacity',30);
							arrActiveClone[i].startX = css(arrActive[i],'left');
							arrActiveClone[i].startY = css(arrActive[i],'top');
						}
					}
						for(var i = 0; i < arrActiveClone.length; i++) {
							wrapUl.appendChild(arrActiveClone[i]);
						}
						
						for(var i = 0; i < arrActiveClone.length; i++) {
							css(arrActiveClone[i],'top',arrActiveClone[i].startY+disY);
							css(arrActiveClone[i],'left',arrActiveClone[i].startX+disX);
						}
				}
			}
			function end(e) {
				if(isMove) {
					var rub = document.querySelector('#rub');
					var infoAll;
					var nowInfo = [];
					var nowLi;
					var info = [];
					var inner = '';
					//与文件夹碰撞就成为子文件夹,并判断其底下是否有命名冲突
					for(var i = 0; i < allLi.length; i++) {
						if(nowClone&&getCollide(allLi[i],nowClone)) {
							if(allLi[i].type == 'file') {
								for(var j = 0; j < arrActive.length; j++) {
									info.push(getInfo(arrActive[j].id));
									nowLi = allLi[i];
								}
								for(var j = 0; j < info.length; j++) {
									if(ifNameSame(info[j].name,allLi[i],allLi[i].id)) {
										nowInfo.push(info[j]);
									} else {
										info[j].pid = Number(nowLi.id);
									}
								}
								if(nowInfo.length > 0) {
									Element.nameSame.style.display = 'block';
									for(var j = 0; j < nowInfo.length; j++) {
										inner = inner + '&nbsp;' + nowInfo[j].name;
									}
									Element1.hint.innerHTML = '此文件夹下已包含' + inner + '&nbsp;' + '的文件，请重新命名后移入。';
								}
								Element1.close.addEventListener('click',function() {
									Element.nameSame.style.display = 'none';
								})
								viewSideNav();
							}
						}
					}

					//与垃圾桶碰撞就删除
					if(nowClone&&getCollide(rub,nowClone)) {
						for(var i = 0; i < arrActiveClone.length; i++) {
							var rubArr = getDataFromElId(arrActive[i].id);
							data.list.splice(rubArr[0],1);
						}
					}
					if(nowClone){
						for(var i = 0; i < arrActiveClone.length; i++) {
							wrapUl.removeChild(arrActiveClone[i]);
						}
					}
					
					view(_IP)
					isMove = false;
				}
				
				document.removeEventListener('mousemove',move);
				document.removeEventListener('mouseup',end);
			}
		})
		
		createFile.addEventListener('mouseover',function() {
			if(this.classList.contains('active')) {
				this.className = 'hover active';
			} else {
				this.classList.add('hover');
			}
		})
		
		createFile.addEventListener('mouseout',function() {
			this.classList.remove('hover');
		})
		
		createFile.className = 'file';
		var inner = '';
		var src,pInner;
		if(value.type == 'file') {
			
			createFile.addEventListener('dblclick',function() {	
				hideMenu();
				//显示面包屑导航
				//显示所有父级
				viewCrumbsParent(createFile.id);			
				
				//显示自己
				viewCrumbsinfo(createFile.id);
				
				//显示子级
				view(value.id);
				
			})
			
			src = 'img/file2.png';
			pInner = dataList[index].name;
		} else if (
			value.type == 'video'
		|| value.type == 'audio' 
		|| value.type == 'image'
		|| value.type == 'text') {
			var type = value.type;
			createFile.addEventListener('dblclick',function() {
				hideMenu();
				openMedie[type](value.src);//不能写成.属性，只能用方括号，因为这里type是个变量，而不是个死值
			})
			
			if(value.type == 'video' || value.type == 'audio') {
				src = 'img/video.png';
			}
			if(value.type == 'image') {
				src = value.src;
			};
			if(value.type == 'text') {
				src = 'img/txt.png';
			}
			pInner = dataList[index].name;
		}
		
		inner = "<img src='" + src + "'><p class=" + 'word' + ">" + pInner + "</p><input type='text' value='" + pInner +"'/>"
        createFile.innerHTML = inner;
		wrapUl.appendChild(createFile);
		filePosition(createFile,index);
		changeLiColor();
	})
}

//点击返回上一层，点击桌面返回桌面

(function() {
	var nav = document.querySelector('#nav');
	var prev = nav.querySelector('.prev');
	var main = nav.querySelector('.main');
	
	//点击桌面按钮，返回桌面
	main.addEventListener('click',function(e) {
		e.stopPropagation();
		hideMenu();
		view(0);
	})
	//点击返回上一级就返回上一级
	prev.addEventListener('click',function() {
		var parent = getInfo(_IP);
		if(parent) {
			view(parent.pid);
			viewCrumbsParent(parent.pid);			
		}
		if(parent.pid) {
			viewCrumbsinfo(parent.pid);
		}		
	})
})();

//不同界面的字体颜色的变化
function changeLiColor() {
	for(var i = 0; i < Element1.wrapP.length; i++) {
		if(_IP > 0) {
			Element1.wrapP[i].style.color = '#646464';
			Element1.wrapTxt[i].style.color = '#646464';
		} else {
			Element1.wrapP[i].style.color = '#fff';
			Element1.wrapTxt[i].style.color = '#fff';
		}	
	}
}

/**
   * 渲染面包屑导航当前层
   * @param  {[number]} IP [当前所在级的pid]
   * @return {[void]}          []
   */

function viewCrumbsinfo(IP) {
	var nav = document.querySelector('#nav');
	var content = nav.querySelector('.content');
	var info = getInfo(IP);
	var span = document.createElement('span');
	var span1 = document.createElement('span');
	span.innerHTML = '>';
	if(info.index) {
		span1.innerHTML = info.name + '(' + (info.index + 1) +')';
	} else {
		span1.innerHTML = info.name;
	}
	content.appendChild(span);
	content.appendChild(span1);
};

/**
   * 渲染面包屑导航当前所在层级的所有父级
   * @param  {[number]} IP [当前所在级的pid]
   * @return {[void]}          []
   */


function viewCrumbsParent(IP) {
	var nav = document.querySelector('#nav');
	var content = nav.querySelector('.content');
	content.innerHTML = '';
	var parents = getParents(IP);
	parents.forEach(function(value) {
		var crumbsParent = document.createElement('a');	
		var id = value.id;
		
		//面包屑导航点击那一层显示那一层下面的子级
		
		crumbsParent.addEventListener('click',function() {
			view(id);
			viewCrumbsParent(id);
			viewCrumbsinfo(id);
		})
		var span = document.createElement('span');
		span.innerHTML = '>';
		if(value.index) {
			crumbsParent.innerHTML = value.name + '(' + (value.index + 1) +')';
		} else {
			crumbsParent.innerHTML = value.name;
		}
		
		crumbsParent.href = 'javascript:;';
		content.appendChild(span);
		content.appendChild(crumbsParent);
	})
	
}

/**
 * 显示上下文菜单
 * @param  {[Event]} e [事件对象]
 * @param  {[Array]} menuData [要生成的菜单内容]
 * @return {[void]}          []
 */

function showContextMenu(e,menuData) {
	e.preventDefault();
	var menu = document.querySelector('#menu');
	var menuList = menu.querySelector('#menuList');
	var body = document.querySelector('body');
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	menu.style.display = 'block';
	ContextMenuContent(menuList,menuData);
	var Rect = menu.getBoundingClientRect();
	var x = document.documentElement.clientWidth - e.clientX;
	var y = document.documentElement.clientHeight - e.clientY;
	
	if(mouseX > document.documentElement.clientWidth - Rect.width) {
		menu.style.left = document.documentElement.clientWidth - css(body,'marginLeft') - Rect.width + 'px';
	} else {
		menu.style.left = mouseX - css(body,'marginLeft') + 'px';
	}
	if(y < Rect.height) {
		menu.style.top = mouseY - Rect.height - css(body,'marginTop') + 'px';
	} else {
		menu.style.top = mouseY - css(body,'marginTop') + 'px';
	}
	
};

/**
 * 显示上下文菜单里面的内容
 * @param  {[element]} ul [元素]
 * @param  {[Array]} menuData [要生成的菜单内容]
 * @return {[void]}          []
 */

function ContextMenuContent(ul,menuData) {
	var menu = document.querySelector('#menu');
	ul.innerHTML = '';
	for(var i = 0; i <　menuData.length; i++) {
		var li = document.createElement('li');
		var p = document.createElement('p');
		p.innerHTML = menuData[i].name;
		p.id = menuData[i].id;
		li.index = i;
		li.addEventListener('mousedown',function(e) {
			e.stopPropagation();
			if(menuData[this.index].callBack 
				&& typeof contextCallback[menuData[this.index].callBack] == "function") {
				contextCallback[menuData[this.index].callBack]();
				
			}	
			viewSideNav();
		});
		var _this;
		li.addEventListener('mouseover',function(e) {
			var ul1 = this.querySelector('ul');
			if(_this) {
				hideLiChild(_this);
			}
			showLiChild(this);
			var Rect = menu.getBoundingClientRect();
			if(ul1 && e.clientX > document.documentElement.clientWidth - Rect.width) {
				css(ul1,"left",-Rect.width);
			}
			_this = this;
		});
		li.appendChild(p);
		if(menuData[i].child) {
			var ul1 = document.createElement('ul');
			ul1.id = 'childShow';
			ContextMenuContent(ul1,menuData[i].child);
			li.appendChild(ul1);
		};		
		ul.appendChild(li);
	}
};


/**
 * 下级菜单的显示隐藏函数
 * @param  {[element]} _this [当前要操作的元素]
 * @return {[void]}          []
 */

function showLiChild(_this) {
	if(_this.children[1]) {
		_this.children[1].style.display = 'block';
	}
};

function hideLiChild(_this) {
	if(_this.children[1]) {
		_this.children[1].style.display = 'none';
	}
};

//隐藏菜单
function hideMenu() {
	var menu = document.querySelector('#menu');
	menu.style.display = 'none';
}

//取消文件夹选中
function removeActive() {
	var allLi = wrap.getElementsByTagName('li');
	for(var i = 0; i < allLi.length; i++) {
		allLi[i].className = 'file';
	}
}

/**
 * 生成框选的框
 * @param  {[event]} e [事件对象]
 * @return {[void]}          []
 */

function region(e) {
	removeActive();
	var liAll = document.querySelectorAll('.file');
	var parent = document.querySelector('#region');
	var start = {x:e.clientX,y:e.clientY};
	var span = '';
	document.addEventListener('mousemove',move);
	function move(e) {
		var now = {x:e.clientX,y:e.clientY}
		var x = now.x>start.x?start.x:now.x;
		var y = now.y>start.y?start.y:now.y;
		var dis = {x:now.x - start.x,y:now.y - start.y};
		console.log(dis.x)
		if(Math.abs(dis.x)<5||Math.abs(dis.y)<5) {
			isMove = false;
			return
		}
		isMove = true;
		if(span == '') {
			span = document.createElement('span');
			span.className = 'rectangle';
			span.style.position = 'absolute';
		}
		css(span,'width',Math.abs(dis.x));
		css(span,'height',Math.abs(dis.y));
		css(span,'left',x - css(body,'marginLeft'));
		css(span,'top',y - css(body,'marginTop'));
		for(var i = 0; i < liAll.length; i++) {
			if(getCollide(span,liAll[i])) {
				liAll[i].classList.add('active');
			} else {
				liAll[i].classList.remove('active');
			}
		}
		parent.appendChild(span);
	}
	document.addEventListener('mouseup',up);
	function up(e) {
		if(parent.children[0]) {
			parent.removeChild(span);
		}

		document.removeEventListener('mousemove',move);

		document.removeEventListener('mouseup',up);

	}
	
}

/**
 * 检测是否碰撞
 * @param  {[element]} el [元素]
 * @param  {[element]} el2 [元素]
 * @return {[boolean]}        []
 */

function getCollide(el,el2){
	var rect = el.getBoundingClientRect();
	var rect2 = el2.getBoundingClientRect();
	if(rect.right < rect2.left
	||rect.left > rect2.right
	||rect.bottom<rect2.top
	||rect.top>rect2.bottom){
		return false;
	}
	return true;
}

/**
 * 窗口大小发生变化时位置改变          []
 */

window.addEventListener('resize',function() {
	var liAll = document.querySelectorAll('.file');
	var rub = document.querySelector('#rub');
	for(var i = 1; i < liAll.length; i++) {
		filePosition(liAll[i],i);
	}
});


/**
 * 文件的定位函数
 * @param  {[element]} el [元素]
 * @param  {[number]} index [在数据数组里是第几位]
 * @return {[void]}          []
 */

function filePosition(el,index) {
	var rub = document.querySelector('#rub');
	var body = document.querySelector('body');
	var ratio = Math.floor((document.documentElement.clientHeight - css(body,'marginTop'))/(rub.clientHeight+15));
	el.style.left = 25 + 110*(parseInt((index+1)/ratio)) + 'px';
	el.style.top = 103*((index+1)%ratio) + 'px';
}

//时钟及日历

(function() {
	var time = document.querySelector("#time");
	var nub = 0;
	setInterval(goRound,500);
	for(var i = 0; i < 60 ; i++) {
		time.innerHTML += '<span style="transform:rotate(' + i * 6 + 'deg)"></span>';
	}
	
	function goRound() {
		var date = new Date();
		var seconds = date.getSeconds();
		var minute = date.getMinutes() + seconds / 60;
		var hours = date.getHours() + minute / 60;;
		Element1.pointer[0].style.transform = 'rotate(' + hours * 30 + 'deg)';
		Element1.pointer[1].style.transform = 'rotate(' + minute * 6 + 'deg)';
		Element1.pointer[2].style.transform = 'rotate(' + seconds * 6 + 'deg)';
	}
	
	var dateTime = document.querySelector('#dateTime');
	var tbody = dateTime.querySelector("tbody");
	var sele = dateTime.querySelectorAll("select");
	var p = dateTime.querySelector("p");
	var date = new Date();
	var arrDay = ['日','一','二','三','四','五','六']
		
	setInterval(function go() {
		date = new Date();
		p.innerHTML = date.getFullYear() + "年" + (date.getMonth() + 1) + '月' + date.getDate() + '日' + addZero(date.getHours()) + '时' + addZero(date.getMinutes()) + '分' + addZero(date.getSeconds()) + '秒' + "  " + '星期' + Day2Upper(date.getDay());
		function addZero(index) {
			return index < 10?('0' + index):index;
		}
		function Day2Upper(day) {
			return day = arrDay[day];
		}
		
	},50);
	//自动生成select
	for(var i = 2000; i < 2020; i++) {
		if(i == date.getFullYear()) {
			sele[0].innerHTML = '<option selected>' + i + '</option>' + sele[0].innerHTML;
		} else {
			sele[0].innerHTML = '<option>' + i + '</option>' + sele[0].innerHTML;
		}
	}
	for(var i = 0; i < 12; i++) {
		if(i == date.getMonth()) {
			sele[1].innerHTML = '<option selected>' + (i + 1) + '</option>' + sele[1].innerHTML;
		} else {
			sele[1].innerHTML = '<option>' + (i + 1) + '</option>' + sele[1].innerHTML;
		}
	}
	var sele0 = sele[0].value;
	var sele1 = sele[1].value;
	var allDay = getAllDay(sele[0].value,sele[1].value - 1); 
	var lastAllDay = getAllDay(sele[0].value,sele[1].value ); 
	var Day = getFirstDay(sele[0].value,sele[1].value - 1);
	tab();
	//获取select变化后的值
	sele[0].onchange = function() {
		allDay = getAllDay(sele[0].value,sele[1].value - 1);
		Day = getFirstDay(sele[0].value,sele[1].value - 1);
		tab();
	};
	sele[1].onchange = function() {
		allDay = getAllDay(sele[0].value,sele[1].value - 1);
		Day = getFirstDay(sele[0].value,sele[1].value - 1);
		tab();
	};

	//得到某个月总共有多少天
	function getAllDay(year,month) {
		var newDate =　new Date(year,month+1,1,-1,0,0).getDate();
		return newDate;
	}
	
	function tab() {
		//生成日期内容
		var html = "";
		var nub = Day;
		var num = 0;
		for(var i = 1; i <= 42; i++) {
			if(i%7 == 1) {
				html += '<tr>';
			}
			if(i <= Day) {
				nub--;
				html += '<td>' + (lastAllDay - nub) + '</td>';
			} else if ((i - Day) > allDay){
				num++;
				html += '<td>' + num + '</td>';
			} else {
				html += '<td>' + (i - Day) + '</td>';//把i减去每个月的一号是礼拜几，让1对应正确的位置
			}
			if(i%7 == 0) {
				html += '</tr>';
			}
		}
		tbody.innerHTML = html;
		
		//使周六和周日的字体变红
		var td = document.getElementsByTagName("td");
		for(var i = 1; i <= 42; i++) {
			if(i%7 == 0 || i%7 == 1) {
				td[i-1].style.color = 'red';
			}
			if(i <= Day) {
				td[i-1].style.color = '#ccc';
			} else if ((i - Day) > allDay) {
				td[i-1].style.color = '#ccc';
			} else if (sele[0].value == date.getFullYear() && 
				       sele[1].value == date.getMonth() + 1 &&
				       i - Day == date.getDate()
			) {
				td[i-1].style.backgroundColor = '#F1F5FB';
			}
		}		
	}
	
	//得到这个月的1号是礼拜几
	function getFirstDay(year,month) {
		var getDay = new Date(year,month,1).getDay();
		return getDay;
	}
	
	//设置外部显示的时间
	
	var boxImage = document.querySelector("#boxImage");
	var dateT = boxImage.getElementsByClassName("date");
	var weekI = boxImage.getElementsByClassName("week"); 
	var time = 0;
	
	boxImage.addEventListener('click',function(e) {
		e.stopPropagation();
		startMove({
			el:Element.dateWrap,
			target:{
				top:0
			},
			type:'linear',
			time:500
		})
	})
	
	var imgB = [
		"img/images/0.png",
		"img/images/1.png",
		"img/images/2.png",
		"img/images/3.png",
		"img/images/4.png",
		"img/images/5.png",
		"img/images/6.png",
		"img/images/7.png",
		"img/images/8.png",
		"img/images/9.png"
	];
	var weekUrl = [
		"img/images/seven.png",
		"img/images/one.png",
		"img/images/two.png",
		"img/images/three.png",
		"img/images/four.png",
		"img/images/five.png",
		"img/images/six.png"
	];
	
	go();
	time = setInterval(go,100);
	function go() {
		var date = new Date();
		var year = date.getFullYear();
		var month = toBg(date.getMonth() + 1);
		var day = toBg(date.getDate());
		var week = date.getDay();
		var minutes = toBg(date.getMinutes());
		var seconds = toBg(date.getSeconds());
		var hours = toBg(date.getHours());
		var sumAll = year + month + day + hours + minutes + seconds;
		
		for(var i = 0; i < dateT.length; i++) {
			dateT[i].src = imgB[sumAll[i]];
			if(dateT[i].now != sumAll[i]) {
				change(i);
			}
			dateT[i].now = sumAll[i];
		}
		function change(index) {
			startMove({
				el:dateT[index],
				target: {
					height: 0
				},
				type: "linear",
				time: 200,
				callBack: function() {
					startMove({
						el:dateT[index],
						target:{
							height: 28
						},
						type: "linear",
						time: 200
					})
				}
			})
		}
		
	}
	
	function toBg(nub) {
		return nub < 10?"0" + nub:"" + nub;
	}
})();














