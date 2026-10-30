import { Avatar, type AvatarProps } from "antd";

function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}

interface UAvatarProps extends AvatarProps {
  nickname?: string;
  src?: string;
}

function UAvatar({ nickname = "", src, style, ...props }: UAvatarProps) {
  const initials = getInitials(nickname);
  return (
    <Avatar
      src={src || undefined}
      style={{
        backgroundColor: src ? undefined : '#2B5A50',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: typeof props.size === 'number' ? Math.max(11, Math.round(props.size / 2.6)) : 12,
        ...style,
      }}
      {...props}
    >
      {initials}
    </Avatar>
  );
}

export default UAvatar;
