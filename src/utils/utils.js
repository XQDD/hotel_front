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


