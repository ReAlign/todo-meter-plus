import path from 'path';
import moment from 'moment';
import electron from 'electron';
import {
    app,
    BrowserWindow,
    Menu,
    dialog,
    shell
} from 'electron';
import setupEvents from './src/installers/setup-events';
import {
    version
} from './package.json';

const MW = {
    willQuit: false,
    mainWindow: {
        show() {
            console.log('show');
        }
    },
    menuTpl: [
        {
            label: 'todometer',
            submenu: [{
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(MW.mainWindow, {
                            type: 'info',
                            title: 'About',
                            message: 'todometer is built by Cassidy Williams',
                            detail: 'You can find her on GitHub and Twitter as @cassidoo, or on her website cassidoo.co.',
                            icon: path.join(__dirname, 'assets/png/64x64.png')
                        });
                    }
                },
                {
                    label: 'Contribute (v' + version + ')',
                    click: () => {
                        shell.openExternal('http://github.com/cassidoo/todometer');
                    }
                },
                {
                    type: 'separator'
                }, {
                    label: 'Dev tools',
                    click: () => {
                        MW.mainWindow.webContents.openDevTools();
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [{
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [{
                    role: 'reload'
                },
                {
                    role: 'togglefullscreen'
                },
                {
                    role: 'minimize'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'close'
                }
            ]
        }
    ],
    createWindow() {
        MW.mainWindow = new BrowserWindow({
            width: 800,
            minWidth: 800,
            height: 600,
            fullscreenable: true,
            backgroundColor: '#403F4D',
            icon: path.join(__dirname, 'assets/png/128x128.png')
        });
        MW.mainWindow.loadURL('file://' + __dirname + '/static/index.html');
    },
    manageRefresh() {
        const time = moment('24:00:00', 'hh:mm:ss').diff(moment(), 'seconds');
        setTimeout(
            midnightTask,
            time * 1000
        );

        function midnightTask() {
            MW.mainWindow.reload();
        }
    },
    menuSetup() {
        const menu = Menu.buildFromTemplate(MW.menuTpl);
        Menu.setApplicationMenu(menu);
    }
};

app.on('ready', () => {
    // Squirrel events have to be handled before anything else
    if (setupEvents.handleSquirrelEvent()) {
        // squirrel event handled and app will exit in 1000ms, so don't do anything else
        return;
    }
    MW.createWindow();
    MW.menuSetup();

    electron.powerMonitor.on('resume', () => {
        MW.mainWindow.reload();
        console.log('reloaded');
    });

    MW.mainWindow.on('close', e => {
        if (MW.willQuit) {
            MW.mainWindow = null;
        } else {
            e.preventDefault();
            MW.mainWindow.hide();
        }
    });

    MW.manageRefresh();
});

app.on('activate', () => MW.mainWindow.show());
app.on('before-quit', () => MW.willQuit = true);