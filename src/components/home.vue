<template>
  <div>
    <!--标题-->
    <div class="header">
      <!--菜单 需加上mescroll-touch-x,原因: http://www.mescroll.com/qa.html#q10 -->
      <div class="scrollx mescroll-touch-x">
        <div id="scrollxContent" class="scrollx-content">
          <ul id="nav" class="nav">
            <li class="active" i="0" @click="clickChangePage(0)">首页</li>
            <li i="1" @click="clickChangePage(1)">分页一</li>
            <li i="2" @click="clickChangePage(2)">分页二</li>
            <li i="3" @click="clickChangePage(3)">分页二</li>
            <li i="4" @click="clickChangePage(4)">分页二</li>
          </ul>
        </div>
      </div>

    </div>

    <!--轮播-->
    <div id="swiper" class="swiper-container">
      <div id="swiperWrapper" class="swiper-wrapper">

        <!--首页-->
        <div id="mescroll0" class="swiper-slide mescroll">
          <ul id="dataList0" class="data-list">
            <li>显示测试1</li>
            <li>显示测试1</li>
            <li>显示测试1</li>
            <li>显示测试1</li>
            <li>显示测试1</li>
            <li>显示测试1</li>
            <li>显示测试1</li>
          </ul>
        </div>

        <!--奶粉-->
        <div id="mescroll1" class="swiper-slide mescroll">
          <ul id="dataList1" class="data-list">
          </ul>
        </div>

        <!--面膜-->
        <div id="mescroll2" class="swiper-slide mescroll">
          <ul id="dataList2" class="data-list"> </ul>
        </div>

        <!--图书-->
        <div id="mescroll3" class="swiper-slide mescroll">
          <ul id="dataList3" class="data-list"> </ul>
        </div>

        <!--果汁-->
        <div id="mescroll4" class="swiper-slide mescroll">
          <ul id="dataList4" class="data-list"> </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import "./../assets/css/mescroll.min.css"
  import "./../assets/css/swiper-3.3.1.min.css"

  import $ from "jquery"

  import MeScroll from "./../../node_modules/mescroll.js/mescroll.min.js"
  import Swiper from "./../../node_modules/swiper/dist/js/swiper"


  export default {
    name: "home",
    data(){
      return{
        mescrollArr:new Array(5),
        curNavIndex:0,
        swiper:{},
        curNavDom:{}
      }
    },
    mounted(){

      //当前菜单下标
      this.curNavIndex=0;

      //初始化首页
      this.mescrollArr[this.curNavIndex]=this.initMescroll(this.curNavIndex);

      console.log(this.mescrollArr);

      /*初始化轮播*/
      this.swiper=new Swiper('#swiper', {
        onTransitionEnd: (swiper)=>{
          var i=swiper.activeIndex;//轮播切换完毕的事件
          this.changePage(i);
        }
      });

      /*菜单点击事件*/
    },
    methods:{
      clickChangePage(i){
        this.swiper.slideTo(i);
      },
      changePage(i) {
        if(this.curNavIndex!=i) {
          //更改列表条件
          //curNavDom;//当前菜单项
          $("#nav li").each(function(n,dom){
            if (dom.getAttribute("i")==i) {
              dom.classList.add("active");
              this.curNavDom=dom;
            } else{
              dom.classList.remove("active");
            }
          });
          //菜单项居中动画
          var scrollxContent=document.getElementById("scrollxContent");
          var star = scrollxContent.scrollLeft;//当前位置
          var end = this.curNavDom.offsetLeft + this.curNavDom.clientWidth/2 - document.body.clientWidth/2; //居中
          this.mescrollArr[this.curNavIndex].getStep(star, end, (step,timer)=>{
            scrollxContent.scrollLeft=step; //从当前位置逐渐移动到中间位置,默认时长300ms
          });
          //隐藏当前回到顶部按钮
          this.mescrollArr[this.curNavIndex].hideTopBtn();
          //取出菜单所对应的mescroll对象,如果未初始化则初始化
          if(this.mescrollArr[i]==null){
            this.mescrollArr[i]=this.initMescroll(i);
          }else{
            //检查是否需要显示回到到顶按钮
            var curMescroll=this.mescrollArr[i];
            var curScrollTop=curMescroll.getScrollTop();
            if(curScrollTop>=curMescroll.optUp.toTop.offset){
              curMescroll.showTopBtn();
            }else{
              curMescroll.hideTopBtn();
            }
          }
          //更新标记
          this.curNavIndex=i;
        }
      },

  /*创建MeScroll对象*/
  initMescroll(index){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll("mescroll"+index, {
      //上拉加载的配置项
      up: {
        callback: this.getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
        isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          icon: "../res/img/mescroll-empty.png", //图标,默认null
          tip: "暂无相关数据~", //提示
          btntext: "去逛逛 >", //按钮,默认""
          btnClick: function(){//点击按钮的回调,默认null
            alert("点击了按钮,具体逻辑自行实现");
          }
        },
        clearEmptyId: "dataList"+index,
        toTop:{ //配置回到顶部按钮
          src : "../res/img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
          //offset : 1000
        },
        isBounce:false
      }
    });
    return mescroll;
  },

  /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
  getListData(page){
    //联网加载数据
    var dataIndex=this.curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
    this.getListDataFromNet(dataIndex, page.num, page.size, (pageData)=>{
      //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
      //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
      //console.log("dataIndex="+dataIndex+", curNavIndex="+this.curNavIndex+", page.num="+page.num+", page.size="+page.size+", pageData.length="+pageData.length);

      //方法一(推荐): 后台接口有返回列表的总页数 totalPage
      //mescrollArr[dataIndex].endByPage(pageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

      //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      //mescrollArr[dataIndex].endBySize(pageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

      //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
      //mescrollArr[dataIndex].endSuccess(pageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

      //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
      //this.mescrollArr[dataIndex].endSuccess(pageData.length);

      //设置列表数据
      this.setListData(pageData,dataIndex);
    }, function(){
      //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
      this.mescrollArr[dataIndex].endErr();
    });
  },

  /*设置列表数据
         * pageData 当前页的数据
         * dataIndex 数据属于哪个nav */
  setListData(pageData,dataIndex){
    var listDom=document.getElementById("dataList"+dataIndex);
    for (var i = 0; i < pageData.length; i++) {
      var pd=pageData[i];

      var str=`
        <div>test1</div>
      `

      var liDom=document.createElement("li");
      liDom.innerHTML=str;
      listDom.appendChild(liDom);
    }
  },

  /*联网加载列表数据
         在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
         请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
         实际项目以您服务器接口返回的数据为准,无需本地处理分页.
         * */
  getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: 'GET',
        url: './static/pdlist1.json',
//		                url: '../res/pdlist1.json?curNavIndex='+curNavIndex+'&num='+pageNum+'&size='+pageSize,
        dataType: 'json',
        success: function(data){
          var listData=[];

          if(curNavIndex==0){
            //首页 (模拟分页数据)
            for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
              if(i==data.length) break;
              listData.push(data[i]);
            }

          }else {
            //关键词筛选模拟数据
            var keyword=["首页","测试一","测试一","测试一","测试一","测试一","测试一","测试一","测试一","测试一","测试一","测试一"];
            var curword=keyword[curNavIndex];
            for (var i = 0; i < data.length; i++) {
              if (data[i].pdName.indexOf(curword)!=-1) {
                listData.push(data[i]);
              }
            }
          }

          //回调
          successCallback(listData);
        },
        error: errorCallback
      });
    },500)
  },


    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -webkit-tap-highlight-color:transparent;
  }
  body{background-color: white}
  ul{list-style-type: none}
  a {text-decoration: none;color: #18B4FE;}

  /*模拟的标题*/
  .header{
    z-index: 9990;
    position: fixed;
    top: 0;
    left: 0;
    width: 96%;
    margin: 0 2% 0 2%;
    height: 45px;
    line-height: 16px;
    text-align: center;
    background-color: white;
    border-bottom: 1px solid #eee;
  }
  .header .btn-left{
    position: absolute;
    top: 0;
    left: 0;
    padding:12px 12px 0 12px;
  }
  .header .btn-right{
    position: absolute;
    top: 0;
    right: 0;
    padding:12px 8px;
  }
  .header .tip{
    margin-top: 4px;
    font-size: 12px;
    color: gray;
  }
  /*菜单*/
  .scrollx{
    width: 100%;
    height: 50px;
    overflow: hidden;
  }
  .scrollx-content{
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
  .nav {
    padding: 0;
  }
  .nav li{
    display: inline-block;
    padding: 22px 0px 6px 0px;
    box-sizing: border-box;
    width:19%;
    margin-bottom: 30px;/*把水平滚动条撑到外面,达到隐藏的目的*/
    vertical-align: middle;
  }
  .nav .active{
    border-bottom: 1px solid #5ab2ff;
    color: #72c2ff;
  }
  /*列表*/
  .swiper-container{
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  /*展示上拉加载的数据列表*/
  .data-list li{
    position: relative;
    padding: 10px 8px 10px 120px;
    border-bottom: 1px solid #eee;
  }
  .data-list .pd-img{
    position: absolute;
    left: 18px;
    top: 18px;
    width: 80px;
    height: 80px;
  }
  .data-list .pd-name{
    font-size: 16px;
    line-height: 20px;
    height: 40px;
    overflow: hidden;
  }
  .data-list .pd-price{
    margin-top: 8px;
    color: red;
  }
  .data-list .pd-sold{
    font-size: 12px;
    margin-top: 8px;
    color: gray;
  }
  /*隐藏*/
  .hide{display: none;}
</style>
