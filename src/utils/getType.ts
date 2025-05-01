import { Code, Laptop, MonitorPlay, Server, Smartphone } from "lucide-react";

export const getIcon = (type: string) => {
  const icons: Record<string, React.ElementType> = {
    client: Laptop,
    desktop: MonitorPlay,
    server: Server,
    mobile: Smartphone,
  };

  return icons[type] || Code;
};

export const getTitle = (type: string) => {
  const titles: Record<string, string> = {
    client: "Frontend",
    desktop: "Desktop",
    server: "Backend",
    mobile: "Mobile",
  };

  return titles[type] || "Code";
};
