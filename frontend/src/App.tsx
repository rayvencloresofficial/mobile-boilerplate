import React from "react";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "@/utils/ScrollToTop";
import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/Routes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
