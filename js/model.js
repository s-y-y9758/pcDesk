//数据操作的函数

var _IP = 0;

//获取子级
function getChildren(id) {
	return data.list.filter(function(value) {
		return value.pid == id
	})
}

//获取自己的数据（自己是当前显示页面的父级）
function getInfo(id) {
	return data.list.filter(function(value) {
		return value.id == id;
	})[0];
}

/**
 * 根据当前传入的id，获取此id的数据
 * @param  {[number]} id [当前文件的id]
 * @return {[array]}          []
 */

function info(id) {
	var nowInfo = [];
	for(var i = 0; i < id.length; i++) {
		data.list.forEach(function(value) {
			if(Number(value.id) == id[i].id) {
				nowInfo.push(value);
			}
		});
	}
	return nowInfo;
};

//根据info的数据找到父级
function getParent(id) {
	var info = getInfo(id);
	if(info) {
		return getInfo(info.pid);
	}	
}

//获取所有父级
function getParents(id) {
	var parents = [];
	var parentInfo = getParent(id);
	if(parentInfo) {
		parents.push(parentInfo);
		var more = getParents(parentInfo.id);
		parents = more.concat(parents);
	}
	return parents;
}


//树结构导航

function viewSideNav() {
	var navSide = document.querySelector('#navSide');
	var list = navSide.querySelector('ul');
	var all = getAllChildren(0);
	list.innerHTML = '';
	all.forEach(function(value) {
		var kong = '';
		var icon = '';
		for(var i = 0; i < value.level; i++) {
			 kong += '&nbsp;&nbsp;&nbsp;';
		}
		if(getChildren(value.id).length != 0) {
			icon = '<span>▽</span>';
		}
		var name = kong + icon + '&nbsp;' + value.name;
		var li = document.createElement('li');
		li.setAttribute('id',value.id);
		li.addEventListener('click',function() {
			view(li.getAttribute('id'))
		})
		li.style.color = '#fff';
		li.setAttribute('level',value.level);
		li.innerHTML = name;
		list.appendChild(li);
	})
	
}

/**
 * 获取所有子级
 * @param  {[number]} id [当前显示页面的父级]
 * @return {[Array]} allChildren   [所有子级]
 */

function getAllChildren(id,level) {
	var level = level || 0;
	var children = getChildren(id);
	var item = [];
	
	children.forEach(function(value) {
		value.level = level;
		item.push(value);
		item = item.concat(getAllChildren(value.id,level+1));
	})
	
	return item;
}

/**
 * 深度克隆当前传入的数组
 * @param  {[array]} beCopyChildren [被克隆的数组]
 * @return {[Array]}    [克隆出的新数组]
 */

function copying(beCopyChildren) {
	var copyingArr = Array.isArray(beCopyChildren)?[]:{};
	for(var property in beCopyChildren) {	
		if(typeof beCopyChildren[property] == 'object') {
			copyingArr[property] = copying(beCopyChildren[property])
		} else{
			copyingArr[property] = beCopyChildren[property];
		}
	}
	return copyingArr;
};


/**
   * 根据元素的id找到data里相应id的数据在第几位
   * @param  {[number]} id [id]
   * @return {[Array]}   arrIdIndex  [数组里是number]
   */

function getDataFromElId(id) {
	var arrIdIndex = [];
	data.list.forEach(function(value,index) {
		if(value.id == id) {
			arrIdIndex.push(index);
		}
	})
	return arrIdIndex;
}

/**
 * 获取当前最大id
 * @param  {[Array]} dataList [要生成的菜单内容]
 * @return {[Number]} maxId+1   [比对象里的ID大1]
 */
function getId(dataList) {
	var maxId = 0;
	dataList.forEach(function(value,index) {
		if(maxId < value.id) {
			maxId = value.id;
		}
	})
	return maxId+1;
}

