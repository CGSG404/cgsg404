'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useNotificationHelpers } from './ui/notification';
import { useAuthNotifications } from '../hooks/useAuthNotifications';
import { Bell, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationDemo: React.FC = () => {
  const notifications = useNotificationHelpers();
  const authNotifications = useAuthNotifications();

  const testBasicNotifications = () => {
    notifications.success('Success!', 'This is a success notification.');
    setTimeout(() => {
      notifications.error('Error!', 'This is an error notification.');
    }, 1000);
    setTimeout(() => {
      notifications.warning('Warning!', 'This is a warning notification.');
    }, 2000);
    setTimeout(() => {
      notifications.info('Info!', 'This is an info notification.');
    }, 3000);
  };

  const testAuthNotifications = () => {
    authNotifications.loginSuccess('John Doe');
    setTimeout(() => {
      authNotifications.sessionRefreshed();
    }, 2000);
    setTimeout(() => {
      authNotifications.logoutSuccess();
    }, 4000);
  };

  const testErrorNotifications = () => {
    authNotifications.loginError('Invalid credentials provided');
    setTimeout(() => {
      authNotifications.accessDenied();
    }, 2000);
    setTimeout(() => {
      authNotifications.sessionExpired();
    }, 4000);
  };

  return (
    <Card className="bg-casino-card-bg border-casino-border-subtle max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-casino-neon-green flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Notifications */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Basic Notifications</h3>
            <div className="space-y-2">
              <Button
                onClick={() => notifications.success('Success!', 'Operation completed successfully.')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Success
              </Button>
              <Button
                onClick={() => notifications.error('Error!', 'Something went wrong.')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Error
              </Button>
              <Button
                onClick={() => notifications.warning('Warning!', 'Please be careful.')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warning
              </Button>
              <Button
                onClick={() => notifications.info('Info!', 'Here is some information.')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Info className="h-4 w-4 mr-2" />
                Info
              </Button>
            </div>
          </div>

          {/* Auth Notifications */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Auth Notifications</h3>
            <div className="space-y-2">
              <Button
                onClick={() => authNotifications.loginSuccess('Demo User')}
                className="w-full bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark"
                size="sm"
              >
                Login Success
              </Button>
              <Button
                onClick={() => authNotifications.logoutSuccess()}
                className="w-full bg-casino-neon-purple hover:bg-casino-neon-purple/80 text-white"
                size="sm"
              >
                Logout Success
              </Button>
              <Button
                onClick={() => authNotifications.loginError('Invalid credentials')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Login Error
              </Button>
              <Button
                onClick={() => authNotifications.sessionExpired()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                Session Expired
              </Button>
            </div>
          </div>
        </div>

        {/* Batch Tests */}
        <div className="border-t border-casino-border-subtle pt-4">
          <h3 className="text-white font-semibold mb-3">Batch Tests</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={testBasicNotifications}
              variant="outline"
              className="border-casino-border-subtle text-gray-300 hover:text-white"
            >
              Test All Basic
            </Button>
            <Button
              onClick={testAuthNotifications}
              variant="outline"
              className="border-casino-border-subtle text-gray-300 hover:text-white"
            >
              Test Auth Flow
            </Button>
            <Button
              onClick={testErrorNotifications}
              variant="outline"
              className="border-casino-border-subtle text-gray-300 hover:text-white"
            >
              Test Error Flow
            </Button>
          </div>
        </div>

        {/* Persistent Notification */}
        <div className="border-t border-casino-border-subtle pt-4">
          <h3 className="text-white font-semibold mb-3">Special Notifications</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => notifications.warning('Persistent Warning', 'This notification will stay until manually closed.', { persistent: true })}
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:text-yellow-300"
            >
              Persistent Warning
            </Button>
            <Button
              onClick={() => notifications.success('Long Duration', 'This notification will stay for 10 seconds.', { duration: 10000 })}
              variant="outline"
              className="border-green-500/30 text-green-400 hover:text-green-300"
            >
              Long Duration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
