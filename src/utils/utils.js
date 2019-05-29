export const ToastUtils = {
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
