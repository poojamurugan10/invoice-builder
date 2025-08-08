import React from "react";
import InvoiceBuilder from "./Components/InvoiceBuilder";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <InvoiceBuilder />
      </div>
    </div>
  );
}
