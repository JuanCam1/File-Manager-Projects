declare global {
  interface Window {
    api: {
      quit: () => void;
      minimize: () => void;
      maximize: () => void;
      selectDirectory: () => Promise<string | null>;
      getProjects: (dirPath: string) => Promise<Project[]>;
      openWithVSCode: (projectPath: string) => Promise<boolean>;
      openTerminal: (path: string) => Promise<string>;
      platform:() => Promise<string>;
      renameProjectFolder: (oldPath: string, newName: string) => Promise<boolean>;
    };
  }
}

export { };
