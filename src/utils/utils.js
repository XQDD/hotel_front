//通用显示消息工具类
export const ToastUtils = {
  //错误
  error: (msg) => {
    window.vue.$bvToast.toast(msg,
      {
        toaster: "b-toaster-top-center",
        noCloseButton: true,
        variant: "danger",
        autoHideDelay: 3000,
        toastClass: "animated shake",
      })
  },
  // 成功
  success: (msg) => {
    window.vue.$bvToast.toast(msg,
      {
        toaster: "b-toaster-top-center",
        noCloseButton: true,
        variant: "success",
        autoHideDelay: 3000,
      })
  }
};


// 将时间戳转化为2018-1-1格式的时间
export const TimeUtils = {
  formatDate: time => {
    let date = new Date(time);
    let month = (date.getMonth() + 1);
    if (month < 10) {
      month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return date.getFullYear() + "-" + month + "-" + day;
  }
}
