import React, { useState, useEffect } from 'react';
import styles from './Login.less';
import { Button } from 'antd';
import banner from '@/assets/banner.png';
import logo from '@/assets/logo.png';
import { login } from './services/user';
import { GlobalResParams } from '@/types/ITypes';
import { setToken } from '@/utils/cookies.js';

export default () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisbale, setBtnDisable] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account && password) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [account, password]);

  const keyDown = (e) => {
    if (e.keyCode === 13 && !btnDisbale) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    let res: GlobalResParams<string> = await login({email: account, password});
    setLoading(false);
    if (res.status === 200) {
      await setToken('ods_token_front', res.obj, 24);
      window.location.href = '/talent/workflow/home';
    } else {
      setErrorText(res?.msg);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.main}>
        <div className={styles.banWrapper}>
          <img alt="banner" className={styles.banner} src={banner}/>
        </div>
        <div className={styles.loginMain}>
          <div className={styles.title}>
            <img alt="banner" className={styles.logo} src={logo}/>
          </div>
          <div className={styles.formStyle}>
            <div>
              <input
                value={account}
                onKeyUp={keyDown}
                onChange={e => setAccount(e.target.value)}
                placeholder="请输入邮箱或工号"
                className={styles.inputForm}
              />
            </div>
            <div className={styles.pasInput}>
              <input
                type="password"
                value={password}
                onKeyUp={keyDown}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className={styles.inputForm}
              />
            </div>
            <div className={styles.error}>
              {errorText && <span>{errorText}</span>}
            </div>
            <div className={styles.loginBtn}>
              <Button
                type="primary"
                loading={loading}
                disabled={btnDisbale}
                block size="large"
                onClick={handleSubmit}
                style={{border: 'none'}}
              >登录</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}