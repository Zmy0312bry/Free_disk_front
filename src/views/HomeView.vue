<template>
  <section :class="{ 'shell-expanded': isShellHovered }">
    <div class="folder-container" :class="{ 'container-expanded': isShellHovered }">
      <div class="folder-item" v-for="i in 19" :key="i">
        <i class="iconfont icon-wenjianjia"></i>
        <span class="folder-name">文件夹 {{ i }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      isShellHovered: false,
    }
  },
  mounted() {
    // 保存事件处理函数的引用，以便正确移除
    this.handleMouseEnter = () => {
      this.isShellHovered = true
    }
    this.handleMouseLeave = () => {
      this.isShellHovered = false
    }

    const shell = document.querySelector('.shell')
    if (shell) {
      shell.addEventListener('mouseenter', this.handleMouseEnter)
      shell.addEventListener('mouseleave', this.handleMouseLeave)
    }
  },
  beforeUnmount() {
    // 使用正确的生命周期钩子
    const shell = document.querySelector('.shell')
    if (shell) {
      shell.removeEventListener('mouseenter', this.handleMouseEnter)
      shell.removeEventListener('mouseleave', this.handleMouseLeave)
    }
  },
}
</script>

<style>
/* 全局样式，没有 scoped 限制 */
.dark-mode section {
  background: #1a1a1a !important;
}

.dark-mode .folder-name {
  color: #fff !important;
}

.dark-mode .folder-item {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

.dark-mode .folder-item:hover {
  background-color: rgba(255, 255, 255, 0.07) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.dark-mode .folder-item .iconfont {
  color: #9785f0 !important;
}
</style>


<style scoped>
section {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 84px;
  display: block;
  transition: all 0.5s ease;
  background: #e4e9f5;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  width: calc(100% - 84px); /* 确保宽度计算正确 */
}

section.shell-expanded {
  left: 300px;
  width: calc(100% - 300px); /* 自动调整宽度 */
}

.folder-container {
  display: grid;
  /* 动态调整网格列宽，根据容器宽度自动适应 */
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  transition: all 0.3s ease;
}

/* 当shell展开时调整folder-container布局 */
.container-expanded {
  /* 稍微调整网格大小以适应更窄的空间 */
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
  box-sizing: border-box;
  padding: 10px;
  /* 设置固定高度确保一致性 */
  height: 130px;
  /* 添加背景色和圆角使文件夹更突出 */
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.folder-item:hover {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.folder-item .iconfont {
  font-size: 84px;
  color: #6e5af0;
  margin-bottom: 8px;
}

.folder-name {
  font-size: 14px;
  color: #333;
}


</style>
