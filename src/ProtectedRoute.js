import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={authenticated ? <Element /> : <Navigate to="/" replace />}
    />
  );
};

export default ProtectedRoute;
