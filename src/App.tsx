import './assets/css/App.css';

import {BrowserRouter} from 'react-router-dom';
import Container from './layouts/container';
import {useQuery, QueryClientProvider, QueryClient} from 'react-query';
import axios from 'axios';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Container />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
