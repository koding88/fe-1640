import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import FormGroup from '../../../components/FormGroup';

const Data = {
    Name: '',
    Description: '',
    IsEnabledGuest: false,
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const UpdateFaculty = () => {
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
    const { data: faculty } = useFetch(`${ApiResponse}faculties/${id}`);

    // Set form data
    useEffect(() => {
        if (faculty) {
            setFormData(faculty);
        }
    }, [faculty]);

    // Validate form
    // useEffect(() => {
    //     setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    // }, [validationErrors, formData]);

    // const validateField = (name, value) => {
    //     const errorMessage = {
    //         Name: /^[A-Za-z\s]{1,15}$/.test(value) ? '' : 'Invalid faculty name: no numbers or special characters, max 15 chars',
    //         Description: value.length < 3000 ? '' : 'Description is invalid, must have a maximum of 3000 characters.'
    //     }[name];
    //     setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    // };

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        // validateField(name, value);
    };

    const handleBack = () => {
        navigate('/admin/faculty');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!isFormValid) {
        //     setError("Please fill in all fields correctly.");
        //     return;
        // }

        const newFormData = {
            ...formData,
            IsEnabledGuest: formData.IsEnabledGuest === 'true' ? true : false,
        }

        console.log(newFormData)

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ApiResponse}faculties/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(newFormData)
            });
            if (!response.ok) {
                const data = response.json();
                data.then(data => setError(data.message))
            }
            navigate('/admin/faculty');
        } catch (error) {
            console.error('Error creating faculty:', error);
            setError('Failed to create faculty. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!faculty) {
        return (
            <Loading />
        )
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update faculty</div>
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
                                <button type="submit" className="btn">Update</button>
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

export default UpdateFaculty;
