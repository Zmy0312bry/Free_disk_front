<template>
  <div class="settings-box">
    <div class="input-group">
      <label for="email" class="label-center">请输入邮箱</label>
      <input type="email" id="email" v-model="email" placeholder="请输入邮箱" />
      <button @click="submitEmail" :disabled="!email" class="btn-primary">保存邮箱</button>
    </div>

    <div class="key-group">
      <button
        v-if="!keyGenerated"
        @click="generateKey"
        :class="{ 'btn-primary': !keyGenerated, 'btn-secondary': keyGenerated }"
      >
        生成随机密钥
      </button>
      <button v-else disabled class="btn-secondary">密钥已生成</button>
      <div v-if="randomKey" class="key-output">
        <p>随机密钥：{{ displayedKey }}</p>
        <!-- 只显示前16位 -->
        <button @click="copyKey" class="btn-primary">复制密钥</button>
      </div>
    </div>

    <!-- 添加文件保存路径设置 -->
    <div class="path-group">
      <label for="save-path" class="label-center">修改文件保存路径</label>
      <div class="path-input-container">
        <input type="text" id="save-path" v-model="savePath" placeholder="请输入文件保存路径" />
        <button @click="updateSavePath" class="btn-primary">确认</button>
      </div>
      <p v-if="pathUpdated" class="path-message">保存路径已更新</p>
    </div>
  </div>
</template>

<script>
import settingAPI from '@/api/setting_api'

export default {
  data() {
    return {
      email: '', // 空白初始值，将从localStorage读取
      randomKey: '', // 存储生成的随机密钥
      emailSubmitted: true, // 默认邮箱已提交
      keyGenerated: false, // 标记密钥是否已生成
      savePath: '', // 文件保存路径
      pathUpdated: false, // 路径是否已更新
    }
  },
  computed: {
    // 计算属性，只显示密钥的前16位
    displayedKey() {
      return this.randomKey.slice(0, 16)
    },
  },
  mounted() {
    // 在组件挂载时获取当前保存路径和邮箱
    this.getSavePath()
    this.getStoredEmail()
  },
  methods: {
    // 获取存储的邮箱
    getStoredEmail() {
      const storedEmail = localStorage.getItem('userEmail')
      if (storedEmail) {
        this.email = storedEmail
        this.emailSubmitted = true
      } else {
        this.email = 'test@126.com' // 默认邮箱
        this.emailSubmitted = true
      }
    },
    // 提交邮箱 - 只存储在本地
    submitEmail() {
      if (!this.email) {
        alert('请输入邮箱！')
        return
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        alert('请输入有效的邮箱地址！')
        return
      }

      try {
        // 只保存邮箱到本地存储，不发送到后端
        localStorage.setItem('userEmail', this.email)
        this.emailSubmitted = true
        alert('邮箱保存成功！')
      } catch (error) {
        console.error('保存邮箱时发生错误：', error)
        alert('保存邮箱时发生错误！')
      }
    },
    // 生成随机密钥
    async generateKey() {
      if (!this.email) {
        alert('请先保存邮箱！')
        return
      }

      this.keyGenerated = true // 标记密钥已生成
      try {
        const response = await settingAPI.ssh.generateKey(this.email)

        if (response.status === 200 && response.data) {
          const data = response.data
          if (data.success) {
            this.randomKey = data.publicKey // 存储完整密钥
            alert('密钥生成成功！')
          } else {
            alert(data.message || '生成密钥失败！')
            this.keyGenerated = false // 如果生成失败，取消标记
          }
        } else {
          alert('生成密钥失败，请稍后再试！')
          this.keyGenerated = false // 如果生成失败，取消标记
        }
      } catch (error) {
        console.error('生成密钥时发生错误：', error)
        alert('生成密钥时发生错误！请检查网络连接。')
        this.keyGenerated = false // 如果生成失败，取消标记
      }
    },
    // 复制密钥到剪贴板
    copyKey() {
      if (!this.randomKey) {
        alert('请先生成密钥！')
        return
      }
      navigator.clipboard
        .writeText(this.randomKey)
        .then(() => {
          alert('密钥已复制到剪贴板！')
        })
        .catch((err) => {
          console.error('复制密钥失败：', err)
          alert('复制密钥失败！')
        })
    },
    // 获取当前保存路径
    async getSavePath() {
      try {
        // 尝试从API获取保存路径
        const response = await settingAPI.config.getSavePath()
        if (response.status === 200 && response.data) {
          this.savePath = response.data.path || 'D:/Downloads'
        } else {
          // 如果API调用失败，使用默认值
          this.savePath = 'D:/Downloads'
        }
      } catch (error) {
        console.error('获取保存路径时发生错误：', error)
        // 发生错误时使用默认值
        this.savePath = 'D:/Downloads'
      }
    },
    // 更新文件保存路径
    async updateSavePath() {
      if (!this.savePath) {
        alert('请输入保存路径！')
        return
      }

      try {
        const response = await settingAPI.config.updateSavePath(this.savePath)

        if (response.status === 200 && response.data) {
          const data = response.data
          if (data.success) {
            this.pathUpdated = true
            setTimeout(() => {
              this.pathUpdated = false
            }, 3000)
            alert('保存路径已更新！')
          } else {
            alert(data.message || '更新保存路径失败！')
          }
        } else {
          alert('更新保存路径失败，请稍后再试！')
        }
      } catch (error) {
        console.error('更新保存路径时发生错误：', error)
        alert('更新保存路径失败！请检查网络连接。')
      }
    },
  },
}
</script>

<style scoped>
.settings-box {
  width: 450px;
  padding: 30px;
  background: linear-gradient(135deg, #e0f0ff 0%, #ffffff 100%);
  border: 2px solid #a3c5f2;
  border-radius: 10px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.15),
    0 6px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.input-group,
.key-group,
.path-group {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px dashed rgba(110, 90, 240, 0.2);
}

.path-group {
  border-bottom: none;
}

.label-center {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  text-align: center;
  font-weight: 500;
}

.input-group input,
.path-input-container input {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 2px solid #a3c5f2;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.input-group input:focus,
.path-input-container input:focus {
  border-color: rgb(110, 90, 240);
  box-shadow: 0 0 8px rgba(110, 90, 240, 0.2);
  outline: none;
}

.input-group button,
.key-group button,
.path-input-container button {
  padding: 12px 26px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: rgb(110, 90, 240);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: rgb(90, 70, 220);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(110, 90, 240, 0.3);
}

.btn-secondary {
  background-color: #cccccc;
  color: #666666;
}

.key-output {
  margin-top: 15px;
  text-align: center;
  padding: 10px;
  background-color: rgba(110, 90, 240, 0.1);
  border-radius: 6px;
}

.key-output p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-family: monospace;
  letter-spacing: 1px;
}

.path-input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.path-message {
  margin-top: 10px;
  color: rgb(110, 90, 240);
  font-size: 14px;
  font-weight: 500;
}

/* 适应暗黑模式 */
:global(.dark-mode) .settings-box {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border-color: #3d3d3d;
}

:global(.dark-mode) .label-center,
:global(.dark-mode) .key-output p {
  color: #e0e0e0;
}

:global(.dark-mode) .input-group input,
:global(.dark-mode) .path-input-container input {
  background-color: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

:global(.dark-mode) .key-output {
  background-color: rgba(110, 90, 240, 0.2);
}

:global(.dark-mode) .input-group,
:global(.dark-mode) .key-group {
  border-bottom: 2px dashed rgba(110, 90, 240, 0.3);
}

/* 添加邮箱表单的验证状态样式 */
.input-group input.valid {
  border-color: #4caf50;
}

.input-group input.invalid {
  border-color: #f44336;
}
</style>
