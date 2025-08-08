import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import React, { useRef, useState } from "react";

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
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    })
    .from(invoiceRef.current)
    .save()
    .catch(err => console.error(err));
};
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2">
      <h2 className="text-2xl font-bold mb-6 text-blue-950 text-center">INVOICE BUILDER</h2>

      {/* Client Details */}
      <h1 className="text-xl font-bold mb-5">Bill To:</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="border p-2 rounded col-span-1" />
        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Mobile Number" value={clientNumber} onChange={(e) => setClientNumber(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Client Mail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="border p-2 rounded" />
      </div>

      {/* Items Table */}
      <table className="w-full border-2 mb-6">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 border">Description</th>
            <th className="p-2 border w-20">Qty</th>
            <th className="p-2 border w-32">Price</th>
            <th className="p-2 border w-32">Total</th>
            <th className="p-2 border w-12"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input type="text" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} className="w-full p-1 border rounded" />
              </td>
              <td className="border p-2">
                <input type="number" value={item.quantity} min="1" onChange={(e) => updateItem(index, "quantity", e.target.value)} className="w-full p-1 border rounded" />
              </td>
              <td className="border p-2">
                <input type="number" value={item.price} min="0" onChange={(e) => updateItem(index, "price", e.target.value)} className="w-full p-1 border rounded" />
              </td>
              <td className="border p-2 text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
              <td className="border p-2 text-center">
                <button onClick={() => removeItem(index)} className="text-red-500 font-bold">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className="mb-6 px-4 py-2 bg-blue-500 text-white rounded">+ Add Item</button>

      {/* Totals */}
      <div className="text-right mb-6">
        <p className="font-bold text-blue-950">Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p className="font-bold text-blue-950">Tax (18%): ₹{taxAmount.toFixed(2)}</p>
        <h3 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h3>
      </div>

      {/* Invoice Preview */}
      <div id="invoice-preview" className="p-6 border rounded mb-6 bg-white">

        <div className="flex justify-between">
          <div ref={invoiceRef}
        className="bg-white p-8 rounded shadow max-w-md w-full"
>
            <h2 className="text-2xl font-bold mb-4">Invoice #{invoiceNumber}</h2>
            <p className="text-xl mb-2"><strong>Bill To:</strong></p>
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Address:</strong> {clientAddress}</p>
            <p><strong>Invoice #:</strong> {invoiceNumber}</p>
            <p><strong>Date:</strong> {invoiceDate}</p>
          </div>
          <div className="text-blue-950 mt-20">
            <h3 className="font-bold">MR ENTERPRISES</h3>
            <h2 className="font-bold">13/10 GP Street</h2>
            <h2 className="font-bold">RS Puram</h2>
            <h2 className="font-bold">Coimbatore</h2>
            <h2 className="font-bold">641001</h2>
          </div>
        </div>
        <hr className="my-4" />
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border text-center">{item.quantity}</td>
                <td className="p-2 border text-right">₹{item.price.toFixed(2)}</td>
                <td className="p-2 border text-right">₹{(item.quantity * item.price).toFixed(2)}</td>
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

      <button onClick={generatePDF} className=" mt-6 px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-600">Export as PDF</button>
    </div>
  );
}
