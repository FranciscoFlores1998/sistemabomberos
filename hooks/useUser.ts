import { useState, useEffect } from 'react';
import { getUserFromCookie } from '../utils/auth';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    setUser(userFromCookie);
  }, []);

  return user;
}

