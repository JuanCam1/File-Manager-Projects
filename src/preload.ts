import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  quit: () => ipcRenderer.send("quit"),
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  selectDirectory: () => ipcRenderer.invoke("select-directory"),
  getProjects: (dirPath: string) => ipcRenderer.invoke("get-projects", dirPath),
  openWithVSCode: (path: string) =>
    ipcRenderer.invoke("open-with-vscode", path),
  platform: () => ipcRenderer.invoke("platform"),
});
