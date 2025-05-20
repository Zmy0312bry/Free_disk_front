import axios from 'axios'

/**
 * 上传文件到服务器并提交到Git
 * @param {File} file - 要上传的文件对象
 * @param {string} targetRelativePath - 目标相对路径
 * @param {Function} progressCallback - 上传进度回调函数
 * @returns {Promise} - 返回上传结果的Promise
 */
export async function uploadFiles(file, targetRelativePath, progressCallback = null) {
  // 创建FormData对象
  const formData = new FormData();

  // 添加文件到FormData
  formData.append('file', file);

  // 添加目标路径
  formData.append('targetRelativePath', targetRelativePath);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/git/upload-and-push`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // 添加上传进度处理
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (progressCallback) {
            progressCallback(percentCompleted);
          }
          console.log(`上传进度: ${percentCompleted}%`);
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('上传文件时发生错误:', error);
    throw error;
  }
}

/**
 * 获取文件树数据
 * @returns {Promise} 文件树数据
 */
export async function fetchFileTree() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/git-tree`);
    return response.data;
  } catch (error) {
    console.error('获取文件树失败:', error);
    // 返回默认的模拟数据
    return {
      success: true,
      message: '获取文件树成功(本地数据)',
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
    };
  }
}


/**
 * 当路径变化时执行稀疏拉取操作
 * @param {string} currentPath - 当前路径，根路径使用空字符串
 * @returns {Promise} - 返回请求结果的Promise
 */
export async function sparsePull(currentPath) {
  // 处理工作区参数，根路径用空字符串，其他路径以/开头
  const workspace = currentPath === 'root' ? '' : currentPath;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/git/sparse-pull`,
      { workspace },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('执行稀疏拉取时发生错误:', error);
    throw error;
  }
}


/**
 * 创建新文件夹
 * @param {string} baseDir - 基础目录路径，根目录使用空字符串
 * @param {string} folderName - 新文件夹名称
 * @returns {Promise} - 返回创建结果的Promise
 */
export async function createFolder(baseDir, folderName) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/file/folder`,
      {
        baseDir,
        folderName
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('创建文件夹时发生错误:', error);
    throw error;
  }
}


/**
 * 删除文件或文件夹
 * @param {string} path - 要删除的文件或文件夹路径
 * @returns {Promise} - 返回删除结果的Promise
 */
export async function deleteFileOrFolder(path) {
  try {
    // 处理路径，如果是root则变为/
    const formattedPath = path === 'root' ? '/' : path;

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/file/delete`,
      {
        data: { path: formattedPath },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('删除文件或文件夹时发生错误:', error);
    throw error;
  }
}

/**
 * 下载文件或文件夹到安装目录
 * @param {string} sourcePath - 要下载的文件或文件夹路径
 * @returns {Promise} - 返回下载结果的Promise
 */
export async function downloadFileOrFolder(sourcePath) {
  try {
    // 处理路径，如果是root则变为/
    const formattedPath = sourcePath === 'root' ? '/' : sourcePath;

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/file/copy-to-install`,
      { sourcePath: formattedPath },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('下载文件或文件夹时发生错误:', error);
    throw error;
  }
}
