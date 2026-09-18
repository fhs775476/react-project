import { useState } from 'react'
import { MIN_PASSWORD_LENGTH, signIn, validateCredentials } from '../lib/auth.js'

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      {!open && (
        <path
          d="M4 20 20 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const [signedInAs, setSignedInAs] = useState('')

  const hasEmailError = Boolean(errors.email)
  const hasPasswordError = Boolean(errors.password)

  function handleSubmit(event) {
    event.preventDefault()
    if (pending) return

    const nextErrors = validateCredentials({ email, password })
    setErrors(nextErrors)
    setFormError('')

    if (nextErrors.email || nextErrors.password) {
      // 把焦点送到第一个出错的字段，方便键盘用户直接修正。
      const firstInvalid = nextErrors.email ? 'login-email' : 'login-password'
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setPending(true)
    signIn({ email: email.trim(), password })
      .then((user) => {
        setSignedInAs(user.email)
        setPassword('')
      })
      .catch((error) => {
        setFormError(error.message)
      })
      .finally(() => {
        setPending(false)
      })
  }

  if (signedInAs) {
    return (
      <main className="auth">
        <section className="card card--success" aria-live="polite">
          <div className="success-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>登录成功</h1>
          <p className="subtitle">
            已以 <strong>{signedInAs}</strong> 的身份登录。
          </p>
          <button
            type="button"
            className="submit submit--ghost"
            onClick={() => setSignedInAs('')}
          >
            退出登录
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth">
      <section className="card" aria-labelledby="login-title">
        <header className="card-header">
          <span className="brand" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3 4 6.5v5c0 4.6 3.3 8.4 8 9.5 4.7-1.1 8-4.9 8-9.5v-5L12 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 id="login-title">欢迎回来</h1>
          <p className="subtitle">请登录以继续访问您的账户</p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <p className="form-error" id="login-form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="field">
            <label htmlFor="login-email">邮箱</label>
            <input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              placeholder="you@example.com"
              value={email}
              disabled={pending}
              aria-invalid={hasEmailError}
              aria-describedby={hasEmailError ? 'login-email-error' : undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
              }}
            />
            {hasEmailError && (
              <p className="field-error" id="login-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="login-password">密码</label>
            <div className="input-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={`至少 ${MIN_PASSWORD_LENGTH} 个字符`}
                value={password}
                disabled={pending}
                aria-invalid={hasPasswordError}
                aria-describedby={hasPasswordError ? 'login-password-error' : undefined}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                }}
              />
              <button
                type="button"
                className="reveal"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-pressed={showPassword}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {hasPasswordError && (
              <p className="field-error" id="login-password-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="row">
            <label className="remember">
              <input type="checkbox" name="remember" disabled={pending} />
              <span>记住我</span>
            </label>
            <a className="link" href="#forgot">
              忘记密码？
            </a>
          </div>

          <button type="submit" className="submit" disabled={pending}>
            {pending && <span className="spinner" aria-hidden="true" />}
            {pending ? '登录中…' : '登录'}
          </button>

          <p className="hint">
            演示账号：任意邮箱 + 密码 <code>password</code>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
