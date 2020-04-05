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

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

  // 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackgroud:'',
    hourWeather:[],
    todayTemp:"",
    todayDate:"",
    city:"广州",
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED
  },

  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    });
  },

  onLoad(){
    qqmapsdk = new QQMapWX({
      key: 'ASEBZ-YB5H4-LOJUZ-X7V5L-SXIWK-LGFJ6'
    })
    this.getNow();
    this.onTapLocation();
  },

  getNow(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
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
      url: '/pages/list/list'
    })
  },

  /** 根据权限做相应动作 **/
  onTapLocation(){
    if(this.data.locationAuthType == UNAUTHORIZED){
      wx.openSetting({
        success: res => {
          let auth = res.authSetting["scope.userLocation"];
          if (auth){
            this.getLocation()
          }
        }
      })
    }else{
      this.getLocation()
    }
  },

  /** 获取当前用户坐标 **/
  getLocation(){
    wx.getLocation({
      success: res => {
        console.log(res.latitude, res.longitude)
        this.setData({
          locationTipsText: AUTHORIZED_TIPS,
          locationAuthType: AUTHORIZED
        })
        this.reverseLocation(res)
      },
      fail: () => {
        this.setData({
          locationTipsText: UNAUTHORIZED_TIPS,
          locationAuthType: UNAUTHORIZED
        })
      }
    })
  },

  /** 将坐标转为城市名 **/
  reverseLocation(res){
    //调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: res.latitude,
        longitude: res.longitude
      },
      success: res => {
        let city = res.result.address_component.city
        console.log(city)
        this.setData({
          city: city,
          locationTipsText: ""
        })
      }
    })
  }

})
