import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

export default function InvoiceBuilder() {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);

  const invoiceRef = useRef();

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "description" ? value : Number(value);
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const generatePDF = () => {
    if (!invoiceRef.current) {
      alert("Invoice not found!");
      return;
    }
    html2pdf()
      .set({
        margin: 0.5,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(invoiceRef.current)
      .save()
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 max-w-3xl mx-auto">
        <style>{`
      * {
        color: black !important;
        background-color: white !important;
        border-color: black !important;
      }
      /* Override Tailwind blue-950 to a safe color */
      .text-blue-950 {
        color: #1e3a8a !important; /* a safe blue hex */
      }
      .bg-blue-950 {
        background-color: #1e3a8a !important;
      }
      .hover\\:bg-blue-600:hover {
        background-color: #2563eb !important;
      }
    `}</style>
      <h2 className="text-2xl font-bold mb-6 text-blue-950 text-center">INVOICE BUILDER</h2>

      {/* Client Details */}
      <h1 className="text-xl font-bold mb-5">Bill To:</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Client Address"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Mobile Number"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Client Email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Items Table */}
      <table className="w-full border-2 mb-6 border-collapse border-gray-400">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 border border-gray-400">Description</th>
            <th className="p-2 border border-gray-400 w-20">Qty</th>
            <th className="p-2 border border-gray-400 w-32">Price</th>
            <th className="p-2 border border-gray-400 w-32">Total</th>
            <th className="p-2 border border-gray-400 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-400 p-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-400 p-2 text-right">
                ₹{(item.quantity * item.price).toFixed(2)}
              </td>
              <td className="border border-gray-400 p-2 text-center">
                <button onClick={() => removeItem(index)} className="text-red-500 font-bold">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className="mb-6 px-4 py-2 bg-blue-500 text-white rounded">
        + Add Item
      </button>

      {/* Totals */}
      <div className="text-right mb-6">
        <p className="font-bold text-blue-950">Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p className="font-bold text-blue-950">Tax (18%): ₹{taxAmount.toFixed(2)}</p>
        <h3 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h3>
      </div>

      {/* Invoice Preview */}
      <div
        ref={invoiceRef}
        className="p-6 border rounded mb-6 bg-white max-w-md mx-auto"
      >
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-4">Invoice #{invoiceNumber}</h2>
            <p className="text-xl mb-2">
              <strong>Bill To:</strong>
            </p>
            <p>
              <strong>Client:</strong> {clientName}
            </p>
            <p>
              <strong>Address:</strong> {clientAddress}
            </p>
            <p>
              <strong>Invoice #:</strong> {invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {invoiceDate}
            </p>
          </div>
          <div className="text-blue-950 text-right">
            <h3 className="font-bold">MR ENTERPRISES</h3>
            <p>13/10 GP Street</p>
            <p>RS Puram</p>
            <p>Coimbatore</p>
            <p>641001</p>
          </div>
        </div>

        <hr className="my-4" />

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300">Description</th>
              <th className="p-2 border border-gray-300">Qty</th>
              <th className="p-2 border border-gray-300">Price</th>
              <th className="p-2 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="p-2 border border-gray-300">{item.description}</td>
                <td className="p-2 border border-gray-300 text-center">{item.quantity}</td>
                <td className="p-2 border border-gray-300 text-right">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border border-gray-300 text-right">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax (18%): ₹{taxAmount.toFixed(2)}</p>
          <h3 className="text-lg font-bold">Total: ₹{total.toFixed(2)}</h3>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="mt-6 px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-600"
      >
        Export as PDF
      </button>
    </div>
  );
}
