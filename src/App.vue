<template>
  <div id="app">
    <Navi/>
    <transition name="fade"
                mode="out-in">
      <router-view class="container" :key="$route.fullPath"/>
    </transition>
  </div>
</template>

<script>
  import Navi from './components/Navi'

  export default {
    name: 'App',
    components: {Navi},
    methods: {
    },
    async created() {
      if (this.$store.getters.isLoggedIn) {
        const result = await this.$contract.accountManager.getUserName(this.pictionConfig.account);
        if (!result.result_) {
          this.$store.dispatch('LOGOUT');
          window.location.reload();
        }
      }
//      this.setEpisodeCreationEvent();
    }
  }
</script>

<style lang="sass">
  @import "https://use.fontawesome.com/releases/v5.4.1/css/all.css"
  @import "http://fonts.googleapis.com/earlyaccess/nanumgothic.css"

  #app
    font-family: 'Nanum Gothic', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50
    margin: 0px auto

  .container
    margin: 80px auto 40px auto

  .pxl-change
    animation-name: example
    animation-duration: 5s

  .page-title
    font-size: 36px
    font-weight: bold

  .overflow-hidden
    overflow: hidden

  .vld-overlay
    z-index: 9999 !important

  @for $i from 10 through 40
    .font-size-#{$i}
      font-size: #{$i}px

  /* Chrome, Safari, Opera */
  @-webkit-keyframes example
    0%
      text-shadow: rgb(255, 255, 255) 0px 0px 30px
    50%
      text-shadow: rgb(255, 0, 0) 0px 0px 30px
    100%
      text-shadow: rgb(255, 255, 255) 0px 0px 30px

  /* Standard syntax */
  @keyframes example
    0%
      text-shadow: rgb(255, 255, 255) 0px 0px 30px
    50%
      text-shadow: rgb(255, 0, 0) 0px 0px 30px
    100%
      text-shadow: rgb(255, 255, 255) 0px 0px 30px

  a
    color: inherit !important

  a:hover
    text-decoration: inherit !important

  .fade-enter-active,
  .fade-leave-active
    transition-duration: 0.2s
    transition-property: opacity
    transition-timing-function: ease

  .fade-enter, .fade-leave-active
    opacity: 0
</style>
