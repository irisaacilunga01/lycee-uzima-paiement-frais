"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Notification } from "@/type";
import { Bell } from "lucide-react"; // Icône de notification

interface NotificationItemProps {
  notification: Notification;
}

export default function ClientNotificationItem({
  notification,
}: NotificationItemProps) {
  const formattedDate = new Date(notification.dateenvoi).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Card className="relative group overflow-hidden flex flex-col h-full border border-muted shadow-md rounded-2xl transition-all hover:shadow-xl hover:border-blue-500 bg-background dark:bg-muted/30">
      {/* Badge en haut à droite */}
      <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
        #{notification.idnotification}
      </div>

      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-100 rounded-full w-10 h-10 shadow">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notification
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            📅 Du {formattedDate}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4 text-gray-700 dark:text-gray-200">
        <p className="text-sm leading-relaxed">{notification.message}</p>
      </CardContent>
    </Card>
  );
}
