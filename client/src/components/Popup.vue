<template>
  <div class="popup">
    <span>{{ message }}</span>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: "預設",
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 2px 2px 4px #00000065;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
