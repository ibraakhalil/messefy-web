'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { Bell, CheckCircle, ChefHat, Clock, Search, Trash2, UserPlus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface NotificationsSectionProps {
  isLoading?: boolean;
}

// Mock notification data
const notifications = [
  {
    id: 'notif-1',
    type: 'mess_invitation',
    title: 'Mess Invitation',
    message: 'John Doe invited you to join "Tech Office Mess"',
    messName: 'Tech Office Mess',
    messCode: 'TECH-2024-001',
    from: 'John Doe',
    fromId: 'user-123',
    timestamp: '2024-01-16T10:30:00Z',
    isRead: false,
    status: 'pending',
    data: {
      messId: 'mess-tech-001',
      invitationId: 'inv-001',
    },
  },
  {
    id: 'notif-2',
    type: 'join_request_approved',
    title: 'Join Request Approved',
    message: 'Your request to join "Community Kitchen" has been approved',
    messName: 'Community Kitchen',
    messCode: 'COM-2024-002',
    from: 'Admin',
    fromId: 'admin-456',
    timestamp: '2024-01-15T14:20:00Z',
    isRead: false,
    status: 'approved',
    data: {
      messId: 'mess-com-002',
      requestId: 'req-002',
    },
  },
  {
    id: 'notif-3',
    type: 'join_request_rejected',
    title: 'Join Request Rejected',
    message: 'Your request to join "Premium Mess" has been rejected',
    messName: 'Premium Mess',
    messCode: 'PREM-2024-003',
    from: 'Admin',
    fromId: 'admin-789',
    timestamp: '2024-01-14T09:15:00Z',
    isRead: true,
    status: 'rejected',
    data: {
      messId: 'mess-prem-003',
      requestId: 'req-003',
      reason: 'Currently at full capacity',
    },
  },
  {
    id: 'notif-4',
    type: 'meal_reminder',
    title: 'Meal Entry Reminder',
    message: 'Don\'t forget to log your meals for today in "Office Mess"',
    messName: 'Office Mess',
    messCode: 'OFF-2024-001',
    from: 'System',
    fromId: 'system',
    timestamp: '2024-01-16T08:00:00Z',
    isRead: true,
    status: 'info',
    data: {
      messId: 'mess-off-001',
      date: '2024-01-16',
    },
  },
  {
    id: 'notif-5',
    type: 'payment_due',
    title: 'Payment Due',
    message: 'You have an outstanding balance of ৳45 in "Office Mess"',
    messName: 'Office Mess',
    messCode: 'OFF-2024-001',
    from: 'System',
    fromId: 'system',
    timestamp: '2024-01-15T16:00:00Z',
    isRead: true,
    status: 'warning',
    data: {
      messId: 'mess-off-001',
      amount: 45,
      currency: 'BDT',
    },
  },
];

export default function NotificationsSection({ isLoading = false }: NotificationsSectionProps) {
  const t = useTranslations('Notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'invitations' | 'requests'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingNotifications, setProcessingNotifications] = useState<Set<string>>(new Set());

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.messName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'invitations':
        return notification.type === 'mess_invitation';
      case 'requests':
        return notification.type.includes('request');
      default:
        return true;
    }
  });

  const handleAcceptInvitation = async (notificationId: string) => {
    setProcessingNotifications((prev) => new Set(prev).add(notificationId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Invitation accepted:', notificationId);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleRejectInvitation = async (notificationId: string) => {
    setProcessingNotifications((prev) => new Set(prev).add(notificationId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Invitation rejected:', notificationId);
    } catch (error) {
      console.error('Failed to reject invitation:', error);
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log('Marked as read:', notificationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setProcessingNotifications((prev) => new Set(prev).add(notificationId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Notification deleted:', notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mess_invitation':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'join_request_approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'join_request_rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'meal_reminder':
        return <ChefHat className="h-5 w-5 text-orange-600" />;
      case 'payment_due':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'mess_invitation':
        return 'bg-blue-50';
      case 'join_request_approved':
        return 'bg-green-50';
      case 'join_request_rejected':
        return 'bg-red-50';
      case 'meal_reminder':
        return 'bg-orange-50';
      case 'payment_due':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationTime.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-md bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {unreadCount} {t('unread')}
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          className="text-sm"
          onClick={() => {
            console.log('Mark all as read');
          }}
        >
          {t('markAllRead')}
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <FormInput
            id="search"
            placeholder={t('searchPlaceholder')}
            icon={<Search className="h-4 w-4 text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: t('all') },
            { key: 'unread', label: t('unread') },
            { key: 'invitations', label: t('invitations') },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as 'all')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No notifications match your search.' : "You're all caught up!"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const isProcessing = processingNotifications.has(notification.id);

            return (
              <div
                key={notification.id}
                className={`relative rounded-xl border p-6 transition-all hover:shadow-md ${
                  notification.isRead ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                } ${getNotificationBg(notification.type)}`}
              >
                {!notification.isRead && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500"></div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="mb-1 text-base font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="mb-2 text-sm text-gray-600">{notification.message}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>From: {notification.from}</span>
                          <span>•</span>
                          <span>{notification.messName}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                        </div>

                        {notification.type === 'join_request_rejected' &&
                          notification.data?.reason && (
                            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2">
                              <p className="text-sm text-red-800">
                                <strong>Reason:</strong> {notification.data.reason}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-2">
                      {notification.type === 'mess_invitation' &&
                        notification.status === 'pending' && (
                          <>
                            <Button
                              className="h-8 bg-gradient-to-r from-emerald-600 to-teal-600 px-3 text-sm text-white hover:from-emerald-700 hover:to-teal-700"
                              onClick={() => handleAcceptInvitation(notification.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                              ) : (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              Accept
                            </Button>
                            <Button
                              variant="secondary"
                              className="h-8 px-3 text-sm"
                              onClick={() => handleRejectInvitation(notification.id)}
                              disabled={isProcessing}
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Decline
                            </Button>
                          </>
                        )}

                      {!notification.isRead && (
                        <Button
                          variant="secondary"
                          className="h-8 px-3 text-sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        className="h-8 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteNotification(notification.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="h-3 w-3 animate-spin rounded-full border border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="border-t border-gray-200 pt-4 text-center">
          <Button
            variant="secondary"
            className="text-sm"
            onClick={() => {
              // Load more functionality
              console.log('Load more notifications');
            }}
          >
            Load More Notifications
          </Button>
        </div>
      )}
    </div>
  );
}
