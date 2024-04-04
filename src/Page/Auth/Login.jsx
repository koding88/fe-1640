import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo1 from '../../../public/logo1.png';
import useFetch from '../../CustomHooks/useFetch';
import { ApiResponse } from '../../Api';
import roles from '../../../roles';

const Data = { email: '', password: ''};

const LoginSCG = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch faculty data
    const facultyData = useFetch(`${ApiResponse}faculties`);

    // Validate form
    const isFormValid = Object.values(validationErrors).every(error => !error) &&
        Object.values(formData).every(value => value !== '');

    const validateField = (name, value) => {
        const errorMessage = {
            email: /\S+@\S+\.\S+/.test(value) ? '' : 'Email requires @ and no other special characters.',
            password: /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(value) ? '' : 'Password must be at least 8 characters with letters and numbers.'
        }[name];
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    }

    useEffect(() => {
        isFormValid && setError(null);
    }, [isFormValid]);

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return setError("Please fill in all fields correctly.");
        const newFormData = { ...formData, FacultyID: parseInt(formData.FacultyID) };
        try {
            const response = await fetch(`${ApiResponse}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                const roleID = data.user.RoleID;
                const rolePaths = {
                    1: '/admin/account',
                    2: '/manager/dashboard',
                    3: '/coordinator/dashboard',
                    4: '/student/event'
                };
                const rolePath = rolePaths[roleID];
                if (rolePath) {
                    navigate(rolePath);
                } else {
                    setError('Unknown role.');
                }
                window.location.reload();

            } else {
                setError(data.message.message);
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            setError('An error occurred while logging in. Please try again later.');
        }
    };

    const handleStaffLogin = () => navigate('/login/admin');

    return (
        <div className="login-1">
            <div className="logo">
                <img src={Logo1} alt="" />
            </div>
            <div className="login-form">
                <div className="login-box">
                    <h2>Login for Student & Marketing <br /> Coordinator</h2>
                    <form onSubmit={handleSubmit} className="form-login">
                        <div className="input-box">
                            <label>Email</label>
                            <input type="email" required name="email" value={formData.email} onChange={handleChange} autoComplete='one' placeholder="Enter your email" />
                        </div>
                        {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                        <div className="input-box">
                            <label>Password</label>
                            <input type="password" required name="password" value={formData.password} onChange={handleChange} autoComplete='one' placeholder="Enter your password" />
                        </div>
                        {validationErrors.password && <div className="error">{validationErrors.password}</div>}
                        <div className="forgot-pass">
                            <Link to={'/forgotpassword'}>Forgot password</Link>
                        </div>
                        <div className="select-form">
                            <select value={formData.FacultyID} onChange={handleChange} required name="FacultyID">
                                <option value="" hidden>Select Faculty</option>
                                {facultyData && Array.isArray(facultyData.data) && facultyData.data.map(faculty => (
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
                <button className="btn-staff" type="button" onClick={handleStaffLogin}>Login for staff</button>
            </div>
        </div>
    );
};

export default LoginSCG;
