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


    </div>
  );
}
