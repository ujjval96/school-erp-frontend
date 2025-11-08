import AppProviders from './providers/AppProviders';
import RouterProvider from './providers/RouterProvider';

/**
 * App
 * Root application component with all providers
 */
function App() {
  return (
    <AppProviders>
      <RouterProvider />
    </AppProviders>
  );
}

export default App;

