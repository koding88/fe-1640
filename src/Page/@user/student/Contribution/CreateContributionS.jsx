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

const CreateContributionS = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
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

    const handleOpen = () => {
        setIsActive(true);
    }

    const handleClose = () => {
        setIsActive(false)
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Create Contribution</div>
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
                                <button type="submit" className="btn" onClick={handleOpen} disabled={!isFormValid || isLoading} >Create</button>
                            </div>

                            <div className={`term-conditions ${isActive ? 'active' : ''}`}>
                                <div className="title">
                                    Term and conditions
                                </div>
                                <div className="content">
                                    <div>General Site Usage</div>
                                    <div>Last Revised: December 16, 2013</div>
                                    <span>Lorem Ipsum is simply dummy text of the printing and typesetting
                                        industry.
                                        Lorem Ipsum has been the industry s standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to
                                        make a type specimen book. It has survived not only five centuries, but
                                        also
                                        the leap into electronic typesetting, remaining essentially unchanged.
                                        It
                                        was popularised in the 1960s with the release of Letraset sheets
                                        containing
                                        Lorem Ipsum passages, and more recently with desktop publishing software
                                        like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                    <div>1. Your Agreement</div>
                                    <span>It is a long established fact that a reader will be distracted by the
                                        readable content of a page when looking at its layout. The point of
                                        using
                                        Lorem Ipsum is that it has a more-or-less normal distribution of
                                        letters, as
                                        opposed to using Content here, content here, making it look like
                                        readable
                                        English.</span>
                                    <span>
                                        PLEASE NOTE: Many desktop publishing packages and web page editors now
                                        use
                                        Lorem Ipsum as their default model text, and a search for lorem ipsum
                                        will
                                        uncover many web sites still in their infancy.
                                    </span>
                                </div>
                                <div className="form-action">
                                    <button type="submit" className="btn" onClick={handleSubmit}>Accept</button>
                                    <button type="submit" className="btn" onClick={handleClose}>Decline</button>
                                </div>
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

export default CreateContributionS;
