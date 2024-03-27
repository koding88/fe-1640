import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../../components/FormGroup';
import Loading from '../../../../components/Loading';

const Data = {
    Name: '',
    Content: '',
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: 0
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const UpdateContributionS = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

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
            case 'Content':
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
        navigate(-1) // Go back | Need to fix
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        const newFormData = {
            ...formData,
            IsPublic: formData.IsPublic === 'true' ? true : false,
            IsApproved: formData.IsApproved === 'true' ? true : false,
            EventID: parseInt(formData.EventID),
            UserID: parseInt(formData.UserID),
            StatusID: parseInt(formData.StatusID),
        }

        setIsLoading(true);
        setError(null);

        // console.log(newFormData)

        try {
            const response = await fetch(`${ApiResponse}contributions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFormData)
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to create contribution');
            }
            navigate(-1); // Need to fix
        } catch (error) {
            console.error('Error creating contribution:', error);
            setError('Failed to create contribution. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution">
                        <form onSubmit={handleSubmit} encType='multipart/form-data'>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                onChange={handleChange}
                            />
                            {validationErrors.Name && <div className="error">{validationErrors.Name}</div>}

                            <div className="form-group">
                                <label>Content</label>
                                <textarea required name="Content" cols="30" rows="10" value={formData.Content} onChange={handleChange}></textarea>
                                {validationErrors.Content && <div className="error">{validationErrors.Content}</div>}
                            </div>

                            <FormGroup
                                label={'Image'}
                                inputType={'file'}
                                inputName={'Image'}
                                value={formData.Image}
                                addClass={'input-file'}
                                onChange={handleChange}
                            />
                            {validationErrors.Image && <div className="error">{validationErrors.Image}</div>}

                            <FormGroup
                                label={'File'}
                                inputType={'file'}
                                inputName={'File'}
                                value={formData.File}
                                addClass={'input-file'}
                                onChange={handleChange}
                            />
                            {validationErrors.File && <div className="error">{validationErrors.File}</div>}
                            <div className='mb-input'></div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid || isLoading} className="btn">Create</button>
                            </div>
                            {isLoading && <Loading />}
                            {error && <div className="error">{error}</div>}
                        </form>
                        <div className="image-preview"
                            style={{ backgroundImage: 'url(' + formData.Image + ')' }}>
                            Preview image
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateContributionS;
