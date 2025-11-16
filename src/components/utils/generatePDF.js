import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export const generatePDF = (type, data, from, to, headerImgBase64, footerImgBase64) => {
    // 1. Initialization
    const doc = new jsPDF();
    
    const A4_WIDTH = 210;
    const HEADER_HEIGHT = 30;  // Space for the header image
    const FOOTER_HEIGHT = 30;  // Space for the footer image
    const TEXT_MARGIN = 5;     // Vertical space between elements
    let currentY = 0;          // Tracks the current drawing position
    
    let headers = [];
    let rows = [];

    // --- 2. Draw Header Image ---
    if (headerImgBase64) {
        // Draw image spanning the full width of the page
        doc.addImage(headerImgBase64, 'PNG', 0, 0, A4_WIDTH, HEADER_HEIGHT); 
        currentY = HEADER_HEIGHT + TEXT_MARGIN; // Start text after image + margin
    } else {
        currentY = 20; // Default start position if no header image
    }

    // --- 3. Add Title Text (Below the Header Image) ---
    doc.setFontSize(18);
    // Draw the main title text
    doc.text(`${type.toUpperCase()} REPORT`, 105, currentY, { align: 'center' }); 

    currentY += 8; // Move down 8mm for the date range

    doc.setFontSize(12);
    // Draw the date range text
    doc.text(`From ${from} to ${to}`, 105, currentY, { align: 'center' });

    currentY += 5; // Add a small buffer before the table starts

    // 4. Map Data to Headers and Rows (Logic remains correct)
    switch (type) {
        case 'inventory':
            headers = [['Product Name', 'Stock Qty', 'Company', 'Supplier']];
            rows = data.map(p => [
                p.name,
                p.stock_qty,
                p.company_name,
                p.supplier?.supplier_name || 'N/A'
            ]);
            break;

        case 'orders':
    headers = [['Order ID', 'Customer', 'Phone','Shipping Address', 'Amount', 'Status', 'Date']]; 
    
    rows = data.map(o => {
        // 🔥 FIX 1: Change the check and access from 'o.user' to 'o.users'
        const userName = o.users 
            ? `${o.users.first_name || ''} ${o.users.last_name || ''}`.trim() 
            : 'N/A';
        const phoneNumber = o.users 
            ? o.users.phone_number || 'N/A' 
            : 'N/A';
        const shortId = o.id ? o.id.substring(0, 8) : 'N/A';
        const amount = o.total_amount || 0;
        const formattedAmount = `₹${amount.toFixed(2)}`;
        return [
            shortId,
            userName,
            phoneNumber,
            o.delivery_address || 'N/A',
            formattedAmount,
            o.delivery_status || 'N/A',
            new Date(o.created_at || new Date()).toLocaleDateString()
        ];
    });
    break;

// In generatePDF.js, inside the switch statement, in case 'custom_build':

case 'custom_build':
    // 🔥 UPDATED HEADERS: Replaced 'Specs' with 'Customer' and 'Address'
    headers = [['Build Name', 'Customer', 'Phone', 'Address', 'Price', 'Source', 'Date']]; 
    
    rows = data.map(b => {
        // --- Customer Details ---
        // Access details using the 'customer_user' alias
        const customerName = b.customer_user 
            ? `${b.customer_user.first_name || ''} ${b.customer_user.last_name || ''}`.trim() 
            : 'N/A';
        const customerPhone = b.customer_user?.phone_number || 'N/A';
        const customerAddress = b.customer_user?.address || 'N/A'; // <-- NEW ADDRESS FIELD
        
        // --- Price Formatting ---
        const amount = b.total_price || 0;
        const formattedAmount = `₹${amount.toFixed(2)}`;

        return [
            b.name || 'N/A',
            customerName,      // <-- ADDED CUSTOMER NAME
            customerPhone,     // <-- ADDED PHONE NUMBER
            customerAddress,   // <-- ADDED CUSTOMER ADDRESS
            formattedAmount, 
            b.source || 'N/A',
            new Date(b.created_at || new Date()).toLocaleDateString()
        ];
    });
    break;

case 'repair_requests':
    headers = [['Request ID', 'Customer', 'Phone', 'Issue', 'Technician', 'Status', 'Date']]; 
    
    rows = data.map(r => {
        // --- Customer Details ---
        const customerName = r.customer_user 
            ? `${r.customer_user.first_name || ''} ${r.customer_user.last_name || ''}`.trim() 
            : 'N/A';
        const customerPhone = r.customer_user?.phone_number || 'N/A';
        const techDetails = r.assignment?.[0]?.technician_user;
        const technicianName = techDetails 
            ? `${techDetails.first_name || ''} ${techDetails.last_name || ''}`.trim() 
            : 'Unassigned';
        const shortId = r.id ? r.id.substring(0, 8) : 'N/A';
        return [
            shortId || 'N/A',
            customerName,
            customerPhone, 
            r.issue_description || 'N/A', 
            technicianName, 
            r.status || 'N/A',
            new Date(r.created_at || new Date()).toLocaleDateString()
        ];
    });
    break;

        default:
            headers = [['Message']];
            rows = [['Unknown report type']];
    }

    // --- 5. Generate Table ---
    autoTable(doc, { 
        head: headers,
        body: rows,
        startY: currentY, // Use the dynamically calculated position
        theme: 'grid',
        styles: { fontSize: 11 }
    });

    // --- 6. Add Footer ---
    const pageHeight = doc.internal.pageSize.height;
//     const footerYText = pageHeight - 10; // 5mm from the bottom for text

    if (footerImgBase64) {
        // Draw the footer image spanning full width, positioned at the bottom
        const imageY = pageHeight - FOOTER_HEIGHT;
        doc.addImage(footerImgBase64, 'PNG', 0, imageY, A4_WIDTH, FOOTER_HEIGHT);
    }
    
    // 7. Save File
    doc.save(`${type}-report.pdf`);
};