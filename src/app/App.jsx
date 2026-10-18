import { ThemeProvider } from '../context/ThemeContext';
import { Router } from './router';
import NetworkBackground from '../components/background/NetworkBackground';

export default function App() {
  return (
    <>
      <NetworkBackground />
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </>
  );
}
