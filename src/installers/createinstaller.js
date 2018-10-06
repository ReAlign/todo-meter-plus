const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error);
        process.exit(1);
    });

function getInstallerConfig() {
    console.log('creating windows installer');
    const rootPath = path.join('./');
    const outPath = path.join(rootPath, 'release-builds');

    return Promise.resolve({
        appDirectory: path.join(outPath, 'todo-meter-plus-win32-ia32/'),
        authors: 'ReAlign',
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'todo-meter-plus.exe',
        setupExe: 'todo-meter-plus-installer.exe',
        setupIcon: path.join(rootPath, 'static', 'assets', 'win', 'icon.png.ico'),
        skipUpdateIcon: true,
        versionString: {
            FileDescription: 'todo-meter-plus by electron, based on cassidoo/todometer',
            ProductName: 'todo-meter-plus'
        }
    });
}