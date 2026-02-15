import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// Typically you'd import a toast here
// import { toast } from 'sonner'; 

export const useQueryWrapper = <TQueryFnData = unknown, TError = AxiosError, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: () => Promise<TQueryFnData>,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<TQueryFnData, TError, TData>({
        queryKey,
        queryFn: async () => {
            try {
                return await queryFn();
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const message = axiosError.response?.data?.message || 'Something went wrong';
                console.error(`API Error [${queryKey.join(',')}]:`, message);
                // toast.error(message);
                throw error;
            }
        },
        ...options,
    });
};
