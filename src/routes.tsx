import { Routes, Route } from "react-router-dom";

import Home from "@/home";
import AiMemoryCalculator from "@/pages/ai-memory-calculator";
import EnergySystemCalculator from "./pages/energy-system-calculator";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/calculators/ai-memory"
        element={<AiMemoryCalculator />}
      />
      <Route
          path="/calculators/energy-system"
          element={<EnergySystemCalculator />}
      />
    </Routes>
  );
}