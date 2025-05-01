export const getDeviceType = (name: string) => {
  const types = ["desktop", "server", "client", "mobile"];

  for (const type of types) {
    if (name.endsWith(type)) {
      return type;
    }
  }

  return "code";
};
