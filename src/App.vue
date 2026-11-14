<template>
  <!-- 顶栏不再常驻：只有登录后的布局（IndexView）才渲染 HeadBar，
       所以 /login、/about 这类页面是干净的整页 -->
  <router-view />
</template>
