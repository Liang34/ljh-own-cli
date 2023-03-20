'use strict';



const { isObject } = require('@ljh-own-cli/utils')
const pkgDir = require('pkg-dir').sync;
const path = require('path')
const formatPath = require('@ljh-own-cli/format-path')
const npminstall = require('npminstall');
const pathExists = require('path-exists')
const fsExtra = require('fs-extra');
const { getDefaultRegistry, getNpmLatestVersion } = require('@ljh-own-cli/get-npm-info')
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
        this.storePath = options.storeDir;
        // package的name
        this.packageName = options.packageName;
        // package的version
        this.packageVersion = options.packageVersion;
        // package缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_')
    }
    async prepare() {
        if (this.storePath && !pathExists(this.storePath)) {
            fsExtra.mkdirSync(this.storeDir) // 解决目录不存在
        }
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName)
        }
    }
    // 判断package是否存在
    async exist() {
        if (this.storePath) {
            await this.prepare();
            return pathExists(this.cacheFilePath)
        } else {
            return pathExists(this.targetPath)
        }

    }
    getSpecifiCacheFilePath(packageVersion) {
        return path.resolve(this.storePath, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`)
    }
    get cacheFilePath() {
        return path.resolve(this.storePath, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`)
    }
    // 安装Package important
    async install() {
        await this.prepare()
        return npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: getDefaultRegistry(),
            pkgs: [
                {
                    name: this.packageName,
                    version: this.packageVersion
                }
            ]
        })
    }
    // 更新package
    async update() {
        await this.prepare()
        // 获取最新的版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName)
        // 查询最新版本号的路径是否存在
        const latestFilePath = this.getSpecifiCacheFilePath(latestPackageVersion)
        // 不存在则安装
        if (!pathExists(latestFilePath)) {
            await npminstall({
                root: this.targetPath,
                storeDir: this.storeDir,
                registry: getDefaultRegistry(),
                pkgs: [
                    {
                        name: this.packageName,
                        version: latestFilePath
                    }
                ]
            })
            this.packageVersion = latestPackageVersion
        }
    }
    getRootFilePath() {
        function _getRootFile(targetPath) {
            //获取Package.json目录， pkg-dir
            const dir = pkgDir(targetPath)
            if (dir) {
                // 读取package.json - require()
                const pkgFile = require(path.resolve(dir, 'package.json'));
                // main/lib -path
                if (pkgFile && pkgFile.main) {
                    // 路径兼容（macOS /windows）
                    return formatPath(path.resolve(dir, pkgFile.main))
                }
            }
            return null
        }
        if (this.storePath) {
            return _getRootFile(this.cacheFilePath)
        } else {
            return _getRootFile(this.targetPath)
        }
    }
    
}
module.exports = Package;
