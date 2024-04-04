import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';
import useFetch from '../../../CustomHooks/useFetch';
import { jwtDecode } from 'jwt-decode';

const Data = {
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: 1
}

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const UpdateContributionC = () => {
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1`);
    const textFile = contribution?.TextFiles[0]?.Url;
    const imageFile = contribution?.ImageFiles[0]?.Url;
    const EventID = contribution?.EventID;

    console.log(contribution)

    // Set Data
    useEffect(() => {
        if (contribution) {
            const { IsPublic, IsApproved, EventID, UserID, StatusID } = contribution;
            setFormData({ IsPublic, IsApproved, EventID, UserID, StatusID });
        }
    }, [contribution]);


    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleBack = () => {
        navigate(-1) // Go back | Need to fix
    }

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const UserID = decodedToken.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newFormData = {
            IsPublic: formData.IsPublic === 'true' ? true : false,
            IsApproved: formData.IsApproved === 'true' ? true : false,
            EventID: parseInt(id),
            UserID: UserID,
            StatusID: 0,
        };

        console.log(newFormData);

        setIsLoading(true);
        setError(null);

        // Rewrite API Link
        // try {
        //     const response = await fetch(`${ApiResponse}contributions`, {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': 'Bearer ' + localStorage.getItem('token')
        //         },
        //         body: newFormData
        //     });
        //     console.log(response)
        //     if (!response.ok) {
        //         throw new Error('Failed to create contribution');
        //     }
        //     navigate(-1); // Need to fix
        // } catch (error) {
        //     console.error('Error creating contribution:', error);
        //     setError('Failed to create contribution. Please try again later.');
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Grade Contribution </div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution coodinator"
                        style={{ display: 'block' }}
                    >
                        <form
                            style={{ display: 'flex' }}
                        >
                            <div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" name="name" id="name" className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="" id="" cols="30" rows="10"></textarea>
                                </div>

                                <div className="form-group">
                                    <label>File</label>
                                    <input type="text" name="name" id="name" className="form-control" />
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
                                            <button type="submit">
                                                <i className="fa-solid fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>

                            <div
                                style={{ marginLeft: 'auto' }}
                            >
                                <div className="form-group update">
                                    <label>Image</label>
                                    <div className="image-preview">
                                        Preview image
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select className="form-control" name="" id="">
                                            <option value=""></option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Public</label>
                                        <select className="form-control" name="" id="">
                                            <option value=""></option>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-action">
                                    <button type="button" onClick={handleBack} className="btn">Back</button>
                                    <button type="submit" disabled className="btn">Update</button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateContributionC;
