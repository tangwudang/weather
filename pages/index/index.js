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

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackgroud:'',
    hourWeather:[]
  },
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    });
  },
  onLoad(){
    this.getNow();
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
  }

  
})
