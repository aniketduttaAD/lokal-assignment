import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { Job } from '../types';

export const storage = new MMKV();

interface JobsState {
    jobs: Job[];
    bookmarkedJobs: Job[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    searchQuery: string;
    setJobs: (jobs: Job[]) => void;
    appendJobs: (jobs: Job[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setHasMore: (hasMore: boolean) => void;
    setCurrentPage: (page: number) => void;
    setSearchQuery: (query: string) => void;
    toggleBookmark: (job: Job) => void;
    initializeBookmarkedJobs: () => void;
}

// Load bookmarked jobs from storage
const loadBookmarkedJobs = (): Job[] => {
    const bookmarksJson = storage.getString('bookmarkedJobs');
    if (bookmarksJson) {
        try {
            return JSON.parse(bookmarksJson);
        } catch (e) {
            console.error('Failed to parse bookmarked jobs', e);
        }
    }
    return [];
};

// Save bookmarked jobs to storage
const saveBookmarkedJobs = (jobs: Job[]) => {
    storage.set('bookmarkedJobs', JSON.stringify(jobs));
};

const useJobsStore = create<JobsState>((set, get) => ({
    jobs: [],
    bookmarkedJobs: loadBookmarkedJobs(),
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    searchQuery: '',

    setJobs: (jobs) => set({ jobs }),

    appendJobs: (newJobs) => {
        set((state) => {
            const existingJobIds = new Set(state.jobs.map(job => job.id));
            const uniqueNewJobs = newJobs.filter(job => !existingJobIds.has(job.id));
            const updatedJobs = uniqueNewJobs.map(job => ({
                ...job,
                is_bookmarked: state.bookmarkedJobs.some(b => b.id === job.id)
            }));

            return {
                jobs: [...state.jobs, ...updatedJobs]
            };
        });
    },
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    setHasMore: (hasMore) => set({ hasMore }),

    setCurrentPage: (page) => set({ currentPage: page }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleBookmark: (job) => {
        if (!job || typeof job.id === 'undefined') return;

        set((state) => {
            const jobExists = state.bookmarkedJobs.some(b => b.id === job.id);
            let newBookmarkedJobs: Job[];

            if (jobExists) {
                newBookmarkedJobs = state.bookmarkedJobs.filter(b => b.id !== job.id);
            } else {
                newBookmarkedJobs = [...state.bookmarkedJobs, { ...job, is_bookmarked: true }];
            }
            const updatedJobs = state.jobs.map(j =>
                j.id === job.id ? { ...j, is_bookmarked: !jobExists } : j
            );
            saveBookmarkedJobs(newBookmarkedJobs);

            return {
                bookmarkedJobs: newBookmarkedJobs,
                jobs: updatedJobs
            };
        });
    },

    initializeBookmarkedJobs: () => {
        const bookmarkedJobs = loadBookmarkedJobs();
        set({ bookmarkedJobs });
        set((state) => ({
            jobs: state.jobs.map(job => ({
                ...job,
                is_bookmarked: bookmarkedJobs.some(b => b.id === job.id)
            }))
        }));
    }
}));

export default useJobsStore;