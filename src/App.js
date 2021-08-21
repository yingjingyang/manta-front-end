import AppRouter from './AppRouter';
import { ThemeProvider } from './contexts/theme.context';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
