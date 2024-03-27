import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import FormGroup from '../../../components/FormGroup';

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const Data = {
    Name: '',
    Email: '',
    Phone: '',
    Address: '',
    RoleID: '',
    FacultyID: ''
}

const UpdateAccount = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ID and Redirect
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: account } = useFetch(`${ApiResponse}users/${id}?depth=1`);
    const facultyData = useFetch(`${ApiResponse}faculties`);
    const roleData = useFetch(`${ApiResponse}roles`);

    // Set Data
    useEffect(() => {
        if (account) {
            setFormData(account);
        }
    }, [account]);

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    }, [validationErrors, formData]);

    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'Name':
                errorMessage = value.trim() ? '' : 'Name is required.';
                break;
            case 'Email':
                errorMessage = /^\S+@\S+\.\S+$/.test(value) ? '' : 'Email is invalid.';
                break;
            case 'Phone':
                errorMessage = /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits.';
                break;
            case 'Address':
                errorMessage = value.trim() ? '' : 'Address is required.';
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

        const inputElement = e.target;
        const isValid = validationErrors[name] === '';

        if (isValid) {
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
        } else {
            inputElement.classList.remove('valid');
            inputElement.classList.add('invalid');
        }

        // Kiểm tra nếu có thông báo lỗi thì thêm class invalid
        if (validationErrors[name]) {
            inputElement.classList.add('invalid');
        }

        // Kiểm tra nếu giá trị là rỗng, thì xoá class valid
        if (value.trim() === '') {
            inputElement.classList.remove('valid');
        }
    };

    const handleBack = () => {
        navigate('/admin/account');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const newFormData = {
            ...formData,
            FacultyID: parseInt(formData.FacultyID),
            RoleID: parseInt(formData.RoleID)
        }

        try {
            const response = await fetch(`${ApiResponse}users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFormData)
            });
            if (!response.ok) {
                throw new Error('Failed to create account');
            }
            navigate(-1);
        } catch (error) {
            console.error('Error creating account:', error);
            setError('Failed to create account. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!account) {
        return <Loading />;
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update Account</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form onSubmit={handleSubmit}>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                onChange={handleChange}
                            />
                            {validationErrors.Name && <div className="error">{validationErrors.Name}</div>}

                            <FormGroup
                                label={'Email'}
                                inputType={'email'}
                                inputName={'Email'}
                                value={formData.Email}
                                onChange={handleChange}
                            />
                            {validationErrors.Email && <div className="error">{validationErrors.Email}</div>}

                            <FormGroup
                                label={'Phone'}
                                inputType={'text'}
                                inputName={'Phone'}
                                value={formData.Phone}
                                onChange={handleChange}
                            />
                            {validationErrors.Phone && <div className="error">{validationErrors.Phone}</div>}

                            <FormGroup
                                label={'Address'}
                                inputType={'text'}
                                inputName={'Address'}
                                value={formData.Address}
                                onChange={handleChange}
                            />
                            {validationErrors.Address && <div className="error">{validationErrors.Address}</div>}


                            <div className="form-group">
                                <label>Role</label>
                                <select value={formData.RoleID} onChange={handleChange} className='form-control' required name="RoleID">
                                    <option value="" hidden>Select Role</option>
                                    {roleData && Array.isArray(roleData.data) && roleData.data.map((role) => (
                                        <option key={role.ID} value={role.ID}>{role.Name}</option>
                                    ))}
                                </select>
                                {validationErrors.RoleID && <div className="error">{validationErrors.RoleID}</div>}
                            </div>

                            <div className="form-group mb-input">
                                <label>Faculty</label>
                                <select value={formData.FacultyID} onChange={handleChange} className='form-control' required name="FacultyID">
                                    <option value="" hidden>Select Faculty</option>
                                    {facultyData && Array.isArray(facultyData.data) && facultyData.data.map((faculty) => (
                                        <option key={faculty.ID} value={faculty.ID}>{faculty.Name}</option>
                                    ))}
                                </select>
                                {validationErrors.FacultyID && <div className="error">{validationErrors.FacultyID}</div>}
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid || isLoading} className="btn">Update</button>
                            </div>
                            {isLoading && <Loading />}
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateAccount;
