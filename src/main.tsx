import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isLocked = localStorage.getItem('SUPER_ADMIN_LOCK') !== 'PHUONG_SGU_2026';

if (isLocked) {
  createRoot(document.getElementById('root')!).render(
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Hệ thống đã đóng</h1>
      <p>Sự kiện đã kết thúc. Website tạm thời khóa để bảo trì dữ liệu.</p>
    </div>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
