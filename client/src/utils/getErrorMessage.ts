import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

type RTKQueryError = FetchBaseQueryError | SerializedError;

const getErrorMessage = (error: RTKQueryError): string => {
  if ("status" in error) {
    // FetchBaseQueryError
    if ("data" in error) {
      const data = error?.data as { message?: string };
      return data?.message || "An unknown error occurred";
    }
    return `Error status: ${error?.status}`;
  } else {
    // SerializedError
    return error?.message || "An unknown error occurred";
  }
};

export default getErrorMessage;
