import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzExNTEwMTcwLCJleHAiOjE3MTE1MTM3NzB9.TDhy3nljlduMDgwN3BUBi0GfAjHcO3C458MrcoSDA6o'

        fetch(url, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            signal: abortCont.signal
        })
            .then(res => {
                if (!res.ok) {
                    throw Error('Could not fetch the data for that resource');
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setIsPending(false);
                    setError(err.message);
                }
            });

        return () => abortCont.abort();
    }, [url]);

    return { data, isPending, error };
};

export default useFetch;
