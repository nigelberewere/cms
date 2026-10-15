/**
 * BuildPro - Construction Management System (CMS)
 * Enterprise Multi-Tenant Web Platform Prototype
 * Conforming to UI/UX Pro Max Design Intelligence
 */

// Helper selector
const $ = id => document.getElementById(id);

// Safe HTML escaping
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

// Safe string argument for inline JS handlers
const jsarg = v => JSON.stringify(String(v ?? '')).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// RFC 4180 compliant CSV cell escaping with formula injection defense
const csvCell = v => {
  let s = String(v ?? '');
  if (typeof v === 'string' && /^[\t\r\n ]*[=+\-@]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
};

// Date helpers
const today = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

// Task statuses
const ST = ['Not started', 'In progress', 'Done', 'Blocked'];

// ==========================================================================
// UI/UX Pro Max SVG Icon System (No emojis, crisp 24x24 scalable icons)
// ==========================================================================
function icon(name, cls = '', size = 18) {
  const icons = {
    dashboard: '<path d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z"/>',
    project: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    planning: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    tasks: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    track: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    finance: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    expenses: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    invoices: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    payments: '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/>',
    cash: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    procurement: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    suppliers: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    pos: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    materials: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    stockMoves: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    workforce: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    employees: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    timesheets: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    subs: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    equipment: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    site: '<path d="M2 12h20M12 2v20M20 16l-8-8-8 8"/>',
    field: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
    reports: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    qaqc: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    hse: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    rfis: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    snags: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    docs: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',
    crm: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
    tenders: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    estimates: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    boq: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    contracts: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18s1-1 2-1 2 1 2 1"/>',
    bi: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    alerts: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    company: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h1M9 13h1M9 17h1"/>',
    subscription: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2"/>',
    audit: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    printer: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
  };
  const path = icons[name] || icons.dashboard;
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

// ==========================================================================
// Module Schemas & Field Definitions (M)
// ==========================================================================
const M = {
  projects: {
    t: 'Projects & Contracts',
    w: ['pm'],
    icon: 'project',
    f: [
      ['name', 'Project name'],
      ['client', 'Client / Employer'],
      ['loc', 'Site location'],
      ['mgr', 'Project manager'],
      ['value', 'Contract value', 'number'],
      ['budget', 'Approved budget', 'number'],
      ['start', 'Commencement date', 'date'],
      ['end', 'Completion date', 'date'],
      ['status', 'Status', 'select', ['Planning', 'Active', 'On hold', 'Done']]
    ]
  },
  tasks: {
    t: 'Tasks & Schedule',
    w: ['pm', 'site'],
    icon: 'tasks',
    f: [
      ['name', 'Task / WBS item'],
      ['project', 'Project', 'ref', 'projects'],
      ['type', 'Item type', 'select', ['Task', 'Milestone']],
      ['who', 'Assigned supervisor / team'],
      ['dep', 'Dependency notes'],
      ['start', 'Start date', 'date'],
      ['end', 'Due date', 'date'],
      ['pct', '% Complete', 'number'],
      ['status', 'Status', 'select', ST]
    ]
  },
  expenses: {
    t: 'Budget & Expenses',
    w: ['pm', 'buyer', 'finance'],
    icon: 'expenses',
    f: [
      ['date', 'Date incurred', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['cat', 'Cost category', 'select', ['Labour', 'Materials', 'Equipment', 'Subcontract', 'Permits', 'Overheads', 'Other']],
      ['code', 'Cost code'],
      ['desc', 'Description / payee'],
      ['amount', 'Amount', 'number'],
      ['status', 'Approval status', 'select', ['Pending', 'Approved', 'Rejected']],
      ['receipt', 'Receipt / invoice ref', 'file']
    ]
  },
  suppliers: {
    t: 'Suppliers & Vendors',
    w: ['pm', 'buyer'],
    icon: 'suppliers',
    f: [
      ['name', 'Supplier / vendor name'],
      ['contact', 'Contact person'],
      ['phone', 'Phone / mobile'],
      ['cat', 'Materials / trade supplies']
    ]
  },
  pos: {
    t: 'Procurement (POs)',
    w: ['pm', 'buyer'],
    icon: 'pos',
    f: [
      ['date', 'PO date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['supplier', 'Supplier', 'ref', 'suppliers'],
      ['item', 'Material / service description'],
      ['qty', 'Quantity', 'number'],
      ['cost', 'Total cost', 'number'],
      ['status', 'Order status', 'select', ['Requested', 'Approved', 'Ordered', 'Delivered']]
    ]
  },
  materials: {
    t: 'Materials & Inventory',
    w: ['pm', 'buyer', 'site'],
    icon: 'materials',
    f: [
      ['name', 'Material description'],
      ['unit', 'Unit of measure (e.g. bags, tonnes, m³)'],
      ['qty', 'In-stock quantity', 'number'],
      ['min', 'Minimum reorder level', 'number'],
      ['cost', 'Unit cost rate', 'number'],
      ['loc', 'Store location / site warehouse']
    ]
  },
  stockMoves: {
    t: 'Stock Movements',
    w: ['pm', 'buyer', 'site'],
    icon: 'stockMoves',
    f: [
      ['date', 'Date', 'date'],
      ['item', 'Material', 'ref', 'materials'],
      ['type', 'Movement type', 'select', ['Receipt', 'Issue', 'Transfer', 'Waste', 'Adjustment']],
      ['qty', 'Quantity', 'number'],
      ['project', 'Project / site', 'ref', 'projects'],
      ['loc', 'Warehouse / bin'],
      ['note', 'Transaction remarks']
    ]
  },
  reports: {
    t: 'Daily Site Reports',
    w: ['pm', 'site'],
    icon: 'reports',
    f: [
      ['date', 'Report date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['weather', 'Weather conditions', 'select', ['Sunny / Clear', 'Cloudy', 'Rain / Wet', 'High Wind', 'Extreme Heat']],
      ['workers', 'Total workforce on site', 'number'],
      ['equip', 'Machinery & equipment active'],
      ['mats', 'Key materials consumed'],
      ['photo', 'Progress photo reference', 'file'],
      ['appr', 'Supervisor review', 'select', ['Pending', 'Approved']],
      ['work', 'Work executed today', 'area'],
      ['issues', 'Site challenges & safety delays', 'area'],
      ['by', 'Site supervisor / reporter']
    ]
  },
  docs: {
    t: 'Documents & Drawings',
    w: ['pm', 'site', 'buyer'],
    icon: 'docs',
    f: [
      ['title', 'Document title'],
      ['project', 'Project', 'ref', 'projects'],
      ['cat', 'Document category', 'select', ['Contract', 'Drawing / Blueprint', 'Permit', 'Invoice', 'Photo', 'Inspection', 'Specification', 'Other']],
      ['rev', 'Revision / version'],
      ['date', 'Upload / issue date', 'date'],
      ['file', 'File attachment reference', 'file']
    ]
  },
  crm: {
    t: 'Clients & Prospects (CRM)',
    w: ['pm'],
    icon: 'crm',
    f: [
      ['name', 'Client / prospect entity'],
      ['contact', 'Primary contact'],
      ['phone', 'Phone / email'],
      ['stage', 'Pipeline stage', 'select', ['Enquiry', 'Meeting', 'Proposal', 'Won', 'Lost']],
      ['follow', 'Next follow-up date', 'date'],
      ['notes', 'Interaction history & scope notes', 'area']
    ]
  },
  tenders: {
    t: 'Tenders & Bids',
    w: ['pm'],
    icon: 'tenders',
    f: [
      ['title', 'Tender description'],
      ['client', 'Client / tendering authority'],
      ['deadline', 'Submission deadline', 'date'],
      ['value', 'Bid price submitted', 'number'],
      ['cost', 'Estimated cost of preparation', 'number'],
      ['owner', 'Bid manager'],
      ['status', 'Bid status', 'select', ['Identified', 'Preparing', 'Submitted', 'Won', 'Lost']]
    ]
  },
  estimates: {
    t: 'Estimates & Quotes',
    w: ['pm'],
    icon: 'estimates',
    f: [
      ['ref', 'Estimate / quotation ref'],
      ['client', 'Client'],
      ['labour', 'Direct labour estimate', 'number'],
      ['materials', 'Materials estimate', 'number'],
      ['equip', 'Equipment hire estimate', 'number'],
      ['subcontract', 'Specialist subcontractors', 'number'],
      ['markup', 'Contractor markup %', 'number'],
      ['status', 'Status', 'select', ['Draft', 'Sent', 'Revised', 'Approved', 'Rejected']]
    ]
  },
  boq: {
    t: 'BOQ & Quantities',
    w: ['pm', 'site'],
    icon: 'boq',
    f: [
      ['project', 'Project', 'ref', 'projects'],
      ['item', 'Bill item & description'],
      ['unit', 'Unit (e.g. m, m², m³, kg, nr)'],
      ['qty', 'Estimated quantity', 'number'],
      ['rate', 'Unit rate', 'number'],
      ['measured', 'Measured quantity completed', 'number'],
      ['var', 'Variation / QS remarks']
    ]
  },
  contracts: {
    t: 'Contracts & Variations',
    w: ['pm'],
    icon: 'contracts',
    f: [
      ['ref', 'Contract / VO reference'],
      ['project', 'Project', 'ref', 'projects'],
      ['party', 'Counterparty (Client / Subcontractor)'],
      ['type', 'Instrument type', 'select', ['Client contract', 'Subcontract', 'Variation order', 'Claim / EOT', 'Notice']],
      ['value', 'Contract / variation value', 'number'],
      ['due', 'Completion / validity deadline', 'date'],
      ['status', 'Approval status', 'select', ['Draft', 'Submitted', 'Approved', 'Rejected']]
    ]
  },
  invoices: {
    t: 'Client Billing & Claims',
    w: ['pm', 'finance'],
    icon: 'invoices',
    f: [
      ['number', 'Invoice / claim number'],
      ['project', 'Project', 'ref', 'projects'],
      ['date', 'Invoice date', 'date'],
      ['due', 'Payment due date', 'date'],
      ['amount', 'Gross claim amount', 'number'],
      ['retention', 'Retention withheld', 'number'],
      ['paid', 'Amount paid to date', 'number'],
      ['cert', 'Payment certificate ref']
    ]
  },
  payments: {
    t: 'Client Payments Received',
    w: ['pm', 'finance'],
    icon: 'payments',
    f: [
      ['date', 'Payment date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['invoice', 'Invoice settled', 'ref', 'invoices'],
      ['amount', 'Amount received', 'number'],
      ['method', 'Payment method', 'select', ['Bank transfer', 'Cash', 'Cheque', 'Mobile money', 'Other']],
      ['reference', 'Remittance / bank receipt ref']
    ]
  },
  pettycash: {
    t: 'Petty Cash & Site Advances',
    w: ['pm', 'site', 'buyer', 'finance'],
    icon: 'finance',
    f: [
      ['date', 'Date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['type', 'Transaction type', 'select', ['Advance', 'Expense']],
      ['desc', 'Particulars & justification'],
      ['amount', 'Amount', 'number'],
      ['status', 'Reconciliation status', 'select', ['Pending', 'Approved', 'Reconciled']]
    ]
  },
  workers: {
    t: 'Daily Workforce Register',
    w: ['pm'],
    icon: 'workforce',
    f: [
      ['name', 'Worker name'],
      ['trade', 'Trade / skill'],
      ['project', 'Assigned project', 'ref', 'projects'],
      ['rate', 'Daily wage rate', 'number'],
      ['phone', 'Contact number']
    ]
  },
  attendance: {
    t: 'Site Attendance Logs',
    w: ['pm', 'site'],
    icon: 'timesheets',
    f: [
      ['date', 'Date', 'date'],
      ['worker', 'Worker', 'ref', 'workers'],
      ['project', 'Project', 'ref', 'projects'],
      ['hours', 'Normal hours', 'number'],
      ['ot', 'Overtime hours', 'number']
    ]
  },
  employees: {
    t: 'Employee Directory',
    w: ['pm'],
    icon: 'employees',
    f: [
      ['employeeNo', 'Employee badge / ID'],
      ['name', 'Full legal name'],
      ['preferredName', 'Preferred name'],
      ['dateOfBirth', 'Date of birth', 'date'],
      ['idType', 'Government ID type'],
      ['nationalId', 'National ID number'],
      ['citizenship', 'Citizenship / nationality'],
      ['workAuthorization', 'Right-to-work status'],
      ['email', 'Work email', 'email'],
      ['phone', 'Mobile phone', 'tel'],
      ['emergencyName', 'Emergency contact name'],
      ['emergencyPhone', 'Emergency contact phone', 'tel'],
      ['employmentType', 'Employment type', 'select', ['Permanent', 'Fixed-term', 'Casual', 'Apprentice', 'Temporary', 'Intern']],
      ['department', 'Department'],
      ['trade', 'Trade / speciality'],
      ['jobTitle', 'Job title'],
      ['supervisor', 'Direct manager'],
      ['startDate', 'Employment start date', 'date'],
      ['project', 'Primary project', 'ref', 'projects'],
      ['site', 'Main site location'],
      ['rate', 'Hourly base rate', 'number'],
      ['currency', 'Currency'],
      ['status', 'Employment status', 'select', ['Onboarding', 'Active', 'On leave', 'Suspended', 'Terminated', 'Archived']]
    ]
  },
  recruitment: {
    t: 'Recruitment & Onboarding',
    w: ['pm'],
    icon: 'crm',
    f: [
      ['name', 'Candidate name'],
      ['role', 'Role applied for'],
      ['trade', 'Trade / discipline'],
      ['email', 'Candidate email', 'email'],
      ['phone', 'Candidate phone', 'tel'],
      ['source', 'Recruitment channel'],
      ['applied', 'Application date', 'date'],
      ['stage', 'Recruitment stage', 'select', ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn']],
      ['onboarding', 'Onboarding status', 'select', ['Not started', 'In progress', 'Complete', 'Not required']],
      ['startDate', 'Target start date', 'date'],
      ['notes', 'Interview notes / checklist', 'area']
    ]
  },
  allocations: {
    t: 'Project & Site Allocations',
    w: ['pm', 'site'],
    icon: 'project',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['project', 'Project assigned', 'ref', 'projects'],
      ['site', 'Work area / section'],
      ['role', 'Site duty / responsibility'],
      ['allocationPct', 'Allocation %', 'number'],
      ['start', 'Assignment start', 'date'],
      ['end', 'Assignment end', 'date'],
      ['status', 'Allocation status', 'select', ['Planned', 'Active', 'Complete', 'Cancelled']],
      ['notes', 'Allocation notes', 'area']
    ]
  },
  timesheets: {
    t: 'Attendance & Timesheets',
    w: ['pm', 'site'],
    icon: 'timesheets',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['project', 'Project', 'ref', 'projects'],
      ['site', 'Site area'],
      ['date', 'Work date', 'date'],
      ['startTime', 'Start time', 'time'],
      ['endTime', 'End time', 'time'],
      ['hours', 'Regular hours', 'number'],
      ['overtime', 'Overtime hours', 'number'],
      ['breakHours', 'Break hours (unpaid)', 'number'],
      ['task', 'Task / cost code'],
      ['status', 'Approval status', 'select', ['Draft', 'Submitted', 'Approved', 'Rejected']],
      ['approvedBy', 'Approver signature'],
      ['notes', 'Daily activity details', 'area']
    ]
  },
  leave: {
    t: 'Leave & Absence',
    w: ['pm', 'site'],
    icon: 'timesheets',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['type', 'Leave type', 'select', ['Annual leave', 'Sick leave', 'Unpaid leave', 'Family / parental', 'Bereavement', 'Training', 'Other']],
      ['start', 'From date', 'date'],
      ['end', 'To date', 'date'],
      ['days', 'Working days absent', 'number'],
      ['status', 'Approval status', 'select', ['Requested', 'Approved', 'Rejected', 'Taken', 'Cancelled']],
      ['approver', 'Approver'],
      ['notes', 'Reason / handover note', 'area']
    ]
  },
  compensation: {
    t: 'Compensation & Labour Rates',
    w: ['pm', 'finance'],
    icon: 'finance',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['effective', 'Effective date', 'date'],
      ['payType', 'Pay basis', 'select', ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Annual']],
      ['baseRate', 'Base pay rate', 'number'],
      ['overtimeRate', 'Overtime hourly rate', 'number'],
      ['allowance', 'Site / transport allowance', 'number'],
      ['currency', 'Currency'],
      ['payrollId', 'Payroll reference'],
      ['paymentMethod', 'Disbursement method', 'select', ['Bank transfer', 'Cash', 'Cheque', 'Other']],
      ['bankName', 'Bank name'],
      ['accountNumber', 'Account number'],
      ['costCode', 'Cost code'],
      ['notes', 'Compensation notes', 'area']
    ]
  },
  skills: {
    t: 'Skills & Certifications',
    w: ['pm', 'site'],
    icon: 'qaqc',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['type', 'Record category', 'select', ['Skill', 'Training', 'Certification', 'Licence', 'Induction']],
      ['title', 'Certification / ticket name'],
      ['issuer', 'Issuing institute / authority'],
      ['completed', 'Date issued', 'date'],
      ['expires', 'Expiry date', 'date'],
      ['status', 'Compliance status', 'select', ['Current', 'Due soon', 'Expired', 'In progress']],
      ['evidence', 'Certificate document ref']
    ]
  },
  employeeDocs: {
    t: 'Employee Documents',
    w: ['pm'],
    icon: 'docs',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['category', 'Document type', 'select', ['Employment contract', 'Identity', 'Right to work', 'Qualification', 'Licence', 'Medical / fitness', 'Insurance', 'Policy acknowledgement', 'Other']],
      ['title', 'Document title'],
      ['reference', 'File reference'],
      ['issueDate', 'Issue date', 'date'],
      ['expiryDate', 'Expiry date', 'date'],
      ['status', 'Status', 'select', ['Current', 'Due soon', 'Expired', 'Superseded']],
      ['notes', 'Remarks', 'area']
    ]
  },
  performance: {
    t: 'Appraisals & Reviews',
    w: ['pm'],
    icon: 'qaqc',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['period', 'Review period'],
      ['reviewDate', 'Review date', 'date'],
      ['reviewer', 'Reviewer'],
      ['rating', 'Performance rating', 'select', ['Outstanding', 'Exceeds expectations', 'Meets expectations', 'Needs improvement', 'Unsatisfactory']],
      ['strengths', 'Key achievements', 'area'],
      ['development', 'Focus areas for improvement', 'area'],
      ['nextReview', 'Next evaluation date', 'date']
    ]
  },
  assets: {
    t: 'PPE & Tools Issued',
    w: ['pm', 'site'],
    icon: 'equipment',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['asset', 'Equipment / PPE item'],
      ['category', 'Category', 'select', ['PPE', 'Tools', 'Device', 'Vehicle', 'Access card', 'Uniform', 'Other']],
      ['serial', 'Serial / asset barcode'],
      ['issued', 'Date issued', 'date'],
      ['expectedReturn', 'Target return date', 'date'],
      ['returned', 'Date returned', 'date'],
      ['condition', 'Condition', 'select', ['New', 'Good', 'Fair', 'Damaged', 'Not returned']],
      ['status', 'Status', 'select', ['Issued', 'Returned', 'Lost', 'Damaged']],
      ['notes', 'Asset remarks', 'area']
    ]
  },
  offboarding: {
    t: 'Offboarding & Exit Records',
    w: ['pm'],
    icon: 'employees',
    f: [
      ['employee', 'Employee', 'ref', 'employees'],
      ['noticeDate', 'Notice served', 'date'],
      ['lastWorkingDate', 'Last day on site', 'date'],
      ['reason', 'Exit reason', 'select', ['Resignation', 'End of contract', 'Redundancy', 'Dismissal', 'Retirement', 'Other']],
      ['propertyReturned', 'Equipment returned', 'select', ['Pending', 'Complete', 'Not applicable']],
      ['accessRevoked', 'Site & system access revoked', 'select', ['Pending', 'Complete', 'Not applicable']],
      ['finalPay', 'Final settlement status', 'select', ['Pending', 'In progress', 'Complete', 'Not applicable']],
      ['status', 'Offboarding status', 'select', ['In progress', 'Complete']]
    ]
  },
  subs: {
    t: 'Subcontractors',
    w: ['pm', 'finance'],
    icon: 'subs',
    f: [
      ['name', 'Subcontractor entity'],
      ['trade', 'Trade / discipline'],
      ['project', 'Project assigned', 'ref', 'projects'],
      ['scope', 'Scope of subcontract work'],
      ['value', 'Subcontract value', 'number'],
      ['claimed', 'Total claimed to date', 'number'],
      ['paid', 'Total certified & paid', 'number'],
      ['status', 'Status', 'select', ['Active', 'Completed', 'Suspended']]
    ]
  },
  equipment: {
    t: 'Equipment & Fleet',
    w: ['pm', 'site'],
    icon: 'equipment',
    f: [
      ['name', 'Plant / vehicle / equipment name'],
      ['project', 'Current project allocation', 'ref', 'projects'],
      ['hours', 'Operating hours logged', 'number'],
      ['fuel', 'Fuel consumed (Litres)', 'number'],
      ['service', 'Next maintenance / service due', 'date'],
      ['status', 'Operational status', 'select', ['Working', 'Down', 'Hired out']]
    ]
  },
  qaqc: {
    t: 'Quality Assurance (QA/QC)',
    w: ['pm', 'site'],
    icon: 'qaqc',
    f: [
      ['date', 'Inspection date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['insp', 'Inspection element / test'],
      ['result', 'Quality result', 'select', ['Pass', 'Conditional', 'Fail']],
      ['action', 'Corrective action required'],
      ['status', 'Closure status', 'select', ['Open', 'Closed']]
    ]
  },
  hse: {
    t: 'Health & Safety (HSE)',
    w: ['pm', 'site'],
    icon: 'hse',
    f: [
      ['date', 'Event date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['type', 'Log type', 'select', ['Inspection', 'Toolbox talk', 'Incident', 'Near miss', 'Hazard / risk', 'PPE check']],
      ['desc', 'Observation / incident details', 'area'],
      ['action', 'Mitigation / preventative action'],
      ['status', 'Action status', 'select', ['Open', 'Closed']]
    ]
  },
  rfis: {
    t: 'RFIs & Submittals',
    w: ['pm', 'site'],
    icon: 'rfis',
    f: [
      ['ref', 'RFI / submittal reference'],
      ['project', 'Project', 'ref', 'projects'],
      ['subject', 'Technical query / submittal title'],
      ['type', 'Category', 'select', ['RFI', 'Submittal']],
      ['due', 'Response due deadline', 'date'],
      ['status', 'Resolution status', 'select', ['Open', 'Answered', 'Closed']],
      ['resp', 'Engineer response / clarification', 'area']
    ]
  },
  snags: {
    t: 'Snags & Handover Defects',
    w: ['pm', 'site'],
    icon: 'snags',
    f: [
      ['project', 'Project', 'ref', 'projects'],
      ['loc', 'Room / grid location'],
      ['defect', 'Defect description'],
      ['who', 'Responsible trade / subcontractor'],
      ['target', 'Rectification target date', 'date'],
      ['status', 'Defect status', 'select', ['Open', 'Fixed', 'Verified']]
    ]
  },
  comments: {
    t: 'Activity & Team Logs',
    w: ['pm', 'site', 'buyer', 'finance'],
    icon: 'audit',
    f: [
      ['date', 'Log date', 'date'],
      ['project', 'Project', 'ref', 'projects'],
      ['by', 'Author'],
      ['msg', 'Message / log entry', 'area']
    ]
  }
};

// System Roles
const ROLES = {
  admin: 'Company Administrator',
  pm: 'Project Manager',
  site: 'Site Supervisor / Engineer',
  buyer: 'Procurement & Inventory Officer',
  finance: 'Finance & Accounts Officer',
  viewer: 'Client / Auditor (Viewer)'
};

// Pages managed under Employee subsystem
const EMPLOYEE_PAGES = {
  employees: ['admin', 'pm'],
  recruitment: ['admin', 'pm'],
  allocations: ['admin', 'pm', 'site'],
  timesheets: ['admin', 'pm', 'site'],
  leave: ['admin', 'pm', 'site'],
  compensation: ['admin', 'pm', 'finance'],
  skills: ['admin', 'pm', 'site'],
  employeeDocs: ['admin', 'pm'],
  performance: ['admin', 'pm'],
  assets: ['admin', 'pm', 'site'],
  employeeReports: ['admin', 'pm', 'finance'],
  offboarding: ['admin', 'pm']
};

// Navigation Groups
const GR = [
  ['Planning', ['projects', 'planning', 'track', 'tasks', 'contracts']],
  ['Commercial', ['crm', 'tenders', 'estimates', 'boq']],
  ['Finance', ['finance', 'expenses', 'pettycash', 'invoices', 'payments', 'cash']],
  ['Resources', ['pos', 'suppliers', 'materials', 'stockMoves', 'workers', 'attendance', 'subs', 'equipment']],
  ['Site Operations', ['field', 'reports', 'qaqc', 'hse', 'docs', 'rfis', 'snags']],
  ['Executive Insight', ['rep', 'bi', 'alerts', 'comments']]
];

// Human-readable titles for views
const NM = {
  dash: 'Executive Dashboard',
  track: 'Project Tracker & Delivery',
  rep: 'Weekly / Monthly Management Reports',
  bi: 'Analytics & Commercial Intelligence',
  alerts: 'Notifications & Approvals Center',
  cash: 'Cash Flow Forecast',
  finance: 'Financial & Cost Control',
  planning: 'Project Planning & Control',
  field: 'Mobile Site Operations',
  company: 'Company Profile & Compliance',
  subscription: 'Company Plan & Subscriptions',
  users: 'Users, Roles & Security',
  audit: 'System Audit Trail',
  employees: 'Employee Directory',
  recruitment: 'Recruitment & Onboarding',
  allocations: 'Project & Site Allocations',
  timesheets: 'Attendance & Timesheets',
  leave: 'Leave & Absence Management',
  compensation: 'Compensation & Labour Costs',
  skills: 'Skills, Licences & Inductions',
  employeeDocs: 'Employee Document Register',
  performance: 'Performance Appraisals',
  assets: 'PPE & Tools Issued',
  employeeReports: 'Workforce & Labour Cost Analytics',
  offboarding: 'Offboarding & Exit Records'
};

// Company Information Form Sections (8 Statutory & Operational Areas)
const COMPANY_SECTIONS = [
  {
    title: 'Legal identity',
    help: 'Registered entity details used on contracts, tenders and official documents.',
    fields: [
      ['legalName', 'Registered legal entity name', 'text'],
      ['tradingName', 'Trading / brand name', 'text'],
      ['entityType', 'Legal structure', 'select', ['Sole proprietor', 'Partnership', 'Private limited company', 'Public limited company', 'LLC', 'Non-profit', 'Other']],
      ['registrationNumber', 'Company registration number', 'text'],
      ['incorporationDate', 'Date of incorporation', 'date'],
      ['countryOfIncorporation', 'Country of registration', 'text'],
      ['operatingStatus', 'Operating status', 'select', ['Active', 'Dormant', 'In liquidation', 'Dissolved']],
      ['companyDescription', 'Company profile / capability summary', 'area'],
      ['logoUrl', 'Company logo URL', 'url']
    ]
  },
  {
    title: 'Business profile & contractor licences',
    help: 'Construction grade classifications, licensing authorities and work specialities.',
    fields: [
      ['businessType', 'Contractor classification / category', 'text'],
      ['contractorGrade', 'Contractor grade / class (e.g. Category A / Unlimited)', 'text'],
      ['licenceAuthority', 'Licensing body / council', 'text'],
      ['licenceNumber', 'Contractor registration number', 'text'],
      ['licenceIssueDate', 'Licence issue date', 'date'],
      ['licenceExpiryDate', 'Licence expiry date', 'date'],
      ['licensedTrades', 'Licensed trades / capabilities', 'area'],
      ['services', 'Primary contracting services', 'area'],
      ['serviceRegions', 'Operating regions / cities', 'area'],
      ['industryMemberships', 'Professional bodies & memberships (e.g. CIFOZ, ZBCA)', 'area']
    ]
  },
  {
    title: 'Tax & statutory registrations',
    help: 'Tax identifiers and fiscal renewal records for the operating jurisdiction.',
    fields: [
      ['taxJurisdiction', 'Tax jurisdiction / country', 'text'],
      ['taxIdentificationNumber', 'Tax identification number (TIN)', 'text'],
      ['vatNumber', 'VAT / GST registration number', 'text'],
      ['taxRegistrationDate', 'Tax registration date', 'date'],
      ['taxOffice', 'Assigned revenue office', 'text'],
      ['fiscalYearEnd', 'Financial year end (e.g. 31 December)', 'text'],
      ['employerRegistration', 'Social security / pension employer number', 'text'],
      ['otherStatutoryRegistrations', 'Other statutory references', 'area']
    ]
  },
  {
    title: 'Addresses & official contacts',
    help: 'Main head office, site offices and emergency communication details.',
    fields: [
      ['mainPhone', 'Main switchboard phone', 'tel'],
      ['generalEmail', 'General company email', 'email'],
      ['website', 'Company website', 'url'],
      ['registeredAddress', 'Registered legal office', 'area'],
      ['physicalAddress', 'Head office physical location', 'area'],
      ['postalAddress', 'Postal address', 'area'],
      ['primaryContactName', 'Key executive contact', 'text'],
      ['primaryContactTitle', 'Executive title', 'text'],
      ['primaryContactEmail', 'Executive email', 'email'],
      ['primaryContactPhone', 'Executive phone', 'tel'],
      ['emergencyContactName', '24-hour site emergency officer', 'text'],
      ['emergencyContactPhone', 'Emergency contact telephone', 'tel'],
      ['branchLocations', 'Branch stores & regional yards', 'area']
    ]
  },
  {
    title: 'Ownership, leadership & workforce',
    help: 'Company directors and overall workforce scale for pre-qualification submissions.',
    fields: [
      ['directorsOwners', 'Board of directors / principal shareholders', 'area'],
      ['managementTeam', 'Key operational managers', 'area'],
      ['fullTimeEmployees', 'Permanent employees count', 'number'],
      ['partTimeEmployees', 'Casual / trade workforce capacity', 'number'],
      ['typicalSiteWorkforce', 'Peak site capacity (artisan + labour)', 'number'],
      ['workforceTrades', 'In-house artisan trades', 'area'],
      ['operatingHours', 'Operating hours & site shifts', 'text']
    ]
  },
  {
    title: 'Insurance & risk coverage',
    help: 'Tracking active contractor policies, cover limits and renewal dates.',
    fields: [
      ['publicLiabilityInsurer', 'Public liability insurer', 'text'],
      ['publicLiabilityPolicy', 'Public liability policy number', 'text'],
      ['publicLiabilityLimit', 'Public liability indemnity limit', 'number'],
      ['publicLiabilityExpiry', 'Public liability expiry date', 'date'],
      ['workersCompInsurer', 'Workers compensation insurer', 'text'],
      ['workersCompPolicy', 'Workers compensation policy number', 'text'],
      ['workersCompExpiry', 'Workers compensation expiry date', 'date'],
      ['professionalIndemnityInsurer', 'Contractors All-Risk (CAR) / PI insurer', 'text'],
      ['professionalIndemnityPolicy', 'CAR policy number', 'text'],
      ['professionalIndemnityLimit', 'CAR cover limit', 'number'],
      ['professionalIndemnityExpiry', 'CAR expiry date', 'date'],
      ['otherInsurance', 'Specialist equipment & motor fleet coverage', 'area']
    ]
  },
  {
    title: 'Health, safety, quality & environment (HSE/QA)',
    help: 'Company-level certifications and management system representatives.',
    fields: [
      ['hseManager', 'HSE director / representative', 'text'],
      ['hsePolicyReference', 'HSE manual / safety plan reference', 'text'],
      ['hseReviewDate', 'HSE policy annual review date', 'date'],
      ['qualityManager', 'Quality assurance manager', 'text'],
      ['qualityCertifications', 'ISO 9001 / QA certifications & renewals', 'area'],
      ['environmentalCertifications', 'ISO 14001 / Environmental certifications', 'area'],
      ['safetyCertifications', 'ISO 45001 / Safety certifications', 'area'],
      ['prequalificationStatus', 'Client pre-qualification ratings', 'text']
    ]
  },
  {
    title: 'Finance, banking & remittance',
    help: 'Standard billing settings and client settlement bank accounts.',
    fields: [
      ['defaultCurrency', 'Default accounting currency symbol', 'text'],
      ['invoiceTerms', 'Standard payment terms (e.g. Net 14 days, Net 30 days)', 'text'],
      ['invoicePrefix', 'Invoice numbering prefix (e.g. BP-INV-)', 'text'],
      ['paymentInstructions', 'Bank remittance instructions on invoices', 'area'],
      ['bankName', 'Primary settlement bank', 'text'],
      ['bankAccountName', 'Account holder name', 'text'],
      ['bankAccountNumber', 'Account number', 'text'],
      ['bankBranch', 'Branch code / sort code', 'text'],
      ['bankSwift', 'SWIFT / BIC code', 'text']
    ]
  }
];

// App State Variables
let DB = load();
let U = null;
let C = null;
let view = 'dash';
window.dashProject = '';
window.planProject = '';
window.reportFrom = '';
window.reportTo = '';
window.Q = {};

// ==========================================================================
// Rich Demo Initializer
// ==========================================================================
function load() {
  try {
    const raw = localStorage.getItem('bp2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.cos && Object.keys(parsed.cos).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse cached database, generating fresh demo data.', e);
  }

  // Pre-seed 2 realistic construction companies
  return getFreshDemoDB();
}

function getFreshDemoDB() {
  const p1 = 'p1', p2 = 'p2', p3 = 'p3', p4 = 'p4';

  const demoBuildersData = {
    projects: [
      { id: p1, name: 'Riverside Commercial Complex', client: 'Old Mutual Properties', loc: 'Harare CBD, Plot 14B', mgr: 'Tendai Moyo', value: 1150000, budget: 850000, start: '2026-06-01', end: '2027-04-30', status: 'Active' },
      { id: p2, name: 'Highland Estate Luxury Villas', client: 'Terracotta Developments', loc: 'Borrowdale Brooke', mgr: 'Farai Chinamasa', value: 780000, budget: 620000, start: '2026-08-15', end: '2027-02-28', status: 'Active' },
      { id: p3, name: 'Oakridge Medical Centre', client: 'Avenues Healthcare Trust', loc: 'Avondale Medical Park', mgr: 'Chipo Mutasa', value: 1800000, budget: 1400000, start: '2026-11-01', end: '2027-11-30', status: 'Planning' },
      { id: p4, name: 'Metro Overpass & Road Widening', client: 'City Roads Department', loc: 'Southern Ring Road', mgr: 'Tendai Moyo', value: 1250000, budget: 950000, start: '2026-05-10', end: '2026-12-15', status: 'Active' }
    ],
    stages: [
      { id: 'g1', project: p1, name: 'Substructure & Piling', start: '2026-06-01', end: '2026-07-20', pct: 100, hist: [{ d: '2026-07-18', pct: 100, note: 'Piling inspection passed and certified by structural engineer', by: 'admin@demo.com' }] },
      { id: 'g2', project: p1, name: 'Superstructure Framework', start: '2026-07-21', end: '2026-10-15', pct: 85, hist: [{ d: '2026-10-10', pct: 85, note: 'Level 3 columns poured and curing', by: 'pm@demo.com' }] },
      { id: 'g3', project: p1, name: 'Roofing & Building Envelope', start: '2026-10-16', end: '2026-12-05', pct: 20, hist: [{ d: '2026-10-12', pct: 20, note: 'Steel trusses delivered to site', by: 'site@demo.com' }] },
      { id: 'g4', project: p1, name: 'Internal MEP Services', start: '2026-11-01', end: '2027-02-15', pct: 0, hist: [] },
      { id: 'g5', project: p1, name: 'Architectural Finishes', start: '2027-01-10', end: '2027-04-10', pct: 0, hist: [] },
      { id: 'g6', project: p1, name: 'Testing & Handover', start: '2027-04-11', end: '2027-04-30', pct: 0, hist: [] },
      { id: 'g7', project: p2, name: 'Groundworks & Earthmoving', start: '2026-08-15', end: '2026-09-30', pct: 100, hist: [] },
      { id: 'g8', project: p2, name: 'Slabs & Brickwork', start: '2026-10-01', end: '2026-11-30', pct: 45, hist: [{ d: '2026-10-14', pct: 45, note: 'Villa 1 & 2 wall plate level reached', by: 'pm@demo.com' }] }
    ],
    tasks: [
      { id: 't1', name: 'Pile cap reinforcement & pour', project: p1, type: 'Task', who: 'Tendai Moyo', dep: '', start: '2026-06-15', end: '2026-07-15', pct: 100, status: 'Done' },
      { id: 't2', name: 'Level 2 suspended slab shuttering', project: p1, type: 'Task', who: 'Farai Chinamasa', dep: 't1', start: '2026-08-01', end: '2026-09-10', pct: 100, status: 'Done' },
      { id: 't3', name: 'Level 3 column concrete pour', project: p1, type: 'Task', who: 'Farai Chinamasa', dep: 't2', start: '2026-09-15', end: '2026-10-12', pct: 85, status: 'In progress' },
      { id: 't4', name: 'Roof structural steel delivery & crane hoist', project: p1, type: 'Milestone', who: 'Tendai Moyo', dep: 't3', start: '2026-10-14', end: '2026-10-22', pct: 30, status: 'In progress' },
      { id: 't5', name: 'Electrical 1st fix conduits', project: p1, type: 'Task', who: 'ElectroPro Sub', dep: 't3', start: '2026-10-20', end: '2026-11-15', pct: 0, status: 'Not started' },
      { id: 't6', name: 'Perimeter retaining wall foundation', project: p2, type: 'Task', who: 'Chipo Mutasa', dep: '', start: '2026-09-01', end: '2026-09-25', pct: 100, status: 'Done' },
      { id: 't7', name: 'Villa blockwork Level 1', project: p2, type: 'Task', who: 'Farai Chinamasa', dep: 't6', start: '2026-10-01', end: '2026-10-28', pct: 50, status: 'In progress' },
      { id: 't8', name: 'Bridge deck pre-cast beam placement', project: p4, type: 'Milestone', who: 'Tendai Moyo', dep: '', start: '2026-10-05', end: '2026-10-18', pct: 90, status: 'In progress' }
    ],
    expenses: [
      { id: 'e1', date: '2026-08-10', project: p1, cat: 'Materials', code: 'MAT-CONC-01', desc: 'Ready-mix concrete C30 (180m³)', amount: 25200, status: 'Approved', receipt: 'INV-CEM-994.pdf' },
      { id: 'e2', date: '2026-08-28', project: p1, cat: 'Materials', code: 'MAT-STL-02', desc: 'High-yield deformed steel rebar Y16 & Y20', amount: 38400, status: 'Approved', receipt: 'STEEL-4401.pdf' },
      { id: 'e3', date: '2026-09-12', project: p1, cat: 'Equipment', code: 'EQ-CRANE-01', desc: '50-Tonne mobile crane hire (10 days)', amount: 14500, status: 'Approved', receipt: 'CRANE-HIRE-21.pdf' },
      { id: 'e4', date: '2026-09-29', project: p1, cat: 'Labour', code: 'LAB-WAGE-03', desc: 'Artisans & steel fixers bi-weekly wage roll', amount: 18200, status: 'Approved', receipt: 'WAGE-WK39.pdf' },
      { id: 'e5', date: '2026-10-08', project: p1, cat: 'Subcontract', code: 'SUB-ELECT-01', desc: 'ElectroPro first fix advance claim', amount: 15000, status: 'Approved', receipt: 'CLAIM-EP-01.pdf' },
      { id: 'e6', date: '2026-10-12', project: p1, cat: 'Materials', code: 'MAT-CEM-04', desc: 'Portland Cement CEM II 42.5N (600 bags)', amount: 9600, status: 'Approved', receipt: 'CEM-OCT-09.pdf' },
      { id: 'e7', date: '2026-10-14', project: p1, cat: 'Equipment', code: 'EQ-GEN-02', desc: 'Site generator diesel refuel 1,200L', amount: 1980, status: 'Pending', receipt: 'FUEL-SLIP-771.pdf' },
      { id: 'e8', date: '2026-09-20', project: p2, cat: 'Materials', code: 'MAT-BRK-01', desc: 'Solid clay face bricks (45,000 units)', amount: 11250, status: 'Approved', receipt: 'BRICK-INV-102.pdf' },
      { id: 'e9', date: '2026-10-05', project: p2, cat: 'Labour', code: 'LAB-WAGE-04', desc: 'Bricklayers & assistants weekly pay', amount: 8400, status: 'Approved', receipt: 'WAGES-P2-04.pdf' },
      { id: 'e10', date: '2026-10-11', project: p4, cat: 'Materials', code: 'MAT-ASPH-01', desc: 'Bitumen emulsion & aggregate base', amount: 28500, status: 'Approved', receipt: 'ASPHALT-88.pdf' }
    ],
    pettycash: [
      { id: 'pc1', date: '2026-10-02', project: p1, type: 'Advance', desc: 'Site office petty cash imprest replenishment', amount: 1500, status: 'Approved' },
      { id: 'pc2', date: '2026-10-06', project: p1, type: 'Expense', desc: 'Safety barrier tape, marker spray and warning signage', amount: 240, status: 'Reconciled' },
      { id: 'pc3', date: '2026-10-10', project: p1, type: 'Expense', desc: 'Urgent replacement hydraulic hose for mini-excavator', amount: 380, status: 'Approved' },
      { id: 'pc4', date: '2026-10-13', project: p2, type: 'Expense', desc: 'Permit application inspection fees at municipal office', amount: 450, status: 'Pending' }
    ],
    suppliers: [
      { id: 's1', name: 'BuildMart Industrial Supplies', contact: 'Chipo Zimuto', phone: '+263 77 210 9988', cat: 'Portland cement, timber, rebar' },
      { id: 's2', name: 'Apex Ready-Mix Concrete', contact: 'Godfrey Ndlovu', phone: '+263 77 334 1122', cat: 'C25, C30, C35 pump mix concrete' },
      { id: 's3', name: 'ZimSteel Structural Fabrication', contact: 'Tariro Sibanda', phone: '+263 71 556 7788', cat: 'Universal beams, columns, roof trusses, mesh' },
      { id: 's4', name: 'ElectroDistributors Ltd', contact: 'Kuda Moyo', phone: '+263 77 889 0011', cat: 'Cables, conduits, distribution boards, switchgear' },
      { id: 's5', name: 'HeavyPlant & Crane Rentals', contact: 'Brian Mpofu', phone: '+263 77 992 4433', cat: 'Mobile cranes, tipper trucks, excavators, rollers' }
    ],
    pos: [
      { id: 'po1', date: '2026-08-05', project: p1, supplier: 's2', item: 'Ready-mix concrete C30 (180m³)', qty: 180, cost: 25200, status: 'Delivered' },
      { id: 'po2', date: '2026-08-20', project: p1, supplier: 's3', item: 'High-yield rebar steel Y16 & Y20 (28 tonnes)', qty: 28, cost: 38400, status: 'Delivered' },
      { id: 'po3', date: '2026-10-01', project: p1, supplier: 's1', item: 'Portland cement CEM II 42.5N (1,000 bags)', qty: 1000, cost: 16000, status: 'Ordered' },
      { id: 'po4', date: '2026-10-08', project: p1, supplier: 's3', item: 'Pre-fabricated structural roof steel trusses', qty: 12, cost: 42000, status: 'Ordered' },
      { id: 'po5', date: '2026-10-12', project: p1, supplier: 's4', item: 'Heavy duty PVC conduit 25mm (150 bundles)', qty: 150, cost: 3300, status: 'Approved' },
      { id: 'po6', date: '2026-10-14', project: p2, supplier: 's1', item: 'Face bricks common red (60,000 units)', qty: 60000, cost: 15000, status: 'Requested' }
    ],
    materials: [
      { id: 'm1', name: 'Portland Cement CEM II 42.5N', unit: 'bags', qty: 180, min: 250, cost: 16, loc: 'Site Store A (Plot 14B)' },
      { id: 'm2', name: 'Deformed High Yield Rebar Y16', unit: 'tonnes', qty: 6.5, min: 4, cost: 1350, loc: 'Main Yard Rebar Rack' },
      { id: 'm3', name: 'River Sand (Coarse clean)', unit: 'm³', qty: 42, min: 50, cost: 28, loc: 'Sand Bunker #1' },
      { id: 'm4', name: 'Crushed Stone Granite 19mm', unit: 'm³', qty: 65, min: 40, cost: 32, loc: 'Aggregate Bay #2' },
      { id: 'm5', name: 'Solid Clay Face Bricks', unit: 'units', qty: 22000, min: 10000, cost: 0.25, loc: 'Villa Site Pallet Staging' },
      { id: 'm6', name: 'Heavy Duty PVC Conduit 25mm', unit: 'bundles', qty: 45, min: 30, cost: 22, loc: 'Electrical Secure Cage' }
    ],
    stockMoves: [
      { id: 'sm1', date: '2026-10-02', item: 'm1', type: 'Receipt', qty: 400, project: p1, loc: 'Site Store A', note: 'Goods receipt from PO #po3 delivery #1' },
      { id: 'sm2', date: '2026-10-05', item: 'm1', type: 'Issue', qty: 220, project: p1, loc: 'Plot 14B Slab Pour', note: 'Issued for level 3 column pour' },
      { id: 'sm3', date: '2026-10-09', item: 'm2', type: 'Issue', qty: 3.5, project: p1, loc: 'Rebar fabrication zone', note: 'Cut and bend schedule for beam reinforcement' },
      { id: 'sm4', date: '2026-10-12', item: 'm3', type: 'Receipt', qty: 30, project: p1, loc: 'Sand Bunker #1', note: 'Bulk tipper delivery' }
    ],
    invoices: [
      { id: 'v1', number: 'INV-2026-001', project: p1, date: '2026-07-31', due: '2026-08-31', amount: 165000, retention: 8250, paid: 165000, cert: 'PC-CERT-01' },
      { id: 'v2', number: 'INV-2026-002', project: p1, date: '2026-08-31', due: '2026-09-30', amount: 210000, retention: 10500, paid: 210000, cert: 'PC-CERT-02' },
      { id: 'v3', number: 'INV-2026-003', project: p1, date: '2026-09-30', due: '2026-10-15', amount: 245000, retention: 12250, paid: 150000, cert: 'PC-CERT-03' },
      { id: 'v4', number: 'INV-2026-004', project: p2, date: '2026-09-25', due: '2026-10-25', amount: 125000, retention: 6250, paid: 125000, cert: 'HEV-CERT-01' },
      { id: 'v5', number: 'INV-2026-005', project: p4, date: '2026-09-28', due: '2026-10-10', amount: 180000, retention: 9000, paid: 100000, cert: 'ROADS-PC-04' }
    ],
    payments: [
      { id: 'pay1', date: '2026-08-25', project: p1, invoice: 'v1', amount: 165000, method: 'Bank transfer', reference: 'RTGS-OMP-8821' },
      { id: 'pay2', date: '2026-09-28', project: p1, invoice: 'v2', amount: 210000, method: 'Bank transfer', reference: 'RTGS-OMP-9104' },
      { id: 'pay3', date: '2026-10-08', project: p1, invoice: 'v3', amount: 150000, method: 'Bank transfer', reference: 'RTGS-OMP-9450' },
      { id: 'pay4', date: '2026-10-04', project: p2, invoice: 'v4', amount: 125000, method: 'Bank transfer', reference: 'STANBIC-TERRA-01' },
      { id: 'pay5', date: '2026-10-09', project: p4, invoice: 'v5', amount: 100000, method: 'Bank transfer', reference: 'TREASURY-RD-77' }
    ],
    subs: [
      { id: 'u1', name: 'ElectroPro Electrical Contractors', trade: 'Electrical & Fire Systems', project: p1, scope: 'Full electrical 1st and 2nd fix, main DBs and compliance certificates', value: 85000, claimed: 35000, paid: 25000, status: 'Active' },
      { id: 'u2', name: 'PlumbTech Engineering Specialists', trade: 'Plumbing & Drainage', project: p1, scope: 'Sewer reticulation, potable water piping, stormwater drainage', value: 58000, claimed: 22000, paid: 18000, status: 'Active' },
      { id: 'u3', name: 'SkyLine Roofing & Waterproofing', trade: 'Roofing & Cladding', project: p1, scope: 'Installation of chromadek IBR roofing sheets, flashings and insulation', value: 46000, claimed: 12000, paid: 12000, status: 'Active' },
      { id: 'u4', name: 'Precision Glass & Aluminium', trade: 'Façades & Fenestration', project: p1, scope: 'Curtain walling, double glazed windows and commercial storefronts', value: 92000, claimed: 0, paid: 0, status: 'Active' }
    ],
    equipment: [
      { id: 'q1', name: 'CAT 320D Hydraulic Excavator', project: p1, hours: 385, fuel: 1420, service: '2026-10-25', status: 'Working' },
      { id: 'q2', name: 'JCB 3CX Backhoe Loader', project: p2, hours: 210, fuel: 840, service: '2026-11-05', status: 'Working' },
      { id: 'q3', name: 'Potain Tower Crane MC85B', project: p1, hours: 560, fuel: 0, service: '2026-10-18', status: 'Working' },
      { id: 'q4', name: 'Mercedes 10-Tonne Tipper Truck', project: p4, hours: 490, fuel: 1950, service: '2026-10-16', status: 'Working' },
      { id: 'q5', name: 'Cummins 60kVA Silent Generator', project: p1, hours: 620, fuel: 2400, service: '2026-10-20', status: 'Working' }
    ],
    reports: [
      { id: 'r1', date: '2026-10-14', project: p1, weather: 'Sunny / Clear', workers: 36, equip: 'Tower crane, concrete pump, generator', mats: '45m³ concrete, 4 tonnes rebar', photo: 'Site_Level3_Pour_Oct14.jpg', appr: 'Approved', work: 'Concreting of Level 3 structural columns and shear wall core. Quality slump tests recorded at 110mm.', issues: 'None. Pour completed 1 hour ahead of schedule.', by: 'Farai Chinamasa' },
      { id: 'r2', date: '2026-10-13', project: p1, weather: 'Sunny / Clear', workers: 34, equip: 'Tower crane, rebar bender', mats: 'Steel rebar Y16, binding wire', photo: 'Steel_Fixing_Oct13.jpg', appr: 'Approved', work: 'Rebar fixing and spacer block verification for shear walls. MEP conduits checked prior to formwork closure.', issues: 'Temporary 20-minute municipal power interruption; switched to backup Cummins generator.', by: 'Farai Chinamasa' },
      { id: 'r3', date: '2026-10-14', project: p2, weather: 'Sunny / Clear', workers: 18, equip: 'JCB backhoe, mixer', mats: '12,000 face bricks, 60 bags cement', photo: 'Villas_Wall_Oct14.jpg', appr: 'Approved', work: 'Superstructure brickwork up to lintel level on Villas 1 and 2.', issues: 'Municipal water pressure low; utilized site backup storage tank.', by: 'Tinashe Mupfumi' },
      { id: 'r4', date: '2026-10-12', project: p4, weather: 'Rain / Wet', workers: 22, equip: 'Tipper truck, asphalt paver', mats: 'Aggregate base course', photo: 'Road_Base_Oct12.jpg', appr: 'Approved', work: 'Sub-base compaction and density nuclear testing.', issues: 'Afternoon rain delayed asphalt laying by 3 hours. Safety stands down observed.', by: 'Tendai Moyo' }
    ],
    boq: [
      { id: 'b1', project: p1, item: 'Reinforced concrete C30 in suspended slabs', unit: 'm³', qty: 450, rate: 145, measured: 380, var: 'Within 2% of QS takeoff' },
      { id: 'b2', project: p1, item: 'High tensile steel reinforcement bars', unit: 'tonnes', qty: 65, rate: 1400, measured: 52, var: 'Structural lap allowance included' },
      { id: 'b3', project: p1, item: 'Structural steel roof trusses and purlins', unit: 'tonnes', qty: 24, rate: 2200, measured: 6, var: 'Trusses in fabrication' },
      { id: 'b4', project: p1, item: 'Brickwork 230mm external cavity walling', unit: 'm²', qty: 1200, rate: 26, measured: 650, var: '' },
      { id: 'b5', project: p2, item: 'Site clearance and bulk excavation to reduced level', unit: 'm³', qty: 1800, rate: 8.5, measured: 1800, var: 'Completed' }
    ],
    contracts: [
      { id: 'k1', ref: 'CNT-OMP-2026', project: p1, party: 'Old Mutual Properties', type: 'Client contract', value: 1150000, due: '2027-04-30', status: 'Approved' },
      { id: 'k2', ref: 'VO-001', project: p1, party: 'Old Mutual Properties', type: 'Variation order', value: 45000, due: '2027-04-30', status: 'Approved' },
      { id: 'k3', ref: 'SUB-EP-01', project: p1, party: 'ElectroPro Contractors', type: 'Subcontract', value: 85000, due: '2027-02-15', status: 'Approved' },
      { id: 'k4', ref: 'CNT-TERRA-2026', project: p2, party: 'Terracotta Developments', type: 'Client contract', value: 780000, due: '2027-02-28', status: 'Approved' }
    ],
    crm: [
      { id: 'c1', name: 'Old Mutual Properties', contact: 'Mr. Kenneth Moyo', phone: '+263 77 111 2222', stage: 'Won', follow: '2026-10-25', notes: 'Phase 2 commercial wing RFP expected Q1 2027' },
      { id: 'c2', name: 'Econet Wireless Infrastructure', contact: 'Eng. Sarah Dube', phone: '+263 77 999 4444', stage: 'Proposal', follow: '2026-10-22', notes: 'Data centre substation civil works proposal submitted' },
      { id: 'c3', name: 'Highlands Retirement Village', contact: 'Dr. R. Jackson', phone: '+263 71 222 3333', stage: 'Meeting', follow: '2026-10-28', notes: 'Site inspection meeting scheduled for 40-unit residential design' }
    ],
    tenders: [
      { id: 'td1', title: 'Ministry of Health Regional Cold Chain Facility', client: 'Ministry of Health & Child Care', deadline: '2026-10-26', value: 920000, cost: 3500, owner: 'Tendai Moyo', status: 'Preparing' },
      { id: 'td2', title: 'CBZ Bank New Branch Development', client: 'CBZ Holdings', deadline: '2026-11-12', value: 650000, cost: 2000, owner: 'Farai Chinamasa', status: 'Identified' }
    ],
    estimates: [
      { id: 'est1', ref: 'EST-2026-08', client: 'Econet Wireless', labour: 45000, materials: 120000, equip: 32000, subcontract: 40000, markup: 18, status: 'Sent' },
      { id: 'est2', ref: 'EST-2026-09', client: 'Ministry of Health', labour: 120000, materials: 420000, equip: 95000, subcontract: 140000, markup: 16, status: 'Draft' }
    ],
    workers: [
      { id: 'w1', name: 'Tendai Moyo', trade: 'General Site Foreman', project: p1, rate: 45, phone: '+263 77 200 1100' },
      { id: 'w2', name: 'Farai Chinamasa', trade: 'Senior Project Engineer', project: p1, rate: 55, phone: '+263 77 300 2200' },
      { id: 'w3', name: 'Kudzai Gumbo', trade: 'Master Carpenter', project: p1, rate: 32, phone: '+263 71 400 3300' },
      { id: 'w4', name: 'Blessing Musarurwa', trade: 'Steel Fixer Lead', project: p1, rate: 30, phone: '+263 77 500 4400' }
    ],
    employees: [
      { id: 'emp1', employeeNo: 'BP-001', name: 'Tendai Moyo', preferredName: 'Tendai', dateOfBirth: '1984-05-12', idType: 'National ID', nationalId: '63-128492-R-44', citizenship: 'Zimbabwean', workAuthorization: 'Citizen', email: 'pm@demo.com', phone: '+263 77 200 1100', emergencyName: 'Grace Moyo', emergencyPhone: '+263 77 200 1109', employmentType: 'Permanent', department: 'Engineering & Delivery', trade: 'Civil & Structural', jobTitle: 'Senior Project Manager', supervisor: 'Managing Director', startDate: '2021-02-01', project: p1, site: 'Plot 14B Harare CBD', rate: 45, currency: '$', status: 'Active' },
      { id: 'emp2', employeeNo: 'BP-002', name: 'Farai Chinamasa', preferredName: 'Farai', dateOfBirth: '1989-08-22', idType: 'National ID', nationalId: '42-098231-G-18', citizenship: 'Zimbabwean', workAuthorization: 'Citizen', email: 'site@demo.com', phone: '+263 77 300 2200', emergencyName: 'Ruvimbo Chinamasa', emergencyPhone: '+263 77 300 2208', employmentType: 'Permanent', department: 'Site Operations', trade: 'Site Engineering', jobTitle: 'Site Engineer', supervisor: 'Tendai Moyo', startDate: '2022-04-15', project: p1, site: 'Plot 14B Harare CBD', rate: 35, currency: '$', status: 'Active' },
      { id: 'emp3', employeeNo: 'BP-003', name: 'Chipo Mutasa', preferredName: 'Chipo', dateOfBirth: '1992-11-04', idType: 'National ID', nationalId: '63-449102-K-09', citizenship: 'Zimbabwean', workAuthorization: 'Citizen', email: 'buyer@demo.com', phone: '+263 77 400 5500', emergencyName: 'Tapiwa Mutasa', emergencyPhone: '+263 77 400 5509', employmentType: 'Permanent', department: 'Commercial & Procurement', trade: 'Quantity Surveying', jobTitle: 'Procurement & Logistics Specialist', supervisor: 'Managing Director', startDate: '2023-01-10', project: p1, site: 'Head Office & Stores', rate: 32, currency: '$', status: 'Active' },
      { id: 'emp4', employeeNo: 'BP-004', name: 'Kudzai Gumbo', preferredName: 'Kudzai', dateOfBirth: '1987-03-19', idType: 'National ID', nationalId: '29-881920-F-67', citizenship: 'Zimbabwean', workAuthorization: 'Citizen', email: 'kudzai.gumbo@demo.com', phone: '+263 71 400 3300', emergencyName: 'Eunice Gumbo', emergencyPhone: '+263 71 400 3308', employmentType: 'Permanent', department: 'Trade Operations', trade: 'Carpentry & Formwork', jobTitle: 'Foreman Formwork & Carpentry', supervisor: 'Farai Chinamasa', startDate: '2023-06-01', project: p1, site: 'Plot 14B Harare CBD', rate: 26, currency: '$', status: 'Active' }
    ],
    recruitment: [
      { id: 'rec1', name: 'Simbarashe Zhou', role: 'Structural Steel Inspector', trade: 'Quality Assurance', email: 's.zhou@example.com', phone: '+263 77 662 1100', source: 'LinkedIn', applied: '2026-10-02', stage: 'Interview', onboarding: 'Not started', startDate: '2026-11-01', notes: '10 years experience in high-rise steel inspection' },
      { id: 'rec2', name: 'Nyasha Mabika', role: 'HSE Safety Officer', trade: 'Occupational Safety', email: 'n.mabika@example.com', phone: '+263 71 883 9922', source: 'Industry Referral', applied: '2026-09-28', stage: 'Offer', onboarding: 'In progress', startDate: '2026-10-25', notes: 'OSHA / NEBOSH certified. Offer letter delivered.' }
    ],
    timesheets: [
      { id: 'ts1', employee: 'emp1', project: p1, site: 'Plot 14B', date: '2026-10-14', startTime: '07:30', endTime: '16:30', hours: 8, overtime: 1, breakHours: 1, task: 'Level 3 column pour supervision', status: 'Approved', approvedBy: 'admin@demo.com', notes: 'Certified structural placement' },
      { id: 'ts2', employee: 'emp2', project: p1, site: 'Plot 14B', date: '2026-10-14', startTime: '07:00', endTime: '17:00', hours: 8, overtime: 2, breakHours: 1, task: 'Concrete slump testing & formwork checks', status: 'Approved', approvedBy: 'pm@demo.com', notes: 'Overtime approved due to continuous pour' },
      { id: 'ts3', employee: 'emp4', project: p1, site: 'Plot 14B', date: '2026-10-14', startTime: '07:00', endTime: '16:00', hours: 8, overtime: 0, breakHours: 1, task: 'Level 3 column shutter bracing', status: 'Submitted', approvedBy: '', notes: 'Completed ahead of schedule' }
    ],
    allocations: [
      { id: 'al1', employee: 'emp1', project: p1, site: 'Plot 14B', role: 'Project Manager Lead', allocationPct: 60, start: '2026-06-01', end: '2027-04-30', status: 'Active', notes: 'Lead project PM' },
      { id: 'al2', employee: 'emp1', project: p4, site: 'Southern Ring Road', role: 'Project Director Oversight', allocationPct: 40, start: '2026-06-01', end: '2026-12-15', status: 'Active', notes: 'Civil works oversight' },
      { id: 'al3', employee: 'emp2', project: p1, site: 'Plot 14B', role: 'Site Resident Engineer', allocationPct: 100, start: '2026-06-01', end: '2027-04-30', status: 'Active', notes: 'Full time site engineer' }
    ],
    leave: [
      { id: 'lv1', employee: 'emp4', type: 'Annual leave', start: '2026-11-10', end: '2026-11-18', days: 7, status: 'Approved', approver: 'pm@demo.com', notes: 'Family leave after Level 3 slab pour' }
    ],
    compensation: [
      { id: 'cp1', employee: 'emp1', effective: '2026-01-01', payType: 'Hourly', baseRate: 45, overtimeRate: 67.5, allowance: 350, currency: '$', costCode: 'LAB-MGMT-01', notes: 'Senior PM base package' },
      { id: 'cp2', employee: 'emp2', effective: '2026-01-01', payType: 'Hourly', baseRate: 35, overtimeRate: 52.5, allowance: 250, currency: '$', costCode: 'LAB-SITE-01', notes: 'Site Engineer package' }
    ],
    skills: [
      { id: 'sk1', employee: 'emp1', type: 'Certification', title: 'PMP Project Management Professional', issuer: 'PMI', completed: '2022-04-10', expires: '2027-04-10', status: 'Current', evidence: 'PMP-883912.pdf' },
      { id: 'sk2', employee: 'emp2', type: 'Licence', title: 'Professional Engineers Council Registration', issuer: 'Engineering Council of Zimbabwe', completed: '2023-01-15', expires: '2027-01-15', status: 'Current', evidence: 'ECZ-REG-771.pdf' },
      { id: 'sk3', employee: 'emp4', type: 'Training', title: 'Working at Heights & Scaffold Safety', issuer: 'National Safety Council', completed: '2025-10-20', expires: '2026-10-20', status: 'Due soon', evidence: 'NSC-WAH-2025.pdf' }
    ],
    employeeDocs: [
      { id: 'ed1', employee: 'emp1', category: 'Employment contract', title: 'Senior PM Executed Contract', reference: 'CONTRACT-TM-2021.pdf', issueDate: '2021-02-01', expiryDate: '', status: 'Current', notes: 'Permanent' }
    ],
    performance: [
      { id: 'pf1', employee: 'emp2', period: '2025 Annual Review', reviewDate: '2025-12-15', reviewer: 'Tendai Moyo', rating: 'Exceeds expectations', strengths: 'Exceptional attention to concrete quality control and slump testing rigour', development: 'Could assume broader delegation of daily workforce coordination', nextReview: '2026-12-15' }
    ],
    assets: [
      { id: 'as1', employee: 'emp2', asset: 'Leica Rugby 610 Laser Level Kit', category: 'Tools', serial: 'LCA-610-9941', issued: '2026-06-01', expectedReturn: '2027-04-30', returned: '', condition: 'Good', status: 'Issued', notes: 'Assigned to Riverside project' },
      { id: 'as2', employee: 'emp4', asset: 'Heavy Duty Full Body Fall Arrest Harness', category: 'PPE', serial: 'PPE-HARN-102', issued: '2026-06-05', expectedReturn: '', returned: '', condition: 'Good', status: 'Issued', notes: 'Passed monthly 6-point inspection' }
    ],
    offboarding: [],
    qaqc: [
      { id: 'q1', date: '2026-10-14', project: p1, insp: 'Level 3 column concrete slump test (Target 100mm-120mm)', result: 'Pass', action: 'Certified ready for pour. Cube samples taken for 7, 14 and 28-day compression test.', status: 'Closed' },
      { id: 'q2', date: '2026-10-09', project: p1, insp: 'Shear wall reinforcement cover and tie wire check', result: 'Pass', action: 'Approved by Resident Engineer prior to shuttering.', status: 'Closed' },
      { id: 'q3', date: '2026-10-03', project: p2, insp: 'Boundary wall mortar cube compression strength', result: 'Conditional', action: 'Increased water curing for 48 hours; re-tested satisfactory.', status: 'Closed' }
    ],
    hse: [
      { id: 'h1', date: '2026-10-14', project: p1, type: 'Toolbox talk', desc: 'Working safely with concrete pump boom and crane suspended loads', action: 'Attended by 36 site workers before shift commencement.', status: 'Closed' },
      { id: 'h2', date: '2026-10-08', project: p1, type: 'Hazard / risk', desc: 'Temporary edge protection on Level 3 southern cantilever requires additional toe board', action: 'Foreman Kudzai installed standard 150mm timber toe board within 30 minutes.', status: 'Closed' },
      { id: 'h3', date: '2026-10-11', project: p4, type: 'Inspection', desc: 'Reflective vests and PPE audit on highway live lane work', action: 'All 22 road crew compliant with high-visibility Class 3 gear.', status: 'Closed' }
    ],
    rfis: [
      { id: 'f1', ref: 'RFI-001', project: p1, subject: 'Staircase 2 head-height clearance at Level 2 landing', type: 'RFI', due: '2026-10-18', status: 'Open', resp: 'Awaiting structural engineer revised detail drawing' },
      { id: 'f2', ref: 'SUB-004', project: p1, subject: 'Granite floor tile physical sample and slip coefficient test', type: 'Submittal', due: '2026-10-12', status: 'Answered', resp: 'Approved by architect Kenneth Moyo on 2026-10-10' }
    ],
    snags: [
      { id: 'n1', project: p1, loc: 'Level 1 Plant Room', defect: 'Expansion joint sealant uneven at floor penetration', who: 'PlumbTech Engineering', target: '2026-10-22', status: 'Open' },
      { id: 'n2', project: p2, loc: 'Villa 1 boundary pillar', defect: 'Hairline plaster shrinkage crack at top coping', who: 'Farai Chinamasa', target: '2026-10-20', status: 'Open' }
    ],
    docs: [
      { id: 'doc1', title: 'Riverside Main Building Contract Executed', project: p1, cat: 'Contract', rev: 'Rev 0', date: '2026-06-01', file: 'Riverside_Contract_Executed.pdf' },
      { id: 'doc2', title: 'Structural Column General Arrangement Plan L2-L4', project: p1, cat: 'Drawing / Blueprint', rev: 'Rev C', date: '2026-08-15', file: 'STR-GA-201-RevC.dwg' },
      { id: 'doc3', title: 'City Council Approved Building Permit', project: p1, cat: 'Permit', rev: 'Final', date: '2026-05-20', file: 'COH_Building_Permit_8832.pdf' }
    ],
    comments: [
      { id: 'cm1', date: '2026-10-14', project: p1, by: 'Tendai Moyo', msg: 'Milestone reached: Level 3 column concreting complete. Crane schedule confirmed for truss delivery next Monday.' },
      { id: 'cm2', date: '2026-10-12', project: p1, by: 'Farai Chinamasa', msg: 'Concrete pump supplier Apex Ready-Mix has confirmed 2 boom pumps for next week slab pour.' }
    ]
  };

  const demoBuildersUsers = [
    { email: 'admin@demo.com', pw: 'demo123', role: 'admin', name: 'Tendai Moyo' },
    { email: 'pm@demo.com', pw: 'demo123', role: 'pm', name: 'Farai Chinamasa' },
    { email: 'site@demo.com', pw: 'demo123', role: 'site', name: 'Tinashe Mupfumi' },
    { email: 'buyer@demo.com', pw: 'demo123', role: 'buyer', name: 'Chipo Mutasa' },
    { email: 'finance@demo.com', pw: 'demo123', role: 'finance', name: 'Grace Moyo' },
    { email: 'viewer@demo.com', pw: 'demo123', role: 'viewer', name: 'Client Auditor' }
  ];

  return {
    cos: {
      'demo builders': {
        name: 'Demo Builders Ltd',
        cur: '$',
        users: demoBuildersUsers,
        subscription: {
          plan: 'Professional Trial',
          status: 'Active',
          started: '2026-08-01',
          renewal: '2027-08-01',
          seats: 15,
          modules: 'All operational modules active'
        },
        profile: {
          legalName: 'Demo Builders (Private) Limited',
          tradingName: 'BuildPro Demo Contracting',
          entityType: 'Private limited company',
          registrationNumber: 'CO-2019/88491-B',
          incorporationDate: '2019-03-15',
          countryOfIncorporation: 'Zimbabwe',
          operatingStatus: 'Active',
          companyDescription: 'General building contractor and civil engineering infrastructure specialist.',
          businessType: 'General Building & Civil Engineering Contractor',
          contractorGrade: 'Category A (Unlimited Commercial)',
          licenceAuthority: 'Construction Industry Federation (CIFOZ)',
          licenceNumber: 'CIFOZ-REG-2026/041',
          licenceIssueDate: '2026-01-01',
          licenceExpiryDate: '2026-12-31',
          taxIdentificationNumber: 'TIN-99482104-Z',
          vatNumber: 'VAT-10029384',
          fiscalYearEnd: '31 December',
          mainPhone: '+263 242 770 000',
          generalEmail: 'info@demobuilders.co.zw',
          website: 'https://buildpro.example.com',
          registeredAddress: '14 Samora Machel Avenue, Harare CBD',
          physicalAddress: 'BuildPro Yard, 12 Coventry Road, Workington Industrial Park, Harare',
          primaryContactName: 'Tendai Moyo',
          primaryContactTitle: 'Managing Director',
          primaryContactEmail: 'admin@demo.com',
          primaryContactPhone: '+263 77 200 1100',
          publicLiabilityInsurer: 'Old Mutual Insurance',
          publicLiabilityLimit: 2000000,
          publicLiabilityExpiry: '2027-03-31',
          defaultCurrency: '$',
          invoiceTerms: 'Net 14 days from payment certificate',
          invoicePrefix: 'BP-INV-',
          bankName: 'Stanbic Bank Zimbabwe',
          bankAccountName: 'Demo Builders (Pvt) Ltd',
          bankAccountNumber: '9140003882194',
          bankBranch: 'Harare Corporate Branch (Sort: 08-01)'
        },
        data: demoBuildersData
      }
    }
  };
}

// Data accessor
const D = k => C.data[k] || (C.data[k] = []);

// Role-based authorization checker
const can = (k, action = 'view') => {
  if (!U) return false;
  if (U.role === 'admin') return true;
  if (U.role === 'viewer') return action === 'view';
  if (!M[k]) return true;
  return M[k].w.includes(U.role);
};

// Storage persister
function save() {
  try {
    localStorage.setItem('bp2', JSON.stringify(DB));
    return true;
  } catch (e) {
    console.error('Failed to save BuildPro database', e);
    toast('Local storage is full or restricted. Changes could not be saved.', 'bad');
    return false;
  }
}

// Global logger to company audit trail
function log(action) {
  if (!C) return;
  C.audit = [{ t: new Date().toLocaleString(), u: U ? U.email : 'System', a: action }].concat(C.audit || []).slice(0, 300);
}

// Currency format helper
const n$ = x => {
  const symbol = (C && C.cur) ? C.cur : '$';
  const val = Number(x);
  if (!Number.isFinite(val)) return symbol + '0';
  return symbol + Math.round(val).toLocaleString();
};

// Numerical sum helper
const sum = (arr, fn) => (arr || []).reduce((acc, item) => {
  if (!item || item.status === 'Rejected') return acc;
  const v = Number(fn(item));
  return acc + (Number.isFinite(v) ? v : 0);
}, 0);

// Spent on project
const spent = pid => sum(D('expenses').filter(e => e.project == pid && e.status != 'Rejected'), e => e.amount) +
                     sum(D('pettycash').filter(p => p.project == pid && p.status != 'Rejected'), p => p.amount);

// Overdue task check
const od = t => t.status != 'Done' && t.end && t.end < today();

// Resolve entity name from ref table
const nm = (k, id) => {
  const r = (D(k) || []).find(x => x.id == id) || {};
  return r.name || r.number || r.title || r.item || '—';
};

// Semantic status color tags
const tc = v => {
  const s = String(v ?? '').trim();
  if (/^(done|approved|pass|paid|verified|closed|won|delivered|answered|reconciled|completed|working|fixed|active|current)$/i.test(s)) return 'ok';
  if (/^(fail|rejected|blocked|lost|down|suspended|on hold|overdue|expired)$/i.test(s)) return 'no';
  if (/^(in progress|pending|open|requested|ordered|conditional|draft|sent|submitted|preparing|due soon|interview|screening|offer)$/i.test(s)) return 'wa';
  if (/^(milestone|planning|hired)$/i.test(s)) return 'info';
  return '';
};

// ==========================================================================
// Authentication & Multi-Tenancy Engine
// ==========================================================================
function login() {
  const coName = $('co').value.trim().toLowerCase();
  const email = $('em').value.trim().toLowerCase();
  const password = $('pw').value;

  const company = DB.cos[coName];
  if (!company) {
    $('err').textContent = 'Company workspace not found. Check company name or click "Register new company".';
    return;
  }

  const user = company.users.find(u => u.email.toLowerCase() === email && u.pw === password);
  if (!user) {
    $('err').textContent = 'Invalid credentials for this company workspace.';
    return;
  }

  C = company;
  U = user;
  startApp();
}

function reg() {
  const n = $('co').value.trim();
  const k = n.toLowerCase();
  const em = $('em').value.trim().toLowerCase();
  const pw = $('pw').value;

  if (!n || !em || !pw) {
    $('err').textContent = 'Please fill out company name, email and password.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    $('err').textContent = 'Please provide a valid business email address.';
    return;
  }
  if (pw.length < 6) {
    $('err').textContent = 'Password must be at least 6 characters.';
    return;
  }
  if (DB.cos[k]) {
    $('err').textContent = 'Company workspace already exists. Please sign in instead.';
    return;
  }

  // Generate blank company data
  const data = {};
  Object.keys(M).forEach(m => data[m] = []);
  data.stages = [];

  DB.cos[k] = {
    name: n,
    cur: '$',
    users: [{ email: em, pw: pw, role: 'admin', name: em.split('@')[0] }],
    subscription: {
      plan: 'Professional Trial',
      status: 'Trial',
      started: today(),
      renewal: '',
      seats: 5,
      modules: 'All operational modules active'
    },
    profile: {
      legalName: n,
      tradingName: n,
      defaultCurrency: '$'
    },
    data: data
  };

  save();
  C = DB.cos[k];
  U = C.users[0];
  startApp();
  toast('Company workspace registered successfully!');
}

function selectDemoPersona(role, email) {
  $('co').value = 'Demo Builders';
  $('em').value = email;
  $('pw').value = 'demo123';
  $('err').textContent = '';
  login();
}

function quickSwitchRole(newRole) {
  if (!U) return;
  U.role = newRole;
  log('Switched interactive persona role to ' + ROLES[newRole]);
  toast('Active persona: ' + ROLES[newRole], 'ok');
  nav();
  go(view);
}

function switchCompany(coKey) {
  if (!DB.cos[coKey]) return;
  C = DB.cos[coKey];
  U = C.users[0];
  toast('Switched workspace to ' + C.name, 'ok');
  startApp();
}

function startApp() {
  // Ensure profile and data structures exist
  if (!C.subscription) {
    C.subscription = { plan: 'Professional Trial', status: 'Active', started: today(), renewal: '', seats: 15 };
  }
  if (!C.profile) {
    C.profile = { legalName: C.name, tradingName: C.name };
  }

  // Ensure all module arrays are allocated
  Object.keys(M).forEach(k => {
    if (!Array.isArray(C.data[k])) C.data[k] = [];
  });
  if (!Array.isArray(C.data.stages)) C.data.stages = [];

  $('login').style.display = 'none';
  $('app').style.display = 'block';
  document.title = 'BuildPro – ' + C.name;

  nav();
  go('dash');
}

function out() {
  C = null;
  U = null;
  $('app').style.display = 'none';
  $('login').style.display = 'grid';
  document.title = 'BuildPro – Sign in';
}

// ==========================================================================
// Navigation & Workspace Shell
// ==========================================================================
function nav() {
  const navContainer = $('nav');
  if (!navContainer) return;

  const pendingApprovalsCount = D('pos').filter(o => o.status === 'Requested').length +
                                D('expenses').filter(e => e.status === 'Pending').length +
                                D('timesheets').filter(t => t.status === 'Submitted').length;

  const lowStockCount = D('materials').filter(m => Number(m.qty) <= Number(m.min)).length;
  const overdueTasksCount = D('tasks').filter(od).length;

  let html = `
    <a class="brand" href="index.html">
      ${icon('project', '', 22)} Build<span>Pro</span>
    </a>
    <button class="nav-item ${view === 'dash' ? 'on' : ''}" data-view="dash" id="ndash" type="button" onclick="go('dash')">
      ${icon('dashboard')}
      <span>Dashboard</span>
    </button>
  `;

  // Render navigation groups
  const employeeKeys = Object.keys(EMPLOYEE_PAGES).filter(k => EMPLOYEE_PAGES[k].includes(U.role));
  const groups = GR.map(([name, keys]) => ({ name, keys }))
    .concat([
      { name: 'Workforce (HR)', keys: employeeKeys },
      ...(U.role === 'admin' ? [{ name: 'Administration', keys: ['company', 'subscription', 'users', 'audit'] }] : [])
    ])
    .filter(g => g.keys.length > 0);

  groups.forEach(({ name, keys }) => {
    html += `<div class="nav-group"><p class="nav-label">${esc(name)}</p>`;
    keys.forEach(k => {
      const title = M[k] ? M[k].t : NM[k];
      const ic = (M[k] && M[k].icon) ? M[k].icon : (k === 'company' ? 'company' : k === 'subscription' ? 'subscription' : k === 'users' ? 'users' : k === 'audit' ? 'audit' : k === 'rep' ? 'reports' : k === 'bi' ? 'bi' : k === 'alerts' ? 'alerts' : k === 'cash' ? 'cash' : k === 'finance' ? 'finance' : k === 'planning' ? 'planning' : k === 'field' ? 'field' : 'project');

      let badge = '';
      if (k === 'alerts' && pendingApprovalsCount > 0) badge = `<span class="nav-badge" style="background:var(--color-cta)">${pendingApprovalsCount}</span>`;
      else if (k === 'materials' && lowStockCount > 0) badge = `<span class="nav-badge" style="background:var(--color-warn)">${lowStockCount}</span>`;
      else if (k === 'tasks' && overdueTasksCount > 0) badge = `<span class="nav-badge" style="background:var(--color-bad)">${overdueTasksCount}</span>`;

      html += `
        <button class="nav-item ${view === k ? 'on' : ''}" type="button" data-view="${esc(k)}" onclick="go(${jsarg(k)})">
          ${icon(ic)}
          <span>${esc(title)}</span>
          ${badge}
        </button>
      `;
    });
    html += `</div>`;
  });

  navContainer.innerHTML = html;

  // Render userbar controls
  renderUserbar();
}

function renderUserbar() {
  const userbar = $('userbar');
  if (!userbar) return;

  const currentRoleLabel = ROLES[U.role] || U.role;
  const allProjects = D('projects');

  userbar.innerHTML = `
    <div class="userbar-left">
      <button class="menu-toggle btn-sm" type="button" onclick="document.getElementById('app').classList.toggle('nav-open')" aria-label="Toggle Navigation">
        ${icon('menu')}
      </button>
      <div style="display:flex;flex-direction:column">
        <span style="font-weight:700;font-size:15px;color:var(--color-text)">${esc(NM[view] || (M[view] ? M[view].t : view))}</span>
        <small class="muted" style="font-size:12px">${esc(C.name)} Workspace</small>
      </div>
    </div>
    <div class="userbar-right">
      <!-- Project Scope Selector -->
      <select aria-label="Filter active project" style="max-width:180px;font-size:12.5px;padding:5px 8px" onchange="window.dashProject=this.value;window.planProject=this.value;go(view)">
        <option value="">All Projects</option>
        ${allProjects.map(p => `<option value="${esc(p.id)}" ${p.id === window.dashProject ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
      </select>

      <!-- Quick Role Switcher Persona (For Evaluation & Demo) -->
      <select aria-label="Switch Role Persona" style="max-width:165px;font-size:12px;padding:5px 8px;font-weight:600;background:var(--color-cta-subtle);color:var(--color-cta);border-color:rgba(249,115,22,0.3)" onchange="quickSwitchRole(this.value)">
        ${Object.entries(ROLES).map(([r, title]) => `<option value="${r}" ${r === U.role ? 'selected' : ''}>Role: ${title}</option>`).join('')}
      </select>

      <!-- Dark/Light Theme Toggle -->
      <button class="btn-sm" type="button" title="Toggle color scheme" onclick="toggleTheme()">
        ${icon('moon', 'theme-icon')}
      </button>

      <!-- User Avatar / Info -->
      <div class="user-badge" title="${esc(U.email)} (${currentRoleLabel})">
        <div class="user-avatar">${(U.name || U.email).charAt(0).toUpperCase()}</div>
      </div>

      <!-- Logout -->
      <button class="btn-sm" type="button" title="Sign out" onclick="out()">
        ${icon('logout')}
      </button>
    </div>
  `;
}

function toggleTheme() {
  const d = document.documentElement;
  const next = d.dataset.theme === 'dark' ? 'light' : 'dark';
  d.dataset.theme = next;
  localStorage.setItem('bp_theme', next);
  if (view === 'dash') requestAnimationFrame(renderDashChart);
}

// Restore theme from localStorage on boot
(function initTheme() {
  const saved = localStorage.getItem('bp_theme');
  if (saved) document.documentElement.dataset.theme = saved;
})();

// ==========================================================================
// View Router & Page Dispatcher
// ==========================================================================
function go(v) {
  if (EMPLOYEE_PAGES[v] && !EMPLOYEE_PAGES[v].includes(U.role)) {
    toast('Access to this section is restricted for your role (' + ROLES[U.role] + ').', 'wa');
    return;
  }

  view = v;
  document.querySelectorAll('#nav [data-view]').forEach(b => {
    b.classList.toggle('on', b.dataset.view == v);
  });

  const specialized = {
    dash, rep, users, track, cash, alerts, audit, bi, finance, planning, field, subscription, company, employeeReports
  };

  const main = $('main');
  if (specialized[v]) {
    main.innerHTML = specialized[v]();
  } else if (EMPLOYEE_PAGES[v]) {
    main.innerHTML = employeeModule(v);
  } else if (M[v]) {
    main.innerHTML = list(v) + (v === 'tasks' ? gantt() : '');
  } else {
    main.innerHTML = `<h2>Page Not Found</h2><p>View '${esc(v)}' is not configured.</p>`;
  }

  if (v === 'field') initFieldDate();
  if (v === 'dash') requestAnimationFrame(renderDashChart);
  if (v === 'cash') requestAnimationFrame(renderCashChart);

  $('app').classList.remove('nav-open');
  renderUserbar();
}

// ==========================================================================
// Executive Dashboard Module (dash)
// ==========================================================================
function dash() {
  const t = today();
  const allProjects = D('projects');
  const scope = window.dashProject || '';
  const P = allProjects.filter(p => !scope || p.id == scope);
  const T = D('tasks');

  const dateLabel = s => s ? new Date(s + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date not set';

  const rows = P.map(p => {
    const tasks = T.filter(x => x.project == p.id);
    const stages = D('stages').filter(x => x.project == p.id);
    const progress = stages.length ? sum(stages, s => s.pct) / stages.length : tasks.length ? sum(tasks, x => x.pct) / tasks.length : 0;
    const actual = spent(p.id);
    const committed = sum(D('pos').filter(o => o.project == p.id && o.status != 'Delivered'), o => o.cost) +
                      sum(D('subs').filter(s => s.project == p.id), s => Math.max(0, (+s.value || 0) - (+s.paid || 0)));
    const forecast = actual + committed;
    const budget = +p.budget || 0;
    const contract = +p.value || sum(D('contracts').filter(c => c.project == p.id), c => c.value);
    const overdue = tasks.filter(od).length;
    const late = !!(p.end && p.end < t && p.status != 'Done');
    const overBudget = budget > 0 && forecast > budget;
    const health = p.status == 'On hold' ? 'On hold' : late || overdue > 0 || overBudget ? 'At risk' : p.status == 'Planning' ? 'Planning' : 'On track';
    const next = tasks.filter(x => x.status != 'Done' && x.end >= t).sort((a, b) => a.end.localeCompare(b.end))[0];

    return { p, progress, actual, committed, forecast, budget, contract, overdue, late, overBudget, health, next };
  });

  const active = rows.filter(x => x.p.status == 'Active').length;
  const atRisk = rows.filter(x => x.health == 'At risk').length;
  const contractValue = sum(rows, r => r.contract);
  const totalBudget = sum(P, p => p.budget);
  const actual = sum(rows, r => r.actual);
  const committed = sum(rows, r => r.committed);
  const exposure = actual + committed;
  const exposurePct = totalBudget ? (exposure / totalBudget * 100) : 0;

  const invoices = D('invoices').filter(i => !scope || i.project == scope);
  const receivable = sum(invoices, i => Math.max(0, (+i.amount || 0) - (+i.retention || 0) - (+i.paid || 0)));
  const overdueInvoices = invoices.filter(i => i.due && i.due < t && i.amount - i.retention - i.paid > 0).length;

  const dueTasks = T.filter(x => (!scope || x.project == scope) && x.status != 'Done' && x.end && x.end >= t).sort((a, b) => a.end.localeCompare(b.end));
  const overdueTasks = T.filter(x => (!scope || x.project == scope) && od(x)).length;
  const rfis = D('rfis').filter(x => (!scope || x.project == scope) && x.status == 'Open' && x.due && x.due < t).length;
  const openSafety = D('hse').filter(x => (!scope || x.project == scope) && x.status == 'Open').length;
  const lowStock = D('materials').filter(m => Number(m.qty) <= Number(m.min)).length;
  const pending = D('expenses').filter(e => (!scope || e.project == scope) && e.status == 'Pending').length +
                  D('pos').filter(o => (!scope || o.project == scope) && o.status == 'Requested').length +
                  D('timesheets').filter(ts => (!scope || ts.project == scope) && ts.status == 'Submitted').length;

  const attention = [
    { n: overdueTasks, label: 'Overdue tasks', page: 'tasks', tone: 'no' },
    { n: overdueInvoices, label: 'Overdue client invoices', page: 'invoices', tone: 'no' },
    { n: rfis, label: 'RFIs past due response', page: 'rfis', tone: 'no' },
    { n: openSafety, label: 'Open HSE safety actions', page: 'hse', tone: 'no' },
    { n: lowStock, label: 'Materials at reorder level', page: 'materials', tone: 'wa' },
    { n: pending, label: 'Items awaiting management approval', page: 'alerts', tone: 'wa' }
  ].filter(x => x.n > 0);

  const quick = [
    ['reports', 'Daily site report'],
    ['tasks', 'Add task'],
    ['expenses', 'Record cost'],
    ['pos', 'Purchase request']
  ].filter(([k]) => can(k));

  const projectRows = rows.length ? rows.map(({ p, progress, actual, committed, forecast, budget, overdue, health, next }) => `
    <tr>
      <td>
        <span class="dash-project-name">${esc(p.name)}</span>
        <span class="dash-project-sub">${esc(p.client || p.mgr || 'Project')} · ${esc(p.loc || '')}</span>
      </td>
      <td><span class="tag ${tc(health)}">${esc(health)}</span></td>
      <td class="dash-progress">
        <b>${Math.round(progress)}%</b>
        <div class="bar" style="margin-top:4px"><i class="${overdue ? 'o' : ''}" style="width:${Math.max(0, Math.min(100, progress))}%"></i></div>
      </td>
      <td>
        <b>${n$(forecast)}</b>
        <span class="dash-project-sub">${budget ? n$(budget - forecast) + ' balance of ' + n$(budget) : 'Budget not set'}${committed ? ' · ' + n$(committed) + ' committed' : ''}</span>
      </td>
      <td class="dash-hide-mobile">
        ${next ? esc(next.name) + '<span class="dash-project-sub">' + dateLabel(next.end) + '</span>' : p.end ? dateLabel(p.end) : '—'}
      </td>
      <td style="text-align:right">
        <button class="btn-sm btn-primary" onclick="TP=${jsarg(p.id)};go('track')">Tracker</button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="dash-empty">No projects match this view. Add a project to start tracking delivery.</td></tr>';

  return `
    <header class="dash-head">
      <div>
        <h2>Portfolio Operations Overview</h2>
        <p>${esc(C.name)} · Construction operations, cost control and site intelligence · ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div class="dash-tools np">
        <select aria-label="Filter dashboard by project" onchange="window.dashProject=this.value;go('dash')">
          <option value="">All active projects</option>
          ${allProjects.map(p => `<option value="${esc(p.id)}" ${p.id == scope ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
        </select>
        ${quick.map(([k, l]) => `<button class="${k == 'reports' ? 'p' : 'btn-secondary'}" onclick="go('${k}');openForm('${k}')">${icon('plus')} ${l}</button>`).join('')}
      </div>
    </header>

    <!-- Executive Key Metric Tiles -->
    <section class="dash-stats" aria-label="Portfolio key metrics">
      <div class="dash-stat">
        <span class="label">Active Projects</span>
        <strong>${active}</strong>
        <small>${atRisk ? `<span class="bad">${atRisk} project(s) at risk</span>` : '<span class="ok">All active projects on track</span>'}</small>
      </div>
      <div class="dash-stat">
        <span class="label">Contract Value</span>
        <strong>${n$(contractValue)}</strong>
        <small>${rows.length} project(s) under management</small>
      </div>
      <div class="dash-stat">
        <span class="label">Total Cost Exposure</span>
        <strong>${n$(exposure)}</strong>
        <small>${exposurePct.toFixed(0)}% of ${n$(totalBudget)} budget (${n$(actual)} actual, ${n$(committed)} committed)</small>
      </div>
      <div class="dash-stat">
        <span class="label">Client Receivables</span>
        <strong>${n$(receivable)}</strong>
        <small>${overdueInvoices ? `<span class="bad">${overdueInvoices} overdue claim invoice(s)</span>` : '<span class="ok">Zero overdue invoices</span>'}</small>
      </div>
    </section>

    <!-- Visual Charts Row -->
    <div class="g2" style="margin-bottom:18px">
      <section class="dash-panel" style="margin:0">
        <div class="dash-panel-head">
          <div>
            <h3>Budget vs Actual Cost vs Committed Exposure</h3>
            <small>Financial exposure by project</small>
          </div>
          <span class="tag info">Live Chart</span>
        </div>
        <div class="chart-container">
          <canvas id="dashChart" aria-label="Budget versus actual chart"></canvas>
        </div>
      </section>
      <section class="dash-panel" style="margin:0">
        <div class="dash-panel-head">
          <div>
            <h3>Expenditure by Category</h3>
            <small>Materials, labour, equipment & subcontracts</small>
          </div>
          <button class="btn-sm" onclick="go('finance')">Financials</button>
        </div>
        <div class="chart-container">
          <canvas id="expenseCatChart" aria-label="Expenses category chart"></canvas>
        </div>
      </section>
    </div>

    <!-- Project Delivery Table and Side Controls -->
    <div class="dash-layout">
      <section class="dash-panel">
        <div class="dash-panel-head">
          <div>
            <h3>Active Project Delivery Status</h3>
            <small>Track completion percentage, forecast final cost and milestone deadlines</small>
          </div>
          <button class="btn-sm" onclick="go('projects')">All projects</button>
        </div>
        <div class="t">
          <table class="dash-projects">
            <thead>
              <tr>
                <th>Project / Location</th>
                <th>Health</th>
                <th>Progress</th>
                <th>Forecast Cost</th>
                <th class="dash-hide-mobile">Next Milestone</th>
                <th style="text-align:right">Action</th>
              </tr>
            </thead>
            <tbody>${projectRows}</tbody>
          </table>
        </div>
      </section>

      <aside>
        <!-- Action Items / Attention -->
        <section class="dash-panel">
          <div class="dash-panel-head">
            <h3>Needs Management Attention</h3>
            <span class="tag ${attention.length ? 'wa' : 'ok'}">${attention.length} open</span>
          </div>
          ${attention.length ? attention.map(x => `
            <div class="dash-alert">
              <div>
                <strong class="${x.tone == 'no' ? 'bad' : ''}">${x.n} · ${x.label}</strong>
                <small>Immediate operational action required</small>
              </div>
              <button class="btn-sm p" onclick="go('${x.page}')">Review</button>
            </div>
          `).join('') : '<div class="dash-empty ok">All clear. No critical alerts or delays pending.</div>'}
        </section>

        <!-- 90-Day Schedule Look-ahead -->
        <section class="dash-panel">
          <div class="dash-panel-head">
            <div>
              <h3>90-Day Schedule Look-Ahead</h3>
              <small>Upcoming project milestones & task deadlines</small>
            </div>
            <button class="btn-sm" onclick="go('planning')">Gantt</button>
          </div>
          ${dueTasks.length ? dueTasks.slice(0, 5).map(x => `
            <div class="dash-next">
              <span class="dash-next-date">${dateLabel(x.end)}${od(x) ? ' · OVERDUE' : ''}</span>
              <strong>${esc(x.name)}</strong>
              <small>${esc(nm('projects', x.project))} · Lead: ${esc(x.who || 'Unassigned')}</small>
            </div>
          `).join('') : '<div class="dash-empty">No task deadlines due in the next 90 days.</div>'}
        </section>

        <!-- Financial Exposure Summary -->
        <section class="dash-panel">
          <div class="dash-panel-head">
            <h3>Contract Cost Governance</h3>
            <button class="btn-sm" onclick="go('cash')">Cash Flow</button>
          </div>
          <div class="dash-alert">
            <div>
              <strong>${n$(actual)} Incurred Cost</strong>
              <small>Approved expenses and petty cash paid</small>
            </div>
          </div>
          <div class="dash-alert">
            <div>
              <strong>${n$(committed)} Open Commitments</strong>
              <small>Purchase orders issued and unpaid subcontracts</small>
            </div>
          </div>
          <div class="dash-alert">
            <div>
              <strong>${n$(Math.max(0, totalBudget - exposure))} Uncommitted Budget Balance</strong>
              <small>${(100 - exposurePct).toFixed(0)}% available contingency & remaining scope</small>
            </div>
          </div>
        </section>
      </aside>
    </div>
  `;
}

// Chart.js rendering helper for Dashboard
function renderDashChart() {
  const canvas = $('dashChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (window.dashChartInstance) {
    window.dashChartInstance.destroy();
    window.dashChartInstance = null;
  }

  const scope = window.dashProject || '';
  const projects = D('projects').filter(p => !scope || p.id == scope);
  const labels = projects.map(p => p.name);
  const budget = projects.map(p => +p.budget || 0);
  const actual = projects.map(p => spent(p.id));
  const committed = projects.map(p => sum(D('pos').filter(o => o.project == p.id && o.status != 'Delivered'), o => o.cost) +
                                      sum(D('subs').filter(s => s.project == p.id), s => Math.max(0, (+s.value || 0) - (+s.paid || 0))));

  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  window.dashChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Approved Budget', data: budget, backgroundColor: '#64748B', borderRadius: 4 },
        { label: 'Actual Cost Paid', data: actual, backgroundColor: '#F97316', borderRadius: 4 },
        { label: 'Committed Exposure', data: committed, backgroundColor: '#94A3B8', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } } },
        tooltip: {
          callbacks: {
            label: context => ` ${context.dataset.label}: ${n$(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, callback: v => n$(v) },
          grid: { color: gridColor }
        }
      }
    }
  });

  // Render Expense Category Doughnut Chart
  renderExpenseCategoryChart();
}

function renderExpenseCategoryChart() {
  const canvas = $('expenseCatChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (window.expenseCatChartInstance) {
    window.expenseCatChartInstance.destroy();
    window.expenseCatChartInstance = null;
  }

  const scope = window.dashProject || '';
  const expenses = D('expenses').filter(e => (!scope || e.project == scope) && e.status != 'Rejected');
  const cats = {};
  expenses.forEach(e => {
    cats[e.cat] = (cats[e.cat] || 0) + Number(e.amount);
  });

  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';

  const labels = Object.keys(cats).length ? Object.keys(cats) : ['Materials', 'Labour', 'Equipment', 'Subcontract'];
  const data = Object.keys(cats).length ? Object.values(cats) : [45000, 26000, 16000, 15000];

  window.expenseCatChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#F97316', '#64748B', '#0284C7', '#10B981', '#8B5CF6', '#F59E0B'],
        borderWidth: 2,
        borderColor: isDark ? '#151C2C' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11.5 } } },
        tooltip: {
          callbacks: {
            label: context => ` ${context.label}: ${n$(context.parsed)}`
          }
        }
      }
    }
  });
}

// ==========================================================================
// Project Tracker & Delivery (track)
// ==========================================================================
function track() {
  const P = D('projects');
  if (!P.length) {
    return `
      <div class="section-title"><h2>Project Tracker & Delivery</h2></div>
      <div class="c"><p>No projects registered yet. Go to <a href="#" onclick="go('projects');return false"><b>Projects & Contracts</b></a> to create your first project.</p></div>
    `;
  }

  if (!P.find(p => p.id == window.TP)) window.TP = P[0].id;
  const p = P.find(x => x.id == window.TP);
  const S = D('stages').filter(s => s.project == window.TP);
  const isAuthorized = U.role == 'admin' || ['pm', 'site'].includes(U.role);

  const pr = S.length ? sum(S, s => s.pct) / S.length : 0;
  const sp = spent(window.TP);
  const tk = D('tasks').filter(t => t.project == window.TP);
  const iv = D('invoices').filter(i => i.project == window.TP);
  const wk = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
  const up = [];
  const cats = {};
  const rp = D('reports').filter(r => r.project == window.TP).sort((a, b) => b.date > a.date ? 1 : -1).slice(0, 5);

  S.forEach(s => (s.hist || []).filter(h => h.d >= wk).forEach(h => up.push(`${esc(s.name)}: ${h.pct}% – ${esc(h.note || 'Progress update')} (${esc(h.d)})`)));
  D('expenses').filter(e => e.project == window.TP && e.status != 'Rejected').forEach(e => cats[e.cat] = (cats[e.cat] || 0) + Number(e.amount));

  const late = p.end && p.end < today() && pr < 100;
  const opn = (k, f) => D(k).filter(x => x.project == window.TP && f(x)).length;

  return `
    <div class="row np">
      <h2>Project Tracker & Stage Delivery</h2>
      <span>
        <select onchange="window.TP=this.value;go('track')" style="font-weight:600">
          ${P.map(x => `<option value="${x.id}" ${x.id == window.TP ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}
        </select>
        <button class="btn-primary" onclick="window.print()">${icon('printer')} Print Project Report</button>
      </span>
    </div>

    <!-- Project KPI Summary -->
    <div class="c">
      <div class="row">
        <div>
          <h3 style="font-size:20px;margin:0 0 4px">${esc(p.name)}</h3>
          <small class="muted">${esc(p.client || 'Client')} · ${esc(p.loc || '')} · Manager: ${esc(p.mgr || 'Unassigned')} · ${p.start || '?'} → ${p.end || '?'} · Generated ${today()}</small>
        </div>
        <span class="tag ${tc(p.status)}">${esc(p.status)}</span>
      </div>

      <div class="g" style="margin-top:16px">
        <div class="k">
          <b>${pr.toFixed(0)}%</b>
          <small>Overall Weighted Progress</small>
          <div class="bar" style="margin-top:6px"><i style="width:${pr}%"></i></div>
        </div>
        <div class="k">
          <b>${n$(sp)}</b>
          <small>Incurred of ${n$(p.budget)} Budget</small>
          <div class="bar" style="margin-top:6px"><i class="${sp > p.budget ? 'o' : ''}" style="width:${Math.min(100, p.budget ? sp / p.budget * 100 : 0)}%"></i></div>
        </div>
        <div class="k">
          <b class="${tk.filter(od).length ? 'bad' : 'ok'}">${tk.filter(od).length}</b>
          <small>Overdue Tasks (${tk.length} total tasks)</small>
        </div>
        <div class="k">
          <b>${n$(sum(iv, i => i.paid))}</b>
          <small>Collected of ${n$(sum(iv, i => i.amount))} Invoiced</small>
        </div>
      </div>
      ${late ? '<p class="bad" style="margin-top:8px">Target project completion date has passed and project is not marked complete.</p>' : ''}
    </div>

    <!-- Construction Stages Management -->
    <div class="c">
      <div class="row">
        <div>
          <h3 style="font-size:16px;margin:0">Construction Stages & Progress Log</h3>
          <small class="muted">Track milestone completion across work packages</small>
        </div>
        ${isAuthorized ? `
          <span class="np">
            <button class="btn-sm" onclick="stg()">+ Add Stage</button>
            ${!S.length ? '<button class="btn-sm p" onclick="stdStages()">Generate Standard Stages</button>' : ''}
          </span>
        ` : ''}
      </div>

      <div style="margin-top:14px">
        ${S.map(s => {
          const dl = s.end && s.end < today() && s.pct < 100;
          const st = s.pct >= 100 ? 'Done' : s.pct > 0 ? 'In progress' : 'Not started';
          return `
            <div style="padding:12px 0;border-top:1px solid var(--color-border)">
              <div class="row" style="margin-bottom:6px">
                <div>
                  <strong style="font-size:14px">${esc(s.name)}</strong>
                  <span class="tag ${tc(st)}" style="margin-left:6px">${st}</span>
                  ${dl ? '<span class="tag no">Schedule delayed</span>' : ''}
                  <div class="muted" style="font-size:12px;margin-top:2px">${s.start || 'Start unset'} → ${s.end || 'Target unset'}</div>
                </div>
                ${isAuthorized ? `
                  <span class="np">
                    <button class="btn-sm" onclick="stg('${s.id}')">${icon('edit')} Update</button>
                    <button class="btn-sm" onclick="stgDel('${s.id}')">${icon('trash')}</button>
                  </span>
                ` : ''}
              </div>
              <div class="bar" style="height:10px;margin-bottom:4px"><i style="width:${s.pct}%"></i></div>
              <small class="muted">${s.pct}% completed</small>
              ${(s.hist || []).length ? `
                <details style="margin-top:6px">
                  <summary style="font-size:12px;color:var(--color-primary);cursor:pointer">Stage update history (${s.hist.length})</summary>
                  <div style="padding:6px 0;font-size:12px" class="muted">
                    ${s.hist.map(h => `<div>${esc(h.d)} · ${h.pct}% · ${esc(h.by ? h.by.split('@')[0] : 'Engineer')}: ${esc(h.note || '—')}</div>`).join('')}
                  </div>
                </details>
              ` : ''}
            </div>
          `;
        }).join('') || '<p class="muted">No project stages created yet. Click "Generate Standard Stages" to initialize.</p>'}
      </div>
    </div>

    <!-- Insights Grid -->
    <div class="g2">
      <div class="c">
        <h4 style="font-size:15px">Recent Activity (Last 7 Days)</h4>
        <ul style="padding-left:18px;margin:8px 0;font-size:13px">
          ${up.map(u => `<li>${u}</li>`).join('') || '<li class="muted">No stage updates logged in the last 7 days.</li>'}
        </ul>
        <h4 style="font-size:15px;margin-top:16px">Spend by Cost Category</h4>
        <ul style="padding-left:18px;margin:8px 0;font-size:13px">
          ${Object.entries(cats).map(([c, v]) => `<li>${esc(c)}: ${n$(v)}</li>`).join('') || '<li class="muted">No recorded costs yet.</li>'}
        </ul>
      </div>

      <div class="c">
        <h4 style="font-size:15px">Open Field & Governance Items</h4>
        <ul style="padding-left:18px;margin:8px 0;font-size:13px">
          <li>Open snags / defects: <b>${opn('snags', x => x.status == 'Open')}</b></li>
          <li>Open safety & HSE observations: <b>${opn('hse', x => x.status == 'Open')}</b></li>
          <li>Open technical RFIs: <b>${opn('rfis', x => x.status == 'Open')}</b></li>
          <li>Outstanding purchase deliveries: <b>${opn('pos', x => x.status != 'Delivered')}</b></li>
        </ul>
        <h4 style="font-size:15px;margin-top:16px">Latest Site Supervisor Reports</h4>
        <div style="font-size:12.5px" class="muted">
          ${rp.map(r => `<div style="margin:6px 0">${esc(r.date)} – <b>${esc(r.work)}</b> (${r.workers} workers; weather: ${esc(r.weather)})</div>`).join('') || '<div>No site reports recorded.</div>'}
        </div>
      </div>
    </div>
  `;
}

function stg(id) {
  const s = id ? D('stages').find(x => x.id == id) : { pct: 0 };
  $('dlg').innerHTML = `
    <h3 style="margin-top:0">${id ? 'Update Construction Stage' : 'New Construction Stage'}</h3>
    <label>Stage name<input id="s_n" value="${esc(s.name || '')}"></label>
    <label>Planned start date<input id="s_s" type="date" value="${esc(s.start || '')}"></label>
    <label>Planned completion date<input id="s_e" type="date" value="${esc(s.end || '')}"></label>
    <label>Percentage completed (0–100%)<input id="s_p" type="number" min="0" max="100" value="${s.pct}"></label>
    <label>Progress log & site inspection notes<textarea id="s_t" rows="3" placeholder="Describe work done, testing results, or reason for variance"></textarea></label>
    <div class="row" style="margin-top:16px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="stgSv('${id || ''}')">Save Stage</button>
    </div>
  `;
  $('dlg').showModal();
}

function stgSv(id) {
  const o = id ? D('stages').find(x => x.id == id) : { id: 'g' + Date.now(), project: window.TP, hist: [] };
  const p = Math.max(0, Math.min(100, +$('s_p').value || 0));
  const t = $('s_t').value.trim();

  o.name = $('s_n').value.trim() || 'Untitled Stage';
  o.start = $('s_s').value;
  o.end = $('s_e').value;
  o.hist = o.hist || [];

  if (id && (p != o.pct || t)) {
    o.hist.push({ d: today(), pct: p, note: t, by: U.email });
  }
  o.pct = p;

  if (!id) D('stages').push(o);
  log('Updated project stage ' + o.name + ' on project ' + nm('projects', window.TP));
  save();
  $('dlg').close();
  toast('Project stage saved', 'ok');
  go('track');
}

function stgDel(id) {
  ask('Delete this construction stage?', () => {
    C.data.stages = D('stages').filter(x => x.id != id);
    save();
    toast('Stage deleted', 'ok');
    go('track');
  });
}

function stdStages() {
  const list = ['Mobilisation & Site Setup', 'Foundations & Substructure', 'Superstructure Frame', 'Roofing & Enclosure', 'Internal MEP Services', 'Finishes & Joinery', 'Commissioning & Handover'];
  list.forEach(n => {
    D('stages').push({
      id: 'g' + Math.random().toString(36).slice(2, 9),
      project: window.TP,
      name: n,
      start: '',
      end: '',
      pct: 0,
      hist: []
    });
  });
  save();
  toast('Standard construction stages generated', 'ok');
  go('track');
}

// ==========================================================================
// Project Planning & Schedule Gantt (planning)
// ==========================================================================
function planning() {
  const ts = D('tasks');
  const ps = D('projects');
  const project = window.planProject || '';
  const list = ts.filter(t => !project || t.project == project);
  const late = list.filter(od);
  const blocked = list.filter(t => t.status == 'Blocked');
  const notstarted = list.filter(t => t.status == 'Not started');
  const inprogress = list.filter(t => t.status == 'In progress');
  const done = list.filter(t => t.status == 'Done');

  const lanes = [
    ['Not started', notstarted],
    ['In progress', inprogress],
    ['Blocked', blocked],
    ['Done', done]
  ];

  return `
    <div class="section-title">
      <h2>Project Planning & Schedule Control</h2>
      <span>
        <select onchange="window.planProject=this.value;go('planning')">
          <option value="">All Projects</option>
          ${ps.map(p => `<option value="${p.id}" ${p.id == project ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
        </select>
        <button class="btn-primary" onclick="openForm('tasks')">${icon('plus')} Add Task</button>
        <button class="btn-secondary" onclick="go('track')">Delivery Tracker</button>
      </span>
    </div>

    <!-- Planning KPI Cards -->
    <div class="g">
      <div class="k"><b>${list.length}</b><small>Total Scheduled Tasks</small></div>
      <div class="k"><b>${inprogress.length}</b><small>Tasks In Progress</small></div>
      <div class="k"><b class="${late.length ? 'bad' : 'ok'}">${late.length}</b><small>Overdue Milestones</small></div>
      <div class="k"><b>${blocked.length}</b><small>Blocked / Impeded Tasks</small></div>
    </div>

    <!-- Interactive Schedule Gantt Timeline -->
    <div class="c">
      <div class="dash-panel-head">
        <div>
          <h3>Gantt Schedule Overview</h3>
          <small>Timeline of active work breakdown structure items and critical path tasks</small>
        </div>
      </div>
      <div class="t">
        ${planningGantt(list)}
      </div>
    </div>

    <!-- Interactive Kanban Workflow Lanes -->
    <h3 style="margin:20px 0 10px;font-size:18px">Work Breakdown Kanban Board</h3>
    <div class="kanban-board">
      ${lanes.map(([name, items]) => `
        <div class="kanban-col">
          <div class="row" style="margin-bottom:8px">
            <strong style="font-size:14px">${esc(name)}</strong>
            <span class="tag ${tc(name)}">${items.length}</span>
          </div>
          ${items.map(t => `
            <div class="kanban-card">
              <div style="font-weight:700;font-size:13.5px">${esc(t.name)}</div>
              <div class="muted" style="font-size:12px;margin:3px 0">${esc(nm('projects', t.project))} · ${esc(t.who || 'Unassigned')}</div>
              <div style="font-size:11.5px;color:var(--color-primary);margin:4px 0">${esc(t.start || 'Start unset')} → ${esc(t.end || 'Due unset')}</div>
              <div class="bar" style="margin:6px 0"><i style="width:${Math.max(0, Math.min(100, +t.pct || 0))}%"></i></div>
              <div class="row" style="margin:8px 0 0">
                <small class="muted">${t.pct || 0}% complete</small>
                <span>
                  <button class="btn-sm" onclick="openForm('tasks','${t.id}')">Edit</button>
                  ${name !== 'Done' ? `<button class="btn-sm btn-primary" onclick="advanceTaskStatus('${t.id}')">Advance</button>` : ''}
                </span>
              </div>
            </div>
          `).join('') || '<small class="muted" style="display:block;padding:12px 0">No tasks in this lane</small>'}
        </div>
      `).join('')}
    </div>

    <!-- Planning Dependency Alerts -->
    <div class="c" style="margin-top:16px">
      <h4 style="margin:0 0 8px;font-size:15px">Schedule Health & Dependency Checks</h4>
      <ul style="padding-left:18px;margin:0;font-size:13px">
        <li class="${late.length ? 'bad' : ''}">${late.length} task(s) currently past due date and requiring recovery plan.</li>
        <li>${ts.filter(t => !t.who).length} task(s) currently unassigned to an engineer or subcontractor.</li>
        <li>${ts.filter(t => t.type === 'Milestone').length} defined contractual milestone(s).</li>
      </ul>
    </div>
  `;
}

function planningGantt(T) {
  const A = T.filter(t => t.start && t.end);
  if (!A.length) {
    return '<p class="muted" style="padding:14px 0">Set start and completion dates on tasks to display the Gantt timeline.</p>';
  }

  const lo = Math.min(...A.map(t => Date.parse(t.start)));
  const hi = Math.max(...A.map(t => Date.parse(t.end)));
  const span = Math.max(86400000, hi - lo);

  return `
    <table>
      <thead>
        <tr>
          <th style="width:28%">Task Description</th>
          <th style="width:48%">Schedule Timeline</th>
          <th>Progress</th>
          <th>Lead</th>
        </tr>
      </thead>
      <tbody>
        ${A.map(t => {
          const left = Math.max(0, (Date.parse(t.start) - lo) / span * 100);
          const width = Math.max(2, (Date.parse(t.end) - Date.parse(t.start)) / span * 100);
          const isOverdue = od(t);

          return `
            <tr>
              <td>
                <strong>${t.type === 'Milestone' ? '◆ ' : ''}${esc(t.name)}</strong>
                <span class="dash-project-sub">${esc(nm('projects', t.project))}</span>
              </td>
              <td>
                <div class="bar" style="height:14px;position:relative">
                  <i class="${isOverdue ? 'o' : ''}" style="position:absolute;left:${left}%;width:${width}%;background:${isOverdue ? 'var(--color-bad)' : 'var(--color-cta)'}"></i>
                </div>
                <small class="muted">${esc(t.start)} to ${esc(t.end)}</small>
              </td>
              <td><b>${Math.max(0, Math.min(100, +t.pct || 0))}%</b></td>
              <td>${esc(t.who || 'Unassigned')}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function advanceTaskStatus(id) {
  const t = D('tasks').find(x => x.id == id);
  if (!t) return;
  if (t.status === 'Not started') {
    t.status = 'In progress';
    if (!t.pct) t.pct = 25;
  } else if (t.status === 'In progress') {
    t.status = 'Done';
    t.pct = 100;
  } else if (t.status === 'Blocked') {
    t.status = 'In progress';
  }
  log('Advanced status for task ' + t.name + ' to ' + t.status);
  save();
  toast('Task updated to ' + t.status, 'ok');
  go('planning');
}

// ==========================================================================
// Financial & Cost Control (finance)
// ==========================================================================
function finance() {
  const projects = D('projects');
  const ex = D('expenses');
  const invs = D('invoices');
  const orders = D('pos');
  const pc = D('pettycash');
  const subs = D('subs');

  const spend = sum(ex.filter(x => x.status != 'Rejected'), x => x.amount) + sum(pc.filter(x => x.status != 'Rejected'), x => x.amount);
  const invoiced = sum(invs, x => x.amount);
  const received = sum(invs, x => x.paid);
  const retention = sum(invs, x => x.retention);
  const receivable = sum(invs, x => Math.max(0, +x.amount - (+x.retention || 0) - (+x.paid || 0)));
  const committed = sum(orders.filter(x => x.status != 'Delivered'), x => x.cost) +
                    sum(subs, x => Math.max(0, (+x.value || 0) - (+x.paid || 0)));

  const projectRows = projects.map(p => {
    const budget = +p.budget || 0;
    const spentHere = sum(ex.filter(e => e.project == p.id && e.status != 'Rejected'), e => e.amount) +
                      sum(pc.filter(e => e.project == p.id && e.status != 'Rejected'), e => e.amount);
    const commit = sum(orders.filter(o => o.project == p.id && o.status != 'Delivered'), o => o.cost) +
                   sum(subs.filter(s => s.project == p.id), s => Math.max(0, (+s.value || 0) - (+s.paid || 0)));
    const balance = budget - spentHere - commit;
    const pctUsed = budget ? Math.round((spentHere + commit) / budget * 100) : 0;

    return `
      <tr>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${n$(budget)}</td>
        <td>${n$(spentHere)}</td>
        <td>${n$(commit)}</td>
        <td class="${balance < 0 ? 'bad' : 'ok'}">${n$(balance)}</td>
        <td>
          <div class="bar" style="margin-bottom:3px"><i class="${pctUsed > 100 ? 'o' : pctUsed > 85 ? 'w' : ''}" style="width:${Math.min(100, pctUsed)}%"></i></div>
          <small>${pctUsed}%</small>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="section-title">
      <h2>Financial & Cost Management</h2>
      <span>
        <button class="btn-secondary" onclick="go('cash')">${icon('cash')} Cash Flow Forecast</button>
        <button class="btn-primary" onclick="openForm('expenses')">${icon('plus')} Record Cost</button>
        <button class="btn-secondary" onclick="openForm('invoices')">${icon('plus')} Client Claim</button>
      </span>
    </div>

    <!-- Financial KPI Summary Cards -->
    <div class="g">
      <div class="k"><b>${n$(invoiced)}</b><small>Total Client Claims Issued</small></div>
      <div class="k"><b>${n$(received)}</b><small>Certified Payments Received</small></div>
      <div class="k"><b class="${receivable ? 'bad' : 'ok'}">${n$(receivable)}</b><small>Outstanding Receivables</small></div>
      <div class="k"><b>${n$(retention)}</b><small>Total Retention Held</small></div>
      <div class="k"><b>${n$(spend)}</b><small>Recorded Actual Costs</small></div>
      <div class="k"><b>${n$(committed)}</b><small>Committed Orders & Subcontracts</small></div>
    </div>

    <!-- Project Budget Variance Table -->
    <div class="c">
      <div class="row">
        <div>
          <h3 style="margin:0;font-size:16px">Project Budget Variance & Financial Exposure</h3>
          <small class="muted">Committed includes open purchase orders and remaining subcontract contracts</small>
        </div>
        <button class="btn-sm" onclick="exp('expenses')">${icon('download')} Export Expenses CSV</button>
      </div>
      <div class="t" style="margin-top:12px">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Approved Budget</th>
              <th>Actual Cost Incurred</th>
              <th>Committed Costs</th>
              <th>Forecast Balance</th>
              <th>Budget Exposed</th>
            </tr>
          </thead>
          <tbody>
            ${projectRows || '<tr><td colspan="6" class="muted">No project records found.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receivables Ageing & Follow-Up -->
    <div class="g2">
      <div class="c">
        <h3 style="margin:0 0 10px;font-size:15px">Client Receivables & Claims Ageing</h3>
        <div class="t">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Due Date</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${invs.map(i => {
                const bal = Math.max(0, +i.amount - (+i.retention || 0) - (+i.paid || 0));
                const late = bal > 0 && i.due < today();
                return `
                  <tr>
                    <td><strong>${esc(i.number || 'Invoice')}</strong><br><small class="muted">${esc(nm('projects', i.project))}</small></td>
                    <td>${esc(i.due || '—')}</td>
                    <td><b>${n$(bal)}</b></td>
                    <td><span class="tag ${late ? 'no' : bal ? 'wa' : 'ok'}">${late ? 'Overdue' : bal ? 'Pending' : 'Paid'}</span></td>
                    <td style="text-align:right">
                      ${bal > 0 ? `<button class="btn-sm btn-primary" onclick="quickRecordPayment('${i.id}')">Pay</button>` : ''}
                      <button class="btn-sm" onclick="openForm('invoices','${i.id}')">Edit</button>
                    </td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="5" class="muted">No client invoices registered.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div class="c">
        <h3 style="margin:0 0 10px;font-size:15px">Cost Control & Commitment Fast Links</h3>
        <ul style="padding-left:18px;margin:8px 0;font-size:13.5px;line-height:1.7">
          <li><a href="#" onclick="go('expenses');return false"><b>Expenses & Cost Codes</b></a> — direct expenditure and receipt verification</li>
          <li><a href="#" onclick="go('pettycash');return false"><b>Petty Cash Register</b></a> — site cash imprests and reconciliation</li>
          <li><a href="#" onclick="go('pos');return false"><b>Purchase Orders (POs)</b></a> — commitments with approved suppliers</li>
          <li><a href="#" onclick="go('subs');return false"><b>Subcontractor Claims</b></a> — certified amounts versus paid balance</li>
          <li><a href="#" onclick="go('payments');return false"><b>Client Payments</b></a> — audit record of bank remittances</li>
        </ul>
        <div class="company-note" style="margin-top:14px">
          <b>Accounting boundary:</b> BuildPro acts as an operational construction cost-management system. Statutory tax filings, payroll deductions and bank feeds operate via external financial integrations.
        </div>
      </div>
    </div>
  `;
}

function quickRecordPayment(invoiceId) {
  const inv = D('invoices').find(x => x.id == invoiceId);
  if (!inv) return;
  const remaining = Math.max(0, +inv.amount - (+inv.retention || 0) - (+inv.paid || 0));

  $('dlg').innerHTML = `
    <h3 style="margin-top:0">Record Client Payment</h3>
    <p class="muted">Invoice ${esc(inv.number)} · ${esc(nm('projects', inv.project))}</p>
    <label>Payment date<input id="qpay_d" type="date" value="${today()}"></label>
    <label>Payment amount received<input id="qpay_a" type="number" step="any" value="${remaining}"></label>
    <label>Disbursement method
      <select id="qpay_m">
        <option>Bank transfer</option>
        <option>Cash</option>
        <option>Cheque</option>
        <option>Mobile money</option>
      </select>
    </label>
    <label>Bank transaction reference<input id="qpay_r" placeholder="e.g. RTGS-884102"></label>
    <div class="row" style="margin-top:16px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="submitQuickPayment('${invoiceId}')">Save Payment</button>
    </div>
  `;
  $('dlg').showModal();
}

function submitQuickPayment(invoiceId) {
  const inv = D('invoices').find(x => x.id == invoiceId);
  if (!inv) return;
  const amt = Number($('qpay_a').value);
  if (!Number.isFinite(amt) || amt <= 0) {
    toast('Please enter a valid payment amount greater than zero', 'bad');
    return;
  }

  const payRecord = {
    id: 'pay' + Date.now(),
    date: $('qpay_d').value || today(),
    project: inv.project,
    invoice: invoiceId,
    amount: amt,
    method: $('qpay_m').value,
    reference: $('qpay_r').value || 'Remittance'
  };

  D('payments').push(payRecord);
  inv.paid = (+inv.paid || 0) + amt;

  log(`Recorded client payment of ${n$(amt)} against invoice ${inv.number}`);
  save();
  $('dlg').close();
  toast('Payment recorded successfully', 'ok');
  go('finance');
}

// ==========================================================================
// Rolling 3-Month Cash Flow Forecast (cash)
// ==========================================================================
function cash() {
  const ms = [0, 1, 2].map(i => {
    const d = new Date();
    d.setMonth(d.getMonth() + i, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  });

  const bk = d => {
    d = (d || '').slice(0, 7);
    return d < ms[0] ? ms[0] : d;
  };

  let cum = 0;
  const rc = ms.map(m => sum(D('invoices').filter(i => bk(i.due) == m), i => Math.max(0, i.amount - i.retention - i.paid)));
  const py = ms.map((m, i) => sum(D('pos').filter(o => o.status != 'Delivered' && bk(o.date) == m), o => o.cost) +
                             (i == 0 ? sum(D('subs'), s => Math.max(0, (+s.claimed || 0) - (+s.paid || 0))) : 0));

  return `
    <div class="section-title">
      <h2>3-Month Cash Flow Forecast</h2>
      <span>
        <button class="btn-primary" onclick="window.print()">${icon('printer')} Print Forecast</button>
      </span>
    </div>

    <div class="c">
      <div class="dash-panel-head">
        <div>
          <h3>Projected Cash Inflows vs Committed Outflows</h3>
          <small>Rolling 3-month operational liquidity analysis</small>
        </div>
      </div>
      <div class="chart-container" style="max-height:260px">
        <canvas id="cashFlowChart" aria-label="Cash flow chart"></canvas>
      </div>
    </div>

    <div class="c t" style="margin-top:16px">
      <table>
        <thead>
          <tr>
            <th>Cash Flow Line Item</th>
            ${ms.map(m => `<th>${m}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Expected Client Receivables Inflow</strong></td>
            ${rc.map(v => `<td class="ok num"><b>+${n$(v)}</b></td>`).join('')}
          </tr>
          <tr>
            <td><strong>Planned Supplier & Subcontractor Disbursements</strong></td>
            ${py.map(v => `<td class="bad num">-${n$(v)}</td>`).join('')}
          </tr>
          <tr style="background:rgba(100,116,139,0.05)">
            <td><strong>Net Monthly Position / Cumulative Buffer</strong></td>
            ${rc.map((v, i) => {
              cum += (v - py[i]);
              return `<td class="${cum < 0 ? 'bad' : 'ok'} num"><b>${n$(v - py[i])}</b> / <b>${n$(cum)}</b> ${cum < 0 ? ' (Funding Gap)' : ''}</td>`;
            }).join('')}
          </tr>
        </tbody>
      </table>
    </div>

    <div class="c">
      <h4 style="margin:0 0 8px;font-size:15px">Liquidity Management Notes</h4>
      <p class="muted">
        Inflows are derived from open client invoices based on agreed payment due dates. Outflows represent unfulfilled purchase orders and approved subcontractor claims.
        ${cum < 0 ? '<span class="bad">Warning: A projected cumulative funding deficit is identified. Accelerate client valuations or phase supplier purchase releases.</span>' : '<span class="ok">Projected liquidity position remains positive across the 3-month forecast window.</span>'}
      </p>
    </div>
  `;
}

function renderCashChart() {
  const canvas = $('cashFlowChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (window.cashChartInstance) {
    window.cashChartInstance.destroy();
    window.cashChartInstance = null;
  }

  const ms = [0, 1, 2].map(i => {
    const d = new Date();
    d.setMonth(d.getMonth() + i, 1);
    return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  });

  const rc = [210000, 140000, 185000];
  const py = [125000, 95000, 110000];

  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  window.cashChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: ms,
      datasets: [
        { label: 'Expected Inflows (Receipts)', data: rc, borderColor: '#15803D', backgroundColor: 'rgba(21,128,61,0.15)', fill: true, tension: 0.3 },
        { label: 'Planned Outflows (Payables)', data: py, borderColor: '#B91C1C', backgroundColor: 'rgba(185,28,28,0.15)', fill: true, tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${n$(ctx.parsed.y)}` } }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: textColor, callback: v => n$(v) }, grid: { color: gridColor } }
      }
    }
  });
}

// ==========================================================================
// Mobile Site Operations (field)
// ==========================================================================
function initFieldDate() {
  const e = $('fielddate');
  if (e && !e.value) e.value = today();
}

function field() {
  const d = today();
  const reports = D('reports').filter(r => r.date == d);
  const att = D('timesheets').filter(a => a.date == d);
  const safety = D('hse').filter(x => x.date == d);
  const sn = D('snags').filter(x => x.status == 'Open');

  return `
    <div class="section-title">
      <div>
        <h2>Mobile Site Operations</h2>
        <small class="muted">Touch-friendly quick capture designed for site engineers and supervisors</small>
      </div>
      <span class="tag ok">${icon('check')} Site Network Active</span>
    </div>

    <!-- Quick Action Grid -->
    <div class="mobile-actions">
      <button class="field-quick-btn" onclick="openForm('reports')">
        <div class="btn-icon-wrap">${icon('reports', '', 20)}</div>
        <strong>Daily Site Report</strong>
        <small>Weather, work done, workers & delays</small>
      </button>
      <button class="field-quick-btn" onclick="openForm('timesheets')">
        <div class="btn-icon-wrap">${icon('timesheets', '', 20)}</div>
        <strong>Record Attendance</strong>
        <small>Log worker hours & overtime</small>
      </button>
      <button class="field-quick-btn" onclick="openForm('hse')">
        <div class="btn-icon-wrap">${icon('hse', '', 20)}</div>
        <strong>Safety & Incident Log</strong>
        <small>Toolbox talks & hazards</small>
      </button>
      <button class="field-quick-btn" onclick="openForm('qaqc')">
        <div class="btn-icon-wrap">${icon('qaqc', '', 20)}</div>
        <strong>Quality Inspection</strong>
        <small>Pass/fail checks & slump tests</small>
      </button>
      <button class="field-quick-btn" onclick="openForm('snags')">
        <div class="btn-icon-wrap">${icon('snags', '', 20)}</div>
        <strong>Snag / Defect</strong>
        <small>Handover punch list item</small>
      </button>
      <button class="field-quick-btn" onclick="openForm('materials')">
        <div class="btn-icon-wrap">${icon('materials', '', 20)}</div>
        <strong>Material Issue</strong>
        <small>Deduct site store stock</small>
      </button>
    </div>

    <!-- Today's Field Metrics -->
    <div class="g" style="margin-top:16px">
      <div class="k"><b>${reports.length}</b><small>Site Reports Filed Today</small></div>
      <div class="k"><b>${att.length}</b><small>Timesheet Records Logged</small></div>
      <div class="k"><b class="${safety.filter(x => x.status == 'Open').length ? 'bad' : 'ok'}">${safety.filter(x => x.status == 'Open').length}</b><small>Open Safety Items Today</small></div>
      <div class="k"><b>${sn.length}</b><small>Open Snags Overall</small></div>
    </div>

    <!-- Today's Site Reports -->
    <div class="c">
      <div class="dash-panel-head">
        <div>
          <h3>Today's Site Progress Reports (${today()})</h3>
          <small>Entries submitted from construction sites</small>
        </div>
        <button class="btn-sm btn-primary" onclick="openForm('reports')">+ New Report</button>
      </div>
      <div class="t">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Work Completed</th>
              <th>Artisans</th>
              <th>Weather</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr>
                <td><strong>${esc(nm('projects', r.project))}</strong></td>
                <td class="w">${esc(r.work || '')}</td>
                <td><b>${esc(r.workers || 0)}</b></td>
                <td>${esc(r.weather || '')}</td>
                <td><span class="tag ${tc(r.appr)}">${esc(r.appr || 'Pending')}</span></td>
              </tr>
            `).join('') || '<tr><td colspan="5" class="muted">No site reports entered today. Click "+ New Report" to record progress.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Open Defects & HSE Hazards -->
    <div class="c">
      <h3 style="margin:0 0 10px;font-size:15px">Open Safety Hazards & Snag Checklist</h3>
      <div class="g2">
        <div>
          <h4 style="font-size:13.5px;color:var(--color-bad)">Active Safety Actions (${D('hse').filter(x => x.status == 'Open').length})</h4>
          <ul style="padding-left:18px;margin:6px 0;font-size:13px">
            ${D('hse').filter(x => x.status == 'Open').map(x => `<li class="bad">${esc(x.desc || x.type)} — <b>${esc(nm('projects', x.project))}</b></li>`).join('') || '<li class="ok">Zero open safety observations.</li>'}
          </ul>
        </div>
        <div>
          <h4 style="font-size:13.5px">Active Snags & Defects (${sn.length})</h4>
          <ul style="padding-left:18px;margin:6px 0;font-size:13px">
            ${sn.slice(0, 6).map(x => `<li>${esc(nm('projects', x.project))} · ${esc(x.loc || 'Site')}: <b>${esc(x.defect)}</b></li>`).join('') || '<li>No open snags recorded.</li>'}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Weekly & Monthly Management Reporting (rep)
// ==========================================================================
function rep() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const defaultFrom = weekStart.getFullYear() + '-' + String(weekStart.getMonth() + 1).padStart(2, '0') + '-' + String(weekStart.getDate()).padStart(2, '0');

  const from = window.reportFrom || defaultFrom;
  const to = window.reportTo || today();
  const scope = window.dashProject || '';

  const inside = x => x.date && x.date >= from && x.date <= to && (!scope || x.project == scope);
  const ex = D('expenses').filter(inside);
  const rp = D('reports').filter(inside);
  const po = D('pos').filter(inside);
  const done = D('tasks').filter(t => t.status == 'Done' && t.end && t.end >= from && t.end <= to && (!scope || t.project == scope));

  const cats = {};
  ex.forEach(e => cats[e.cat] = (cats[e.cat] || 0) + Number(e.amount));
  const issues = rp.filter(r => r.issues && r.issues.toLowerCase() !== 'none' && r.issues.trim() !== '');

  return `
    <div class="print-header">
      <h1 style="font-size:24pt;margin:0 0 6pt">${esc(C.name)}</h1>
      <h2 style="font-size:16pt;margin:0 0 12pt">Weekly / Monthly Executive Management Report</h2>
      <p style="font-size:11pt;color:#555">Reporting Period: ${from} to ${to} · Project Scope: ${scope ? esc(nm('projects', scope)) : 'All Company Projects'}</p>
      <hr style="border:none;border-top:1px solid #ccc;margin:12pt 0">
    </div>

    <div class="section-title np">
      <div>
        <h2>Weekly & Monthly Management Reports</h2>
        <small class="muted">Contractual progress, financial exposure, site health and procurement audit</small>
      </div>
      <span>
        <button class="btn-secondary" onclick="setReportPeriod('week')">Last 7 Days (Weekly)</button>
        <button class="btn-secondary" onclick="setReportPeriod('month')">This Month (Monthly)</button>
        <button class="btn-primary" onclick="window.print()">${icon('printer')} Print / Save PDF</button>
      </span>
    </div>

    <!-- Filter Bar -->
    <div class="c np">
      <div class="row">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <label style="font-size:12.5px;font-weight:600;margin:0">From Date: <input id="rfrom" type="date" value="${from}"></label>
          <label style="font-size:12.5px;font-weight:600;margin:0">To Date: <input id="rto" type="date" value="${to}"></label>
          <button class="btn-sm btn-primary" onclick="applyReportDates()">Apply Dates</button>
        </div>
        <button class="btn-sm btn-secondary" onclick="exportReportCSV()">${icon('download')} Export Report CSV</button>
      </div>
    </div>

    <!-- Executive Summary Card -->
    <div class="c">
      <div class="dash-panel-head">
        <div>
          <h3 style="margin:0;font-size:17px">Executive Operations Summary: ${from} to ${to}</h3>
          <small class="muted">Performance metrics for ${scope ? esc(nm('projects', scope)) : 'all operational company projects'}</small>
        </div>
      </div>

      <div class="g" style="margin-top:14px">
        <div class="k"><b>${n$(sum(ex, e => e.amount))}</b><small>Recorded Expenditures</small></div>
        <div class="k"><b>${rp.length}</b><small>Daily Site Reports Filed</small></div>
        <div class="k"><b>${n$(sum(po, o => o.cost))}</b><small>Purchase Orders Issued</small></div>
        <div class="k"><b>${done.length}</b><small>Tasks Completed in Period</small></div>
        <div class="k"><b class="${issues.length ? 'bad' : 'ok'}">${issues.length}</b><small>Reports Noting Site Delays</small></div>
        <div class="k"><b>${new Set(rp.map(r => r.project).filter(Boolean)).size}</b><small>Active Sites Reporting</small></div>
      </div>

      <div class="g2" style="margin-top:14px">
        <div>
          <h4 style="font-size:14px">Expenditure Breakdown by Cost Category</h4>
          <ul style="padding-left:18px;margin:8px 0;font-size:13px">
            ${Object.entries(cats).map(([c, v]) => `<li><b>${esc(c)}:</b> ${n$(v)}</li>`).join('') || '<li class="muted">Zero recorded expenses in selected date range.</li>'}
          </ul>
        </div>
        <div>
          <h4 style="font-size:14px">Site Issues, Safety & Delay Notes</h4>
          <ul style="padding-left:18px;margin:8px 0;font-size:13px">
            ${issues.map(r => `<li><b>${esc(r.date)} · ${esc(nm('projects', r.project))}:</b> ${esc(r.issues)}</li>`).join('') || '<li class="ok">Zero significant delays or safety incidents noted.</li>'}
          </ul>
        </div>
      </div>
    </div>

    <!-- Site Activities Table -->
    <div class="c">
      <h3 style="font-size:16px;margin:0 0 10px">Site Operations Log for Reporting Period</h3>
      <div class="t">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Work Done</th>
              <th>Workers</th>
              <th>Weather</th>
              <th>Reported By</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            ${rp.sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(r => `
              <tr>
                <td>${esc(r.date)}</td>
                <td><strong>${esc(nm('projects', r.project))}</strong></td>
                <td class="w">${esc(r.work || '')}</td>
                <td>${esc(r.workers || 0)}</td>
                <td>${esc(r.weather || '')}</td>
                <td>${esc(r.by || '')}</td>
                <td><span class="tag ${tc(r.appr)}">${esc(r.appr || 'Pending')}</span></td>
              </tr>
            `).join('') || '<tr><td colspan="7" class="muted">No site reports filed within this date range.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="print-header" style="margin-top:40pt;page-break-inside:avoid">
      <div style="display:flex;justify-content:space-between;gap:40pt">
        <div style="flex:1;border-top:1px solid #000;padding-top:6pt">
          <strong>Prepared by:</strong> ${esc(U ? U.email : 'System Admin')}<br>
          <small>Project Manager / Resident Engineer</small>
        </div>
        <div style="flex:1;border-top:1px solid #000;padding-top:6pt">
          <strong>Approved by:</strong> ___________________________<br>
          <small>Managing Director / Contracts Lead</small>
        </div>
      </div>
    </div>
  `;
}

function applyReportDates() {
  const from = $('rfrom').value;
  const to = $('rto').value;
  if (from && to && from > to) {
    toast('Commencement date cannot be after target completion date', 'bad');
    return;
  }
  window.reportFrom = from;
  window.reportTo = to;
  go('rep');
}

function setReportPeriod(period) {
  const n = new Date();
  const from = new Date(n);
  if (period == 'week') {
    from.setDate(n.getDate() - 6);
  } else {
    from.setDate(1);
  }
  window.reportFrom = from.getFullYear() + '-' + String(from.getMonth() + 1).padStart(2, '0') + '-' + String(from.getDate()).padStart(2, '0');
  window.reportTo = today();
  go('rep');
}

function exportReportCSV() {
  const from = window.reportFrom || today();
  const to = window.reportTo || today();
  const rows = [['Type', 'Date', 'Project', 'Particulars', 'Amount / Quantities', 'Status']];

  D('expenses').filter(x => x.date >= from && x.date <= to).forEach(x => {
    rows.push(['Expense', x.date, nm('projects', x.project), x.desc, x.amount, x.status]);
  });
  D('reports').filter(x => x.date >= from && x.date <= to).forEach(x => {
    rows.push(['Site report', x.date, nm('projects', x.project), x.work, x.workers, x.appr || 'Pending']);
  });
  D('pos').filter(x => x.date >= from && x.date <= to).forEach(x => {
    rows.push(['Purchase order', x.date, nm('projects', x.project), x.item, x.cost, x.status]);
  });

  const csv = rows.map(r => r.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BuildPro_Management_Report_${from}_to_${to}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('Report CSV exported successfully', 'ok');
}

// ==========================================================================
// Notifications & Approvals Center (alerts)
// ==========================================================================
function alerts() {
  const t = today();
  const w = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const a = [];
  const A = (cat, title, page, id, allowApprove = false, entityType = '') => a.push({ cat, title, page, id, allowApprove, entityType });

  D('tasks').filter(od).forEach(x => A('Overdue Task', `${x.name} (${nm('projects', x.project)}) due on ${x.end}`, 'tasks', x.id));
  D('materials').filter(m => +m.qty <= +m.min).forEach(m => A('Low Inventory', `${m.name}: ${m.qty} ${m.unit} in stock (Reorder minimum: ${m.min})`, 'materials', m.id));
  D('pos').filter(o => o.status == 'Requested').forEach(o => A('PO Approval Needed', `PO for ${o.item} (${n$(o.cost)}) on ${nm('projects', o.project)}`, 'pos', o.id, true, 'pos'));
  D('expenses').filter(e => e.status == 'Pending').forEach(e => A('Expense Approval Needed', `${e.desc} (${n$(e.amount)}) on ${nm('projects', e.project)}`, 'expenses', e.id, true, 'expenses'));
  D('timesheets').filter(ts => ts.status == 'Submitted').forEach(ts => A('Timesheet Approval Needed', `${nm('employees', ts.employee)} on ${ts.date} (${ts.hours} hrs)`, 'timesheets', ts.id, true, 'timesheets'));
  D('invoices').filter(i => i.due < t && i.amount - i.retention - i.paid > 0).forEach(i => A('Overdue Client Claim', `Invoice ${i.number} (${n$(i.amount - i.retention - i.paid)} outstanding)`, 'invoices', i.id));
  D('rfis').filter(r => r.status == 'Open' && r.due < t).forEach(r => A('Overdue RFI Technical Query', `${r.subject} (${nm('projects', r.project)})`, 'rfis', r.id));
  D('equipment').filter(e => e.service && e.service <= w).forEach(e => A('Equipment Service Due', `${e.name} service due ${e.service}`, 'equipment', e.id));
  D('hse').filter(h => h.status == 'Open').forEach(h => A('Open Safety Action', `${h.type}: ${h.desc} (${nm('projects', h.project)})`, 'hse', h.id));

  return `
    <div class="section-title">
      <div>
        <h2>Notifications & Approvals Center</h2>
        <small class="muted">Critical operational alerts, authorization workflows and pending compliance actions</small>
      </div>
      <span class="tag ${a.length ? 'wa' : 'ok'}">${a.length} active notifications</span>
    </div>

    <div class="c t">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Particulars & Scope</th>
            <th style="text-align:right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(x => `
            <tr>
              <td><span class="tag ${tc(x.cat)}">${esc(x.cat)}</span></td>
              <td class="w"><strong>${esc(x.title)}</strong></td>
              <td style="text-align:right">
                ${x.allowApprove && ['admin', 'pm'].includes(U.role) ? `
                  <button class="btn-sm btn-primary" onclick="quickApproveFromAlert('${x.entityType}', '${x.id}')">Approve</button>
                ` : ''}
                <button class="btn-sm" onclick="go('${x.page}')">Inspect</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="3" class="ok" style="padding:16px">All systems clear. No actions require immediate attention.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function quickApproveFromAlert(type, id) {
  if (type === 'pos') appr('pos', id);
  else if (type === 'expenses') appr('expenses', id);
  else if (type === 'timesheets') setHrStatus('timesheets', id, 'Approved');
  toast('Item approved', 'ok');
  go('alerts');
}

// ==========================================================================
// Analytics & Commercial Intelligence (bi)
// ==========================================================================
function bi() {
  const P = D('projects');
  return `
    <div class="section-title">
      <h2>Commercial Intelligence & Analytics</h2>
      <button class="btn-primary" onclick="window.print()">${icon('printer')} Print Analytics</button>
    </div>

    <div class="c">
      <div class="dash-panel-head">
        <div>
          <h3 style="margin:0;font-size:16px">Project Margin, Forecast Cost at Completion (EAC) & Risk</h3>
          <small class="muted">Calculated from billings, recorded costs and progress milestones</small>
        </div>
      </div>
      <div class="t" style="margin-top:12px">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Certified Billed</th>
              <th>Collected</th>
              <th>Cost + Committed</th>
              <th>Gross Margin</th>
              <th>Forecast Cost (EAC)</th>
              <th>Overdue Tasks</th>
            </tr>
          </thead>
          <tbody>
            ${P.map(p => {
              const iv = D('invoices').filter(i => i.project == p.id);
              const inv = sum(iv, i => i.amount);
              const col = sum(iv, i => i.paid);
              const ts = D('tasks').filter(t => t.project == p.id);
              const pr = ts.length ? sum(ts, t => t.pct) / ts.length : 0;
              const c = spent(p.id) + sum(D('pos').filter(o => o.project == p.id && o.status != 'Delivered'), o => o.cost);
              const fc = pr > 5 ? spent(p.id) / pr * 100 : p.budget;
              const margin = inv - c;

              return `
                <tr>
                  <td><strong>${esc(p.name)}</strong></td>
                  <td>${n$(inv)}</td>
                  <td>${n$(col)}</td>
                  <td>${n$(c)}</td>
                  <td class="${margin < 0 ? 'bad' : 'ok'}"><b>${n$(margin)}</b></td>
                  <td class="${fc > p.budget ? 'bad' : ''}">${n$(fc)}</td>
                  <td>${ts.filter(od).length ? `<span class="bad">${ts.filter(od).length}</span>` : '0'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="g2">
      <div class="c">
        <h4 style="margin:0 0 10px;font-size:15px">Vendor & Supplier Performance</h4>
        <div class="t">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Orders</th>
                <th>Delivered</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              ${D('suppliers').map(s => {
                const o = D('pos').filter(x => x.supplier == s.id);
                return `
                  <tr>
                    <td><strong>${esc(s.name)}</strong></td>
                    <td>${o.length}</td>
                    <td><span class="tag ok">${o.filter(x => x.status == 'Delivered').length}</span></td>
                    <td>${n$(sum(o, x => x.cost))}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="c">
        <h4 style="margin:0 0 10px;font-size:15px">Plant & Fleet Utilization</h4>
        <div class="t">
          <table>
            <thead>
              <tr>
                <th>Machine / Plant</th>
                <th>Hours</th>
                <th>Fuel (L)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${D('equipment').map(e => `
                <tr>
                  <td><strong>${esc(e.name)}</strong></td>
                  <td>${e.hours} hrs</td>
                  <td>${e.fuel} L</td>
                  <td><span class="tag ${tc(e.status)}">${esc(e.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Generic CRUD List Table Generator (list)
// ==========================================================================
function list(k) {
  const m = M[k];
  if (!m) return '';

  const isAuthorized = can(k);
  const q = (window.Q && window.Q[k] || '').toLowerCase();
  const hp = m.f.some(f => f[0] == 'project');
  const records = D(k);

  const filtered = records.filter(r => {
    const matchesSearch = !q || JSON.stringify(Object.values(r)).toLowerCase().includes(q);
    const matchesProject = !window.PF || !hp || r.project == window.PF;
    return matchesSearch && matchesProject;
  });

  const cols = m.f.filter(f => f[2] != 'area' || k == 'reports');

  return `
    <div class="row">
      <div>
        <h2 style="font-size:22px;margin:0 0 2px">${esc(m.t)}</h2>
        <small class="muted">Showing ${filtered.length} of ${records.length} record(s)</small>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <!-- Live Instant Search -->
        <input placeholder="Filter records…" value="${esc(q)}" oninput="(window.Q=window.Q||{})['${k}']=this.value;go('${k}')" style="width:160px;font-size:12.5px;padding:6px 10px">

        <!-- Project Scope Filter -->
        ${hp ? `
          <select onchange="window.PF=this.value;go('${k}')" style="font-size:12.5px;padding:6px 10px">
            <option value="">All Projects</option>
            ${D('projects').map(p => `<option value="${esc(p.id)}" ${p.id == window.PF ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}
          </select>
        ` : ''}

        <button class="btn-sm btn-secondary" onclick="exp('${k}')">${icon('download')} CSV</button>
        ${isAuthorized ? `<button class="btn-sm btn-primary" onclick="openForm('${k}')">${icon('plus')} Add Record</button>` : '<small class="muted">Read-only role</small>'}
      </div>
    </div>

    <div class="c t" style="margin-top:10px">
      <table>
        <thead>
          <tr>
            ${cols.map(f => `<th>${f[1]}</th>`).join('')}
            ${k == 'materials' ? '<th>Inventory Actions</th>' : ''}
            ${XH(k)}
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(r => `
            <tr>
              ${cols.map(f => `<td>${cell(f, r[f[0]], r)}</td>`).join('')}
              ${k == 'materials' ? `
                <td>
                  <span class="tag ${+r.qty <= +r.min ? 'no' : 'ok'}">${+r.qty <= +r.min ? 'REORDER' : 'IN STOCK'}</span>
                  ${isAuthorized ? `
                    <button class="btn-sm btn-primary" style="margin-left:4px" onclick="mv(${jsarg(r.id)},1)">+ In</button>
                    <button class="btn-sm" onclick="mv(${jsarg(r.id)},-1)">− Out</button>
                  ` : ''}
                </td>
              ` : ''}
              ${X(k, r)}
              <td style="text-align:right">
                ${isAuthorized ? `
                  <button class="btn-sm" onclick="openForm(${jsarg(k)},${jsarg(r.id)})">${icon('edit')}</button>
                  <button class="btn-sm" onclick="del(${jsarg(k)},${jsarg(r.id)})">${icon('trash')}</button>
                ` : ''}
              </td>
            </tr>
          `).join('') || `<tr><td colspan="${cols.length + 3}" class="muted" style="padding:16px">No records found. Click "+ Add Record" to create.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

// Table cell formatter
function cell(f, v, r) {
  if (f[2] == 'ref') return esc(nm(f[3], v));
  if (f[2] == 'number' && ['budget', 'amount', 'cost', 'value', 'retention', 'paid', 'rate', 'labour', 'materials', 'equip', 'subcontract', 'claimed'].includes(f[0])) {
    return n$(v || 0);
  }
  if (f[0] == 'pct') {
    const p = Math.max(0, Math.min(100, +v || 0));
    return `<div class="bar" style="width:70px;margin-bottom:2px"><i style="width:${p}%"></i></div><small>${p}%</small>`;
  }
  if (f[2] == 'area') {
    return `<span style="white-space:normal;display:block;min-width:180px">${esc(v || '')}</span>`;
  }
  if (f[2] == 'select' || f[0] == 'status' || f[0] == 'appr') {
    return `<span class="tag ${tc(v)}">${esc(v || '')}</span>`;
  }
  return esc(v ?? '');
}

// Specialized Table Column Headers
const XH = k => ({
  projects: '<th>Tracker</th>',
  boq: '<th>Value</th><th>Done</th><th>Variance</th>',
  invoices: '<th>Outstanding</th><th>Payment</th>',
  subs: '<th>Unpaid</th>',
  estimates: '<th>Estimated Total</th>',
  pos: '<th>Approval</th>',
  expenses: '<th>Approval</th>',
  recruitment: '<th>Fast Track</th>',
  timesheets: '<th>Labour Cost</th><th>Approval</th>',
  leave: '<th>Approval</th>'
}[k] || '');

// Specialized Table Action Cells
const X = (k, r) => {
  const q = +r.qty || 0;
  const m = +r.measured || 0;

  if (k == 'projects') {
    return `<td><button class="btn-sm btn-primary" onclick="TP=${jsarg(r.id)};go('track')">Track</button></td>`;
  }
  if (k == 'recruitment') {
    return `<td>${r.stage == 'Hired' ? '<span class="tag ok">Hired</span>' : `<button class="btn-sm btn-primary" onclick="hireCandidate(${jsarg(r.id)})">Hire to Directory</button>`}</td>`;
  }
  if (k == 'timesheets') {
    return `
      <td><b>${n$(employeeLabourCost(r))}</b></td>
      <td>
        ${r.status == 'Submitted' && ['admin', 'pm'].includes(U.role) ? `
          <button class="btn-sm btn-primary" onclick="setHrStatus('timesheets',${jsarg(r.id)},'Approved')">Approve</button>
          <button class="btn-sm" onclick="setHrStatus('timesheets',${jsarg(r.id)},'Rejected')">Reject</button>
        ` : esc(r.status || '—')}
      </td>
    `;
  }
  if (k == 'leave') {
    return `
      <td>
        ${r.status == 'Requested' && ['admin', 'pm'].includes(U.role) ? `
          <button class="btn-sm btn-primary" onclick="setHrStatus('leave',${jsarg(r.id)},'Approved')">Approve</button>
          <button class="btn-sm" onclick="setHrStatus('leave',${jsarg(r.id)},'Rejected')">Reject</button>
        ` : esc(r.status || '—')}
      </td>
    `;
  }
  if (k == 'boq') {
    return `
      <td><b>${n$(q * r.rate)}</b></td>
      <td>${q ? Math.round(m / q * 100) : 0}%</td>
      <td class="${m > q ? 'bad' : ''}">${m - q}</td>
    `;
  }
  if (k == 'invoices') {
    const bal = Math.max(0, +r.amount - (+r.retention || 0) - (+r.paid || 0));
    return `
      <td class="${r.due < today() && bal > 0 ? 'bad' : ''}"><b>${n$(bal)}</b></td>
      <td>${bal > 0 ? `<button class="btn-sm btn-primary" onclick="quickRecordPayment('${r.id}')">Pay</button>` : '<span class="tag ok">Settled</span>'}</td>
    `;
  }
  if (k == 'subs') {
    return `<td><b>${n$(r.claimed - r.paid)}</b></td>`;
  }
  if (k == 'estimates') {
    return `<td><b>${n$((+r.labour + +r.materials + +r.equip + +r.subcontract) * (1 + r.markup / 100))}</b></td>`;
  }
  if (k == 'pos') {
    const canAppr = ['pm', 'admin'].includes(U.role);
    return `
      <td>
        ${canAppr && r.status == 'Requested' ? `<button class="btn-sm btn-primary" onclick="appr('pos',${jsarg(r.id)})">Approve</button>` : ''}
        ${r.status == 'Ordered' ? `<button class="btn-sm" onclick="markPoDelivered(${jsarg(r.id)})">Receive</button>` : ''}
      </td>
    `;
  }
  if (k == 'expenses') {
    return `
      <td>
        ${['pm', 'admin'].includes(U.role) && r.status == 'Pending' ? `
          <button class="btn-sm btn-primary" onclick="appr('expenses',${jsarg(r.id)})">Approve</button>
          <button class="btn-sm" onclick="rejectExpense(${jsarg(r.id)})">Reject</button>
        ` : ''}
      </td>
    `;
  }
  return '';
};

// ==========================================================================
// Modal Form Engine (openForm, sv, del)
// ==========================================================================
function openForm(k, id) {
  if (!M[k] || !can(k)) {
    toast('You do not have permission to modify records in this section.', 'bad');
    return;
  }
  const m = M[k];
  const r = id ? D(k).find(x => x.id == id) : { date: today(), by: (U.name || U.email.split('@')[0]) };
  if (id && !r) {
    toast('Record not found', 'bad');
    return;
  }

  let fieldsHtml = m.f.map(f => {
    const v = esc(r[f[0]] ?? '');
    const a = `id="f_${f[0]}"`;
    let i = '';

    if (f[2] == 'select') {
      i = `<select ${a}>${f[3].map(o => `<option ${o == v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    } else if (f[2] == 'ref') {
      const records = D(f[3]);
      i = `<select ${a}>${records.map(o => `<option value="${esc(o.id)}" ${o.id == v ? 'selected' : ''}>${esc(o.name || o.number || o.title || o.item || o.id)}</option>`).join('')}</select>`;
    } else if (f[2] == 'area') {
      i = `<textarea ${a} rows="3">${v}</textarea>`;
    } else if (f[2] == 'file') {
      i = `<input ${a} type="file">${v ? '<br><small class="muted">Current attachment: ' + v + '</small>' : ''}`;
    } else {
      i = `<input ${a} type="${f[2] || 'text'}" value="${v}">`;
    }

    return `<label>${esc(f[1])}${i}</label>`;
  }).join('');

  $('dlg').innerHTML = `
    <h3 style="margin-top:0">${id ? 'Edit' : 'Add'} – ${esc(m.t)}</h3>
    <form onsubmit="event.preventDefault();sv(${jsarg(k)},${jsarg(id || '')})">
      ${fieldsHtml}
      <div class="row" style="margin-top:16px">
        <button type="button" onclick="$('dlg').close()">Cancel</button>
        <button class="p" type="submit">Save Record</button>
      </div>
    </form>
  `;
  $('dlg').showModal();
}

function sv(k, id) {
  if (!M[k] || !can(k)) {
    toast('You do not have permission to modify records in this section.', 'bad');
    return;
  }

  const existing = id ? D(k).find(x => x.id == id) : null;
  const o = { ...(existing || { id: 'i' + Date.now() }) };
  const next = { ...o };

  for (const f of M[k].f) {
    const e = $('f_' + f[0]);
    if (!e) {
      toast('Form input is missing: ' + f[1], 'bad');
      return;
    }

    if (f[2] == 'file') {
      next[f[0]] = e.files && e.files[0] ? e.files[0].name : o[f[0]] || '';
    } else if (f[2] == 'number') {
      const n = e.value.trim() === '' ? 0 : Number(e.value);
      if (!Number.isFinite(n) || n < 0) {
        toast(f[1] + ' must be a valid non-negative number', 'bad');
        e.focus();
        return;
      }
      next[f[0]] = n;
    } else {
      next[f[0]] = e.value;
      if (f[2] == 'email' && e.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())) {
        toast(f[1] + ' must be a valid email address', 'bad');
        e.focus();
        return;
      }
    }
  }

  if (next.start && next.end && next.end < next.start) {
    toast('Completion deadline cannot precede commencement date', 'bad');
    $('f_end').focus();
    return;
  }

  // Domain validations
  if (k == 'employees') {
    if (!next.name.trim()) {
      toast('Employee full legal name is required', 'bad');
      $('f_name').focus();
      return;
    }
    if (next.employeeNo && D(k).some(x => (x.employeeNo || '').toLowerCase() === next.employeeNo.toLowerCase() && x.id != id)) {
      toast('Employee badge/ID number must be unique', 'bad');
      $('f_employeeNo').focus();
      return;
    }
  }

  Object.assign(o, next);
  if (!id) D(k).push(o);

  log((id ? 'Edited ' : 'Added ') + M[k].t + ' record: ' + (o.name || o.number || o.title || o.item || o.id));
  if (!save()) return;

  $('dlg').close();
  toast(id ? 'Record updated successfully' : 'Record added successfully', 'ok');
  go(view);
}

function del(k, id) {
  if (!M[k] || !can(k)) {
    toast('You do not have permission to delete records here.', 'bad');
    return;
  }
  ask('Are you sure you want to delete this record?', () => {
    C.data[k] = D(k).filter(x => x.id != id);
    log('Deleted from ' + M[k].t);
    save();
    toast('Record deleted', 'ok');
    go(view);
  });
}

function appr(k, id) {
  const r = D(k).find(x => x.id == id);
  if (!r || !can(k)) {
    toast('You do not have authorization to approve this item', 'bad');
    return;
  }
  r.status = 'Approved';
  log('Approved ' + M[k].t + ' item ' + (r.item || r.desc || r.id));
  save();
  toast('Item approved successfully', 'ok');
  go(view);
}

function rejectExpense(id) {
  const r = D('expenses').find(x => x.id == id);
  if (!r) return;
  r.status = 'Rejected';
  log('Rejected expense item ' + (r.desc || r.id));
  save();
  toast('Expense rejected', 'wa');
  go(view);
}

function markPoDelivered(poId) {
  const po = D('pos').find(x => x.id == poId);
  if (!po) return;
  po.status = 'Delivered';

  // Increment matching stock item if available
  const match = D('materials').find(m => m.name.toLowerCase().includes(po.item.toLowerCase()) || po.item.toLowerCase().includes(m.name.toLowerCase()));
  if (match) {
    match.qty = Number(match.qty) + Number(po.qty);
    D('stockMoves').push({
      id: 'sm' + Date.now(),
      date: today(),
      item: match.id,
      type: 'Receipt',
      qty: Number(po.qty),
      project: po.project,
      loc: match.loc || 'Main Store',
      note: 'Auto-receipt from delivered PO #' + po.id
    });
  }

  log('Marked PO delivered and updated inventory: ' + po.item);
  save();
  toast('Purchase order marked Delivered and stock updated', 'ok');
  go('pos');
}

// Materials Stock Movements (+ In / - Out)
function mv(id, sign) {
  if (!can('materials')) {
    toast('You do not have authorization to adjust inventory levels', 'bad');
    return;
  }
  const m = D('materials').find(x => x.id == id);
  if (!m) return;

  $('dlg').innerHTML = `
    <h3 style="margin-top:0">${sign > 0 ? 'Receive Materials into Stock' : 'Issue Materials to Construction Site'}</h3>
    <p class="muted">Material: <b>${esc(m.name)}</b> · Current Stock: ${m.qty} ${esc(m.unit)}</p>
    <label>Quantity (${esc(m.unit)})<input id="mq" type="number" min="0.1" step="any" value="10"></label>
    <label>Target Project<select id="m_proj">${D('projects').map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label>
    <label>Storage Bin / Site Area<input id="m_loc" value="${esc(m.loc || 'Main Yard')}"></label>
    <label>Transaction Remarks<input id="m_note" placeholder="e.g. Delivery note ref, or slab pour requisition"></label>
    <div class="row" style="margin-top:16px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="mv2(${jsarg(m.id)},${sign})">Save Transaction</button>
    </div>
  `;
  $('dlg').showModal();
}

function mv2(id, sign) {
  const m = D('materials').find(x => x.id == id);
  const q = Number($('mq').value);
  if (!m || !Number.isFinite(q) || q <= 0) {
    toast('Enter a valid quantity greater than zero', 'bad');
    return;
  }
  if (sign < 0 && q > Number(m.qty)) {
    toast(`Cannot issue more stock than is available on hand (${m.qty} ${m.unit})`, 'bad');
    $('mq').focus();
    return;
  }

  m.qty = Number(m.qty) + sign * q;

  D('stockMoves').push({
    id: 'sm' + Date.now(),
    date: today(),
    item: m.id,
    type: sign > 0 ? 'Receipt' : 'Issue',
    qty: q,
    project: $('m_proj').value,
    loc: $('m_loc').value,
    note: $('m_note').value || (sign > 0 ? 'Goods received' : 'Issued to site operations')
  });

  log((sign > 0 ? 'Received ' : 'Issued ') + q + ' ' + m.unit + ' of ' + m.name);
  save();
  $('dlg').close();
  toast(`Inventory updated: ${m.name} now at ${m.qty} ${m.unit}`, 'ok');
  go(view);
}

// CSV Exporter for any module
function exp(k) {
  if (!M[k]) return;
  const fields = M[k].f.filter(f => f[2] != 'file');
  const csv = [
    fields.map(f => f[1]),
    ...D(k).map(r => fields.map(f => f[2] == 'ref' ? nm(f[3], r[f[0]]) : (r[f[0]] ?? '')))
  ].map(row => row.map(csvCell).join(',')).join('\r\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BuildPro_${k}_${today()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('CSV export downloaded', 'ok');
}

// ==========================================================================
// Workforce & HR Module Handlers
// ==========================================================================
function hireCandidate(id) {
  const c = D('recruitment').find(x => x.id == id);
  if (!c) return;

  const emp = {
    id: 'emp' + Date.now(),
    employeeNo: 'BP-0' + (D('employees').length + 1),
    name: c.name,
    preferredName: c.name.split(' ')[0],
    email: c.email || '',
    phone: c.phone || '',
    jobTitle: c.role,
    trade: c.trade || '',
    department: 'Site Operations',
    employmentType: 'Permanent',
    startDate: c.startDate || today(),
    status: 'Active',
    rate: 25,
    currency: '$'
  };

  D('employees').push(emp);
  c.stage = 'Hired';
  c.onboarding = 'Complete';
  c.employeeId = emp.id;

  log('Hired candidate ' + c.name + ' to employee directory');
  save();
  toast(c.name + ' transferred to Employee Directory', 'ok');
  go('recruitment');
}

function setHrStatus(k, id, status) {
  const r = D(k).find(x => x.id == id);
  if (!r) return;
  r.status = status;
  if (k == 'timesheets') r.approvedBy = U.email;
  else r.approver = U.email;

  log(status + ' ' + k + ' record for ' + nm('employees', r.employee));
  save();
  toast(k + ' marked ' + status, 'ok');
  go(view);
}

function employeeCostRate(e) {
  const base = Number(e.rate || 0);
  return {
    regular: base,
    overtime: base * 1.5
  };
}

function employeeLabourCost(ts) {
  const e = D('employees').find(x => x.id == ts.employee);
  if (!e) return 0;
  const rates = employeeCostRate(e);
  return (Math.max(0, +ts.hours || 0) * rates.regular) + (Math.max(0, +ts.overtime || 0) * rates.overtime);
}

function employeeModule(k) {
  const titles = NM[k];
  const E = D('employees');
  const records = D(k);

  return `
    <div class="section-title">
      <div>
        <h2>${esc(titles)}</h2>
        <small class="muted">Human Capital, Workforce Attendance & Site Allocations</small>
      </div>
      ${k == 'employees' && can(k) ? `<button class="btn-primary" onclick="openForm('employees')">${icon('plus')} Add Employee</button>` : ''}
    </div>
    ${list(k)}
  `;
}

function employeeReports() {
  const employees = D('employees');
  const approved = D('timesheets').filter(x => x.status == 'Approved');
  const byId = {};

  approved.forEach(x => {
    const r = byId[x.employee] || (byId[x.employee] = { hours: 0, overtime: 0, cost: 0, days: new Set() });
    r.hours += (+x.hours || 0);
    r.overtime += (+x.overtime || 0);
    r.cost += employeeLabourCost(x);
    if (x.date) r.days.add(x.date);
  });

  const rows = employees.map(e => ({ e, r: byId[e.id] || { hours: 0, overtime: 0, cost: 0, days: new Set() } }));

  return `
    <div class="section-title">
      <div>
        <h2>Workforce & Labour Cost Analytics</h2>
        <small class="muted">Aggregated hours and certified labour expenditure calculated from approved timesheets</small>
      </div>
      <button class="btn-primary" onclick="exportEmployeeReportCSV()">${icon('download')} Export CSV</button>
    </div>

    <div class="g">
      <div class="k"><b>${employees.filter(e => e.status == 'Active').length}</b><small>Active Directory Headcount</small></div>
      <div class="k"><b>${approved.length}</b><small>Approved Timesheet Records</small></div>
      <div class="k"><b>${sum(approved, x => x.hours)}</b><small>Approved Normal Hours</small></div>
      <div class="k"><b>${sum(approved, x => x.overtime)}</b><small>Approved Overtime Hours</small></div>
      <div class="k"><b>${n$(sum(approved, employeeLabourCost))}</b><small>Estimated Labour Cost Paid</small></div>
    </div>

    <div class="c t" style="margin-top:16px">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department / Trade</th>
            <th>Approved Normal Hours</th>
            <th>Overtime Hours</th>
            <th>Site Days</th>
            <th>Labour Cost</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(({ e, r }) => `
            <tr>
              <td><strong>${esc(e.name)}</strong><br><small class="muted">${esc(e.employeeNo || '')}</small></td>
              <td>${esc([e.department, e.trade].filter(Boolean).join(' · ') || 'General')}</td>
              <td>${r.hours} hrs</td>
              <td>${r.overtime} hrs</td>
              <td>${r.days.size}</td>
              <td><b>${n$(r.cost)}</b></td>
            </tr>
          `).join('') || '<tr><td colspan="6" class="muted">No employee timesheet records found.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function exportEmployeeReportCSV() {
  const approved = D('timesheets').filter(x => x.status == 'Approved');
  const employees = D('employees');
  const byId = {};

  approved.forEach(x => {
    const r = byId[x.employee] || (byId[x.employee] = { hours: 0, overtime: 0, cost: 0, days: new Set() });
    r.hours += (+x.hours || 0);
    r.overtime += (+x.overtime || 0);
    r.cost += employeeLabourCost(x);
    if (x.date) r.days.add(x.date);
  });

  const rows = [
    ['Employee ID', 'Employee Name', 'Department', 'Trade', 'Primary Project', 'Approved Hours', 'Overtime Hours', 'Days Worked', 'Estimated Labour Cost'],
    ...employees.map(e => {
      const r = byId[e.id] || { hours: 0, overtime: 0, cost: 0, days: new Set() };
      return [e.employeeNo, e.name, e.department, e.trade, nm('projects', e.project), r.hours, r.overtime, r.days.size, r.cost];
    })
  ];

  const data = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BuildPro_Workforce_Labour_${today()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('Employee labour report exported', 'ok');
}

// ==========================================================================
// Company Administration, Settings & Profiles (company, users, subscription)
// ==========================================================================
function company() {
  if (U.role != 'admin') {
    return '<h2>Company Profile & Compliance</h2><p class="muted">Access is restricted to Company Administrators.</p>';
  }

  const p = C.profile || (C.profile = { legalName: C.name });
  const fields = COMPANY_SECTIONS.flatMap(s => s.fields);
  const filled = fields.filter(f => String(p[f[0]] ?? '').trim()).length;

  const renderInput = f => {
    const [key, label, type, options] = f;
    const value = esc(p[key] ?? '');
    const id = 'cp_' + key;
    let control = '';

    if (type == 'select') {
      control = `<select id="${id}"><option value="">Select option…</option>${options.map(x => `<option value="${esc(x)}" ${x == value ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
    } else if (type == 'area') {
      control = `<textarea id="${id}" rows="3">${value}</textarea>`;
    } else {
      control = `<input id="${id}" type="${type}" value="${value}" ${type == 'number' ? 'min="0" step="1"' : ''}>`;
    }

    return `<label class="${type == 'area' ? 'full' : ''}">${esc(label)}${control}</label>`;
  };

  return `
    <div class="section-title">
      <div>
        <h2>Company Profile & Statutory Compliance</h2>
        <small class="muted">Corporate entity data, licensing credentials, insurance and bank remittance</small>
      </div>
      <span>
        <span class="tag ok">${filled} of ${fields.length} items configured</span>
        <button class="btn-primary" onclick="companySave()">Save All Changes</button>
      </span>
    </div>

    ${COMPANY_SECTIONS.map((s, i) => `
      <details class="company-section" ${i === 0 ? 'open' : ''}>
        <summary><h3>${i + 1}. ${esc(s.title)}</h3></summary>
        <p class="muted" style="margin-top:6px">${esc(s.help)}</p>
        <div class="company-fields">${s.fields.map(renderInput).join('')}</div>
      </details>
    `).join('')}

    <div class="company-actions">
      <button class="btn-secondary" onclick="go('dash')">Cancel</button>
      <button class="btn-primary" onclick="companySave()">Save Company Information</button>
    </div>
  `;
}

function companySave() {
  if (U.role != 'admin') {
    toast('Only administrators can update the company profile', 'bad');
    return;
  }

  const p = { ...(C.profile || {}) };
  for (const s of COMPANY_SECTIONS) {
    for (const [key, label, type] of s.fields) {
      const el = $('cp_' + key);
      if (!el) continue;
      const val = el.value.trim();
      p[key] = (type == 'number' && val !== '') ? Number(val) : val;
    }
  }

  if (!p.legalName) {
    toast('Registered legal entity name is required', 'bad');
    $('cp_legalName').focus();
    return;
  }

  p.updatedAt = new Date().toISOString();
  C.profile = p;
  if (p.defaultCurrency) C.cur = p.defaultCurrency;

  log('Updated company statutory profile');
  save();
  toast('Company profile saved successfully', 'ok');
  go('company');
}

function subscription() {
  if (U.role != 'admin') {
    return '<h2>Subscription & Workspace Tiers</h2><p class="muted">Restricted to Administrators.</p>';
  }

  const sub = C.subscription || (C.subscription = { plan: 'Professional Trial', status: 'Active', seats: 15 });
  const plans = [
    { name: 'Starter', price: '$49/user/mo', seats: 3, desc: 'For small contractors managing core projects, site reports and expenses.' },
    { name: 'Professional', price: '$89/user/mo', seats: 15, desc: 'For growing general contractors: full procurement, stock, workforce and equipment.' },
    { name: 'Business / Enterprise', price: 'Custom', seats: 50, desc: 'For larger portfolios requiring multi-tier approvals, advanced audit and custom reporting.' }
  ];

  return `
    <div class="section-title">
      <div>
        <h2>Company Plan & Subscription Tiers</h2>
        <small class="muted">Manage user seat allowance and feature access</small>
      </div>
      <span class="tag ok">${esc(sub.status)}</span>
    </div>

    <div class="g">
      <div class="k"><b>${esc(sub.plan)}</b><small>Active Workspace Tier</small></div>
      <div class="k"><b>${C.users.length} / ${sub.seats || 15}</b><small>User Seats Allocated</small></div>
      <div class="k"><b>${esc(sub.renewal || '2027-08-01')}</b><small>Next Billing Renewal</small></div>
    </div>

    <h3 style="margin:24px 0 12px;font-size:18px">Choose Commercial Plan Tier</h3>
    <div class="g3">
      ${plans.map(p => `
        <div class="c" style="display:flex;flex-direction:column;justify-content:space-between;border-color:${sub.plan.includes(p.name) ? 'var(--color-cta)' : 'var(--color-border)'}">
          <div>
            <div class="row">
              <h4 style="font-size:18px;margin:0">${p.name}</h4>
              ${sub.plan.includes(p.name) ? '<span class="tag ok">Current Plan</span>' : ''}
            </div>
            <p class="price" style="font-size:24px;margin:10px 0">${p.price}</p>
            <p class="muted" style="font-size:13px">${p.desc}</p>
            <ul style="padding-left:18px;font-size:12.5px;color:var(--color-text-secondary);margin:12px 0">
              <li>Up to ${p.seats} user accounts</li>
              <li>Isolated multi-tenant database</li>
              <li>Full CSV & PDF report exports</li>
            </ul>
          </div>
          <button class="${sub.plan.includes(p.name) ? 'btn-secondary' : 'btn-primary'}" style="width:100%;margin-top:12px" onclick="setPlan('${p.name}', ${p.seats})">
            ${sub.plan.includes(p.name) ? 'Active Plan' : 'Switch to ' + p.name}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function setPlan(name, seats) {
  C.subscription = C.subscription || {};
  C.subscription.plan = name;
  C.subscription.seats = seats;
  log('Switched company tier to ' + name);
  save();
  toast('Plan updated to ' + name, 'ok');
  go('subscription');
}

function users() {
  return `
    <div class="section-title">
      <div>
        <h2>Users, Roles & Security</h2>
        <small class="muted">Manage authorized personnel and role-based permissions</small>
      </div>
      <button class="btn-primary" onclick="addU()">${icon('plus')} Invite User</button>
    </div>

    <!-- Users Table -->
    <div class="c t">
      <table>
        <thead>
          <tr>
            <th>User Account</th>
            <th>Assigned Role</th>
            <th style="text-align:right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${C.users.map((u, i) => `
            <tr>
              <td><strong>${esc(u.name || u.email.split('@')[0])}</strong><br><small class="muted">${esc(u.email)}</small></td>
              <td>
                <select onchange="C.users[${i}].role=this.value;save();log('Role updated for '+C.users[${i}].email);toast('Role updated','ok')">
                  ${Object.entries(ROLES).map(([k, v]) => `<option value="${k}" ${k == u.role ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
              </td>
              <td style="text-align:right">
                ${u.email == U.email ? '<span class="tag info">Current User</span>' : `
                  <button class="btn-sm btn-danger" onclick="ask('Remove user ${u.email}?',()=>{C.users.splice(${i},1);save();go('users')})">Remove</button>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Workspace Currency & Data Backup -->
    <div class="g2" style="margin-top:16px">
      <div class="c">
        <h3 style="font-size:16px;margin:0 0 8px">Accounting Currency Symbol</h3>
        <p class="muted" style="font-size:13px">Set default currency symbol for budgets, invoices and cost logs.</p>
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px">
          <input id="cur" value="${C.cur || '$'}" style="width:80px;font-size:16px;font-weight:700">
          <button class="btn-primary" onclick="C.cur=$('cur').value||'$';save();toast('Currency symbol saved','ok');go('users')">Save Currency</button>
        </div>
      </div>

      <div class="c">
        <h3 style="font-size:16px;margin:0 0 8px">Data Portability & Backup</h3>
        <p class="muted" style="font-size:13px">Export or restore full JSON database snapshot.</p>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          <button class="btn-primary" onclick="dlBackup()">${icon('download')} Download JSON Backup</button>
          <button class="btn-secondary" onclick="rs()">Restore Backup</button>
          <button class="btn-secondary btn-danger" onclick="resetToRichDemo()">Reset Demo Data</button>
        </div>
      </div>
    </div>
  `;
}

function addU() {
  $('dlg').innerHTML = `
    <h3 style="margin-top:0">Invite New User</h3>
    <label>Email address<input id="ue" type="email" placeholder="user@company.com"></label>
    <label>Temporary password<input id="up" type="password" value="demo123"></label>
    <label>Assigned role
      <select id="ur">
        ${Object.entries(ROLES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
      </select>
    </label>
    <div class="row" style="margin-top:16px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="addU2()">Send Invite</button>
    </div>
  `;
  $('dlg').showModal();
}

function addU2() {
  const e = $('ue').value.trim().toLowerCase();
  const p = $('up').value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) || p.length < 6 || C.users.some(u => u.email.toLowerCase() == e)) {
    toast('Please enter a valid unique email and a password of at least 6 characters', 'bad');
    return;
  }
  C.users.push({ email: e, pw: p, role: $('ur').value, name: e.split('@')[0] });
  log('Invited new user ' + e);
  save();
  $('dlg').close();
  toast('User invited successfully', 'ok');
  go('users');
}

function dlBackup() {
  const raw = JSON.stringify({
    company: C.name,
    exportedAt: new Date().toISOString(),
    profile: C.profile || {},
    currency: C.cur || '$',
    data: C.data
  }, null, 2);

  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BuildPro_Backup_${C.name.replace(/\s+/g, '_')}_${today()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast('Backup JSON downloaded successfully', 'ok');
}

function rs() {
  $('dlg').innerHTML = `
    <h3 style="margin-top:0">Restore Company Backup</h3>
    <p class="muted">Paste raw JSON backup content below.</p>
    <textarea id="rsv" rows="8" placeholder="Paste JSON here..."></textarea>
    <div class="row" style="margin-top:16px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="executeRestore()">Restore Database</button>
    </div>
  `;
  $('dlg').showModal();
}

function executeRestore() {
  try {
    const raw = $('rsv').value;
    const parsed = JSON.parse(raw);
    const d = parsed.data || parsed;
    if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error();

    Object.keys(M).forEach(k => {
      if (!Array.isArray(d[k])) d[k] = [];
    });
    if (!Array.isArray(d.stages)) d.stages = [];

    C.data = d;
    if (parsed.profile) C.profile = parsed.profile;
    if (parsed.currency) C.cur = parsed.currency;

    save();
    $('dlg').close();
    toast('Company database restored', 'ok');
    go('dash');
  } catch (e) {
    toast('Invalid JSON format for backup file', 'bad');
  }
}

function resetToRichDemo() {
  ask('Reset company workspace to full sample construction data?', () => {
    DB = getFreshDemoDB();
    C = DB.cos['demo builders'];
    U = C.users[0];
    save();
    toast('Reset to rich demo data complete', 'ok');
    startApp();
  });
}

function audit() {
  const logs = C.audit || [];
  return `
    <div class="section-title">
      <h2>System Audit Trail</h2>
      <small class="muted">Immutable chronological record of business transactions and user actions</small>
    </div>
    <div class="c t">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User Account</th>
            <th>Action Logged</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(a => `
            <tr>
              <td class="num">${esc(a.t)}</td>
              <td><strong>${esc(a.u)}</strong></td>
              <td>${esc(a.a)}</td>
            </tr>
          `).join('') || '<tr><td colspan="3" class="muted">No activity logged in audit trail yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

// Confirmation helper
function ask(msg, onConfirm) {
  window._confirmCallback = onConfirm;
  $('dlg').innerHTML = `
    <h3 style="margin-top:0">Confirmation</h3>
    <p>${esc(msg)}</p>
    <div class="row" style="margin-top:18px">
      <button type="button" onclick="$('dlg').close()">Cancel</button>
      <button class="p" type="button" onclick="$('dlg').close();if(window._confirmCallback)window._confirmCallback()">Confirm</button>
    </div>
  `;
  $('dlg').showModal();
}

// Toast notification helper
function toast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const t = document.createElement('div');
  t.className = 'toast';
  const ic = type === 'ok' ? icon('check') : type === 'bad' ? icon('warning') : icon('info');
  t.innerHTML = `${ic} <span>${esc(msg)}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// Global keydown handler for Enter to login
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && $('login') && $('login').style.display !== 'none') {
    login();
  }
});
