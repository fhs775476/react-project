export const MIN_PASSWORD_LENGTH = 8

// 演示用的账号约定：接入真实后端后删除。
const DEMO_PASSWORD = 'password'
const DEMO_LATENCY = 900

/**
 * 演示用的模拟登录接口。接入真实后端时替换为 fetch 调用，
 * 并保持「成功 resolve 用户、失败 reject Error」的契约即可。
 */
export function signIn({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === DEMO_PASSWORD) {
        resolve({ email })
      } else {
        reject(new Error('邮箱或密码不正确，请重试。'))
      }
    }, DEMO_LATENCY)
  })
}

/** 校验邮箱；内部自行 trim，因此可以安全地接收原始输入。 */
export function validateEmail(value) {
  const email = value.trim()
  if (!email) return '请输入邮箱地址。'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return '邮箱格式不正确。'
  return ''
}

export function validatePassword(value) {
  if (!value) return '请输入密码。'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `密码至少需要 ${MIN_PASSWORD_LENGTH} 个字符。`
  }
  return ''
}

/** 返回 { email, password } 两条错误信息，空字符串代表该项通过。 */
export function validateCredentials({ email, password }) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  }
}
