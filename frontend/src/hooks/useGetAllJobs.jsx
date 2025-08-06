import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                // Build query parameters based on search type
                let queryParams = '';
                
                if (searchedQuery) {
                    // Check if it's a salary range filter
                    const salaryRanges = {
                        '0-40k': { min: 0, max: 40000 },
                        '42-1lakh': { min: 42000, max: 100000 },
                        '1lakh to 5lakh': { min: 100000, max: 500000 },
                        '5lakh to 10lakh': { min: 500000, max: 1000000 },
                        '10lakh to 20lakh': { min: 1000000, max: 2000000 },
                        '20lakh to 50lakh': { min: 2000000, max: 5000000 },
                        '50lakh to 1 crore': { min: 5000000, max: 10000000 }
                    };
                    
                    if (salaryRanges[searchedQuery]) {
                        const { min, max } = salaryRanges[searchedQuery];
                        queryParams = `minSalary=${min}&maxSalary=${max}`;
                    } else {
                        // It's a regular keyword search
                        queryParams = `keyword=${encodeURIComponent(searchedQuery)}`;
                    }
                }
                
                const url = `${JOB_API_END_POINT}/get${queryParams ? '?' + queryParams : ''}`;
                console.log('Fetching jobs from:', url);
                
                const res = await axios.get(url, {withCredentials:true});
                console.log('API Response:', res.data);
                
                if(res.data.success){
                    console.log('Jobs fetched successfully:', res.data.jobs.length, 'jobs');
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }
        fetchAllJobs();
    },[searchedQuery])
}

export default useGetAllJobs