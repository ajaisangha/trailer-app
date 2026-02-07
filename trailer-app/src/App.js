import React, { useState } from 'react';

// Compliance questions from your Excel "Load Form" sheets
const COMPLIANCE_ITEMS = [
  { id: 1, text: "Incoming Trailer in Good Condition", comment: "Trailer damaged/unfit" },
  { id: 2, text: "Cleanliness (No Contamination Risk)", comment: "Dirt/Debris found" },
  { id: 3, text: "Structural Concerns (Holes/Damage)", comment: "Visible holes in wall" },
  { id: 4, text: "Free of Pest Infestation", comment: "Pest activity noticed" },
  { id: 5, text: "Within Temperature Range", comment: "Temp above 4°C" },
  { id: 6, text: "No Damage to Product/Packaging", comment: "Damaged cases found" },
  { id: 7, text: "Free of Chemical Contamination", comment: "Chemical smell detected" },
];

export default function App() {
  const [mode, setMode] = useState('temp'); 
  const [trailerType, setTrailerType] = useState('OS');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '', trailerNum: '', temp: '', supervisor: '', initials: '',
    seal: '', destination: 'Etobicoke Spoke'
  });
  
  // Track checkmarks (all true by default)
  const [checks, setChecks] = useState(
    COMPLIANCE_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        
        {/* LEFT SIDE: INPUT FORM (Hidden when printing) */}
        <div className="col-md-4 p-4 bg-white border-end d-print-none shadow-sm overflow-auto">
          <h4 className="mb-4">📋 Load Form Entry</h4>
          
          <div className="btn-group w-100 mb-4">
            <button className={`btn ${mode === 'bol' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('bol')}>BOL</button>
            <button className={`btn ${mode === 'temp' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('temp')}>Temp Check</button>
          </div>

          <div className="vstack gap-3">
            {mode === 'bol' && (
              <select className="form-select" value={trailerType} onChange={(e) => setTrailerType(e.target.value)}>
                <option value="OS">Ottawa Spoke (Sheet 1)</option>
                <option value="ES">Etobicoke Spoke (Sheet 3)</option>
              </select>
            )}

            <div className="row g-2">
              <div className="col-6"><label className="small fw-bold">Date</label><input type="date" name="date" className="form-control" value={formData.date} onChange={handleInput} /></div>
              <div className="col-6"><label className="small fw-bold">Time</label><input type="time" name="time" className="form-control" onChange={handleInput} /></div>
            </div>

            <input name="trailerNum" className="form-control" placeholder="Trailer #" onChange={handleInput} />
            <input name="temp" className="form-control" placeholder="Temp (°C)" onChange={handleInput} />
            <input name="seal" className="form-control" placeholder="Seal Number(s)" onChange={handleInput} />
            <input name="supervisor" className="form-control" placeholder="Supervisor Name" onChange={handleInput} />
            <input name="initials" className="form-control" placeholder="Initials" onChange={handleInput} />

            {mode === 'temp' && (
              <div className="mt-2 p-3 bg-light border rounded">
                <p className="fw-bold small mb-2 text-primary">Compliance Checklist</p>
                {COMPLIANCE_ITEMS.map(item => (
                  <div key={item.id} className="form-check form-switch d-flex justify-content-between small mb-1">
                    <label className="form-check-label">{item.id}. {item.text}</label>
                    <input className="form-check-input" type="checkbox" checked={checks[item.id]} 
                      onChange={() => setChecks({...checks, [item.id]: !checks[item.id]})} />
                  </div>
                ))}
              </div>
            )}
            
            <button onClick={() => window.print()} className="btn btn-success mt-3 py-2 fw-bold">🖨️ Print Document</button>
          </div>
        </div>

        {/* RIGHT SIDE: LIVE PREVIEW (Becomes the full page when printing) */}
        <div className="col-md-8 p-5 bg-secondary d-flex justify-content-center overflow-auto shadow-inner">
          <div className="bg-white p-5 shadow-lg d-print-block" style={{ width: '8.5in', minHeight: '11in', color: '#000' }}>
            
            {/* --- BOL TEMPLATE --- */}
            {mode === 'bol' && (
              <div className="bol-template">
                <div className="d-flex justify-content-between border-bottom border-3 border-dark mb-4">
                  <div>
                    <h2 className="fw-black mb-0">STRAIGHT BILL OF LADING</h2>
                    <p className="small">Original - Not Negotiable</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-0"><strong>Date:</strong> {formData.date}</p>
                    <p><strong>BOL #:</strong> V_{formData.date.replace(/-/g,'')}_{formData.trailerNum}</p>
                  </div>
                </div>

                <div className="row mb-4 border border-dark g-0">
                  <div className="col-6 border-end border-dark p-2">
                    <label className="text-uppercase small fw-bold d-block">Ship From:</label>
                    <p className="mb-0 small">Vaughan CFC<br/>100 Gibraltar Road<br/>Vaughan, ON L4H 3N5</p>
                  </div>
                  <div className="col-6 p-2">
                    <p className="mb-1 small"><strong>Carrier:</strong> Sobeys Inc.</p>
                    <p className="mb-1 small"><strong>Trailer No:</strong> {formData.trailerNum}</p>
                    <p className="mb-0 small"><strong>Seal No:</strong> {formData.seal}</p>
                  </div>
                </div>

                <div className="border border-dark p-2 mb-4 bg-light">
                  <label className="text-uppercase small fw-bold d-block">Ship To:</label>
                  <p className="mb-0">{trailerType === 'OS' ? 'Ottawa Spoke' : 'Etobicoke Spoke'}</p>
                </div>

                <table className="table table-bordered border-dark small">
                  <thead className="table-light">
                    <tr>
                      <th>QTY</th>
                      <th>Type</th>
                      <th>Commodity Description</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>36</td>
                      <td>Frames</td>
                      <td>Mixed Grocery - Perishable</td>
                      <td>28,440 lbs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TEMP CHECK TEMPLATE --- */}
            {mode === 'temp' && (
              <div className="temp-template">
                <h3 className="text-center text-uppercase text-decoration-underline mb-4">Trailer Loading & Temp Log</h3>
                
                <div className="row mb-4 border p-3 bg-light">
                  <div className="col-4"><strong>Date:</strong> {formData.date}</div>
                  <div className="col-4"><strong>Time:</strong> {formData.time}</div>
                  <div className="col-4"><strong>Trailer:</strong> {formData.trailerNum}</div>
                </div>

                <p className="small fw-bold">Trailer Standards (✓ = Pass, X = Fail):</p>
                <div className="row small mb-4">
                  {COMPLIANCE_ITEMS.map(item => (
                    <div key={item.id} className="col-6 border-bottom py-1">
                      {item.id}. {item.text} <span className="float-end fw-bold">{checks[item.id] ? '✓' : 'X'}</span>
                    </div>
                  ))}
                </div>

                <table className="table table-bordered border-dark text-center small">
                  <thead className="table-secondary">
                    <tr>
                      <th>Trailer #</th>
                      <th>Temperature (°C)</th>
                      <th>Comply? (Y/N)</th>
                      <th>Comments / Deviation</th>
                      <th>Initials</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{formData.trailerNum}</td>
                      <td>{formData.temp}°C</td>
                      <td>Y</td>
                      <td>Within Range</td>
                      <td>{formData.initials}</td>
                    </tr>
                    {/* NEW ROWS FOR FAILURES */}
                    {COMPLIANCE_ITEMS.map(item => !checks[item.id] && (
                      <tr key={item.id} className="table-warning">
                        <td>{formData.trailerNum}</td>
                        <td>-</td>
                        <td className="fw-bold text-danger">N</td>
                        <td className="text-start">{item.comment}</td>
                        <td>{formData.initials}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-5 pt-5">
                  <p className="border-top border-dark pt-2"><strong>Supervisor Name:</strong> {formData.supervisor}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}