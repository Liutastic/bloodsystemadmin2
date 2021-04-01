<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ username }}</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      avatar: '',
      username: ''
    }
  },
  mounted () {
    this.initUserInfo()
  },
  methods: {
    initUserInfo () {
      this.avatar = window.localStorage.getItem('avatar')
      this.username = window.localStorage.getItem('username')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
