function Notification({ notification, onDismiss }) {
  if (!notification) return null;

  return (
    <div
      className={`notification notification-${notification.type}`}
      role={notification.type === "error" ? "alert" : "status"}
      key={notification.key}
    >
      <span className="notification-icon" aria-hidden="true">
        {notification.type === "error" ? "!" : "✓"}
      </span>
      <span>{notification.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button>
    </div>
  );
}

export default Notification;
