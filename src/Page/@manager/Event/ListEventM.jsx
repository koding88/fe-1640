import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const ListEventM = () => {
    // Fetch data
    const { data: eventData, error } = useFetch(`${ApiResponse}events/?depth=1`);

    // State
    const [events, setEvents] = useState([]);
    const [searchDate, setSearchDate] = useState('');

    // Set Data
    useEffect(() => {
        if (eventData) {
            setEvents(eventData);
        }
    }, [eventData]);

    // Comment no fetch data
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

    const handleDateChange = (event) => {
        setSearchDate(event.target.value);
    };

    // Filter data
    const filteredEvents = events.filter(event =>
        event.FinalDate.includes(searchDate)
    );

    // Combobox date
    // Day
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    // Month
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    // Year
    const years = Array.from({ length: 10 }, (_, i) => i + 2021);

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Event</div>
                </div>

                {/* Filter by date */}
                <div style={
                    {
                        marginRight: '100px',
                    }
                }>
                    <input type="text" name="day" list="dayList" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                    <datalist id='dayList'>
                        {days.map(day => (
                            <option key={day} value={day} />
                        ))}
                    </datalist>
                </div>

                <input type="text"
                    className='filter-event'
                    value={searchDate}
                    placeholder='Filter Event &thinsp;&thinsp;&thinsp;&thinsp;&thinsp;&thinsp;&thinsp; &#128197;'
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    onChange={handleDateChange} />
            </div>

            <div className="row-2 list">
                <div className="box event-card">
                    <div className="list-event">
                        {
                            filteredEvents.length > 0 ? (
                                filteredEvents.map((row, index) => (
                                    <Link key={index} to={`detail/${row.ID}`}>
                                        <div className="event-item" key={index}>
                                            <div className="time-now">Today</div>
                                            <div className="event-title">{row.Name}</div>
                                            <div className="event-description text-truncate">
                                                <div dangerouslySetInnerHTML={{ __html: row.Description }} />
                                            </div>
                                            <div className="due-date">
                                                <i className="fa-regular fa-calendar"></i>
                                                {formatDate(row.FinalDate)}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <Loading />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListEventM;
