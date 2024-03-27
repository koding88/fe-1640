import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';

const Data = {
    Name: '',
    Description: '',
    IsEnabledGuest: false,
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const CreateFaculty = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        navigate('/admin/faculty');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        const newFormData = {
            ...formData,
            IsEnabledGuest: formData.IsEnabledGuest === 'true' ? true : false,
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ApiResponse}faculties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFormData)
            });
            if (!response.ok) {
                throw new Error('Failed to create faculty');
            }
            navigate('/admin/faculty');
        } catch (error) {
            console.error('Error creating faculty:', error);
            setError('Failed to create faculty. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Create Faculty</div>
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

                            <div className="form-group mb-input">
                                <label>Guest</label>
                                <select value={formData.IsEnabledGuest} onChange={handleChange} className='form-control' name="IsEnabledGuest">
                                    <option value="" hidden>Select Guest</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid || isLoading} className="btn">Create</button>
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

export default CreateFaculty;
