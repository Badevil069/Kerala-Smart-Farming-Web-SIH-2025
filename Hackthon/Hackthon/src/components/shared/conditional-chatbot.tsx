
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Chatbot from './chatbot';

export default function ConditionalChatbot() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render the chatbot on the login or home page
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  // Only render the chatbot on the client-side to avoid hydration errors
  if (!isClient) {
    return null;
  }

  return <Chatbot />;
}
