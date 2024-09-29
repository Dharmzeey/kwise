export interface User {
//   name?: string | null | undefined;
//   role?: string;
//   userName?: string;
  access_token: string;
  data: UserData;
}

interface UserData {
  id: string;
  email: string;
  phone_number: string;
}
