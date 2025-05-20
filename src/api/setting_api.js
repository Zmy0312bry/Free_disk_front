import axios from 'axios'

// 获取环境变量中的 API URL，如果不存在则使用默认值
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.21.235.116:3001'
const SSH_API_URL = `${API_BASE_URL}/ssh`
const CONFIG_API_URL = `${API_BASE_URL}/init/config`

// SSH 密钥生成相关 API
const sshAPI = {
  /**
   * 生成 SSH 密钥
   * @param {string} email 用户邮箱
   * @returns {Promise} 包含生成的密钥的响应
   */
  generateKey(email) {
    return axios.post(`${SSH_API_URL}/generate-key`, { email })
  },

  /**
   * 提交邮箱信息（如果后端需要单独的邮箱提交功能）
   * @param {string} email 用户邮箱
   * @returns {Promise} 提交邮箱的响应
   */
  submitEmail(email) {
    return axios.post(`${SSH_API_URL}/submit-email`, { email })
  },
}

// 设置相关 API
const configAPI = {
  /**
   * 更新文件保存路径
   * @param {string} sourcePath 用户设置的保存路径
   * @returns {Promise} 更新路径的响应
   */
  updateSavePath(sourcePath) {
    return axios.post(`${CONFIG_API_URL}/init-install-path`, { sourcePath })
  },

  /**
   * 获取当前保存路径设置
   * @returns {Promise} 获取保存路径的响应
   */
  getSavePath() {
    return axios.get(`${CONFIG_API_URL}/get-install-path`)
  },
}

export default {
  ssh: sshAPI,
  config: configAPI,
}
