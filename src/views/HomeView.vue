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
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="getItemIconSymbol(name, item)"></use>
        </svg>
        <span class="folder-name">{{ name }}</span>

        <!-- 新增操作按钮区域 -->
        <div class="folder-actions">
          <div class="action-button download" @click.stop="downloadItem(name, item)">
            <svg class="icon action-icon" aria-hidden="true">
              <use xlink:href="#icon-xiazai"></use>
            </svg>
          </div>
          <div class="action-button delete" @click.stop="deleteItem(name, item)">
            <svg class="icon action-icon" aria-hidden="true">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加上传进度对话框 -->
    <div class="upload-overlay" v-if="uploading">
      <div class="upload-container">
        <h2>文件上传</h2>

        <div class="file-info">
          <p><strong>文件名:</strong> {{ uploadingFileName }}</p>
          <p><strong>目标路径:</strong> {{ uploadTargetPath }}</p>
        </div>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <div class="progress-text">{{ uploadProgress }}%</div>
        </div>

        <div
          class="status-text"
          :class="{ error: uploadError, success: uploadComplete && !uploadError }"
        >
          {{ uploadStatusText }}
        </div>

        <button
          class="back-button"
          @click="closeUploadDialog"
          :disabled="isUploading && !uploadError"
        >
          {{ uploadComplete || uploadError ? '关闭' : '取消上传' }}
        </button>
      </div>
    </div>

    <!-- 两个按钮 -->
    <div class="upload-buttons-container">
      <!-- 新建文件夹按钮 -->
      <div class="upload-button new-folder-button" @click="createNewFolder">
        <svg class="icon upload-icon" aria-hidden="true">
          <use xlink:href="#icon-xinjianwenjianjia1"></use>
        </svg>
      </div>

      <!-- 文件上传按钮 -->
      <div class="upload-button" @click="triggerFileUpload">
        <svg class="icon upload-icon" aria-hidden="true">
          <use xlink:href="#icon-shangchuan1"></use>
        </svg>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleFileUpload"
          multiple
        />
      </div>
    </div>
  </section>
</template>

<script>
// 导入API函数
import {
  fetchFileTree,
  sparsePull,
  uploadFiles,
  createFolder,
  deleteFileOrFolder,
  downloadFileOrFolder,
} from '../api/home_api.js'
export default {
  name: 'HomeView',
  data() {
    return {
      isShellHovered: false,
      fileData: null,
      currentPath: ['root'],
      currentFiles: {},
      uploading: false,
      // 添加上传相关数据
      isUploading: false, // 是否正在上传
      uploadingFileName: '', // 当前上传的文件名
      uploadTargetPath: '', // 上传目标路径
      uploadProgress: 0, // 上传进度百分比
      uploadStatusText: '准备上传...', // 上传状态文本
      uploadError: false, // 是否有上传错误
      uploadComplete: false, // 上传是否完成
    }
  },
  methods: {
    // 获取文件/文件夹图标Symbol
    getItemIconSymbol(name, item) {
      if (Object.keys(item).length > 0) {
        return '#icon-wenjianjia' // 文件夹图标
      }
      const ext = name.split('.').pop().toLowerCase()
      switch (ext) {
        case 'js':
          return '#icon-JS'
        case 'json':
          return '#icon-wenjiantubiao'
        case 'md':
          return '#icon-MD'
        case 'txt':
        case 'text':
          return '#icon-TEXT'
        case 'bin':
          return '#icon-BIN'
        case 'css':
          return '#icon-CSS'
        case 'doc':
          return '#icon-DOC'
        case 'docx':
          return '#icon-DOCX'
        case 'xls':
        case 'xlsx':
          return '#icon-XLSX'
        case 'html':
          return '#icon-HTML'
        case 'py':
          return '#icon-PY'
        case 'ico':
          return '#icon-ICO'
        case 'jpg':
          return '#icon-JPG'
        case 'jpeg':
          return '#icon-JPEG'
        case 'png':
          return '#icon-PNG'
        case 'ppt':
        case 'pptx':
          return '#icon-PPT'
        case 'rar':
          return '#icon-RAR'
        case 'zip':
          return '#icon-ZIP'
        case 'svg':
          return '#icon-SVG'
        case 'pdf':
          return '#icon-PDF'
        default:
          return '#icon-wenjiantubiao' // 默认文件图标
      }
    },

    // 获取当前路径字符串，用于API调用
    getCurrentPathString() {
      // 如果只有root，返回root
      if (this.currentPath.length === 1 && this.currentPath[0] === 'root') {
        return 'root'
      }
      // 否则返回去掉root的路径
      return this.currentPath.slice(1).join('/')
    },

    // 处理文件/文件夹点击
    async handleItemClick(name, item) {
      console.log(`点击项目: ${name}`, item)
      if (Object.keys(item).length > 0) {
        // 是文件夹，更新路径和显示内容
        console.log(`进入文件夹: ${name}`)
        this.currentPath.push(name)
        this.updateCurrentFiles()

        // 路径变化时调用稀疏拉取API
        try {
          const pathString = this.getCurrentPathString()
          console.log(`路径变化，执行稀疏拉取: ${pathString}`)
          await sparsePull(pathString)
        } catch (error) {
          console.error('稀疏拉取失败:', error)
        }
      } else {
        console.log(`点击文件: ${name}`)
        // 这里可以添加文件处理逻辑
      }
    },

    // 更新当前显示的文件列表
    updateCurrentFiles() {
      console.log('开始更新当前文件列表，当前路径:', this.currentPath)
      let current = this.fileData.data.root

      // 根据当前路径遍历到对应层级
      for (let i = 1; i < this.currentPath.length; i++) {
        console.log(`路径导航: 进入 ${this.currentPath[i]} 层级`)
        if (!current[this.currentPath[i]]) {
          console.error(`路径错误: ${this.currentPath[i]} 不存在!`)
          return
        }
        current = current[this.currentPath[i]]
      }

      console.log('当前目录内容:', Object.keys(current))
      // 过滤掉后缀名为.myignore的文件
      const filteredFiles = {}
      Object.keys(current).forEach((name) => {
        if (!name.endsWith('.myignore')) {
          filteredFiles[name] = current[name]
        }
      })
      console.log('当前目录内容(过滤后):', Object.keys(filteredFiles))
      this.currentFiles = filteredFiles
    },

    // 路径导航点击
    async navigateToPath(index) {
      console.log(`路径导航点击: 从 ${this.currentPath.join('/')} 切换到索引 ${index}`)
      // 截取到点击的位置
      this.currentPath = this.currentPath.slice(0, index + 1)
      console.log('新路径:', this.currentPath.join('/'))
      this.updateCurrentFiles()
      // 路径变化时调用稀疏拉取API
      try {
        const pathString = this.getCurrentPathString()
        console.log(`路径变化，执行稀疏拉取: ${pathString}`)
        await sparsePull(pathString)
      } catch (error) {
        console.error('稀疏拉取失败:', error)
      }
    },

    // 模拟获取文件树数据
    // 获取文件树数据
    async fetchFileTree() {
      console.log('开始获取文件树数据...')
      try {
        console.time('文件树获取耗时')
        // 使用API文件中的函数获取文件树
        const response = await fetchFileTree()
        console.timeEnd('文件树获取耗时')

        console.log('文件树获取成功，数据结构:', {
          hasData: !!response,
          rootKeys: response?.data ? Object.keys(response.data) : '无数据',
        })

        this.fileData = response
        this.updateCurrentFiles()
      } catch (error) {
        console.error('获取文件树失败:', error)
        console.log('错误详情:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
        })

        // 可以添加用户提示
        this.$message?.error?.('获取文件列表失败，请刷新页面重试') ||
          alert('获取文件列表失败，请刷新页面重试')
      }
    },

    // 触发文件选择对话框
    triggerFileUpload() {
      console.log('触发文件上传对话框')
      this.$refs.fileInput.click()
    },
    // 处理文件上传 - 修改现有方法
    async handleFileUpload(event) {
      const files = event.target.files
      if (!files || files.length === 0) {
        console.log('未选择任何文件')
        return
      }

      console.log(
        `选择了 ${files.length} 个文件:`,
        Array.from(files).map((f) => f.name),
      )

      // 获取当前路径（去掉root）
      const currentPathString = this.currentPath.slice(1).join('/') || '/'
      this.uploadTargetPath = currentPathString
      console.log('上传目标路径:', currentPathString)

      // 目前只处理第一个文件
      const file = files[0]
      this.uploadingFileName = file.name

      // 显示上传对话框
      this.uploading = true
      this.isUploading = true
      this.uploadProgress = 0
      this.uploadStatusText = '正在上传...'
      this.uploadError = false
      this.uploadComplete = false
      try {
        // 调用API上传文件
        const result = await uploadFiles(file, currentPathString, (progress) => {
          this.uploadProgress = progress
        })

        // 上传成功
        this.uploadProgress = 100
        this.uploadComplete = true
        this.uploadStatusText = `文件上传成功! ${result.message || ''}`

        // 刷新文件列表
        setTimeout(() => {
          this.fetchFileTree()
        }, 1000)
      } catch (error) {
        // 上传失败
        this.uploadError = true
        this.uploadStatusText = `上传失败: ${error.message || '未知错误'}`
        console.error('文件上传失败:', error)
      } finally {
        this.isUploading = false
        // 重置文件输入控件，以便用户可以再次选择相同的文件
        this.$refs.fileInput.value = ''
      }
    },
    // 关闭上传对话框
    closeUploadDialog() {
      // 如果正在上传且没有错误，询问用户是否确定取消
      if (this.isUploading && !this.uploadError) {
        if (confirm('上传正在进行中，确定要取消吗？')) {
          // 这里可以添加取消上传的逻辑，如果API支持的话
          this.uploading = false
        }
      } else {
        // 关闭对话框
        this.uploading = false

        // 如果上传成功，刷新文件列表
        if (this.uploadComplete && !this.uploadError) {
          this.fetchFileTree()
        }
      }
    },
    // 新建文件夹方法
    async createNewFolder() {
      console.log('创建新文件夹')
      // 弹出对话框让用户输入文件夹名称
      const folderName = prompt('请输入新文件夹名称:')

      if (folderName) {
        if (folderName.trim() === '') {
          alert('文件夹名称不能为空')
          return
        }

        // 检查文件夹名称是否已存在
        if (this.currentFiles[folderName]) {
          alert(`文件夹 "${folderName}" 已存在`)
          return
        }

        try {
          // 获取当前目录路径
          let baseDir = ''
          if (this.currentPath.length > 1) {
            // 如果不是根目录，则构造路径
            baseDir = '/' + this.currentPath.slice(1).join('/')
          }

          console.log(`创建文件夹: ${folderName}, 在路径: ${baseDir || '根目录'}`)

          // 调用API创建文件夹
          const result = await createFolder(baseDir, folderName)

          console.log('创建文件夹结果:', result)

          if (result.success) {
            // 创建成功，刷新文件列表
            this.fetchFileTree()
            alert(`文件夹 "${folderName}" 创建成功!`)
          } else {
            // 创建失败
            alert(`创建文件夹失败: ${result.message || '未知错误'}`)
          }
        } catch (error) {
          console.error('创建文件夹时发生错误:', error)
          alert(`创建文件夹时发生错误: ${error.message || '未知错误'}`)
        }
      }
    },

    // 删除文件/文件夹
    async deleteItem(name, item) {
      console.log(`删除项目: ${name}`, item)

      // 添加删除确认
      const isFolder = Object.keys(item).length > 0
      const confirmMessage = isFolder
        ? `确定要删除文件夹 "${name}" 及其所有内容吗？此操作不可恢复！`
        : `确定要删除文件 "${name}" 吗？此操作不可恢复！`

      if (!confirm(confirmMessage)) {
        return
      }

      try {
        // 构建完整路径
        let fullPath
        if (this.currentPath.length === 1 && this.currentPath[0] === 'root') {
          // 如果在根目录
          fullPath = name
        } else {
          // 如果在子目录，去掉root前缀
          const currentPathWithoutRoot = this.currentPath.slice(1).join('/')
          fullPath = currentPathWithoutRoot ? `${currentPathWithoutRoot}/${name}` : name
        }
        console.log(`删除路径: ${fullPath}`)

        // 调用API删除文件/文件夹
        const result = await deleteFileOrFolder(fullPath)

        if (result.success) {
          // 删除成功，刷新文件列表
          alert(`删除成功: ${name}`)
          this.fetchFileTree()
        } else {
          // 删除失败
          alert(`删除失败: ${result.message || '未知错误'}`)
        }
      } catch (error) {
        console.error('删除时发生错误:', error)
        alert(`删除失败: ${error.message || '未知错误'}`)
      }
    },
    // 下载文件/文件夹
    async downloadItem(name, item) {
      console.log(`下载项目: ${name}`, item)

      // 添加下载确认
      const isFolder = Object.keys(item).length > 0
      const confirmMessage = isFolder
        ? `确定要下载文件夹 "${name}" 到安装目录吗？`
        : `确定要下载文件 "${name}" 到安装目录吗？`

      if (!confirm(confirmMessage)) {
        return
      }

      try {
        // 构建完整路径
        let fullPath
        if (this.currentPath.length === 1 && this.currentPath[0] === 'root') {
          // 如果在根目录
          fullPath = name
        } else {
          // 如果在子目录，去掉root前缀
          const currentPathWithoutRoot = this.currentPath.slice(1).join('/')
          fullPath = currentPathWithoutRoot ? `${currentPathWithoutRoot}/${name}` : name
        }

        console.log(`下载路径: ${fullPath}`)
        // 调用API下载文件/文件夹
        const result = await downloadFileOrFolder(fullPath)

        if (result.success) {
          // 下载成功
          alert(`下载成功: ${name}\n已保存到安装目录`)
        } else {
          // 下载失败
          alert(`下载失败: ${result.message || '未知错误'}`)
        }
      } catch (error) {
        console.error('下载时发生错误:', error)
        alert(`下载失败: ${error.message || '未知错误'}`)
      }
    },
  },
  mounted() {
    console.log('HomeView 组件已挂载')
    // 引入iconfont.js文件
    const script = document.createElement('script')
    script.src = '/src/assets/font/iconfont.js'
    document.head.appendChild(script)

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

    // 检查是否需要刷新文件树和更新路径
    if (this.$route.params.shouldRefresh === 'true' && this.$route.params.refreshPath) {
      console.log('检测到需要刷新数据，参数:', this.$route.params)
      try {
        const pathToNavigate = JSON.parse(this.$route.params.refreshPath)
        console.log('解析后的路径:', pathToNavigate)
        if (Array.isArray(pathToNavigate) && pathToNavigate.length > 0) {
          console.log('设置新路径:', pathToNavigate)
          this.currentPath = pathToNavigate
        }
      } catch (e) {
        console.error('解析返回路径失败:', e)
        console.log('原始路径数据:', this.$route.params.refreshPath)
      }
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

.dark-mode .folder-item .icon {
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

.dark-mode .upload-button {
  background-color: rgba(110, 90, 240, 0.8) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
}

.dark-mode .upload-button:hover {
  background-color: rgba(110, 90, 240, 1) !important;
}

.dark-mode .upload-button .upload-icon {
  color: #fff !important;

  .dark-mode .folder-actions {
    background-color: rgba(0, 0, 0, 0.8) !important;
  }

  .dark-mode .action-button {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .dark-mode .action-button:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  .dark-mode .action-button.download:hover {
    background-color: rgba(76, 175, 80, 0.8) !important;
  }

  .dark-mode .action-button.delete:hover {
    background-color: rgba(244, 67, 54, 0.8) !important;
  }
}
</style>

<style scoped>
/* Symbol 图标全局样式 */
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

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
  margin-right: auto;
  max-width: 800px;
  display: flex; /* 添加flex布局 */
  justify-content: flex-start; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.path-item {
  display: inline-flex; /* 改为inline-flex更好地控制对齐 */
  align-items: center; /* 垂直居中内容 */
  color: #333;
  cursor: pointer;
  font-size: 22px;
  transition: color 0.3s;
  height: 24px; /* 设置固定高度确保垂直居中一致 */
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

.folder-item .icon {
  font-size: 84px;
  margin-bottom: 8px;
  color: #333;
}

.folder-name {
  font-size: 14px;
  color: #333;
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  padding: 0 5px;
}

/* 上传按钮容器 */
.upload-buttons-container {
  position: fixed;
  right: 50px;
  bottom: 50px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 100;
}

/* 上传按钮样式 */
.upload-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(110, 90, 240, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.upload-button:hover {
  transform: scale(1.1);
  background-color: rgba(110, 90, 240, 1);
}

.upload-button .upload-icon {
  font-size: 40px;
  color: white;
}

.upload-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.upload-container {
  max-width: 600px;
  max-height: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-size: 22px;
}

.file-info {
  margin-bottom: 30px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #6e5af0;
}
.file-info p {
  margin: 8px 0;
  word-break: break-all;
  font-size: 16px;
}

.progress-container {
  margin: 30px 0;
}

.progress-bar {
  height: 20px;
  background-color: #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background-color: #6e5af0;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-weight: bold;
  color: #6e5af0;
  font-size: 15px;
}

.status-text {
  text-align: center;
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
  font-size: 16px;
}
.status-text.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.status-text.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.back-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #6e5af0;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #5a48c0;
}

.back-button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
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
  position: relative; /* 添加相对定位以便放置操作按钮 */
  overflow: hidden; /* 隐藏溢出的操作按钮 */
}

/* 操作按钮容器 */
.folder-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 0;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}
/* 悬停时显示操作按钮 */
.folder-item:hover .folder-actions {
  opacity: 1;
  transform: translateY(0);
}

/* 操作按钮样式 */
.action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: 0 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.action-button.download:hover {
  background-color: #4caf50;
}

.action-button.delete:hover {
  background-color: #f44336;
}

.action-icon {
  font-size: 20px;
  color: white;
}
</style>
