type CreateUserData = {
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
};

type LoginUserData = {
    email: string;
    password: string;
};

type PinVerificationData = {
    email_pin: string,
};

type ForgotPasswordData = {
    email: string;
};

type ResetPasswordPinData = {
    email: string,
    reset_token: string,
    email_pin: string;
}

type CreateNewPasswordData = {
    email: string;
    reset_token: string,
    password: string,
    confirm_password: string
}

export type { CreateUserData, LoginUserData, PinVerificationData, ForgotPasswordData, ResetPasswordPinData, CreateNewPasswordData }