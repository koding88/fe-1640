import { useState, useEffect } from 'react';
import useFetch from '../../../../CustomHooks/useFetch';
import TableHead from '../../../../components/TableHead';
import Search from '../../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../../../Api';
import Loading from '../../../../components/Loading';

const headings = ['Name', 'Content', 'Image', 'File', 'Status', 'Action'];

const ListContribution = () => {
    // Fetch data
    const { data: contributionData, error } = useFetch(`${ApiResponse}contributions/?depth=1`);

    const { data: fileData, errorFile } = useFetch(`${ApiResponse}files/`);

    // console.log(
    //     fileData.map((file) => file.Url)
    // )

    // State
    const navigate = useNavigate();
    const [contribution, setContribution] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Set Data
    useEffect(() => {
        if (contributionData) {
            setContribution(contributionData);
        }
    }, [contributionData]);

    if (error) {
        {
            console.log('Error fetching data: ', error.message)
        }
        return (
            <Loading />
        )
    }

    if (!contribution) {
        return (
            <Loading />
        )
    }

    // Handle Event
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}contribution/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete contribution');
            }
            setContribution(prevContribution => prevContribution.filter(contribution => contribution.ID !== id));
        } catch (error) {
            console.error('Error deleting contribution:', error);
        }
    };

    const handleSearchChange = (contribution) => {
        setSearchTerm(contribution.target.value);
    };

    const handleCreate = () => {
        navigate('/student/event/contribution/create');
    }

    // Filter data
    const filteredContribution = contribution.filter(contribution =>
        contribution.Name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Contribution</div>
                </div>

                <Search placeholder={'Search Contribution'} value={searchTerm} onChange={handleSearchChange} />

                <div className="create">
                    <button className="custom-button" onClick={handleCreate}>Create</button>
                </div>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredContribution.length > 0 ? (
                                filteredContribution.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Name}</td>
                                        <td>{row.Content}</td>

                                        {
                                            fileData.map((file, index) =>
                                                <td key={index}>
                                                    <img width={100 + 'px'} height={100 + 'px'} src={file.Url} alt="" />
                                                </td>
                                            )
                                        }


                                        <td>File</td>
                                        <td>{row.Status.Name}</td>

                                        <td colSpan="2">
                                            <ul className="menu-action">
                                                <li>
                                                    <Link to={`detail/${row.ID}`}>
                                                        <i className="fa-solid fa-circle-info"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`update/${row.ID}`}>
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to='#' onClick={() => handleDelete(row.ID)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headings.length}>Not Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListContribution;
