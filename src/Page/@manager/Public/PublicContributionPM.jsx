import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const headings = ['Name', 'Content', 'Image', 'File', 'Action'];

const ListContributionPM = () => {
    // Fetch data
    const { id } = useParams();
    const { data: contributionData, error } = useFetch(`${ApiResponse}eventss/${id}?depth=1&contribution=true`);

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

    // Filter data
    const filteredContribution = contribution.Contributions ?
        contribution.Contributions.filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    console.log(contribution.Contributions)

    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }


    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Public Contribution</div>
                </div>

                <Search placeholder={'Search Contribution'} value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                        <TableHead headings={headings} />
                        </thead>
                        <tbody>
                        {filteredContribution?.length > 0 ? (
                            filteredContribution?.map((row, index) => (
                                <tr key={index}>
                                    <td>{row?.Name}</td>
                                    <td>{row?.Content}</td>
                                    <td>
                                        <img
                                            width={50 + 'px'}
                                            height={50 + 'px'}
                                            src={row?.Files[0]?.Url}/>
                                    </td>

                                    <td>{(splitFiles(row?.Files[1]?.Url))}</td>

                                    <td colSpan="2">
                                        <span>Download</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headings?.length}>Not Found</td>
                            </tr>
                        )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListContributionPM;
