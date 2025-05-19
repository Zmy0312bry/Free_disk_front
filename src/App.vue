<template>
  <div class="shell">
    <ul class="nav">
      <li :class="{ active: currentRoute === '/' }" id="logo">
        <router-link to="/">
          <div class="iconbar">
            <div class="icon">
              <div class="imageBox">
                <img src="@/assets/images/logo.png" alt="" />
              </div>
            </div>
            <div class="text app-title">白嫖怪网盘</div>
          </div>
        </router-link>
      </li>
      <li class="search-container">
        <div class="search-box">
          <div class="search-icon">
            <i class="iconfont icon-sousuo"></i>
          </div>
          <input type="text" placeholder="搜索文件..." class="search-input" />
        </div>
      </li>
      <li :class="{ active: currentRoute === '/home' }" id="home-nav">
        <router-link to="/home">
          <div class="icon">
            <i class="iconfont icon-icon_cangku"></i>
          </div>
          <div class="text">主页</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/upload' }">
        <router-link to="/upload">
          <div class="icon">
            <i class="iconfont icon-shangchuan"></i>
          </div>
          <div class="text">文件上传</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/star' }">
        <router-link to="/star">
          <div class="icon">
            <i class="iconfont icon-shoucang-weishoucang"></i>
          </div>
          <div class="text">收藏夹</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/garbage' }">
        <router-link to="/garbage">
          <div class="icon">
            <i class="iconfont icon-huishouzhan"></i>
          </div>
          <div class="text">回收站</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/setting' }">
        <router-link to="/setting">
          <div class="icon">
            <i class="iconfont icon-shezhi"></i>
          </div>
          <div class="text">设置</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/download' }">
        <router-link to="/download">
          <div class="icon">
            <i class="iconfont icon-icon-"></i>
          </div>
          <div class="text">下载管理</div>
        </router-link>
      </li>
      <li :class="{ active: currentRoute === '/me', 'me-profile': true }" id="logo">
        <router-link to="/me">
          <div class="iconbar">
            <div class="icon">
              <div class="imageBox">
                <img src="@/assets/images/logo.png" alt="" />
              </div>
            </div>
            <div class="text">ME</div>
          </div>
        </router-link>
      </li>
      <li class="theme-switch-container">
        <div class="theme-switch" @click="toggleDarkMode">
          <div class="icon">
            <i
              class="iconfont"
              :class="isDarkMode ? 'icon-yejianmoshi' : 'icon-sunbaitian-taiyang'"
            ></i>
          </div>
          <div class="text">
            {{ isDarkMode ? '深色模式' : '浅色模式' }}
          </div>
        </div>
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const currentRoute = computed(() => route.path)
    const isDarkMode = ref(false)

    // 在组件挂载时检查并恢复暗黑模式设置
    onMounted(() => {
      // 从localStorage获取暗黑模式设置
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'true') {
        isDarkMode.value = true
        document.body.classList.add('dark-mode')
      }
    })

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
      document.body.classList.toggle('dark-mode')
      // 保存设置到localStorage
      localStorage.setItem('darkMode', isDarkMode.value.toString())
    }

    return {
      currentRoute,
      isDarkMode,
      toggleDarkMode,
    }
  },
}
</script>

<style scoped>
@import '@/assets/font/iconfont.css';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
  text-decoration: none;
}

body {
  background: #e4e9f5;
}

section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font: 900 100px '';
  color: rgba(110, 90, 240, 0.3);
  background: #e4e9f5;
}

.shell {
  position: fixed;
  width: 84px;
  height: 100%;
  background: #fff;
  z-index: 9999;
  transition: width 0.5s;
  padding-left: 10px;
  overflow: hidden;
  left: 0; /* 确保贴合左侧边缘 */
  top: 0; /* 确保贴合顶部边缘 */
}

.shell:hover {
  width: 300px;
}

/* iconbar样式 - 左对齐 */
.iconbar {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 左对齐 */
  width: 100%;
}

/* 调整logo的icon样式，确保左对齐 */
#logo .icon {
  justify-content: flex-start; /* 覆盖原来的center对齐 */
  padding-left: 0; /* 移除左侧内边距 */
  min-width: auto; /* 允许宽度自适应内容 */
}


/* 调整imageBox在logo中的位置 */
#logo .imageBox {
  margin-left: 5px; /* 添加少量左边距 */
}

.imageBox {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
}

.imageBox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shell ul {
  position: relative;
  height: 100vh;
}

.shell ul li {
  position: relative;
  padding: 5px;
}

.active {
  background: #e4e9f5;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}

.active::before {
  content: '';
  position: absolute;
  top: -30px;
  right: 0;
  width: 30px;
  height: 30px;
  border-bottom-right-radius: 25px;
  box-shadow: 5px 5px 0 5px #e4e9f5;
  background: transparent;
}

.active::after {
  content: '';
  position: absolute;
  bottom: -30px;
  right: 0;
  width: 30px;
  height: 30px;
  border-top-right-radius: 25px;
  box-shadow: 5px -5px 0 5px #e4e9f5;
  background: transparent;
}

#logo {
  margin: 10px 0 0px 0;
}

.shell ul li a {
  position: relative;
  display: flex;
  white-space: nowrap;
}

.icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 70px;
  height: 70px;
  color: #333;
  transition: 0.5s;
  color: rgb(110, 90, 240);
}

.icon i {
  font-size: 30px;
  z-index: 999;
  display: flex; /* 添加flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 占满父容器宽度 */
  height: 100%; /* 占满父容器高度 */
  text-align: center; /* 文本居中 */
}

.text {
  position: relative;
  height: 70px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #333;
  padding-left: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: 0.5s;
  margin-left: 20px; /* 添加这行，让文本向右移动 */
}

/* 为app-title添加特殊样式，因为它与其他文本元素可能有不同的对齐需求 */
.app-title {
  margin-left: 20px; /* 不使用auto，给定一个固定值 */
  flex-grow: 0; /* 不需要占据所有剩余空间 */
}

.shell ul li:hover a .icon,
.shell ul li:hover a .text {
  color: #ffa117;
}

.active a .icon::before {
  content: '';
  position: absolute;
  inset: 5px;
  width: 60px;
  background: #fff;
  border-radius: 50%;
  transition: 0.5s;
  border: 7px solid rgb(110, 90, 240);
  box-sizing: border-box;
}

#home-nav {
  margin-top: -20px; /* 减少顶部外边距 */
  /* 或者使用transform */
  /* transform: translateY(-10px); */
}

/* ME个人资料样式 */
.me-profile {
  position: relative;
  margin: 60px 0 0 0; /* 顶部外边距 */
  padding: 5px 5px 0 5px;
  transition: background 0.3s ease; /* 只过渡背景色变化 */
}

/* ME 标签的文本可能需要特殊处理 */
.me-profile .text {
  margin-left: 80px; /* 为ME文本设置特定的左边距 */
}

/* 为ME添加顶部分隔线，使用::after而不是::before */
.me-profile::after {
  content: '';
  position: absolute;
  top: 0px; /* 向上偏移使分隔线位于元素上方 */
  left: 5px;
  right: 5px;
  height: 0; /* 高度为0，只显示边框 */
  border-top: 3px dashed rgba(110, 90, 240, 0.2);
  z-index: 999 !important; /* 使用更高的z-index确保始终显示 */
}

/* 确保ME项被选中时分隔线仍然可见 */
.active.me-profile::after {
  content: '' !important;
  position: absolute !important;
  top: -10px !important;
  left: 5px !important;
  right: 5px !important;
  height: 0 !important;
  border-top: 3px dashed rgba(110, 90, 240, 0.2) !important;
  box-shadow: none !important; /* 防止继承活动状态的阴影 */
  z-index: 999 !important;
  background: transparent !important;
  width: auto !important;
  border-radius: 0 !important;
}

/* 确保ME项被选中时圆角效果正常 */
.active.me-profile::before {
  content: '';
  position: absolute;
  top: -30px;
  right: 0;
  width: 30px;
  height: 30px;
  border-bottom-right-radius: 25px;
  box-shadow: 5px 5px 0 5px #e4e9f5;
  background: transparent;
  z-index: 99;
}

/* 选中状态下，重写部分active样式，确保与普通状态保持一致 */
.active.me-profile {
  background: #e4e9f5;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
}

/* 确保ME图片的父容器在悬停时不变化 */
.me-profile .icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  padding-left: 10px;
  height: 70px;
  transform: none !important;
  transition: color 0.5s !important; /* 只允许颜色变化，禁用位置变化 */
}

/* 防止选中状态下的图片移动或样式变化 */
.active.me-profile .imageBox {
  width: 60px;
  height: 60px;
  transform: none !important;
  transition: none !important;
  border: 3px solid transparent;
  position: relative !important;
  left: auto !important;
  top: auto !important;
}

/* 确保选中项图标的样式正确 */
.active.me-profile a .icon::before {
  content: '';
  position: absolute;
  inset: 5px;
  width: 60px;
  background: #fff;
  border-radius: 50%;
  border: 7px solid rgb(110, 90, 240);
  box-sizing: border-box;
  z-index: 0; /* 确保在图片下层 */
}

/* 搜索栏样式 */
.search-container {
  margin: 0 0 30px 0;
  padding: 0 5px 15px 5px;
  border-bottom: 2px dashed rgba(110, 90, 240, 0.2);
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 25px;
  padding: 2px 15px;
  height: 40px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.search-box:hover,
.search-box:focus-within {
  border: 1px solid rgb(110, 90, 240);
  box-shadow: 0 2px 8px rgba(110, 90, 240, 0.15);
}

.search-icon {
  display: flex;
  align-items: center;
  color: rgb(110, 90, 240);
  margin-right: 16px;
}

.search-icon i {
  font-size: 22px;
  text-shadow: 0 1px 2px rgba(110, 90, 240, 0.3);
  margin-left: 4px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  color: #333;
  font-size: 14px;
  width: 100%;
}

.search-input::placeholder {
  color: #888;
  transition: color 0.3s;
}

.search-input:focus::placeholder {
  color: #aaa;
}

.shell:hover .search-box {
  width: 100%;
}

/* 暗黑模式切换按钮样式 */
.theme-switch-container {
  margin: 15px 20px 15px 0;
  padding: 0 5px;
  position: relative;
  left: -5px;
}

.theme-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 42px;
  transition: all 0.3s ease;
  border-radius: 25px;
  overflow: hidden;
}

.shell:hover .theme-switch {
  width: 250px;
  background: #f5f7fa;
}

.theme-switch .icon {
  min-width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #f5f7fa;
  color: rgb(110, 90, 240);
}

.theme-switch .text {
  font-size: 14px;
  margin-left: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.shell:hover .theme-switch .text {
  opacity: 1;
}

/* 暗黑模式样式 */
.dark-mode {
  background: #1a1a1a;
  color: #fff;
}

.dark-mode .shell {
  background: #2d2d2d;
}

.dark-mode .active {
  background: #1a1a1a;
}

.dark-mode .active::before {
  box-shadow: 5px 5px 0 5px #1a1a1a;
}

.dark-mode .active::after {
  box-shadow: 5px -5px 0 5px #1a1a1a;
}

.dark-mode .search-box,
.dark-mode .theme-switch .icon,
.dark-mode .shell:hover .theme-switch {
  background: #3d3d3d;
}

.dark-mode .text {
  color: #fff;
}

.dark-mode .search-input {
  color: #fff;
}

.dark-mode .search-input::placeholder {
  color: #666;
}
</style>
