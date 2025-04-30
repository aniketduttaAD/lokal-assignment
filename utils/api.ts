import axios from 'axios';
import { JobsResponse } from '../types';

const BASE_URL = 'https://testapi.getlokalapp.com';

export const fetchJobs = async (page: number = 1): Promise<JobsResponse> => {
    try {
        const response = await axios.get<JobsResponse>(`${BASE_URL}/common/jobs`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};