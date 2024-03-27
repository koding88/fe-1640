import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import FormGroup from '../../../components/FormGroup';

const Data = {
    Name: '',
    Description: '',
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const UpdateRole = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ID, Redirect
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: role } = useFetch(`${ApiResponse}roles/${id}`);

    // Set form data
    useEffect(() => {
        if (role) {
            setFormData(role);
        }
    }, [role]);

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
            case 'Description':
                errorMessage = value.trim() ? '' : 'Description is required.';
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
        if (validationErrors[name]) {
            inputElement.classList.remove('valid');
            inputElement.classList.add('invalid');
        } else {
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
        }
    };

    const handleBack = () => {
        navigate('/admin/role');
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
            const response = await fetch(`${ApiResponse}roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzExNTEwMTcwLCJleHAiOjE3MTE1MTM3NzB9.TDhy3nljlduMDgwN3BUBi0GfAjHcO3C458MrcoSDA6o'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to create role');
            }
            navigate('/admin/role');
        } catch (error) {
            console.error('Error creating role:', error);
            setError('Failed to create role. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!role) {
        return (
            <Loading />
        )
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update role</div>
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

                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="Description" cols="30" rows="10" value={formData.Description} onChange={handleChange}></textarea>
                                {validationErrors.Description && <div className="error">{validationErrors.Description}</div>}
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

export default UpdateRole;
