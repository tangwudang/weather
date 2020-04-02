//index.js
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
  // 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackgroud:'',
    hourWeather:[],
    todayTemp:"",
    todayDate:"",
    city:"",
    locationTipsText:""
  },

  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    });
  },

  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: 'ASEBZ-YB5H4-LOJUZ-X7V5L-SXIWK-LGFJ6'
    })
    this.getNow();
    console.log("onLoad")
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },
  getNow(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '南京市'
      },
      success: res => {
        console.log(res)
        let result = res.data.result
        this.setNow(result)
        this.setHourWeather(result)
        this.setToday(result)
      },
      complete: () => {
        callBack && callBack()
      }
    })
  },

  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather

    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackgroud: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather]
    })
  },

  setHourWeather(result) {
    let forecast = result.forecast
    let hourWeather1 = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 24; i += 3) {
      let id = i / 3
      hourWeather1.push({
        time: (i + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[id].weather + '-icon.png',
        temp: forecast[id].temp + '°'
      })
    }
    hourWeather1[0].time = "现在"
    this.setData({
      hourWeather: hourWeather1
    })
  },

  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp: result.today.minTemp + '° - ' + result.today.maxTemp + '°',
      todayDate: date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate() + "今天"
    })
  },

  onTapDayWeather(){
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  xxxx(){
    //调用接口
    this.qqmapsdk.reverseGeocoder({
      location: {
        latitude: 39.984060,
        longitude: 116.307520
      },
      success: res => {
        let city = res.result.address_component.city;
        console.log(city);
      }
    });
  }
})
