import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #333333',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
        },
        success: {
          style: {
            border: '1px solid #00FF99',
            boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
          },
          iconTheme: {
            primary: '#00FF99',
            secondary: '#1A1A1A',
          },
        },
        error: {
          style: {
            border: '1px solid #FF6B6B',
            boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
          },
          iconTheme: {
            primary: '#FF6B6B',
            secondary: '#1A1A1A',
          },
        },
        loading: {
          style: {
            border: '1px solid #00BFFF',
            boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)',
          },
          iconTheme: {
            primary: '#00BFFF',
            secondary: '#1A1A1A',
          },
        },
      }}
    />
  );
};

export default Toast;