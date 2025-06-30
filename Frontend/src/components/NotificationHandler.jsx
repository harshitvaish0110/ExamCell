import React, { useEffect, useState } from 'react';
import { onMessageListener } from '@/notification/firebase';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const NotificationHandler = () => {
  const [notification, setNotification] = useState(null);
  const [show, setShow] = useState(false);
  const [isListenerActive, setIsListenerActive] = useState(false);

  useEffect(() => {
    const setupMessageListener = async () => {
      try {
        console.log('Setting up Firebase message listener...');
        
        // Check if service worker is registered
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          console.log('Service Worker registration:', registration);
        }
        
        const messageListener = onMessageListener();
        
        if (messageListener && typeof messageListener.then === 'function') {
          setIsListenerActive(true);
          console.log('Firebase message listener setup successfully');
          
          // The messageListener is a Promise that resolves when a message is received
          messageListener.then((payload) => {
            console.log('Received notification payload:', payload);
            
            if (payload) {
              const notificationData = {
                title: payload?.notification?.title || payload?.data?.title || 'New Notification',
                body: payload?.notification?.body || payload?.data?.body || 'You have a new notification',
                data: payload?.data
              };
              
              console.log('Setting notification:', notificationData);
              setNotification(notificationData);
              setShow(true);
              
              // Auto-hide notification after 10 seconds
              setTimeout(() => {
                setShow(false);
                setNotification(null);
              }, 10000);
            }
          }).catch((err) => {
            console.error('Failed to receive notification:', err);
            setIsListenerActive(false);
          });
        } else {
          console.warn('Firebase message listener not available or not a Promise');
          setIsListenerActive(false);
        }
      } catch (err) {
        console.error('Failed to setup message listener:', err);
        setIsListenerActive(false);
      }
    };

    setupMessageListener();

    // Cleanup function
    return () => {
      console.log('Cleaning up Firebase message listener');
      setIsListenerActive(false);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    setNotification(null);
  };

  const handleOpen = () => {
    // Handle opening the app or specific page
    console.log('Opening app from notification');
    setShow(false);
    setNotification(null);
    // You can add navigation logic here if needed
  };

  if (!show || !notification) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {notification.body}
          </p>
          {notification.data && (
            <div className="mt-2 text-xs text-gray-500">
              {Object.entries(notification.data).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpen}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
            title="Open"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-2 flex items-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${isListenerActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-gray-500">
          {isListenerActive ? 'Notifications active' : 'Notifications inactive'}
        </span>
      </div>
    </div>
  );
};

export default NotificationHandler; 