import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import path from "node:path";
import { shell } from "electron";
import started from "electron-squirrel-startup";
import { template } from "./api/libs";
import { exec } from "node:child_process";
import fs from "node:fs";

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "File Manager Projects",
    minHeight: 600,
    minWidth: 500,
    frame: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.maximize();

  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.webContents.openDevTools({
    mode: "detach",
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.on("minimize", () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on("maximize", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow?.isMaximized()) {
    focusedWindow.unmaximize();
  } else {
    focusedWindow?.maximize();
  }
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

function isProject(dirPath: string) {
  return (
    fs.existsSync(path.join(dirPath, 'package.json')) ||
    fs.existsSync(path.join(dirPath, '.git')) ||
    fs.existsSync(path.join(dirPath, '.vscode'))
  );
}

ipcMain.handle('get-projects', async (_: unknown, dirPath: string) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = path.join(dirPath, entry.name);
        if (isProject(projectPath)) {
          projects.push({
            name: entry.name,
            path: projectPath
          });
        }
      }
    }

    return projects;
  } catch (error) {
    console.error('Error al leer los proyectos:', error);
    return [];
  }
});

// Manejador para abrir un proyecto con VSCode
ipcMain.handle('open-with-vscode', async (_: unknown, projectPath: string) => {
  try {
    // Comando para abrir VS Code con el proyecto
    exec(`code "${projectPath}"`, (error) => {
      if (error) {
        console.error(`Error al abrir VSCode: ${error}`);
        return false;
      }
    });
    return true;
  } catch (error) {
    console.error('Error al abrir con VSCode:', error);
    return false;
  }
});