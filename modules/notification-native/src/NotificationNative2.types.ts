export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  auctionDate: string;
  auctionTime: string;
  price: number;
  image: string;
};

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type NotificationNative2ModuleEvents = {
  onNotificationReceived: (params: NotificationEventPayload) => void;
  onNotificationTapped: (params: NotificationEventPayload) => void;
};

export type NotificationEventPayload = {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
};

export type ScheduledNotification = {
  id: string;
  vehicleId: string;
  title: string;
  body: string;
  scheduledTime: number;
  data?: Record<string, any>;
};
