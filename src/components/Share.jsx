import React from "react";
import { useLocation } from "react-router-dom";

function Share() {
  // Get the current location (URL)
  const location = useLocation();

  // Extract query parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  
  // Get specific query params (like `id`)
  const id = searchParams.get("id");

  return (
    <div>
      {/* Conditionally render content based on query param */}
      {id ? <h1>ID is {id}</h1> : <h1>No ID provided</h1>}
    </div>
  );
}

export default Share;
