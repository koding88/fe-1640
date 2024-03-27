import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../Api';
import Logo1 from '../../../public/logo1.png';

const Data = {
    email: '',
    password: ''
}

const LoginAM = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [loginError, setLoginError] = useState(false)
    const navigate = useNavigate();

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    }, [validationErrors, formData]);

    // Validate field
    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'email':
                errorMessage = value.trim() ? '' : 'Email is required.';
                break;
            case 'password':
                errorMessage = value.trim() ? '' : 'Password is required.';
                break;
            default:
                break;
        }
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    };

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    }

    // Handle back
    const handleBack = () => {
        navigate('/login');
    }

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        try {
            const response = await fetch(`${ApiResponse}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/admin/account'
            } else {
                setLoginError(true);
                setError(data.message.message);
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            setLoginError(true);
            setError('An error occurred while logging in. Please try again later.');
        }
    };

    // useEffect(() => {
    //     if (loginError) {
    //         window.location.href = '/login/admin'
    //     }
    // }, [loginError]);

    return (
        <div className="login-staff">
            <div className="header">
                <div className="logo">
                    <img src={Logo1} alt="" />
                </div>
                <div className="heading">
                    <h1>FPT Education Organization</h1>
                </div>
            </div>
            <div className="content">
                <div className="title">
                    <h2>Login with account and password</h2>
                </div>
                <form onSubmit={handleSubmit} className="form-staff">
                    <div className="box">
                        <div className="input-box">
                            <label>Email</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                            {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                        </div>
                        <div className="input-box">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                            {validationErrors.password && <div className="error">{validationErrors.password}</div>}
                        </div>
                        <div className="button-staff">
                            <button type="button" className="btn" onClick={handleBack}>Back</button>
                            <button type="submit" className="btn" disabled={!isFormValid} >
                                Login
                            </button>
                        </div>
                        {error && <div className="error">{error}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginAM;
