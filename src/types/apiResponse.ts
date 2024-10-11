type ApiResponse<T = any> = {
    status?: number;
    message?: string;
    token?: string;
    error?: string;
    data?: T;
};

type ForgotPasswordData = {
    email: string;
};

export type {ApiResponse, ForgotPasswordData}