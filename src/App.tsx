// App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
};

export default App;
