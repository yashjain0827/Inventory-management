import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BillDetails = () => {
  const { state } = useLocation();
  const { bill } = state;

  if (!bill) {
    return <div>No bill details available</div>;
  }

  const generateInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Total amount", 14, 20);
    doc.setFontSize(20);
    doc.setTextColor("#008080");
    doc.text(`Rs ${bill.totalAmount}`, 14, 30);

    doc.setFontSize(14);
    doc.setTextColor("#000000");
    doc.text("Date", 150, 20);
    doc.setFontSize(20);
    doc.setTextColor("#008080");
    doc.text(bill.date, 150, 30);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Transaction ID:`, 14, 50);
    doc.setTextColor("#000000");
    doc.text(bill.orderId, 100, 50);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Description:`, 14, 60);
    doc.setTextColor("#000000");
    doc.text(bill.description, 100, 60);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Customer name:`, 14, 70);
    doc.setTextColor("#000000");
    doc.text(bill.customerName, 100, 70);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Quantity:`, 14, 80);
    doc.setTextColor("#000000");
    doc.text(
      bill.products
        .reduce((total, product) => total + product.quantity, 0)
        .toString(),
      100,
      80
    );

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Total Amount (Rs):`, 14, 90);
    doc.setTextColor("#000000");
    doc.text(`${bill.totalAmount}`, 100, 90);

    const tableColumn = ["Code", "Name", "QTY", "Price (Rs)"];
    const tableRows = [];

    bill.products.forEach((product) => {
      const productData = [
        product.productCode,
        product.productName,
        product.quantity,
        `${product.sellingPrice}`,
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      styles: { halign: "center" },
      theme: "striped",
      headStyles: { fillColor: [128, 128, 128] },
    });

    doc.save(`invoice_${bill.transactionId}.pdf`);
  };

  return (
    <div className="bill-details">
      <div className="bill-header">
        <div className="total-amount-section">
          <p>Total amount:</p>
          <h2>Rs {bill.totalAmount}</h2>
        </div>
        <div className="date-section">
          <p>Date:</p>
          <h2>{bill.date}</h2>
        </div>
      </div>

      <div className="bill-info">
        <p>Order ID: {bill.orderId}</p>
        <p>Description: {bill.description}</p>
        <p>Customer name: {bill.customerName}</p>
        <p>
          QTY:{" "}
          {bill.products.reduce(
            (total, product) => total + product.quantity,
            0
          )}
        </p>
        <p>Total Amount: ₹{bill.totalAmount}</p>
      </div>

      <div className="bill-products">
        <h3>Products</h3>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>QTY</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bill.products.map((product, index) => (
              <tr key={index}>
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>₹{product.sellingPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={generateInvoice} className="generate-invoice-button">
        Generate Invoice
      </button>
    </div>
  );
};

export default BillDetails;
