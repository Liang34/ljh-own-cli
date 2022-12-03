'use strict';



const { isObject } = require('@ljh-own-cli/utils')
const pkgDir = require('pkg-dir').sync;
const path = require('path')
const formatPath = require('@ljh-own-cli/format-path')
class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package 类的options参数不能为空')
        }
        if (!isObject(options)) {
            throw new Error('Package 类的options参数必须为对象')
        }
        // path的目标路径
        this.targetPath = options.targetPath
        // // package的存储路径
        // this.storePath = options.storePath;
        // package的name
        this.packageName = options.packageName;
        // package的version
        this.packageVersion = options.packageVersion;
    }
    // 判断package是否存在
    exist() {

    }
    // 安装Package important
    install() {

    }
    // 更新package
    getRootFilePath() {
        //获取Package.json目录， pkg-dir
        const dir = pkgDir(this.targetPath)
        if (dir) {
            // 读取package.json - require()
            const pkgFile = require(path.resolve(dir, 'package.json'));
            // main/lib -path
            if(pkgFile && pkgFile.main) {
                // 路径兼容（macOS /windows）
                return formatPath(path.resolve(dir, pkgFile.main))
            }
        }
        return null
    }

}
module.exports = Package;
