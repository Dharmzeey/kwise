type ApiResponse<T = any> = {
    // success: boolean;
    message?: string;
    token?: string;
    error?: string;
    data?: T;
};

type ForgotPasswordData = {
    email: string;
};

export type {ApiResponse, ForgotPasswordData}