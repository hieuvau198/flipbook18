import React from "react";

const ErrorMessage = ({ error }) => (
  error ? <p className="text-red-500 mb-4">{error}</p> : null
);

export default ErrorMessage;
