<template>
  <div class="upload-container">
    <h2>文件上传</h2>

    <div class="file-info">
      <p><strong>文件名:</strong> {{ fileName }}</p>
      <p><strong>目标路径:</strong> {{ uploadParams.targetRelativePath }}</p>
    </div>

    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <div class="progress-text">{{ uploadProgress }}%</div>
    </div>

    <div class="status-text" :class="{ error: uploadError, success: uploadComplete && !uploadError }">
      {{ statusText }}
    </div>

    <button class="back-button" @click="goBack" :disabled="uploading && !uploadError">
      {{ uploadComplete || uploadError ? '返回' : '取消上传并返回' }}
    </button>
  </div>
</template>

<script>
import { uploadFiles } from '../api/home_api.js'

export default {
  name: 'UploadView',
  data() {
    return {
      uploadParams: {
        file: null,
        targetRelativePath: '/'
      },
      fileName: '',
      returnPath: [],
      uploadProgress: 0,
      uploading: false,
      uploadComplete: false,
      uploadError: false,
      statusText: '准备上传...'
    }
  },
  created() {
    // 从路由参数中获取上传信息
    if (this.$route.params.uploadParams) {
      this.uploadParams = JSON.parse(this.$route.params.uploadParams)

      // 如果有文件对象，保存文件名
      if (this.uploadParams.file) {
        this.fileName = this.uploadParams.file.name || '未知文件名'
      }
    }

    if (this.$route.params.returnPath) {
      this.returnPath = JSON.parse(this.$route.params.returnPath)
    }

    // 开始上传
    this.startUpload()
  },
  methods: {
    async startUpload() {
      if (!this.uploadParams.file) {
        this.statusText = '错误: 没有指定文件'
        this.uploadError = true
        return
      }

      this.uploading = true
      this.statusText = '正在上传...'

      try {
        // 调用API上传文件
        const result = await uploadFiles(
          this.uploadParams.file,
          this.uploadParams.targetRelativePath,
          (progress) => {
            this.uploadProgress = progress
          }
        )

        this.uploadProgress = 100
        this.uploadComplete = true
        this.statusText = `文件上传成功! ${result.message || ''}`

        // 2秒后自动返回
        setTimeout(() => {
          this.goBack()
        }, 2000)

      } catch (error) {
        this.uploadError = true
        this.statusText = `上传失败: ${error.message || '未知错误'}`
        console.error('文件上传失败:', error)
      } finally {
        this.uploading = false
      }
    },

    goBack() {
      // 返回到文件浏览页面并重新加载当前目录
      this.$router.push({
        name: 'home',
        params: {
          refreshPath: JSON.stringify(this.returnPath),
          shouldRefresh: 'true'
        }
      })
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.upload-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
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
}

.status-text {
  text-align: center;
  padding: 10px;
  margin: 20px 0;
  border-radius: 5px;
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
</style>
