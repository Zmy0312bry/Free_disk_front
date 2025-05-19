<template>
  <section :class="{ 'shell-expanded': isShellHovered }">
    <!-- 路径导航 -->
    <div class="path-nav">
      <span
        v-for="(path, index) in currentPath"
        :key="index"
        @click="navigateToPath(index)"
        class="path-item"
      >
        {{ path }}
        <span v-if="index < currentPath.length - 1" class="path-separator">/</span>
      </span>
    </div>

    <!-- 文件夹容器 -->
    <div class="folder-container" :class="{ 'container-expanded': isShellHovered }">
      <div
        class="folder-item"
        v-for="(item, name) in currentFiles"
        :key="name"
        @click="handleItemClick(name, item)"
      >
        <i class="iconfont" :class="getItemIcon(name, item)"></i>
        <span class="folder-name">{{ name }}</span>
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
      fileData: null,
      currentPath: ['root'],
      currentFiles: {},
    }
  },
  methods: {
    // 获取文件/文件夹图标
    getItemIcon(name, item) {
      if (Object.keys(item).length > 0) {
        return 'icon-wenjianjia' // 文件夹图标
      }
      const ext = name.split('.').pop().toLowerCase()
      switch (ext) {
        case 'js':
          return 'icon-JS'
        case 'json':
          return 'icon-wenjiantubiao'
        case 'md':
          return 'icon-MD'
        case 'txt':
        case 'text':
          return 'icon-TEXT'
        case 'bin':
          return 'icon-BIN'
        case 'css':
          return 'icon-CSS'
        case 'doc':
          return 'icon-DOC'
        case 'docx':
          return 'icon-DOCX'
        case 'xls':
        case 'xlsx':
          return 'icon-XLSX'
        case 'html':
          return 'icon-HTML'
        case 'py':
          return 'icon-PY'
        case 'ico':
          return 'icon-ICO'
        case 'jpg':
          return 'icon-JPG'
        case 'jpeg':
          return 'icon-JPEG'
        case 'png':
          return 'icon-PNG'
        case 'ppt':
        case 'pptx':
          return 'icon-PPT'
        case 'rar':
          return 'icon-RAR'
        case 'zip':
          return 'icon-ZIP'
        case 'svg':
          return 'icon-SVG'
        case 'pdf':
          return 'icon-PDF'
        default:
          return 'icon-wenjiantubiao' // 默认文件图标
      }
    },

    // 处理文件/文件夹点击
    handleItemClick(name, item) {
      if (Object.keys(item).length > 0) {
        // 是文件夹，更新路径和显示内容
        this.currentPath.push(name)
        this.updateCurrentFiles()
      }
    },

    // 更新当前显示的文件列表
    updateCurrentFiles() {
      let current = this.fileData.data.root
      // 根据当前路径遍历到对应层级
      for (let i = 1; i < this.currentPath.length; i++) {
        current = current[this.currentPath[i]]
      }
      this.currentFiles = current
    },

    // 路径导航点击
    navigateToPath(index) {
      // 截取到点击的位置
      this.currentPath = this.currentPath.slice(0, index + 1)
      this.updateCurrentFiles()
    },

    // 模拟获取文件树数据
    async fetchFileTree() {
      try {
        // 这里使用模拟数据，实际项目中需要替换为真实的API调用
        this.fileData = {
          success: true,
          message: '获取文件树成功',
          data: {
            root: {
              '.gitignore': {},
              'app.js': {},
              config: {
                'gitConfig.js': {},
              },
              controllers: {
                'gitController.js': {},
                'gitTreeController.js': {},
                'sshController.js': {},
              },
              examples: {
                'useFileTreeIndex.js': {},
              },
              'package.json': {},
              public: {
                '3333.txt': {},
                'hello.txt': {},
                'hello1.txt': {},
                'hello5.txt': {},
                temp: {
                  'gitee_id_rsa_1745845010860.pub': {},
                  'id_ed25519_1745311729219.pub': {},
                  'id_test_1745312938693.pub': {},
                },
                'this.txt': {},
              },
              'readme.md': {},
              routes: {
                'git-tree.js': {},
                'git.js': {},
                'index.js': {},
                'ssh.js': {},
              },
              utils: {
                'fileUtils.js': {},
                'gitTreeUtils.js': {},
                'gitUtils.js': {},
                '111.doc': {},
              },
            },
          },
        }
        this.updateCurrentFiles()
      } catch (error) {
        console.error('获取文件树失败:', error)
      }
    },
  },
  mounted() {
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

    // 获取文件树数据
    this.fetchFileTree()
  },
  beforeUnmount() {
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
  filter: brightness(0.8) contrast(1.2) !important;
}

/* 路径导航样式 */
.dark-mode .path-nav {
  background: rgba(255, 255, 255, 0.03) !important;
}

.dark-mode .path-item {
  color: #fff !important;
}

.dark-mode .path-separator {
  color: #666 !important;
}
</style>

<style scoped>
@import '@/assets/font/iconfont.css';
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
  width: calc(100% - 84px);
}

section.shell-expanded {
  left: 300px;
  width: calc(100% - 300px);
}

/* 路径导航样式 */
.path-nav {
  background: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.path-item {
  display: inline-block;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}

.path-item:hover {
  color: #6e5af0;
}

.path-separator {
  margin: 0 8px;
  color: #999;
}

.folder-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.container-expanded {
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
  height: 130px;
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
  margin-bottom: 8px;
}

.folder-name {
  font-size: 14px;
  color: #333;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  padding: 0 5px;
}
</style>
