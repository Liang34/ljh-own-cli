'use strict';


const Package = require('@ljh-own-cli/package');
const log = require('@ljh-own-cli/log');
const SETTINGS = {
    init: '@ljh-own-cli/init'
}
function exec(command, options, cmdObj) {
    let targetPath = options.targetPath;
    const homePath = process.env.CLI_HOME_PATH;
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)
    if(!targetPath) {
        // 生成缓存路径
        targetPath =' '
    }
    const pkg = new Package({
        targetPath,
        packageName,
        packageVersion
    });
    console.log(pkg.getRootFilePath())
    // 1.targetPath -> modulePath
    // 2.modulePath -> Package(npm模块)
    // 3。Package.getRootFile（获取入口文件）Package.update、Package.install

}
module.exports = exec;