$(function () {
  var Theight = $(window).height() - 260;
  $(".div_any_child").height(Theight);
  // totalPage = 10;
  // currentPage = 1;
  // paging(totalPage, currentPage);
  initPagination()
  getUserListData(currentPage)
  // getPenumaticUserList()
})
var userTable = null;
var userList = []
var shuffledArray = []
const itemsPerPage = 5;
let currentPage = 1;
var dateList = [];
var painLevelList = [];
var warningTimeList = [];
var loadList = [];
var trainRecordList = []
var isSubChartDisplayed = false
var targetLoad = null;

var countList = [];
var countLoadList = [];
var planDate = [];
var weightData = [];
var weightMax = 70;
var weightScale = null;
var weight = null;
var stepData = [];





var dateListPen = []
var gloveTypeList = []
var mirrorTypeList = []
var resistanceTypeList = []
var functionTypeList = []
var gameTypeList = []
var helpTypeList = []
var stretchTypeList = []
var voiceTypeList = []
var gloveTypeRealList = []
var mirrorTypeRealList = []
var resistanceTypeRealList = []
var functionTypeRealList = []
var gameTypeRealList = []
var helpTypeRealList = []
var stretchTypeRealList = []
var voiceTypeRealList = []
var maxTime = null
var allTimeList = []
var haveRecord=null

function getUserListData(pageNum) {
  const apiUrl = 'https://pharos3.ewj100.com/palnUser/pageData';
  const params = new URLSearchParams({
    pageNum: pageNum,
    pageSize: itemsPerPage,
    macAdd: "78:f2:35:05:c6:07"
    // macAdd: "40:24:b2:ef:44:5a"

  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {

      if (data.code == 0) {
        userList = data.data.records
        console.log("Transform data", userList)
        getPenumaticUserList(pageNum)
        // userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0]
        // // 渲染用户数据到表格
        // userList.forEach((user, index) => {
        //   loadRowUser(user, index)
        // });
      }

    })
}
function getPenumaticUserList(pageNum) {
  const apiUrl = 'https://api.redadzukibeans.com/system/deviceUser/page';
  const params = new URLSearchParams({
    pageNum: pageNum,
    pageSize: itemsPerPage,
    macAdd: "40:24:b2:a9:e4:6f"
    // macAdd: "40:24:b2:aa:07:89"
  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {

      if (data.code == 200) {
        // console.log("Transform penumatic data", userList)
        userList = userList.concat(data.rows)
        console.log("Transform data", userList)
        shuffledArray = shuffleArray([...userList]); // 复制原数组，以保持原数组不变
        userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0]
        // 渲染用户数据到表格
        shuffledArray.forEach((user, index) => {
          loadRowUser(user, index)
        });
      }

    })
}
function shuffleArray(array) {//洗牌算法
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 交换元素
  }
  return array;
}
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase(); // 获取查询输入，并转为小写
    // 清空表格内容
    userTable.innerHTML = '';

    // 重新渲染用户数据到表格，根据查询词过滤数据
    userList.forEach((user, index) => {
      if (user.name.toLowerCase().includes(searchTerm)) {
        loadRowUser(user, index)
      }
    });
  });
});
function loadRowUser(user, index) {
  const row = userTable.insertRow();
  const idCell = row.insertCell(0);
  const nameCell = row.insertCell(1);
  const genderCell = row.insertCell(2);
  const ageCell = row.insertCell(3);
  const idCardCell = row.insertCell(4);
  const categoryCell = row.insertCell(5);
  const actionCell = row.insertCell(6);

  idCell.textContent = index + 1;
  nameCell.textContent = user.name;
  if (user.sex == 1) {
    genderCell.textContent = '男';
  } else {
    genderCell.textContent = "女";
  }
  if (user.macAdd == "40:24:b2:a9:e4:6f") {
    categoryCell.textContent = "手功能训练";
  } else {
    categoryCell.textContent = "动态平衡";
  }
  if (user.age.length > 3) {
    ageCell.textContent = calculateAge(user.age);
  } else {
    ageCell.textContent = user.age
  }
  idCardCell.textContent = user.idCard.substring(0, 4) + '****' + user.idCard.slice(-4);

  // actionCell.innerHTML = '<button>查看</button>';
  const planButton = document.createElement('button');
  const recordButton = document.createElement('button');
  const outButton = document.createElement('button');
  planButton.textContent = '查看计划';
  planButton.dataset.userId = user.idCard;
  planButton.className = 'btn btn-primary btn-sm'; // 应用样式类名
  recordButton.textContent = '查看记录';
  recordButton.dataset.userId = user.idCard;
  recordButton.className = 'btn btn-primary btn-sm'; // 应用样式类名
  outButton.textContent = '出院';
  outButton.dataset.userId = user.userId;
  outButton.className = 'btn btn-primary btn-sm'; // 应用样式类名
  outButton.class = 'outButton';
  planButton.dataset.toggle = 'modal';
  planButton.dataset.target = '#planModal';
  planButton.addEventListener('click', function () {
    viewPlan(user.userId, this);
  });
  recordButton.dataset.toggle = 'modal';
  recordButton.dataset.target = '#recordsModal';
  recordButton.class = 'view-records-button';
  recordButton.addEventListener('click', function () {


    if (user.macAdd == "40:24:b2:a9:e4:6f") {
      pneumaticRecord(user.idCard,this);
    } else {
      viewRecord(user.userId, this);
    }



  });
  outButton.addEventListener('click', function () {
    dischargeReq(user.userId, this);
  });
  // actionCell.appendChild(planButton);
  actionCell.appendChild(recordButton);
  actionCell.appendChild(outButton);
}





function pneumaticRecord(idCard,button) {

  $('#chartPen').show();
  $('#echartsBar').hide();
  $('#subChartContainer').hide();

  const  getChart = echarts.init(document.getElementById('chartPen'));

  const apiUrl = 'https://pharos3.ewj100.com/pneumaticRecord/getByUserId';
  const params = new URLSearchParams({
    idCard: idCard,
  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      }).then(data => {
    if (data.code === 0) {
      console.log('训练记录rsp--->', data)


      dateListPen = []
      gloveTypeList = []
      mirrorTypeList = []
      resistanceTypeList = []
      functionTypeList = []
      gameTypeList = []
      helpTypeList = []
      stretchTypeList = []
      voiceTypeList = []
      allTimeList = []

      let timeList = []
      let allTime = 0
      let list = [data.data]
      let list1 = {}
      let list2 = []
      let oneDay = {}
      let i = -1
      for (let items of list) {
        for (let value in items) {
          // console.log(value)
          // continue
          i++
          oneDay = {}
          allTime = 0
          items[value].map((item, index, arr) => {
            allTime = allTime + item.planTime
            list1['date'] = value
            if (item.planName == '手套操训练') {
              if (!oneDay.hasOwnProperty('gloveValue')) {
                gloveTypeList.push(item.planTimeDone)
              } else {
                let ele = gloveTypeList[i] + item.planTimeDone
                gloveTypeList[i] = ele
              }
              list1['gloveType'] = item
              oneDay['gloveValue'] = item.planTimeDone
            } else if (item.planName == '镜像训练') {
              if (!oneDay.hasOwnProperty('mirrorValue')) {
                mirrorTypeList.push(item.planTimeDone)
              } else {
                let ele = mirrorTypeList[i] + item.planTimeDone
                mirrorTypeList[i] = ele
              }
              list1['mirrorType'] = item
              oneDay['mirrorValue'] = item.planTimeDone
            } else if (item.planName == '抗阻训练') {
              if (!oneDay.hasOwnProperty('resistanceValue')) {
                resistanceTypeList.push(item.planTimeDone)
              } else {
                let ele = resistanceTypeList[i] + item.planTimeDone
                resistanceTypeList[i] = ele
              }
              list1['resistanceType'] = item
              oneDay['resistanceValue'] = item.planTimeDone
            } else if (item.planName == '功能训练') {
              if (!oneDay.hasOwnProperty('functionValue')) {
                functionTypeList.push(item.planTimeDone)
              } else {
                let ele = functionTypeList[i] + item.planTimeDone
                functionTypeList[i] = ele
              }
              list1['functionType'] = item
              oneDay['functionValue'] = item.planTimeDone
            } else if (item.planName == '游戏训练') {
              if (!oneDay.hasOwnProperty('gameValue')) {
                gameTypeList.push(item.planTimeDone)
              } else {
                let ele = gameTypeList[i] + item.planTimeDone
                gameTypeList[i] = ele
              }
              list1['gameType'] = item//游戏训练
              oneDay['gameValue'] = item.planTimeDone
            } else if (item.planName == '助力训练') {
              if (!oneDay.hasOwnProperty('helpValue')) {
                helpTypeList.push(item.planTimeDone)
              } else {
                let ele = helpTypeList[i] + item.planTimeDone
                helpTypeList[i] = ele
              }
              list1['helpType'] = item//游戏训练
              oneDay['helpValue'] = item.planTimeDone
            } else if (item.planName == '伸展训练') {
              if (!oneDay.hasOwnProperty('stretchValue')) {
                stretchTypeList.push(item.planTimeDone)
              } else {
                let ele = stretchTypeList[i] + item.planTimeDone
                stretchTypeList[i] = ele
              }
              list1['stretchType'] = item//伸展训练
              oneDay['stretchValue'] = item.planTimeDone
            } else if (item.planName == '声控训练') {
              if (!oneDay.hasOwnProperty('voiceValue')) {
                voiceTypeList.push(item.planTimeDone)
              } else {
                let ele = voiceTypeList[i] + item.planTimeDone
                voiceTypeList[i] = ele
              }
              list1['voiceType'] = item//伸展训练
              oneDay['voiceValue'] = item.planTimeDone
            }
          })
          if (!oneDay.hasOwnProperty('gloveValue')) {
            oneDay.gloveValue = 0
            gloveTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('mirrorValue')) {
            oneDay.mirrorValue = 0
            mirrorTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('resistanceValue')) {
            oneDay.resistanceValue = 0
            resistanceTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('functionValue')) {
            oneDay.functionValue = 0
            functionTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('gameValue')) {
            oneDay.gameValue = 0
            gameTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('helpValue')) {
            oneDay.helpValue = 0
            helpTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('stretchValue')) {
            oneDay.stretchValue = 0
            stretchTypeList.push(0)
          }
          if (!oneDay.hasOwnProperty('voiceValue')) {
            oneDay.voiceValue = 0
            voiceTypeList.push(0)
          }
          dateListPen.push(value)
          list2.push(list1)
          timeList.push(allTime)
        }
      }
      gloveTypeRealList = JSON.parse(JSON.stringify(gloveTypeList))
      mirrorTypeRealList = JSON.parse(JSON.stringify(mirrorTypeList))
      resistanceTypeRealList = JSON.parse(JSON.stringify(resistanceTypeList))
      functionTypeRealList = JSON.parse(JSON.stringify(functionTypeList))
      gameTypeRealList = JSON.parse(JSON.stringify(gameTypeList))
      helpTypeRealList = JSON.parse(JSON.stringify(helpTypeList))
      stretchTypeRealList = JSON.parse(JSON.stringify(stretchTypeList))
      voiceTypeRealList = JSON.parse(JSON.stringify(voiceTypeList))
      allTimeList = timeList
      allTimeList.map((item, index) => {
        gloveTypeList[index] = gloveTypeList[index] * 100 / item
        mirrorTypeList[index] = (mirrorTypeList[index] * 100 / item) + gloveTypeList[index]
        resistanceTypeList[index] = (resistanceTypeList[index] * 100 / item) + mirrorTypeList[index]
        functionTypeList[index] = (functionTypeList[index] * 100 / item) + resistanceTypeList[index]
        gameTypeList[index] = (gameTypeList[index] * 100 / item) + functionTypeList[index]
        helpTypeList[index] = (helpTypeList[index] * 100 / item) + gameTypeList[index]
        stretchTypeList[index] = (stretchTypeList[index] * 100 / item) + helpTypeList[index]
        voiceTypeList[index] = (voiceTypeList[index] * 100 / item) + stretchTypeList[index]
      })
      allTimeList.map((item, index) => {
        gloveTypeList[index] = Number(gloveTypeList[index]).toFixed(0)
        mirrorTypeList[index] = Number(mirrorTypeList[index]).toFixed(0)
        resistanceTypeList[index] = Number(resistanceTypeList[index]).toFixed(0)
        functionTypeList[index] = Number(functionTypeList[index]).toFixed(0)
        gameTypeList[index] = Number(gameTypeList[index]).toFixed(0)
        helpTypeList[index] = Number(helpTypeList[index]).toFixed(0)
        stretchTypeList[index] = Number(stretchTypeList[index]).toFixed(0)
        voiceTypeList[index] = Number(voiceTypeList[index]).toFixed(0)
      })
      maxTime = Math.max.apply(null, voiceTypeList);
      maxTime = (maxTime / 10) * 10

      initChartPen(getChart)


    }

  })

}


function initChartPen(getChart) {




  let  option = {
    dataZoom: [
      {
        type: "slider",
        orient: 'horizontal',
        show: true,
        left: '8%',
        xAxisIndex: [0],

        textStyle: {
          color: "#ccd7d7"
        },
        // 调整 dataZoom 在图表容器中的位置

      },
    ],
    tooltip: [{
      trigger: 'axis',
      formatter: (params) => { // 提示框浮层内容格式器 以函数的形式修改
        return tipFormatter(params, params[0].dataIndex) // 见最底层的函数
      },

      extraCssText: 'height:170px;width:280px;',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
    }],
    legend: [{
      type: 'scroll',
      data: ['手套操训练', '镜像训练', '抗阻训练', '功能训练'],
      bottom: '5%',
      y: 'top',
    }, {
      type: 'scroll',
      data: ['游戏训练', '助力训练', '伸展训练', '声控训练'],
      bottom: '10%',
      top: '7%',
      y: 'top',
    }],
    grid: { //调整图表上下左右位置
      top: '18%',
      left: '8%',
      right: '20%',
      bottom: '11%',

    },

    yAxis: [
      {
        type: 'value',
        boundaryGap: true,
        nameLocation: 'end',

        axisTick: {
          show: false,
        },
        axisLabel: {

        },
        splitLine: {
          show: false
        },
      },
      {
        name: '完成（%）',
        min: 0,
        max: maxTime > 100 ? maxTime : 100,
        // max:120,
        splitNumber: 10,

        type: 'value',

        axisLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        axisLabel: {

        }
      },
    ],
    xAxis: [
      {
        position: 'left',
        type: 'category',
        inverse: true,
        data: dateListPen,
        axisLabel: {

        },
        axisTick: {
          show: false
        }
      },
      {
        type: 'category',
        min: 0,
      }
    ],

    series: [
      {
        name: '手套操训练',
        type: 'bar',
        yAxisIndex: 1,
        data: gloveTypeList,
        barWidth: 20,
        z: '8',
        itemStyle: {
          normal: {
            color: "#66ccff"
          }
        },
      },
      {
        name: '镜像训练',
        type: 'bar',
        yAxisIndex: 1,
        data: mirrorTypeList,
        barWidth: 20,
        barGap: '-100%',
        z: '7',
        itemStyle: {
          normal: {
            color: "#d9505c"
          }
        },
      },
      {
        name: '抗阻训练',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        z: '6',
        data: resistanceTypeList,
        barWidth: 20,
        itemStyle: {
          normal: {
            color: "#8136ea"
          }
        },
      },
      {
        name: '功能训练',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        z: '5',
        data: functionTypeList,
        barWidth: 20,
        itemStyle: {
          normal: {
            color: "#2335b1"
          }
        },
      },
      {
        name: '游戏训练',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        z: '4',
        data: gameTypeList,
        barWidth: 20,
        itemStyle: {
          normal: {
            color: "#c9bb74"
          }
        },
      },
      {
        name: '助力训练',
        type: 'bar',
        barGap: '-100%',
        z: '3',
        yAxisIndex: 1,
        data: helpTypeList,
        barWidth: 20,
        itemStyle: {
          normal: {
            color: "#84b17c"
          }
        },
      },
      {
        name: '伸展训练',
        type: 'bar',
        barGap: '-100%',
        z: '2',
        yAxisIndex: 1,
        data: stretchTypeList,
        barWidth: 20,
        itemStyle: {
          normal: {
            color: "#d53edb"
          }
        },
      },
      {
        name: '声控训练',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        z: '1',
        data: voiceTypeList,
        barWidth: 20,
        label: {
          // 柱图头部显示值
          show: true,
          position: "right",
          color: "#333",
          fontSize: "12px",

          // left:'10px',
          formatter: (params) => {
            return voiceTypeList[params.dataIndex] + '%';
          },
        },
        itemStyle: {
          normal: {
            color: "#e2881b"
          }
        },
      },
    ]
  };

  getChart.setOption(option);

  const modalWidth = $('.modal-dialog').width(); // 获取弹窗的宽度
  getChart.resize({width: modalWidth + 'px', height: '400px'});

  //随着屏幕大小调节图表
  window.addEventListener("resize", () => {
    getChart.resize();
  });
  if (dateListPen < 1) {
    option.dataZoom[0].show = false
    haveRecord = true
  } else {
    haveRecord = false
  }
  getChart.on('click', (params) => {
        // this.$router.push({
        //     path: '/ucenter/equipmentTraining/trainDay',
        //     query: {
        //         userId: this.userId,
        //         planDayTime: this.dateListPen[params.dataIndex]
        //     },
        // })
      }
  )
}

function tipFormatter(params, index) {
  let time = allTimeList[index]
  let value1 = (gloveTypeRealList[index] / time) * 100
  let name = (gloveTypeRealList[index] / time) * 100
  let name1 = (mirrorTypeRealList[index] / time) * 100
  let name2 = (resistanceTypeRealList[index] / time) * 100
  let name3 = (functionTypeRealList[index] / time) * 100
  let name4 = (gameTypeRealList[index] / time) * 100
  let name5 = (helpTypeRealList[index] / time) * 100
  let name6 = (stretchTypeRealList[index] / time) * 100
  let name7 = (voiceTypeRealList[index] / time) * 100
  // let value2=
  name = '手套操训练:' + gloveTypeRealList[index] + ' (' + Number(name).toFixed(0) + '%）'; // 悬浮层内容，可自定义
  name1 = '镜像训练:' + mirrorTypeRealList[index] + ' (' + Number(name1).toFixed(0) + '%）';
  name2 = '抗阻训练:' + resistanceTypeRealList[index] + ' (' + Number(name2).toFixed(0) + '%）';
  name3 = '功能训练:' +functionTypeRealList[index] + ' (' + Number(name3).toFixed(0) + '%）';
  name4 = '游戏训练:' + gameTypeRealList[index] + ' (' + Number(name4).toFixed(0) + '%）';
  name5 = '助力训练:' + helpTypeRealList[index] + ' (' + Number(name5).toFixed(0) + '%）';
  name6 = '伸展训练:' + stretchTypeRealList[index] + ' (' + Number(name6).toFixed(0) + '%）';
  name7 = '声控训练:' + voiceTypeRealList[index] + ' (' + Number(name7).toFixed(0) + '%）';
  let divWarp = $('<div>'); //
  let divContent = $('<div style = "position:relative;bottom:-0px;backgroundColor: #505050;transform:rotate(0deg);">'); //
  let p = $('<p style="color:#66ccff;font-weight: bold">').text(name); // 内容标签， 可以有多个
  let p1 = $('<p style="color:#d9505c;font-weight: bold">').text(name1); // 内容标签可以有多个
  let p2 = $('<p style="color:#8136ea;font-weight: bold">').text(name2); // 内容标签可以有多个
  let p3 = $('<p style="color:#2335b1;font-weight: bold">').text(name3); // 内容标签可以有多个
  let p4 = $('<p style="color:#c9bb74;font-weight: bold">').text(name4); // 内容标签可以有多个
  let p5 = $('<p style="color:#84b17c;font-weight: bold">').text(name5); // 内容标签可以有多个
  let p6 = $('<p style="color:#d53edb;font-weight: bold">').text(name6); // 内容标签可以有多个
  let p7 = $('<p style="color:#e2881b;font-weight: bold">').text(name7); // 内容标签可以有多个
  let divFirst = divContent.append(p); // 将 p 加到 divContent
  let divTwo = divContent.append(p1); // 将 p 加到 divContent
  let divThree = divContent.append(p2); // 将 p 加到 divContent
  let divFour = divContent.append(p3); // 将 p 加到 divContent
  let divFive = divContent.append(p4); // 将 p 加到 divContent
  let divSix = divContent.append(p5); // 将 p 加到 divContent
  let divSeven = divContent.append(p6); // 将 p 加到 divContent
  let divEight = divContent.append(p7); // 将 p 加到 divContent
  let div = divWarp.append(divFirst).append(divTwo).append(divThree).append(divFour).append(divFive).append(divSix).append(divSeven).append(divEight); // 将内容盒子加到外盒子上
  return div.html(); // 渲染到html 并将结果返回
}



function viewPlan(userId, button) {
  weightData = []
  planDate = []
  stepData = []
  const echartsBar = echarts.init(document.getElementById('lineChart'));
  // userId = '1676406801490857984'
  const apiUrl = 'https://pharos3.ewj100.com/plan/listByUid/' + userId;
  // const params = new URLSearchParams({
  //   userId: userId,
  // });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if (data.code == 0) {
        console.log('计划rsp--->', data)
        var list = data.data
        var subPlanEntityList = null
        if (list && list.length > 0) {
          subPlanEntityList = data.data[0].subPlanEntityList
        } else {
          Toastify({
            text: '暂无计划',
            duration: 2000,
            gravity: 'top',
            position: 'center',
          }).showToast();
          echartsBar.dispose();
          return
        }

        if (subPlanEntityList && subPlanEntityList.length > 0) {
          weight = list[0].weight;
          // userWeight = list[0].weight;
          weightMax = parseInt(weight) + 5
          weight = (parseInt(weight) / 10 + 1) * 10;
          weightScale = weight / 10;
          console.log('scale--->', weightScale)
          subPlanEntityList.map((item, index, arr) => {

            if (item.startDate) {
              // planDate.push(item.startDate);
              let startDate = item.startDate.split(" ")[0];
              planDate.push(startDate);
            }

            stepData.push(item.trainStep)
            weightData.push(item.load);
          });
          initPlanLineChart(echartsBar)
          // this.data.unshift([0,0])

          // subPlanEntityList.forEach((subPlan, index) => {
          // })
          // initChart(echartsBar)
        } else {
          Toastify({
            text: '暂无计划',
            duration: 2000,
            gravity: 'top',
            position: 'center',
          }).showToast();
          echartsBar.dispose();
        }

      }

    })

}


function viewRecord(userId, button) {
  dateList = []
  loadList = []
  painLevelList = []
  warningTimeList = []
  trainRecordList = []
  const echartsBar = echarts.init(document.getElementById('echartsBar'));
  $('#subChartContainer').hide();
  $('#echartsBar').show();
  $('#chartPen').hide();

  const apiUrl = 'https://pharos3.ewj100.com/productStockUserCount/getTrainRecordByUserId';
  const params = new URLSearchParams({
    userId: userId,
  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if (data.code == 0) {
        console.log('训练记录rsp--->', data)
        var records = data.data.tbUserTrainRecords
        if (records && records.length > 0) {
          records.forEach((record, index) => {
            console.log('训练记录--->', record)
            var dateStr = record.dateStr.substring(record.dateStr.indexOf('-') + 1)
            dateList.push(dateStr + `(${record.frequency})`)
            loadList.push(record.targetLoad)
            painLevelList.push(record.painLevel);
            warningTimeList.push(record.adverseReactions);
            trainRecordList.push(record)
          })
          console.log('训练记录日期--->', dateList)
          initChart(echartsBar)
        } else {
          Toastify({
            text: '暂无训练记录',
            duration: 2000,
            gravity: 'top',
            position: 'center',
          }).showToast();
          echartsBar.dispose();
        }

      }

    })
}
function dischargeReq(userId, button) {
  const apiUrl = 'https://pharos3.ewj100.com/palnUser/updateOnHospital';
  const params = new URLSearchParams({
    userId: userId,
  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if (data.code == 0) {
        button.textContent = '已出院';
        button.disabled = true;
        Toastify({
          text: '出院成功',
          duration: 2000, // 持续时间（以毫秒为单位）
          gravity: 'top', // Toast 的位置（可以是 top, right, bottom, left）
          position: 'center', // Toast 的水平位置（可以是 start, center, end）
        }).showToast();
      }

    })
}
function initChart(getChart) {
  const colors = ["#5470C6", "#91CC75", "#EE6666"];
  var option = {
    toolbox: {
      show: true,
      feature: {
        dataZoom: { show: true },
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar", "scatter", "pie"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    //放大缩小
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 30,
        height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: function (params) {
        var result = params[0].name;
        params.forEach(function (item) {
          result += "<br/>";
          result +=
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
            item.color +
            '"></span>';
          if (item.seriesIndex == 0) {
            result += "VAS反馈：" + "<b>" + item.value + "</b>";
          } else if (item.seriesIndex == 1) {
            result += "目标负重：" + "<b>" + item.value + "</b>";
          } else {
            result += "异常反馈：" + "<b>" + item.value + "</b>";
          }
        });
        return result;
      },
    },
    legend: {
      type: "scroll",
      data: ["目标负重", "VAS反馈", "异常反馈"],
      bottom: "1%",
      y: "top",
    },
    grid: {
      //调整图表上下左右位置
      top: "12%",
      left: "10%",
      right: "10%",
      bottom: "11%",
      containLabel: true,
    },

    yAxis: [
      {
        name: "VAS反馈（级）",
        min: 0,
        max: 10,
        splitNumber: 10,
        data: painLevelList,
        type: "value",
        position: "right",
        boundaryGap: true,
        alignTicks: true,
        nameLocation: "end",
        // nameRotate:-90,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: "{value} 级",
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },
      },
      {
        name: "目标负重（kg）",
        min: 0,
        max: 70,
        position: "left",
        splitNumber: 7,
        type: "value",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2],
          },
        },

        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} kg",
        },
      },
      {
        //name:'异常反馈',
        min: 0,
        max: 70,
        position: "right",
        type: "value",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2],
          },
        },
        axisLabel: {
          formatter: "{value} ",
        },

        axisTick: {
          show: false,
        },

      },
    ],
    xAxis: [
      {
        position: "left",
        type: "category",
        data: dateList,
        axisLabel: {
          // rotate:-90,
        },
        axisTick: {
          show: false,
        },
      },
      {
        type: "category",
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],

    series: [
      {
        name: "VAS反馈",
        type: "line",
        max: 10,
        data: painLevelList,
      },
      {
        name: "目标负重",
        type: "bar",
        yAxisIndex: 1,
        data: loadList,
        barWidth: 5,
        itemStyle: {
          normal: {
            color: "#66ccff",
          },
        },
        emphasis: {
          focus: "series",
        },
      },
      {
        name: "异常反馈",
        type: "scatter",
        // yAxisIndex: 1,
        data: warningTimeList,
        // data:[1,2,"-","啊哈"],
        itemStyle: {
          normal: {
            color: "#FF0000",
          },
        },
        emphasis: {
          focus: "series",
        },
      },
    ],
  };

  // if (this.dateList < 1) {
  //   option.dataZoom[0].show = false;
  //   this.haveRecord = true;
  // } else {
  //   this.haveRecord = false;
  // }

  // getChart.setOption(option);
  //随着屏幕大小调节图表
  getChart.setOption(option);
  const modalWidth = $('.modal-dialog').width(); // 获取弹窗的宽度
  getChart.resize({ width: modalWidth + 'px', height: '400px' });
  // window.addEventListener("resize", () => {
  //   getChart.resize();
  // });
  //点击单次训练记录
  getChart.on("click", (params) => {
    // this.recordVisible=false
    // this.countRecordVisible = true;
    let userId = trainRecordList[params.dataIndex].userId;
    let frequency = trainRecordList[params.dataIndex].frequency;
    let dateStr = trainRecordList[params.dataIndex].dateStr;
    showSubChart(userId, frequency, dateStr)
    console.log('数据-->', userId, frequency, dateStr)
    // getRecord(userId, frequency, dateStr);


  });
  //随着屏幕大小调节图表
  // window.addEventListener("resize", () => {
  //   this.getChart.resize();
  // });
}
function showSubChart(userId, frequency, dateStr) {
  const subEchartsBar = echarts.init(document.getElementById('subChart'));
  const apiUrl = 'https://pharos3.ewj100.com/planUserTrainRecord/getByUserIdAndFrequency';
  const params = new URLSearchParams({
    userId: userId,
    frequency: frequency,
    dateStr: dateStr
  });
  // 将参数拼接在URL的末尾
  const urlWithParams = `${apiUrl}?${params.toString()}`;
  fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 可以添加其他头部信息
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    }).then(data => {

      if (data.code == 0) {
        console.log("subrecord data", data)
        targetLoad = data.data[0].targetLoad;
        // this.countLoadList = data.map((i) => i.realLoad);
        countList = [];
        countLoadList = [];

        for (let n = 1; n < data.data[0].trainDataList.length + 1; n++) {
          let count = "第" + n + "踩";
          countList.push(count)
          countLoadList.push(data.data[0].trainDataList[n - 1].realLoad);
        }
        initSubRecordChart(subEchartsBar)
      }

    })
}
function hideSubChart() {
  $('#subChartContainer').hide();
  isSubChartDisplayed = false;
}
function initSubRecordChart(chart) {
  var option = {

    toolbox: {
      show: true,
      feature: {
        dataZoom: { show: true },
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: {
          show: true,
          type: ["line", "bar", "scatter", "pie"],
        },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    //放大缩小
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 30,
        height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["训练实际负重"],
      bottom: "1%",
      y: "top",
    },
    grid: {
      //调整图表上下左右位置
      top: "10%",
      left: "10%",
      right: "10%",
      bottom: "11%",
      containLabel: true,
    },

    yAxis: [
      {
        // name:'VAS反馈（级）',
        min: 0,
        max: weightMax,
        splitNumber: 5,
        // data:this.painLevelList,
        type: "value",
        boundaryGap: true,
        nameLocation: "end",
        // nameRotate:-90,
        axisTick: {
          show: false,
        },
        axisLabel: {
          // rotate:-90,
          formatter: "{value} kg",
        },
        splitLine: {
          show: false,
        },
      },
      {
        // name:'目标负重（kg）',
        min: 0,
        max: weightMax,
        splitNumber: 5,
        // data:this.loadList,
        type: "value",
        // nameRotate:-90,
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          // rotate:90,
          formatter: "{value} kg",
        },
      },
    ],
    xAxis: [
      {
        position: "left",
        type: "category",
        data: this.countList,
        axisLabel: {
          // rotate:-90,
        },
        axisTick: {
          show: false,
        },

      },
      {
        type: "category",
        min: 0,
      },
    ],

    series: [
      {
        name: "训练实际负重",
        type: "bar",
        data: countLoadList,
        barWidth: 5,
        itemStyle: {
          normal: {
            color: "#66ccff",
          },
        },
        emphasis: {
          focus: "series",
        },

        markLine: {
          symbol: "none",
          itemStyle: {
            normal: {
              color: "#FA8565",
              label: {
                // rotate:-90,
                position: "middle",
                formatter: "{b}",
              },
            },
          },
          data: [
            {
              yAxis: targetLoad * 1.2,
              name: "最大负重",
              // symbolRotate:-90,
              itemStyle: {
                normal: {
                  color: "red",
                },
              },
            },
            {
              yAxis: targetLoad,
              name: "目标负重",
              itemStyle: {
                normal: {
                  color: "#00FF00",
                },
              },
            },
            {
              yAxis: targetLoad * 0.8,
              name: "最小负重",
              itemStyle: {
                normal: {
                  color: "yellow",
                },
              },
            },
          ],
        },

      },
      {

        type: "line",
        yAxisIndex: 1,

      },
      {
        name: "异常反馈",
        type: "scatter",
        yAxisIndex: 1,
        data: warningTimeList,
        itemStyle: {
          normal: {
            color: "#FF0000",
          },
        },

      },
    ],
  };
  const modalWidth = $('.modal-dialog').width(); // 获取弹窗的宽度
  chart.resize({ width: modalWidth + 'px', height: '400px' });
  chart.setOption(option);
  // 显示子图表容器
  $('#subChartContainer').show();
  $('#chartPen').hide();

  isSubChartDisplayed = true;
}

function initPlanLineChart(lineChart) {
  const modalWidth = $('.modal-dialog').width(); // 获取弹窗的宽度
  lineChart.resize({ width: modalWidth + 'px', height: '400px' });
  var option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
        },
      },
    },
    //加入可变换折线图和柱状图工具栏
    toolbox: {
      show: true,
      feature: {
        dataZoom: { show: true },
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    grid: {
      top: "15%",
      bottom: "10%",
      right: "18%",
      left: "10%",
      containLabel: true,
    },
    legend: {
      // data: ['评估记录']
    },
    xAxis: [
      {
        name: "时间",
        min: 0,
        // max: this.test,
        data: planDate,

        nameLocation: "end",
        type: "category",
        axisPointer: {
          type: "none",
          label: {
            show: true,
          },
        },
        // splitNumber :this.test+3,
        // inverse:true,
        axisLine: { onZero: false },
        boundaryGap: false
      },

    ],
    yAxis: [
      {
        name: "重量(kg)",
        min: 0,
        max: weightMax,
        data: weightData,
        axisTick: {
          show: true,
        },
        // nameRotate:-90,
        // boundaryGap: [0, 0],
        type: "value",
        // position: 'top',
        axisLabel: {
          // rotate:-90,
        },
        // inverse:true,
        splitNumber: weightScale,
        // axisLine: { onZero: true }
      },
      {
        // name:'异常反馈',
        // min:0,
        // max:70,
        // splitNumber :7,
        // data:this.assessData,
        type: "category",
        // nameRotate:-90,
        axisLine: {
          show: true,
          onZero: false,
        },
        axisPointer: {
          type: "none",
          label: {
            show: true,
          },
        },
        axisTick: {
          show: true,
        },
        axisLabel: {
          // rotate:90,
          show: false,
        },
      },
    ],
    //放大缩小
    dataZoom: [
      {
        show: true,
        start: 0,
        end: 100,
      },
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 30,
        height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    series: [
      {
        name: "康复计划",
        type: "line",
        // yAxisIndex: 1,
        max: weightMax,
        smooth: true,
        symbolSize: 16,
        emphasis: {
          focus: "series",
          show: false,
        },
        data: weightData,
      },
    ],
  };
  // lineChart.resize({ width: '100%', height: '400px' });
  lineChart.setOption(option)

}

//初始化分页插件
function initPagination() {
  $('#pagination').pagination({
    // dataSource: userList,
    // pageSize: itemsPerPage,
    pageCount: 6,
    showData: 4,
    callback: function (data, pagination) {
      userTable.innerHTML = '';
      console.log('分页回调数据', data)
      console.log('分页回调pagination', pagination)
      getUserListData(data)

    }
  });
}

// 计算年龄的函数
function calculateAge(birthdate) {
  const birthYear = new Date(birthdate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}