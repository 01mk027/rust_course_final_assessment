import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        login(username, password)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    return (
        <div id={styles.mainFrame}>
            <div id={styles.loginFormContainer}>
                <form onSubmit={handleLogin} id={styles.loginForm}>
                    <div className='form-control'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='text'
                            id="email"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor='pw'>Password:</label>
                        <input
                            type='password'
                            id="pw"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-control btn btn-info">LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
