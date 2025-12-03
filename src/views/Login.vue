<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 左侧装饰区域 -->
      <div class="decorative-side">
        <div class="welcome-text">
          <h2>欢迎回来</h2>
          <p>请登录您的账户继续使用我们的服务</p>
          <p>祝你有个愉快的好心情~</p>
        </div>
        <div class="graphic-element">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-side">
        <div class="form-header">
          <h1>用户登录</h1>
          <p>请输入您的账户信息</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group" :class="{ 'error': errors.username }">
            <label for="username">用户名</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </span>
              <input type="text" id="username" v-model="form.username" placeholder="请输入用户名"
                @blur="validateField('username')">
            </div>
            <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
          </div>

          <div class="form-group" :class="{ 'error': errors.password }">
            <label for="password">密码</label>
            <div class="input-container">
              <span class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" />
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password"
                placeholder="请输入密码" @blur="validateField('password')">
              <span class="password-toggle" @click="showPassword = !showPassword">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>

          <div class="form-group" :class="{ 'error': errors.captchaCode }">
            <label for="captchaCode">验证码</label>
            <div class="input-container" style="justify-content: space-between;">
              <input id="captchaCode" v-model="form.captchaCode" placeholder="请输入验证码" @blur="validateField('code')"
                style="width: 200px;">
              <img :src="'data:image/png;base64,' + imageUrl" alt=""
                style="width: 100px;height: 40px;margin-left: 10px; border: 1px solid gray;border-radius: 10px;cursor: pointer;"
                @click="getCode">
            </div>
            <span class="error-message" v-if="errors.captchaCode">{{ errors.captchaCode }}</span>
          </div>

          <div class="form-options"></div>
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="!loading">登录</span>
            <div v-else class="loading-spinner"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import {
  login as loginApi,
  getYanzhengma as getYanzhengmaApi,
  getUserInfor as getUserInforApi
} from '@apis/login'
const router = useRouter()
// 响应式数据
const form = reactive({
  username: 'admin',
  password: 'admin123',
  remember: false,
  captchaId: '',
  captchaCode: ''
})

const errors = reactive({
  username: '',
  password: '',
  captchaCode: ''
})


const imageUrl = ref(null)
const showPassword = ref(false)
const loading = ref(false)

// 表单验证
const validateField = (field) => {
  if (field === 'username') {
    if (!form.username.trim()) {
      errors.username = '用户名不能为空'
    } else if (form.username.length < 3) {
      errors.username = '用户名至少3个字符'
    } else {
      errors.username = ''
    }
  }

  if (field === 'password') {
    if (!form.password) {
      errors.password = '密码不能为空'
    } else if (form.password.length < 6) {
      errors.password = '密码至少6个字符'
    } else {
      errors.password = ''
    }
  }

  if (field === 'code') {
    if (!form.captchaCode) {
      errors.captchaCode = '验证码不能为空'
    } else if (form.captchaCode.length != 5) {
      errors.captchaCode = '请正确输入验证码'
    } else {
      errors.captchaCode = ''
    }
  }
}

// 登录处理
const handleLogin = async () => {
  validateField('username')
  validateField('password')
  validateField('code')

  if (errors.username || errors.password || errors.captchaCode) {
    return
  }

  loading.value = true
  // 模拟登录请求
  try {
    const { data: { token = '' } = {} } = await loginApi({
      loginName: form.username,
      password: form.password,
      captchaId: form.captchaId,
      captchaCode: form.captchaCode
    })
    sessionStorage.setItem('token', token)
    await getUser()
  } catch (error) {
  }
  getCode();
  loading.value = false
}

async function getUser() {
  try {
    const data = await getUserInforApi()
    console.log(data,'222222222222')
    sessionStorage.setItem('username', username)
    ElMessage.success(`登录成功！欢迎 ${username}`)
    // router.push('/viewer')
  } catch (error) {

  }
}

async function getCode() {
  try {
    const { data = {} } = await getYanzhengmaApi()
    form.captchaId = data.captchaId
    imageUrl.value = data.imageBase64
  } catch (error) {
  }
}
getCode();
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.login-card {
  display: flex;
  width: 900px;
  height: 550px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.decorative-side {
  flex: 1;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  .welcome-text {
    z-index: 2;

    h2 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    p {
      opacity: 0.9;
      font-size: 16px;
    }
  }

  .graphic-element {
    position: relative;
    height: 200px;

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }

    .circle-1 {
      width: 120px;
      height: 120px;
      bottom: -30px;
      left: -30px;
    }

    .circle-2 {
      width: 80px;
      height: 80px;
      bottom: 60px;
      right: 20px;
    }

    .circle-3 {
      width: 60px;
      height: 60px;
      top: 20px;
      right: 40px;
    }
  }
}

.form-side {
  flex: 1;
  padding: 10px 40px;
  display: flex;
  flex-direction: column;

  .form-header {
    text-align: center;

    h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 600;
    }

    p {
      color: #666;
      font-size: 14px;
    }
  }
}

.login-form {
  flex: 1;

  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;

      .input-icon {
        position: absolute;
        left: 15px;
        color: #999;
        z-index: 2;
      }

      input {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 2px solid #e1e5e9;
        border-radius: 10px;
        font-size: 16px;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #6e8efb;
          box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.1);
        }

        &::placeholder {
          color: #aaa;
        }
      }

      .password-toggle {
        position: absolute;
        right: 15px;
        color: #999;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #6e8efb;
        }
      }
    }

    &.error {
      .input-container input {
        border-color: #ff4757;
      }
    }

    .error-message {
      display: block;
      color: #ff4757;
      font-size: 12px;
      margin-top: 5px;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    font-size: 14px;

    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;

      input {
        display: none;
      }

      .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid #e1e5e9;
        border-radius: 4px;
        margin-right: 8px;
        position: relative;
        transition: all 0.3s ease;
      }

      input:checked+.checkmark {
        background: #6e8efb;
        border-color: #6e8efb;

        &::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }

    .forgot-password {
      color: #6e8efb;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #5a7df4;
        text-decoration: underline;
      }
    }
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(110, 142, 251, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
  }

  .register-link {
    text-align: center;
    font-size: 14px;
    color: #666;

    a {
      color: #6e8efb;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: #5a7df4;
        text-decoration: underline;
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  .decorative-side {
    padding: 30px;
    min-height: 200px;
  }

  .form-side {
    padding: 30px 25px;
  }
}
</style>