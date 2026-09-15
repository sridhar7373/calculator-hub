import { BrowserRouter } from "react-router-dom";

import AppRoutes from "@/routes";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />

        <div className="flex-1">
          <AppRoutes />
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}