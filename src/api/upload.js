import axios from 'axios'

/**
 * 上传文件到服务器
 * @param {string} path - 文件上传的目标路径
 * @param {FileList} files - 要上传的文件列表
 * @returns {Promise} - 返回上传结果的Promise
 */
export async function uploadFiles(path, files) {
  const formData = new FormData()
  formData.append('path', path)

  // 添加所有选择的文件
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 添加上传进度处理
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`上传进度: ${percentCompleted}%`)
      },
    })

    return response.data
  } catch (error) {
    console.error('上传文件时发生错误:', error)
    throw error
  }
}
