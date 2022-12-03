'use strict';
const LOWEST_NODE_VERSION = '12.0.0'
const semver = require('semver');
const colors = require('colors/safe')
const log = require('@ljh-own-cli/log')
class Command {
    constructor(argv) {
        // console.log('command constructor', argv);
        this._argv = argv;
        let runner = new Promise((resolve, reject) => {
            let chain = Promise.resolve()
            chain = chain.then(this.checkNodeVersion); // 检查node版本
            chain = chain.then()
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



