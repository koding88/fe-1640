import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';
import useFetch from '../../../CustomHooks/useFetch';

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

const DetailContributionPM = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // const eventID = localStorage.getItem()

    const handleBack = () => {
        navigate(-1); // Go back
    }

    // Fetch data
    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1`);

    // console.log(contribution)

    // Set Data
    useEffect(() => {
        if (contribution) {
            setFormData(contribution);
        }
    }, [contribution]);

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution coodinator manager">
                        <form action="">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" id="name" className="form-control" />
                            </div>

                            <div className="form-group">
                                <label >Description</label>
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
                            <button className="download">Download</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContributionPM;
