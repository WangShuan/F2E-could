import Vue from "vue";
import firebase from "firebase/app";
import App from "./App.vue";
import router from "./router";
import "bootstrap";

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyAVY9kx81K4OYqOqjP5RumP9fwoMH1Sv3o",
  authDomain: "f2e-could.firebaseapp.com",
  projectId: "f2e-could",
  storageBucket: "f2e-could.appspot.com",
  messagingSenderId: "843526990354",
  appId: "1:843526990354:web:f81d9b13879305cab846cb",
};
firebase.initializeApp(firebaseConfig);

Vue.filter("niceBytes", function (x) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  //include a decimal point and a tenths-place digit if presenting
  //less than ten of KB or greater units
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + units[l];
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
