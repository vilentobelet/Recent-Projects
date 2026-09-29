import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ProductBoard from "@/components/product-board";
import { Toaster } from "@/components/ui/sonner";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductBoard />
    <Toaster position="bottom-center" richColors />
  </StrictMode>,
);
