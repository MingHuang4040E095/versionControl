<template>
  <div>
    <v-text-field label="帳號" v-model="account"></v-text-field>
    <v-text-field
      label="密碼"
      v-model="password"
      type="password"
    ></v-text-field>
    <v-btn elevation="2" @click="login()">登入</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      account: "",
      password: ""
    };
  },
  methods: {
    login() {
      const payload = {
        account: this.account, //帳號
        password: this.password // 密碼
      };
      this.$http.post("/user/add", payload).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
