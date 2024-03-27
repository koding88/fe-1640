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

const DetailContributionS = () => {
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
                    <div className="title">Detail Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box detail">
                    <div className="box-content contribution detail">
                        <form>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                readOnly={true}
                            />

                            <div className="form-group">
                                <label>Content</label>
                                <textarea name="" id="" cols="30" rows="10" readOnly></textarea>
                            </div>

                            <div className="form-group">
                                <label>Image</label>
                                <div className="image"></div>
                            </div>
                            <div style={{ marginBottom: 116 + 'px' }} ></div>

                            <div className="form-action">
                                <button type="submit" className="btn" onClick={handleBack}>Back</button>
                            </div>

                        </form>
                        <div className="content-right">
                            <table className=" date-time">
                                <tbody>
                                    <tr>
                                        <td className="label">Closure Date</td>
                                        <td className="value">Saturday, 8 April 2023, 11:59 PM</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Due Date</td>
                                        <td className="value">Sunday, 9 April 2023, 11:59 PM</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Time Remaining</td>
                                        <td className="value">Contribution was submitted 7 hours 35 mins</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Last Modified</td>
                                        <td className="value">Sunday, 9 April 2023, 4:23 PM</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="content-flex">
                                <FormGroup
                                    label={'File'}
                                    inputType={'text'}
                                    inputName={'File'}
                                    value={formData.File}
                                    readOnly={true}
                                />

                                <div className="download">
                                    <a href="" download="">
                                        <i className="fa-solid fa-file-arrow-down"></i>
                                    </a>
                                </div>
                            </div>

                            <form action="">
                                <div className="form-group comments">
                                    <label>Comments (3)</label>
                                    <div className="list-comment">
                                        <div className="comment-item">
                                            <div className="user">Nguyen Van A</div>
                                            <div className="description">You should find another procedure.</div>
                                        </div>

                                        <div className="comment-item">
                                            <div className="user">Nguyen Van A</div>
                                            <div className="description">You should find another procedure.</div>
                                        </div>
                                        <div className="comment-item">
                                            <div className="user">Nguyen Van A</div>
                                            <div className="description">You should find another procedure.</div>

                                        </div>
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <input type="text" name="name" id="name" className="form-control"
                                            placeholder="Write a comment..." />
                                        <button type="submit" onClick={handleSubmit}>
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContributionS;
