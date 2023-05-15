import { Container } from '@chakra-ui/react';
import { supabase } from '@supabase-sdk';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Login from '../components/login';
import Register from '../components/register';
import Tasks from '../components/tasks';

export function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session?.user);
      setUser(session?.user);
    });
  }, []);
  return (
    <Container padding={10}>
      {authenticated ? (
        <Tasks user={user} />
      ) : showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
    </Container>
  );
}

export default App;
