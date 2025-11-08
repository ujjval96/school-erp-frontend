import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

// Initialize tenant detection on app load
import { extractTenantFromUrl } from '@/utils/tenantUtils';
import { useTenantStore } from '@/store/tenantStore';

// Set initial tenant from URL
const tenantInfo = extractTenantFromUrl();
useTenantStore.getState().setTenant(tenantInfo.tenantId, tenantInfo.subdomain);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

