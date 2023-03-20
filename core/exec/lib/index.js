'use strict';


const Package = require('@ljh-own-cli/package');
const log = require('@ljh-own-cli/log');
const CACHE_DIR = 'dependencies/';
const path = require('path');
const cp = require('child_process');

const SETTINGS = {
    init: '@ljh-own-cli/init'
}
async function exec(command, options, cmdObj) {
    let targetPath = options.targetPath;
    const homePath = process.env.CLI_HOME_PATH;
    let storeDir = '';
    let pkg;
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)
    if (!targetPath) {
        // 生成缓存路径
        targetPath = path.resolve(homePath, CACHE_DIR) // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules');
        log.verbose('targetPath', targetPath)
        log.verbose('storeDir', storeDir)
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
            storeDir
        });
        if (await pkg.exist()) {
            // 更新
            await pkg.update()
        } else {
            // 安装
            await pkg.install()
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion,
        });
    }
    const rootFile = pkg.getRootFilePath()
    
    if(rootFile) {
        try{
            // 当前进程调用
            // require(rootFile)(command, options, cmdObj);
            
            const cmd = Object.create(null);
            Object.keys(cmdObj).forEach(key => {
                if(cmdObj.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent') {
                    cmd[key] = cmdObj[key]
                }
            })
            const code = `require('${rootFile}')(${JSON.stringify([command, options, cmd])})`
            const child = spawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit',
            })
            child.on('error', e => {
                log.error(e.message);
                process.exit(1)
            })
            child.on('exit', e => {
                log.error('进程结束')
            })
        } catch(e) {
            log.error(e.message)
        }
    }
    // 1.targetPath -> modulePath
    // 2.modulePath -> Package(npm模块)
    // 3。Package.getRootFile（获取入口文件）Package.update、Package.install

}
// 系统找不到指定的文件。
// function spawn (command, args, options) {
//     const win32 = process.platform === 'win32';
//     const cmd = win32 ? 'cmd': command;
//     const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
//     return cp.spawn(cmd, cmdArgs, options || {});
// }
module.exports = exec;