'use strict';


const Package = require('@ljh-own-cli/package');
const log = require('@ljh-own-cli/log');
const CACHE_DIR = 'dependencies/';
const path = require('path');
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
        require(rootFile)(command, options, cmdObj);
    }
    // 1.targetPath -> modulePath
    // 2.modulePath -> Package(npm模块)
    // 3。Package.getRootFile（获取入口文件）Package.update、Package.install

}
module.exports = exec;