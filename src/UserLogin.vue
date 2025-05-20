<template>
  <div class="sign">
    <div class="login-box">
      <label for="close" class="close-btn" title="close">x</label>
      <div class="text">白嫖怪网盘</div>
      <form @submit.prevent="submitForm">
        <div class="Account-Information">
          <label>账号</label>
          <input type="text" name="username" required />
        </div>
        <div class="Account-Information">
          <label>密码</label>
          <input type="password" name="password" required />
        </div>
        <div class="forgot-paw">
          <router-link to="/forgot-password">忘记密码？</router-link>
        </div>
        <div class="btn">
          <div class="inner"></div>
          <button type="submit">登录</button>
        </div>
        <div class="signup-link">
          没有账号？<router-link to="/register">注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    submitForm() {
      // 使用Vue Router进行导航
      this.$router.push('/home');
    },
  },
};
</script>

<style scoped>
/* 背景设置 */
body {
  height: 100vh;
  width: 100%;
  background: linear-gradient(115deg, #3f2f74 10%, #000000 90%);
}

/* 登录框大小和背景设置 */
.login-box {
  display: block;
  background: #fff;
  width: 410px;
  padding: 30px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 关闭按钮设置 */
.close-btn {
  position: absolute;
  right: 20px;
  top: 15px;
  font-size: 18px;
  color: #777;
  cursor: pointer;
}
.close-btn:hover {
  color: #3498db;
}

/* 登录框的标题设置 */
.text {
  font-size: 35px;
  font-weight: 600;
  text-align: center;
}
.login-box form {
  margin-top: -20px;
}

/* 登录框的输入框设置 */
.Account-Information {
  height: 45px;
  width: 100%;
  margin: 40px 0;
}

/* 输入框信息提示设置 */
.Account-Information label {
  font-size: 18px;
  font-weight: 500;
}

/* 信息输入框设置 */
.Account-Information input {
  height: 100%;
  width: 100%;
  padding-left: 10px;
  font-size: 17px;
  border: 1px solid silver;
  border-radius: 15px;
  outline: none;
}

/* 输入框聚焦时的效果 */
.Account-Information input:focus {
  border-color: #3f2f74;
  border-bottom-width: 2px;
}

/* 忘记密码设置 */
.forgot-paw {
  margin-top: -8px;
}
.forgot-paw a {
  color: #3f2f74;
  text-decoration: none;
}
.forgot-paw a:hover {
  text-decoration: underline;
}

/* 登录按钮设置 */
.btn {
  margin: 30px 0;
  height: 45px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}
.btn .inner {
  height: 100%;
  width: 300%;
  position: absolute;
  left: -100%;
  z-index: -1;
  background: -webkit-linear-gradient(left, #3f2f74, #000000);
  transition: all 0.4s;
}
.btn:hover .inner {
  left: 0;
}

/* 登录按钮的样式 */
.btn button {
  height: 100%;
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
}

/* 注册链接设置 */
.signup-link {
  text-align: center;
}
.signup-link a {
  color: #3f2f74;
  text-decoration: none;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style>
