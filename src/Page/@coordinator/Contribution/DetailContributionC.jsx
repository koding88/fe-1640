import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';

const Data = {
    Name: "",
    Content: "",
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: 1,
    files: [
        {
            Path: ""
        }
    ]
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const DetailContributionC = () => {
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
    // useEffect(() => {
    //     setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    // }, [validationErrors, formData]);

    // const validateField = (name, value) => {
    //     let errorMessage = '';
    //     switch (name) {
    //         case 'Name':
    //             errorMessage = value.trim() ? '' : 'Name is required.';
    //             break;
    //         case 'Content':
    //             errorMessage = value.trim() ? '' : 'Description is required.';
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

        if (name === 'File') {
            const file = e.target.files[0];
            setFormData(prevState => ({
                ...prevState,
                // files: [{ Path: 'C:\\fakepath\\ProjectProposalTemplate.docx' }]
                files: [{ Path: file ? file.name : '' }]
            }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
        // validateField(name, value);
    };

    const handleBack = () => {
        navigate(-1) // Go back | Need to fix
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!isFormValid) {
        //     setError("Please fill in all fields correctly.");
        //     return;
        // }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const { File, ...formDataWithoutFile } = formData;
        const newFormData = {
            ...formDataWithoutFile,
            IsPublic: formData.IsPublic === 'true' ? true : false,
            IsApproved: formData.IsApproved === 'true' ? true : false,
            EventID: parseInt(id),
            UserID: currentUser.ID,
            StatusID: 0,
        };

        console.log(newFormData);

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(); // Tạo một đối tượng FormData mới
            formData.append('Name', formDataWithoutFile.Name);
            formData.append('Content', formDataWithoutFile.Content);
            formData.append('IsPublic', newFormData.IsPublic);
            formData.append('IsApproved', newFormData.IsApproved);
            formData.append('EventID', newFormData.EventID);
            formData.append('UserID', newFormData.UserID);
            formData.append('StatusID', newFormData.StatusID);
            formData.append('File', e.target.elements.File.files[0]); // Lấy file từ input có name là 'File'

            const response = await fetch(`${ApiResponse}contributions`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
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
                    <div className="title">Detail Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution coodinator">
                        <form action="">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" id="name" className="form-control" />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="" id="" cols="30" rows="10"></textarea>
                            </div>

                            <div className="form-group mb-input">
                                <label>File</label>
                                <input type="text" name="name" id="name" className="form-control" />
                            </div>


                            <div className="form-action">
                                <button type="submit" className="btn">Back</button>
                            </div>
                        </form>
                        <div className="form-group update">
                            <label>Image</label>
                            <div className="image-preview">
                                Preview image
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContributionC;
