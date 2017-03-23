// JavaScript


//*************************************************************************
//iE8 getElementsByClassName兼容方法
//*************************************************************************
function getElementsByClassName(ele, name) {
  //   先检测是否支持原生的getElementsByClassName
  if(ele.getElementsByClassName) {
    return ele.getElementsByClassName(name);
  } else {
    //     如果不支持就通过getElementsByTagName匹配所有标签，默认在目标元素下查找
    var children = (ele || document).getElementsByTagName("*");
    //     定义一个空数组，用于后续储存符合条件的元素
    var elements = [];
    //     第一次通过byTagName循环遍历目标元素下的所有元素
    for(var i = 0; i < children.length; i++) {
      var child = children[i];
      //       通过空格分隔元素的class名称
      var classNames = child.className.split(" ");
      //       再次循环遍历元素的className
      for(var j = 0; j < classNames.length; j++) {
        //         类名和传入的class相同时，通过push推到之前新建的空数组里
        if(classNames[j] === name) {
          elements.push(child);
          //           找到后就跳出循环
          break;
        }
      }
    }
    //     最后返回数组
    return elements;
  }
}




//***************************************************************************
//1.1 关闭顶部通知条
//点击顶部通知条中的“X 不再提醒”后，刷新页面不再出现此通知条（使用本地cookie实现）
//检查cookie,隐藏通知栏，并设置cookie,
//***************************************************************************

//检查cookie,隐藏通知栏，并设置cookie,
function popup() {   
    var oPopup = document.getElementById('j-display');
    var oBtn = oPopup.getElementsByTagName('p')[1];
    if ( getCookie('Off')) {
        oPopup.style.display = 'none';
    }
    else{
    oBtn.onclick = function () {
        oPopup.style.display = 'none';
        setCookie('Off', true, 36500 );
        };
    }
}
popup();

//设置cookie
function setCookie (key, value, t) {  
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t);
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

//获取cookie
function getCookie (key) {  
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if(arr2[0] === key ){
            return decodeURI(arr2[1]);
        }
    }
}

//删除cookie
function removeCookie (key) {  
  setCookie(key,'',-1); 
}

// 设置参数
function serialize (data) {  
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
 
 //get方法
function get(url,options,callback){  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert("request failed : " + xhr.status);
            }
        }
    };
    xhr.open("get",url + "?" + serialize(options),true);
    xhr.send(null);
}



//***********************************************************************************************************
//1.2 关注“网易教育产品部”登陆部分                                                                             
//点击关注按钮：首先判断登录的cookie是否已设置（loginSuc）                                                       
//如果未设置登录cookie，则弹出登录框，使用给定的用户名和密码（需要表单验证）调用服务器Ajax登录，成功后设置登录cookie  
//登录成功后，调用关注API，并设置关注成功的cookie（followSuc）                                                     
//登录后“关注”按钮变成不可点的“已关注”状态。按钮的hover效果见视觉稿
//************************************************************************************************************
 
//登录 
function login(){    
 var oLogin = document.getElementById('j-login');
 var oAttention = document.getElementById('j-input');
 var oPopuplog = getElementsByClassName(oLogin,'m-popuplog');
 var oClose = getElementsByClassName(oLogin,'close');
 var oInput = oLogin.getElementsByTagName('input');
 var oLabel = oLogin.getElementsByTagName('label');
 var oButton = getElementsByClassName(oLogin,'submit');
 var oCancel = getElementsByClassName(oLogin,'cancel');
 var prompt = document.getElementById('prompt');



 //用户名输入框失去焦点开始验证
  function focus(i){ 
    oInput[i+1].onfocus = function(){

      oLabel[i].style.display = 'none';};
    oInput[i+1].onblur = function(){
      if(this.value ===''){
        oLabel[i].style.display = 'block';
      }else if(this.value.length> 3 && this.value.length < 12){
          prompt.innerHTML = '用户名符合';
          prompt.style.color = '#189f36';
      }else {
          prompt.innerHTML = '用户名不合法！请输入3-12位用户名！';
          prompt.style.color = '#f00';
          }

    }
  }
  focus(0);


  //密码输入框失去焦点开始验证
  function focus1(i){ 
    oInput[i+1].onfocus = function(){

      oLabel[i].style.display = 'none';};
    oInput[i+1].onblur = function(){
      if(this.value ===''){
        oLabel[i].style.display = 'block';
      }else if(this.value.length > 6 ) {
        prompt.innerHTML = '密码符合';
        prompt.style.color = '#189f36';
      }else{
        prompt.innerHTML = '密码不符合！请输入6位以上密码！';
        prompt.style.color = '#f00';
      }

    }
  }
  focus1(1);

  
//关闭登录框
  oClose[0].onclick = function(){ oPopuplog[0].style.display = 'none'; };  
 
//判断登录的 cookie 是否已设置 
  if( !getCookie ('loginSuc') ){   
    oAttention.onclick = function(){ 
      oPopuplog[0].style.display = 'block';
    };
  }else{
    oAttention.value = '以关注';
    oAttention.disabled = false;
    oAttention.className = 'active f-fl';
    oCancel[0].style.display = 'block';
  }
    
//点击登录 
  oButton[0].onclick = function(){   
    var userName1 = hex_md5(oInput[1].value);
    var password1 = hex_md5(oInput[2].value);
    get('http://study.163.com/webDev/login.htm',{userName:userName1,password:password1},function(a){ 
      if( a === '1' ){
        oPopuplog[0].style.display = 'none';
        setCookie ('loginSuc', '1', 36500);
        get('http://study.163.com/webDev/attention.htm','', function(b){
          if( b === '1' ){
            setCookie ('followSuc', '1', 36500);
            oAttention.value = '以关注';
            oAttention.disabled = true;
            oAttention.className = 'active f-fl';
            oCancel[0].style.display = 'block';
          }
          
        })
        
      }else if(oInput[1].value ==='' || oInput[2].value ===''){
         oPopuplog[0].style.display = 'block';
         prompt.innerHTML = '用户名或密码不能为空！';
         prompt.style.color = '#f00';
      }else{
        alert( '帐号密码错误，请重新输入')
      }
     });
  };

//取消关注
  oCancel[0].onclick = function(){  
    setCookie('followSuc','',-1);
    setCookie('loginSuc','',-1);
    oAttention.value = '关注';
    oAttention.disabled = false;
    oAttention.className = 'attention f-fl f-csp';
    this.style.display = 'none';
  };
  
}
login();

//********************************************************************
//1.4 轮播头图
//三张轮播图轮播效果：实现每5s切换图片，图片循环播放；鼠标悬停某张图片，
//则暂停切换；切换效果使用入场图片500ms淡入的方式。点击后新开窗口打开目的页
//面，对应的跳转链接如下，
//banner1
//banner2
//banner3
//********************************************************************

//轮播
function slide(){   
    var oBanner = document.getElementById('j-slide');
    var oLink = oBanner.getElementsByTagName('a')[0];
    var oImg = oBanner.getElementsByTagName('img')[0];
    var oUl = oBanner.getElementsByTagName('ul')[0];
  var aLi = oBanner.getElementsByTagName('li');
    var data = [
        { link: 'http://open.163.com/' , src : '网易教育产品部_files/images/banner1.jpg' },
        { link: 'http://study.163.com/' , src : '网易教育产品部_files/images/banner2.jpg' },
        { link: 'http://www.icourse163.org/' , src : '网易教育产品部_files/images/banner3.jpg' }
    ];
  
//初始化 
    for (var i = 0; i < data.length; i++) { 
        var oLi = document.createElement('li');
        var aNum = document.createTextNode(i+1);
    var num = 0;
        oUl.appendChild(oLi);
        oLi.appendChild(aNum);
        oLink.href = data[0].link;
        oImg.src = data[0].src;
    aLi[0].className = 'active';
    //初始化结束
    aLi[i].index = i;

//控制点函数
    aLi[i].onclick =function(){   
      num = this.index;
      slideshow(this.index);
    };
  }
  var oWindow = document.body.clientWidth;
  oUl.style.left = ( oWindow -  20 * aLi.length)/2 + 'px';
  window.onresize = function(){ 
    oWindow = parseFloat(document.body.clientWidth);
    oUl.style.left = ( oWindow -  20 * aLi.length)/2 + 'px';
  };
  
//轮播函数
  function slideshow(index){   
    oImg.style.opacity = 0;
    oImg.style.transition = ''; 
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].className = '';
      }
    oLink.href = data[index].link;
    oImg.src = data[index].src;
    aLi[index].className = 'active';
    setTimeout( function  () {
      oImg.style.transition = '0.5s';
      oImg.style.opacity = 1;
    },30);
  }

//每5S变化一次
  function autoplay(){   
        timer = setInterval(
            function(){
                num = (num+1)%aLi.length;
                slideshow(num);
            },5000);
    }

//鼠标移入暂停
  oBanner.onmouseover = function(){  
        clearInterval(timer);
    };

//鼠标移除恢复
    oBanner.onmouseout = function(){  
        autoplay();
    };
    autoplay();
}
slide();

//获取样式
function getStyle (obj,attr) {  
        if( obj.currentStyle ){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj)[attr];
        }
    }



//向左循环滚动图片
var scrollImg = document.getElementById('clearfix'),
  speed = -2;
scrollImg.innerHTML += scrollImg.innerHTML;

function scroll() {
  //复位          
  if(scrollImg.offsetLeft < -scrollImg.offsetWidth / 2) {
    scrollImg.style.left = '0';

  }
  //设置滚动

  scrollImg.style.left = scrollImg.offsetLeft + speed + 'px';
}
//计时器
var timeScroll = setInterval(scroll, 30)

//鼠标事件
scrollImg.onmouseover = function() {
  clearInterval(timeScroll);
}
scrollImg.onmouseout = function() {
  timeScroll = setInterval(scroll, 30);
}


//*********************************************************************
//1.6 查看课程详情
//鼠标悬停“产品设计”或“编程语言”tab下的任意课程卡片，出现浮层显示该课
//程的课程详情；鼠标离开课程详情浮层，则浮层关闭。课程卡片即详情浮层的效果见视
//觉稿，课程卡片及详情数据见本文档的数据接口列表
//*********************************************************************


//ajax封装
//浏览器添加事件
//设置CSS
function getStyle(obj, name) {
  if(obj.currentStyle) {
    return obj.currentStyle[name];
  } else {
    return getComputedStyle(obj, false)[name];
  }
}
//ajax封装
//浏览器添加事件
function addEvent(obj, type, fn) {
  if(obj.addEventListener) {
    obj.addEventListener(type, fn, false)
  } else if(obj.attachEvent) {
    obj.attachEvent("on" + type, fn);
  }
}

//跨浏览器移除事件
function removeEvent(obj, type, fn) {
  if(obj.removeEventListener) {
    obj.removeEventListener(type, fn, false);
  } else if(obj.detachEvent) {
    obj.detachEvent("on" + type, fn);
  }
}

//XHR支持检测
function createXHR() {
  if(typeof XMLHttpRequest != "undefined") {
    return new XMLHttpRequest();
  } else if(typeof ActiveXObject != "undefined") {
    var version = [
      "MSXML2.XMLHttp.6.0",
      "MSXML2.XMLHttp.3.0",
      "MSXML2.XMLHttp"
    ];
    for(var i = 0; version.length; i++) {
      try {
        return new ActiveXObject(version[i]);
      } catch(e) {
        //跳过
      }
    }
  } else {
    throw new Error("您的系统或浏览器不支持XHR对象！");
  }
}
//名值对转换为字符串
function params(data) {
  var arr = [];
  for(var i in data) {
    arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
  }
  return arr.join("&");
}

//封装ajax
function ajax(obj) {
  var xhr = createXHR();
  //url拼接
  obj.url = obj.url + "?rand=" + Math.random();
  obj.data = params(obj.data);

  if(obj.method === "get") obj.url += obj.url.indexOf("?") == -1 ? "?" + obj.data : "&" + obj.data;

  if(obj.async === true) {
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        callback();
      }
    };
  }
  xhr.open(obj.method, obj.url, obj.async);

  if(obj.method === "post") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(obj.data);
  } else {
    xhr.send(null);
  }
  if(obj.async === false) {
    callback();
  }

  function callback() {
    if(xhr.status == 200) {
      obj.success(xhr.responseText); //回调传递参数
    } else {
      console.log("获取数据错误！错误代码：" + xhr.status + "，状态信息：" + xhr.statusText);
    }
  }
}



//课程数据获取

//pageNo页码 type课程分类 psize总条数
function contenrAjax(pageNo, type, psize) {
  ajax: ajax({
    method: "get", //传输方式
    url: "http://study.163.com/webDev/couresByCategory.htm", //url地址
    data: { //传的参数
      "pageNo": pageNo, //页数
      "psize": psize, //条数
      "type": type //课程类型 10设计 20编程
    },
    success: function(text) {
      contenrObj = JSON.parse(text);
      JsonObj = contenrObj.list;
      //储存课程下标
      var jsonArr = [],
        contenrHtml = '';

      for(var i = 0; i < JsonObj.length; i++) {
        jsonArr = [i];
        //遍历下标
        for(var j = 0; j < jsonArr.length; j++) {
          //免费价格处理
          JsonObj[i].price == 0 ? JsonObj[i].price = '免费' : JsonObj[i].price = '￥' + JsonObj[i].price.toFixed(2);

          contenrHtml += '<li class="kc-list">\
                <a href="' + JsonObj[i].providerLink + '" target="_blank">\
                  <div class="kc">\
                    <div class="l-img"><img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" /></div>\
                    <div class="l-txt">\
                      <h3 class="">' + JsonObj[i].name + '</h3>\
                      <h4 class="">' + JsonObj[i].provider + '</h4>\
                      <span class="span-1"><i class="learnerCount">' + JsonObj[i].learnerCount + '</i></span>\
                      <span class="span-2"><i class="Listprice">' + JsonObj[i].price + '</i></span>\
                    </div>\
                  </div>\
                  <div class="kc-hover" >\
                    <div class="kc-hover-top">\
                      <div class="kc-hover-img">\
                      <img class="middlePhotoUrl" src="' + JsonObj[i].middlePhotoUrl + '" alt="' + JsonObj[i].name + '" />\
                      </div>\
                      <dl>\
                        <h3 class="ListName">' + JsonObj[i].name + '</h3>\
                        <dt><p><span class="learnerCount">' + JsonObj[i].learnerCount + '</span>在学</p></dt>\
                        <dd>\
                          <p>发布者：<span class="provider">' + JsonObj[i].provider + '</span></p>\
                        </dd>\
                        <dd>\
                          <p>分类：<span class="">' + JsonObj[i].provider + '</span></p>\
                        </dd>\
                      </dl>\
                    </div>\
                    <div class="kc-hover-txt">\
                      <p class="description">\
                        ' + JsonObj[i].description + '\
                      </p>\
                    </div>\
                  </div>\
                </a>\
              </li>';
          contenrList.innerHTML = contenrHtml;
          contenrPop();
        }

      }
      function contenrPop(){
        //课程鼠标悬停弹出课程详情
      var contenrLi = getElementsByClassName(contenrList, 'kc-list'),
        contenrHover = getElementsByClassName(contenrList, 'kc-hover'),
         hoverindex = 0;
        
      for(var i = 0; i < contenrLi.length; i++) {
        contenrLi[i].index = i;
        //鼠标移入
        contenrLi[i].onmouseenter = function() {
            hoverindex = this.index;
            for(var i = 0; i < contenrLi.length; i++) {
              contenrHover[i].style.display = 'none';
            }
            //课程弹出延时
            setTimeout(function() {
              if(document.body.offsetWidth <= 1205) {
              contenrHover[hoverindex].style.display = 'inline-block';
            }else{
              contenrHover[hoverindex].style.display = 'block';
            }
            }, 100);

          }
          //鼠标移开
        contenrLi[i].onmouseleave = function() {
          contenrHover[hoverindex].style.display = 'none';
        }

      }
      }
      

    },

    async: true //同步方式，true异步, false不是异步
  });

}



//翻页
var contenrList = document.getElementById('contenr-l-list'),
  pageDiv = document.getElementById('page'),
  pageLi = pageDiv.getElementsByTagName('li'),
  pageUp = document.getElementById('page-up'),
  pageDown = document.getElementById('page-down');
  

 
//翻页函数
function coursePage(page, type) {
  var now = 0;
  for(var i = 0; i < pageLi.length; i++) {
    pageLi[i].index = i;
 
    //默认进来是第一页码
    pageLi[now].className = 'active-page';

    //切换课程分类页码重置
    var page = pageLi[i].className = '';
    pageLi[i].onclick = function() {
      var type = 10,
        psize = 20;
      now = this.index;
      for(var i = 0; i < pageLi.length; i++) {
        pageLi[i].className = '';
      }

      //选中class
      pageLi[now].className = 'active-page';

      //判断当前停留在哪个分类
      design.className == 'active-checked' ? type = 10 : type = 20;
      document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

      contenrAjax(now + 1, type, psize);
      return pageNow = now;
    }
    var pageNow = '';

    //下一页
    pageDown.onclick = function() {
      pageNow++;

      for(var i = 0; i < pageLi.length; i++) {
        pageLi[i].className = '';
      }
      if(pageNow >= 7) {
        pageLi[7].className = 'active-page';
      } else {
        pageLi[pageNow].className = 'active-page';
      }

      //判断当前停留在哪个分类
      design.className == 'active-checked' ? type = 10 : type = 20;

      document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

      contenrAjax(pageNow + 1, type, psize);
      return pageNow;
    }

    //上一页
    pageUp.onclick = function() {
      pageNow--;

      for(var i = 0; i < pageLi.length; i++) {
        pageLi[i].className = '';
      }
      if(pageNow <= 0) {
        pageLi[0].className = 'active-page';
        pageNow = 0;
      } else {
        pageLi[pageNow].className = 'active-page';
      }

      //判断当前停留在哪个分类
      design.className == 'active-checked' ? type = 10 : type = 20;
      document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

      contenrAjax(pageNow + 1, type, psize);
      return pageNow;
    }

  }

}
coursePage();


contenrAjax(1, 10, 20);
//切换课程
var design = document.getElementById('tab-1'),
  programme = document.getElementById('tab-2');

function contenrTab() {
  var psize = 20;
  design.onclick = function() {
    document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

    //切换课程类型
    contenrAjax(1, 10, psize);
    //调整页码相关
    // 1为初始化页码位置 10设计分类
    coursePage(1, 10);
    design.className = 'active-checked';
    programme.className = '';

  }
  programme.onclick = function() {
    document.body.offsetWidth < 1205 ? psize = 15 : psize = 20;

    //切换课程类型
    contenrAjax(1, 20, psize);
    //调整页码相关
    // 1为初始化页码位置 20编程分类
    coursePage(1, 20);
    design.className = '';
    programme.className = 'active-checked';

  }
}
contenrTab();


//检测大小屏幕兼容ie8

var minCss = document.getElementById('minW');
if(document.body.offsetWidth <= 1205) {

  minCss.href = 'css/min-1025.css';
  //课程加载每页15条
  contenrAjax(1, 10, 15);

} else {
  //默认加载课程列表，1为页码 10课程分类
  //课程加载每页20条
  contenrAjax(1, 10, 20);
}

var timerBody;
timerBody = setInterval(function() {
  if(document.body.offsetWidth <= 1205) {
    minCss.href = '网易教育产品部_files/c1.css';

  } else {
    minCss.href = '网易教育产品部_files/c2.css';
  }
}, 500);

window.onresize = function() {
  if(document.body.offsetWidth <= 1205) {
    //      console.log('小屏');
    minCss.href = '网易教育产品部_files/c1.css';
    contenrAjax(1, 10, 15);

    //    }

  } else {
    minCss.href = '网易教育产品部_files/c2.css';
    contenrAjax(1, 10, 20);

  }
}





//**********************************************************************
//1.7 右侧“机构介绍”中的视频介绍
//点击“机构介绍”中的整块图片区域，调用浮层播放介绍视频。图片的hover效果
//见视觉稿，浮层中调用的播放器（不做浏览器兼容,可用html5）及视频内容接口见本文
//档的数据接口列表
//**********************************************************************

//弹出视频层
function playvideo(){  
   var oList = document.getElementById('j-list');
   var oTrigger = getElementsByClassName(oList,'trigger');
   var oPopupvideo = getElementsByClassName(oList,'popupvideo');
   var oClose = getElementsByClassName(oList,'close');
   var myVideo = oList.getElementsByTagName('video')[0];
   oTrigger[0].onclick = function(){
     oPopupvideo[0].style.display = 'block';
   };
   oClose[0].onclick = function(){
     oPopupvideo[0].style.display = 'none';
     myVideo.pause();
   };
   
 }
playvideo();


//*******************************************************************
//1.8 右侧“热门推荐”
//实现每次进入或刷新本页面，“热门推荐”模块中，接口返回20门课程数据，默认
//展示前10门课程，隔5秒更新一门课程，实现滚动更新热门课程的效果。课程数据接
//口见本文档的数据接口列表
//*******************************************************************

//设置热门列表数据
function setList(){  
  var oList = document.getElementById('j-list');  
  var oListwrap = getElementsByClassName(oList, 'm-wrap2');
  get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
    var arr = JSON.parse(data);
    for( var i=0; i<20; i++){
      var oA = document.createElement('a');
      oA.innerHTML += '<div> <img src="' + arr[i].smallPhotoUrl + '" /> </div> <p>' + arr[i].name + '</p> <span>' + arr[i].learnerCount + '</span> </a>';
      //oA.innerHTML += '<div> <a href= "' + arr[i].providerLink +'" target="_blank">';
      oA.href=''+ arr[i].providerLink +'';
      oA.target='_blank';
      oListwrap[0].appendChild(oA); 
    }
  });
}
setList();

//热门列表滚动
function change(){  
  var oList = document.getElementById('j-list');  
  var oListwrap = getElementsByClassName(oList, 'm-wrap2');
  var oListbox = getElementsByClassName(oList, 'm-list');
  var timer;
    function autoplay(){
    timer = setInterval(function(){
      if( oListwrap[0].style.top == '-700px'){
        oListwrap[0].style.top = 0;
      }
      else{
        oListwrap[0].style.top = parseFloat(getStyle(oListwrap[0],'top')) - 70 + 'px';
        }
    },5000);
    }
    autoplay();
  oListbox[0].onmouseover = function(){
    clearInterval( timer );
    };
  oListbox[0].onmouseout = function(){
    autoplay();
    };
}
change();
  