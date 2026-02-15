import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { toast } from 'sonner';

export const useMutationWrapper = <TData = unknown, TError = AxiosError, TVariables = void, TContext = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
    return useMutation<TData, TError, TVariables, TContext>({
        mutationFn: async (variables) => {
            try {
                return await mutationFn(variables);
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const message = axiosError.response?.data?.message || 'Something went wrong';
                console.error('Mutation Error:', message);
                // toast.error(message);
                throw error;
            }
        },
        ...options,
    });
};
