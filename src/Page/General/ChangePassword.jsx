import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import FormGroup from '../../components/FormGroup';
import useFetch from '../../CustomHooks/useFetch';

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const Data = {
    CurrentPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
}

const ChangePassword = () => {
    const navigate = useNavigate();

    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validate form
    // useEffect(() => {
    //     setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !==''));
    // }, [validationErrors, formData]);

    // const validateField = (name, value) => {
    //     let errorMessage = '';
    //     switch (name) {
    //         case 'Name':
    //             errorMessage = /^[A-Za-z\s]{1,15}$/.test(value) ? '' : 'User name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.';
    //             break;
    //         case 'Email':
    //             errorMessage = /\S+@\S+\.\S+/.test(value) ? '' : 'Email must contain `@` and cannot contain other special characters..';
    //             break;
    //         case 'Phone':
    //             errorMessage = /^\+?[0-9]\d{1,20}$/.test(value) ? '' : 'Phone number must be 10 digits.';
    //             break;
    //         case 'Address':
    //             errorMessage = /^[A-Za-z0-9\s]{1,300}$/.test(value) ? '' : 'Address is invalid, cannot contain special characters, and must have a maximum of 50 characters.';
    //             break;
    //         default:
    //             break;
    //     }
    //     setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    // };

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        // validateField(name, value);
    };

    const handleBack = () => {
        navigate('/home/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ApiResponse}users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },

                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const data = response.json();
                data.then(data => setError(data.message))
            }
            navigate('/home');
        } catch (error) {
            console.error('Error change password:', error);
            setError('Failed to change passwword. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Change Password</div>
                </div>
            </div>

            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form onSubmit={handleSubmit}>
                            <FormGroup
                                label={'Current Password'}
                                inputType={'password'}
                                inputName={'CurrentPassword'}
                                value={formData.CurrentPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.CurrentPassword && <div className="error">{validationErrors.CurrentPassword}</div>}

                            <FormGroup
                                label={'New Password'}
                                inputType={'password'}
                                inputName={'NewPassword'}
                                value={formData.NewPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.NewPassword && <div className="error">{validationErrors.NewPassword}</div>}

                            <FormGroup
                                label={'Confirm Password'}
                                inputType={'password'}
                                inputName={'ConfirmPassword'}
                                value={formData.ConfirmPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.ConfirmPassword && <div className="error">{validationErrors.ConfirmPassword}</div>}

                            <div className="form-action">
                                <button type="button" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" className="btn">Update</button>
                            </div>
                            {isLoading && <Loading />}
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ChangePassword;
