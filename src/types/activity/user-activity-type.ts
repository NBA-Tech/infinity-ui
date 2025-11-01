export enum ACTIVITY_TYPE{
    WARNING = "WARNING",
    ERROR = "ERROR",
    INFO = "INFO",
    SUCCESS = "SUCCESS"
}

export interface UserActivity{
    activityID?: string;
    userId: string;
    activityTitle: string;
    activityType: ACTIVITY_TYPE;
    activityMessage: string;
    createdDate?: Date;
    updatedDate?: Date;
}

export interface Notification {
  notificationId: string;
  sendersEmail: string;
  notificationFor: string;
  notificationData: Record<string, string>; // Map<String, String> equivalent
  createdAt: Date;
  sendDateTime: Date;
  isSent: boolean;
}
