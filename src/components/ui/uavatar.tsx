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

function UAvatar({ nickname = "Unknown", src, ...props }: UAvatarProps) {
  return (
    <Avatar alt={`@${nickname}`} src={src} {...props}>
      {getInitials(nickname)}
    </Avatar>
  );
}

export default UAvatar;
