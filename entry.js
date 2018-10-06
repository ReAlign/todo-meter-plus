import path from 'path';
import moment from 'moment';
import electron from 'electron';
import {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog,
    shell
} from 'electron';
import { getData } from './src/tools/local-storage';
import setupEvents from './src/installers/setup-events';
import {
    version
} from './package.json';


ipcMain.on('async-update-lang-cb', (event, arg) => {
    if(arg.res) {
        MW.mainWindow.reload();
    }
});

const MW = {
    willQuit: false,
    mainWindow: {
        show() {
            console.log('show');
        }
    },
    menuTpl() {
        return [
            {
                label: 'todo-meter-plus',
                submenu: [
                    {
                        label: 'About',
                        click() {
                            dialog.showMessageBox(MW.mainWindow, {
                                type: 'info',
                                title: 'About todo-meter-plus',
                                message: 'todo-meter-plus built with electron, based on cassidoo/todometer',
                                detail: '©copyright ReAlign',
                                buttons: [],
                                icon: path.join(__dirname, 'static/assets/png/64x64.png')
                            });
                        }
                    },
                    {
                        label: `Contribute (v${version})`,
                        click() {
                            shell.openExternal('https://github.com/ReAlign/todo-meter-plus');
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Dev tools',
                        click() {
                            MW.mainWindow.webContents.openDevTools();
                        }
                    },
                    {
                        label: 'Quit',
                        accelerator: 'CommandOrControl+Q',
                        click() {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: 'Language',
                submenu:  MW.getLanguageTpl()
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'delete' },
                    { role: 'selectall' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'togglefullscreen' },
                    { role: 'minimize' },
                    { role: 'hide' },
                    { role: 'close' }
                ]
            }
        ];
    },
    getLanguageTpl() {
        let _base = [
            {
                label: 'English',
                _lang: 'en',
                type: 'radio',
                checked: false,
                click() { MW._setLang('en') }
            },
            {
                label: ' 中文',
                _lang: 'zh-cn',
                type: 'radio',
                checked: false,
                click() { MW._setLang('zh-cn') }
            }
        ];

        const _lang = getData('langLSKey') || 'en';

        _base.forEach(item => {
            if(item._lang === _lang) {
                item.checked = true;
            }
        });

        return _base;
    },
    _setLang(lang = 'en') {
        MW.mainWindow.webContents.send('async-update-lang', {
            'langLSKey': lang
        });
    },
    createWindow() {
        MW.mainWindow = new BrowserWindow({
            width: 800,
            minWidth: 800,
            height: 600,
            fullscreenable: true,
            backgroundColor: '#403F4D',
            icon: path.join(__dirname, 'static/assets/png/128x128.png')
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
        const menu = Menu.buildFromTemplate(MW.menuTpl());
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