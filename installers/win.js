const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1);
});

function getInstallerConfig()
{
  console.log('Creating win installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'releases');
 
  return Promise.resolve({
    appDirectory: path.join(outPath, 'gelbooru-client-win32-x64'),
    authors: 'KeziahMoselle',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'gelbooru-client.exe',
    setupExe: 'gelbooruClient.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'icon.ico')
  });
}
