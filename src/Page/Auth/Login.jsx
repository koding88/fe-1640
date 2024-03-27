import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../Api';
import Logo1 from '../../../public/logo1.png';
import Background from '../../../public/bg_login1.png';
import useFetch from '../../CustomHooks/useFetch';

const Data = {
    email: '',
    password: '',
    FacultyID: ''
}

const LoginSCG = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);

    // Fetch data
    const facultyData = useFetch(`${ApiResponse}faculties`);

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    }, [validationErrors, formData]);

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

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }
        setError(null);

        const newFormData = {
            ...formData,
            FacultyID: parseInt(formData.FacultyID),
        }

        try {
            const response = await fetch(`${ApiResponse}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFormData)
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsNavigating(true);
                window.location.href = '/student/event'
            } else {
                setError(data.message.message);
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            setError('An error occurred while logging in. Please try again later.');
        }
    };

    const handClick = () => {
        navigate('/login/admin');
    }

    return (
        <>
            <div className="login"
                style={{ backgroundImage: `url(${Background})` }}
            >
                <div className="main">
                    <div className="container">
                        <div className="logo">
                            <img src={Logo1} alt="" />
                        </div>
                        <div className="login-form">
                            <div className="login-box">
                                <h2>Login for Student & Marketing <br /> Coordinator</h2>
                                <form onSubmit={handleSubmit} className="form-login">
                                    <div className="input-box">
                                        <label>Email</label>
                                        <input type="email"
                                            name="email"
                                            onChange={handleChange}
                                            value={formData.email}
                                            placeholder="Enter your email" />
                                    </div>
                                    {validationErrors.email && <div className="error">{validationErrors.email}</div>}

                                    <div className="input-box">
                                        <label>Password</label>
                                        <input type="password"
                                            name="password"
                                            onChange={handleChange}
                                            value={formData.password}
                                            placeholder="Enter your password" />
                                    </div>
                                    {validationErrors.password && <div className="error">{validationErrors.password}</div>}

                                    <div className="forgot-pass">
                                        <a href="#">Forgot password</a>
                                    </div>

                                    <div className="select-form">
                                        <select value={formData.FacultyID} onChange={handleChange} required name="FacultyID">
                                            <option value="" hidden>Select Faculty</option>
                                            {facultyData && Array.isArray(facultyData.data) && facultyData.data.map((faculty) => (
                                                <option key={faculty.ID} value={faculty.ID}>{faculty.Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {validationErrors.FacultyID && <div className="error">{validationErrors.FacultyID}</div>}

                                    <div className="form-submit">
                                        <button type="button" className="btn-guest">Guest</button>
                                        <button type="submit" className="btn-login">Login</button>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <button className="btn-staff" type="button" onClick={handClick}>Login for staff</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSCG;
