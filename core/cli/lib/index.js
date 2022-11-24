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
const pathExists= require('path-exists');
const path = require('path')
let args, config;
function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        checkEnv();
    } catch(e) {
        log.error(e.message)
    }
}
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome, '.env');
    if(pathExists(dotenvPath)) {
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
    if(process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}
/**
 * 检查入参
 */
function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2))
    checkArgs()
}
function checkArgs() {
    if(args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL;
}
/**
 * 检查用户主目录
 */
 async function checkUserHome () {
    if(!userHome || !pathExists.sync(userHome)) {
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
    if(!semver.gte(currentVersion, lowestNodeVersion)) {
        throw new Error(`需要安装${lowestNodeVersion}以上的版本`)
    }
}
/**
 * 检查版本号
 */
function checkPkgVersion() {
    log.notice('cli', pkg.version)
}