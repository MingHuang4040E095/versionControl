<template>
  <v-app>
    <v-main
      style="background:linear-gradient(to right top, rgb(218 233 243) 18%, rgb(214 200 196))"
    >
      <v-container class="fill-height">
        <v-row class="text-center">
          <v-col md="8" offset-md="2" cols="12">
            <router-view router-view @commit="getCommit"></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
  methods: {
    getCommit(value) {
      alert(value);
    }
  }
};
</script>
<style lang="scss"></style>
