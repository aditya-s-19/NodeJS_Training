export interface User {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

export interface DatabaseOperationResult {
  status: number;
  message: string;
  userData?: object;
}

export interface DatabaseOperationResultWithData {
  status: number;
  message: string;
  userData: {
    exists: boolean;
  };
}
