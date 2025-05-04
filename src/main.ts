import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { shell } from "electron";
import started from "electron-squirrel-startup";
import path from "node:path";
import { exec, spawn } from "node:child_process";
import fs from "node:fs";
import { platform } from "node:process";
import { template } from "./api/libs";
import { promisify } from "node:util";

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    icon: "../images/logo.png",
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
  Menu.setApplicationMenu(null);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // mainWindow.webContents.openDevTools({
  //   mode: "detach",
  // });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
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

ipcMain.handle("select-directory", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

function isProject(dirPath: string) {
  return (
    fs.existsSync(path.join(dirPath, "package.json")) ||
    fs.existsSync(path.join(dirPath, ".git")) ||
    fs.existsSync(path.join(dirPath, ".vscode"))
  );
}

ipcMain.handle("get-projects", async (_: unknown, dirPath: string) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = path.join(dirPath, entry.name);
        if (isProject(projectPath)) {
          projects.push({
            name: entry.name,
            path: projectPath,
          });
        }
      }
    }

    return projects;
  } catch (error) {
    console.error("Error al leer los proyectos:", error);
    return [];
  }
});

ipcMain.handle("open-with-vscode", async (_: unknown, projectPath: string) => {
  try {
    exec(`code "${projectPath}"`, (error) => {
      if (error) {
        console.error(`Error al abrir VSCode: ${error}`);
        return false;
      }
    });
    return true;
  } catch (error) {
    console.error("Error al abrir con VSCode:", error);
    return false;
  }
});

ipcMain.handle("platform", async () => {
  const pathWind = "C:\\Users\\juanc\\Desktop\\Developer";
  const pathLinux = "/home/juanc/Escritorio/Dev/developer";
  try {
    const type = platform === "win32" ? pathWind : pathLinux;
    return type;
  } catch (error) {
    console.log("Error", error);
    return pathLinux;
  }
});

const execAsync = promisify(exec);
async function commandExists(command: string): Promise<boolean> {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch (_error) {
    return false;
  }
}

ipcMain.handle("open-terminal", async (_: unknown, path: string) => {
  try {
    switch (platform) {
      case "win32": {
        const cmdProcess = spawn("cmd.exe", ["/K", `cd /d "${path}"`], {
          detached: true,
          stdio: "ignore",
          windowsHide: false,
          shell: true,
        });

        cmdProcess.unref();
        return true;
      }
      case "darwin": {
        exec(`open -a Terminal "${path}"`, (error) => {
          if (error) {
            console.error("Error al abrir Terminal en macOS:", error);
          }
        });
        return true;
      }

      case "linux": {
        const terminals = [
          { cmd: "gnome-terminal", args: [`--working-directory=${path}`] },
          { cmd: "konsole", args: [`--workdir`, path] },
          { cmd: "xfce4-terminal", args: [`--working-directory=${path}`] },
          { cmd: "mate-terminal", args: [`--working-directory=${path}`] },
          { cmd: "terminator", args: [`--working-directory=${path}`] },
          { cmd: "tilix", args: [`--working-directory=${path}`] },
          { cmd: "xterm", args: [`-e`, `cd "${path}" && bash`] },
          { cmd: "urxvt", args: [`-e`, `bash -c "cd '${path}' && exec bash"`] },
          { cmd: "kitty", args: [`--directory=${path}`] },
          { cmd: "alacritty", args: [`--working-directory`, path] },
        ];

        const desktopEnv = process.env.XDG_CURRENT_DESKTOP?.toLowerCase() || "";

        if (desktopEnv.includes("gnome")) {
          const gnomeIndex = terminals.findIndex(
            (t) => t.cmd === "gnome-terminal",
          );
          if (gnomeIndex > 0) {
            const [gnomeTerminal] = terminals.splice(gnomeIndex, 1);
            terminals.unshift(gnomeTerminal);
          }
        } else if (desktopEnv.includes("kde")) {
          const kdeIndex = terminals.findIndex((t) => t.cmd === "konsole");
          if (kdeIndex > 0) {
            const [kdeTerminal] = terminals.splice(kdeIndex, 1);
            terminals.unshift(kdeTerminal);
          }
        } else if (desktopEnv.includes("xfce")) {
          const xfceIndex = terminals.findIndex(
            (t) => t.cmd === "xfce4-terminal",
          );
          if (xfceIndex > 0) {
            const [xfceTerminal] = terminals.splice(xfceIndex, 1);
            terminals.unshift(xfceTerminal);
          }
        }

        for (const term of terminals) {
          try {
            if (await commandExists(term.cmd)) {
              console.log(`Intentando abrir terminal con: ${term.cmd}`);
              const process = spawn(term.cmd, term.args, {
                detached: true,
                stdio: "ignore",
              });
              process.unref();
              console.log(`Terminal abierta exitosamente con: ${term.cmd}`);
              return true;
            }
          } catch (err) {
            console.log(`No se pudo abrir con ${term.cmd}:`, err);
          }
        }

        // Si llegamos aquí, ningún terminal funcionó
        console.error(
          "No se pudo encontrar un terminal disponible en tu sistema",
        );
        return false;
      }
    }
  } catch (error) {
    console.error("Error al intentar abrir la terminal:", error);
    return false;
  }
});

ipcMain.handle(
  "rename-project-folder",
  async (_event, oldPath: string, newName: string) => {
    try {
      if (!fs.existsSync(oldPath)) {
        return false;
      }

      const stats = fs.statSync(oldPath);

      if (!stats.isDirectory()) {
        return false;
      }

      const parentDir = path.dirname(oldPath);
      const newPath = path.join(parentDir, newName);

      if (fs.existsSync(newPath)) {
        throw new Error(`Ya existe una carpeta con el nombre ${newName}`);
      }

      fs.renameSync(oldPath, newPath);

      return true;
    } catch (error) {
      console.error("Error al renombrar la carpeta:", error);
      return false;
    }
  },
);
