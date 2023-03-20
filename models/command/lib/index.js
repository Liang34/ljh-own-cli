'use strict';
const LOWEST_NODE_VERSION = '12.0.0'
const semver = require('semver');
const colors = require('colors/safe')
const log = require('@ljh-own-cli/log')
const utils = require('@ljh-own-cli/utils')
class Command {
    constructor(argv) {
        this._argv = argv;
        if(!argv) {
            log.error('参数不能为空');
            throw new Error('参数不能为空')
        }
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve()
            chain = chain.then(this.checkNodeVersion); // 检查node版本
            chain = chain.then(this.initArgs());
            chain = chain.then(() => this.init());
            chain = chain.then(() => this.exec());
            chain.catch(err => {
                log.error(err.message)
            })
        })
    }
    init() {
        throw new Error('init必须要实现')
    }
    exec() {
        throw new Error('exec必须要实现')
    }
    /**
     * 初始化参数
     */
    initArgs() {
        this._cmd = this._argv[this._argv.length - 1];
        this._argv = this._argv.slice(0, this._argv.length - 1);
        console.log(this._cmd, this._argv)
    }
    /**
 * 检查node版本
 */
    checkNodeVersion() {
        // 第一步L拿到当前node版本号
        const currentVersion = process.version;
        const lowestNodeVersion = LOWEST_NODE_VERSION;
        if (!semver.gte(currentVersion, lowestNodeVersion)) {
            throw new Error(colors.red(`需要安装${lowestNodeVersion}以上的版本`))
        }
    }
}

module.exports = Command;



