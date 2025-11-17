import { 
  ShoppingCart, 
  ArrowRight, 
  DollarSign, 
  MessageCircle, 
  User,
  Activity as ActivityIcon 
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface ActivityEvent {
  id: string;
  type: 'order_created' | 'status_update' | 'payment' | 'inquiry' | 'staff_action';
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  action: string;
  timestamp: Date | string;
  metadata?: {
    orderId?: number;
    status?: string;
    amount?: number;
  };
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  loading?: boolean;
  maxHeight?: string;
  onEventClick?: (event: ActivityEvent) => void;
}

function formatRelativeTime(timestamp: Date | string): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateLabel(dateKey: string): string {
  const eventDate = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = getDateKey(today);
  const yesterdayKey = getDateKey(yesterday);

  if (dateKey === todayKey) {
    return 'Today';
  } else if (dateKey === yesterdayKey) {
    return 'Yesterday';
  } else {
    return eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

interface EventGroup {
  date: string;
  label: string;
  events: ActivityEvent[];
}

function groupEventsByDate(events: ActivityEvent[]): EventGroup[] {
  const groupMap = new Map<string, ActivityEvent[]>();

  events.forEach(event => {
    const eventDate = event.timestamp instanceof Date 
      ? event.timestamp 
      : new Date(event.timestamp);
    const dateKey = getDateKey(eventDate);

    if (!groupMap.has(dateKey)) {
      groupMap.set(dateKey, []);
    }
    groupMap.get(dateKey)!.push(event);
  });

  const groups: EventGroup[] = Array.from(groupMap.entries()).map(([date, events]) => ({
    date,
    label: getDateLabel(date),
    events: events.sort((a, b) => {
      const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
      const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    })
  }));

  groups.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return groups;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'linear-gradient(135deg, #C44569 0%, #9B3654 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #5A3825 0%, #3E2618 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

interface StatusIconProps {
  type: ActivityEvent['type'];
}

function StatusIcon({ type }: StatusIconProps) {
  const getIconConfig = () => {
    switch (type) {
      case 'order_created':
        return { Icon: ShoppingCart, color: 'var(--db-color-raspberry)' };
      case 'status_update':
        return { Icon: ArrowRight, color: 'var(--db-color-info)' };
      case 'payment':
        return { Icon: DollarSign, color: 'var(--db-color-success)' };
      case 'inquiry':
        return { Icon: MessageCircle, color: 'var(--db-color-warning)' };
      case 'staff_action':
        return { Icon: User, color: 'var(--db-color-chocolate)' };
      default:
        return { Icon: ActivityIcon, color: 'var(--db-color-gray-500)' };
    }
  };

  const { Icon, color } = getIconConfig();

  return (
    <div className="status-icon">
      <Icon size={14} color={color} strokeWidth={2} />
      
      <style jsx>{`
        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

interface ActivityItemProps {
  event: ActivityEvent;
  onClick?: (event: ActivityEvent) => void;
}

function ActivityItem({ event, onClick }: ActivityItemProps) {
  const initials = getInitials(event.user.name);
  const avatarColor = getAvatarColor(event.user.name);
  const isClickable = !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(event);
    }
  };

  return (
    <div 
      className="activity-item"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="activity-avatar">
        {event.user.avatar ? (
          <img src={event.user.avatar} alt={event.user.name} className="avatar-image" />
        ) : (
          <div className="avatar-placeholder" style={{ background: avatarColor }}>
            {initials}
          </div>
        )}
      </div>

      <div className="activity-content">
        <p className="activity-text">
          <strong className="user-name">{event.user.name}</strong> {event.action}
        </p>
        <time className="activity-time">
          {formatRelativeTime(event.timestamp)}
        </time>
      </div>

      <div className="activity-indicator">
        <StatusIcon type={event.type} />
      </div>

      <style jsx>{`
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: var(--db-space-3);
          padding: 12px;
          border-bottom: 1px solid #E5E7EB;
          transition: background-color var(--db-transition-base);
          cursor: ${isClickable ? 'pointer' : 'default'};
          outline: none;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item:hover {
          background-color: rgba(196, 69, 105, 0.05);
        }

        .activity-item:focus-visible {
          outline: 2px solid var(--db-color-raspberry);
          outline-offset: -2px;
        }

        .activity-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--db-color-white);
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-semibold);
        }

        .activity-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: var(--db-space-1);
        }

        .activity-text {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-regular);
          color: var(--db-color-chocolate);
          line-height: var(--db-text-sm-line-height);
          margin: 0;
          word-wrap: break-word;
        }

        .user-name {
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
        }

        .activity-time {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-regular);
          color: var(--db-color-gray-500);
          line-height: var(--db-text-tiny-line-height);
        }

        .activity-indicator {
          display: flex;
          align-items: center;
          padding-top: 2px;
        }

        @media (max-width: 639px) {
          .activity-item {
            padding: var(--db-space-3);
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonEvents() {
  return (
    <div className="skeleton-events">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-avatar" />
          <div className="skeleton-content">
            <div className="skeleton-text" style={{ width: '75%' }} />
            <div className="skeleton-time" style={{ width: '40%' }} />
          </div>
          <div className="skeleton-icon" />
        </div>
      ))}

      <style jsx>{`
        .skeleton-events {
          padding: var(--db-space-2) 0;
        }

        .skeleton-item {
          display: flex;
          gap: var(--db-space-3);
          padding: 12px;
          border-bottom: 1px solid #E5E7EB;
        }

        .skeleton-item:last-child {
          border-bottom: none;
        }

        .skeleton-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(
            90deg,
            var(--db-color-gray-100) 0%,
            var(--db-color-gray-200) 50%,
            var(--db-color-gray-100) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        .skeleton-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--db-space-1);
        }

        .skeleton-text {
          height: 14px;
          background: linear-gradient(
            90deg,
            var(--db-color-gray-100) 0%,
            var(--db-color-gray-200) 50%,
            var(--db-color-gray-100) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: var(--db-radius-xs);
        }

        .skeleton-time {
          height: 10px;
          background: linear-gradient(
            90deg,
            var(--db-color-gray-100) 0%,
            var(--db-color-gray-200) 50%,
            var(--db-color-gray-100) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: var(--db-radius-xs);
        }

        .skeleton-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(
            90deg,
            var(--db-color-gray-100) 0%,
            var(--db-color-gray-200) 50%,
            var(--db-color-gray-100) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          flex-shrink: 0;
          margin-top: 2px;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ActivityIcon size={40} color="var(--db-color-gray-400)" />
      </div>
      <p className="empty-message">No recent activity</p>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--db-space-16) var(--db-space-6);
          text-align: center;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--db-color-gray-100);
          border-radius: 50%;
          margin-bottom: var(--db-space-4);
        }

        .empty-message {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-sm);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-gray-500);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export function ActivityFeed({
  events,
  loading = false,
  maxHeight = 'calc(100vh - 200px)',
  onEventClick
}: ActivityFeedProps) {
  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3 className="feed-title">Activity Feed</h3>
        <Badge className="live-badge">
          <span className="live-dot" />
          Live
        </Badge>
      </div>

      <div className="feed-events" style={{ maxHeight }}>
        {loading ? (
          <SkeletonEvents />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          groupedEvents.map(group => (
            <div key={group.date} className="event-group">
              <div className="day-header">
                <span className="day-label">{group.label}</span>
                <span className="day-count">({group.events.length} {group.events.length === 1 ? 'event' : 'events'})</span>
              </div>
              {group.events.map(event => (
                <ActivityItem 
                  key={event.id} 
                  event={event} 
                  onClick={onEventClick}
                />
              ))}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .activity-feed {
          background: var(--db-color-white);
          border: 1px solid #E5E7EB;
          border-radius: var(--db-radius-lg);
          padding: var(--db-space-6);
          box-shadow: var(--db-shadow-card);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 96px;
        }

        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--db-space-6);
          padding-bottom: var(--db-space-4);
          border-bottom: 1px solid #E5E7EB;
        }

        .feed-title {
          font-family: var(--db-font-heading);
          font-size: var(--db-text-h5);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
          margin: 0;
          line-height: var(--db-text-h5-line-height);
        }

        .feed-events {
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .event-group {
          position: relative;
        }

        .day-header {
          position: sticky;
          top: 0;
          background: linear-gradient(to bottom, var(--db-color-gray-50) 0%, var(--db-color-gray-50) 90%, rgba(243, 244, 246, 0) 100%);
          padding: var(--db-space-3) var(--db-space-4);
          margin-bottom: var(--db-space-2);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: var(--db-space-2);
          border-bottom: 1px solid var(--db-color-gray-200);
        }

        .day-label {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-semibold);
          color: var(--db-color-charcoal);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .day-count {
          font-family: var(--db-font-sans);
          font-size: var(--db-text-xs);
          font-weight: var(--db-weight-medium);
          color: var(--db-color-gray-500);
        }

        .feed-events::-webkit-scrollbar {
          width: 6px;
        }

        .feed-events::-webkit-scrollbar-track {
          background: var(--db-color-gray-100);
          border-radius: var(--db-radius-full);
        }

        .feed-events::-webkit-scrollbar-thumb {
          background: var(--db-color-raspberry);
          border-radius: var(--db-radius-full);
        }

        .feed-events::-webkit-scrollbar-thumb:hover {
          background: var(--db-color-raspberry-hover);
        }

        @media (max-width: 1024px) {
          .activity-feed {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 639px) {
          .activity-feed {
            padding: var(--db-space-5);
          }

          .feed-header {
            margin-bottom: var(--db-space-5);
          }

          .feed-title {
            font-size: var(--db-text-h6);
          }
        }
      `}</style>

      <style jsx global>{`
        .live-badge {
          background-color: var(--db-color-success-light) !important;
          border-color: var(--db-color-success-border) !important;
          color: var(--db-color-success) !important;
          font-size: var(--db-text-tiny);
          font-weight: var(--db-weight-semibold);
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--db-color-success);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
