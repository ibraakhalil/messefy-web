import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProvider } from './providers/query-provider.tsx';
import { AuthProvider } from './providers/auth-provider.tsx';
import { WorkspaceProvider } from './providers/workspace-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
