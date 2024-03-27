import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const headings = ['Name', 'Description', 'Faculty', 'Closure Date', 'Due Date', 'Action'];

const ListEvent = () => {
    // Fetch data
    const { data: eventData, error } = useFetch(`${ApiResponse}events/?depth=1`);

    // State
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Set Data
    useEffect(() => {
        if (eventData) {
            setEvents(eventData);
        }
    }, [eventData]);

    if (error) {
        {
            console.log('Error fetching data: ', error.message)
        }
        return (
            <Loading />
        )
    }

    if (!events) {
        return (
            <Loading />
        )
    }

    // Handle Event
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}events/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            setEvents(prevEvents => prevEvents.filter(event => event.ID !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreate = () => {
        navigate('/admin/event/create');
    }

    // Filter data
    const filteredEvents = events.filter(event =>
        event.Name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Event</div>
                </div>

                <Search placeholder={'Search Event'} value={searchTerm} onChange={handleSearchChange} />

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
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Name}</td>
                                        <td><div className='text-truncate' dangerouslySetInnerHTML={{ __html: row.Description }} /></td>
                                        <td>{row.Faculty?.Name}</td>
                                        <td>{formatDate(row.ClosureDate)}</td>
                                        <td>{formatDate(row.FinalDate)}</td>

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

export default ListEvent;
