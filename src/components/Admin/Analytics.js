import { useEffect, useState } from 'react';
import axios from 'axios';
import { generatePDF } from '../utils/generatePDF'; // ✅ CORRECT (Uses named export)
export default function AnalyticsDashboard() {
  const [kpis, setKpis] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    console.log('Fetching KPIs...');
    axios.get('https://pc-parts-marketplace-website.onrender.com/api/kpis')
      .then(res => {
        console.log('KPI response:', res.data);
        setKpis(res.data);
      })
      .catch(err => {
        console.error('KPI fetch error:', err);
      });
  }, []);

const handleDownload = async (type) => {
    // Input validation remains correct
    const reportFrom = fromDate || '2000-01-01'; 
    const reportTo = toDate || new Date().toISOString().split('T')[0];

    try {
        // 1. Send request to the correct JSON data endpoint
        console.log('📤 Sending POST request to backend for raw data (Endpoint: /api/report/data)...');
        const res = await axios.post('https://pc-parts-marketplace-website.onrender.com/api/report/data', { 
            type,
            from: reportFrom,
            to: reportTo
        });
        
        console.log('✅ Backend request successful (Status:', res.status, ')');

        // 🔥 FIX 1: Destructure the response object to get the array and image strings
        // The backend returns: { reportData: [...], headerImg: '...', footerImg: '...' }
        const { reportData, headerImg, footerImg } = res.data; 

        // Check if the data array is present before proceeding
        if (!Array.isArray(reportData)) {
            console.error('❌ Data received is not an array:', reportData);
            throw new Error('Invalid data structure received from server.');
        }

        console.log(`📄 Received ${reportData.length} records. Calling generatePDF...`); 
        
        // 🔥 FIX 2: Pass the correct data array AND the image strings to the PDF generator
        generatePDF(type, reportData, reportFrom, reportTo, headerImg, footerImg);
        
        console.log(`🎉 ${type} PDF generated and download complete.`);
        
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error(`❌ Axios Request Failed for ${type}. Status: ${err.response?.status || 'N/A'}`);
            console.error('❌ Backend Error Data:', err.response?.data || err.message);
        } else {
            console.error(`❌ PDF generation failed in frontend for ${type}:`, err);
        }
        
        alert(`PDF generation failed for ${type} brooo 😓`);
    }
};

  if (!kpis) return <div>Loading KPIs...</div>;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Analytics Dashboard</h2>

<div className="kpi-grid">
  {Object.entries(kpis)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => (
      <div key={key} className="kpi-card">
        <div className="kpi-title">{key.replace(/([A-Z])/g, ' $1')}</div>
        <div className="kpi-value">{value}</div>
      </div>
    ))}
</div>

      <div className="low-stock-section">
        <h3>⚠️ Low Stock Products</h3>
        <ul className="low-stock-list">
          {kpis.lowStockProductList?.length > 0 ? (
            kpis.lowStockProductList.map(p => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span className={`stock-badge ${p.stock_qty === 0 ? 'out' : 'low'}`}>
                  {typeof p.stock_qty === 'number' ? `Stock: ${p.stock_qty}` : 'Stock: N/A'}
                </span>
              </li>
            ))
          ) : (
            <li>All products sufficiently stocked ✅</li>
          )}
        </ul>
      </div>

      <div className="report-controls">
        <h3 className="text-cyan-400 mt-8 mb-2">📄 Generate Reports</h3>
        <div className="date-inputs">
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
  <div className="report-buttons">
        <button onClick={() => handleDownload('inventory')}>📄 Inventory Report</button>
        <button onClick={() => handleDownload('orders')}>🛒 Orders Report</button>
        <button onClick={() => handleDownload('custom_build')}>🧩 Custom Builds Report</button>
        <button onClick={() => handleDownload('repair_requests')}>🛠️ Repair Requests Report</button>
      </div>
      </div>
    </div>
  );
}