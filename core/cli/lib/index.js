#!/usr/bin/env node

module.exports = core;
// require默认支持js、json、node
// js ---> module.export,exports
// json ---> JSON.parse
// any --> 当成js解析
// node ---> process.dlopen
const pkg = require('../package.json')
const log = require('@ljh-own-cli/log')
const constant = require('./const')
const semver = require('semver');
const colors = require('colors/safe')
const rootCheck = require('root-check');
const userHome = require('user-home'); // 判断用户主目录
const pathExists = require('path-exists');
const path = require('path')
const init = require('@ljh-own-cli/init')
const exec = require('@ljh-own-cli/exec')
let args, config;
const commander = require('commander');
const program = new commander.Command()
async function core() {
    try {
        prepare()
        registerCommand()
    } catch (e) {
        log.error(e.message)
    }
}
async function prepare() {
    checkPkgVersion();
    checkRoot();
    checkUserHome();
    checkEnv()
    await checkGlobalUpdate();
}
// 注册命令
function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否启用调试模式', true);
    // 监听debug
    program.on('option:debug', function () {
        const options = program.opts()
        if (options.debug) {
            process.env.LOG_LEVEL = 'verbose'
        } else {
            process.env.LOG_LEVEL = 'info'
        }
        log.level = process.env.LOG_LEVEL;
        log.verbose('进入调试模式')
    })
    // init命令注册
    program
        .command('init [projectName]')
        .option('-f --force', '是否强制初始化项目', false)
        .option('-tp --targetPath <targetPath>', '是否指定本地调试路径', '')
        .action(exec);
    // 对未知命令的监听
    program.on('command:*', function (obj) {
        const availableCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red('未知的命令：' + obj[0]))
        if (availableCommands.length > 0) {
            console.log(colors.red(`可用的命令${availableCommands.join(',')}`))
        }
    });
    // 打印帮助文档，当不输入时候
    if (program.commands && program.commands.length < 1) {
        program.outputHelp();
        console.log()
    }
    program.parse(process.argv)
}
async function checkGlobalUpdate() {
    // 获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    // 调用npm Api， 获取所有版本号
    const { getNpmSemverVersions } = require('@ljh-own-cli/get-npm-info');
    const lastVersion = await getNpmSemverVersions(currentVersion, npmName)
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion}, 最新版本${lastVersion}`))
    }
    // 提取所有版本号，比对哪些版本号是大于当前版本号
    // 获取最新的版本号，提示用户更新到该版本
}
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        })
    }
    createConfigPath();
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}
function createConfigPath() {
    const cliConfig = {
        home: userHome,
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}
/**
 * 检查入参
 */
// function checkInputArgs() {
//     const minimist = require('minimist');
//     args = minimist(process.argv.slice(2))
//     checkArgs()
// }
// function checkArgs() {
//     if (args.debug) {
//         process.env.LOG_LEVEL = 'verbose'
//     } else {
//         process.env.LOG_LEVEL = 'info'
//     }
//     log.level = process.env.LOG_LEVEL;
// }
/**
 * 检查用户主目录
 */
async function checkUserHome() {
    if (!userHome || !pathExists.sync(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在'));
    }

}
/**
 * 检查是否是root账号
 */
function checkRoot() {
    // windows不支持root-check
    // console.log(process.geteuid())
    rootCheck();
}
/**
 * 检查node版本
 */
function checkNodeVersion() {
    // 第一步L拿到当前node版本号
    const currentVersion = process.version;
    const lowestNodeVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestNodeVersion)) {
        throw new Error(`需要安装${lowestNodeVersion}以上的版本`)
    }
}
/**
 * 检查版本号
 */
function checkPkgVersion() {
    log.notice('cli', pkg.version)
}