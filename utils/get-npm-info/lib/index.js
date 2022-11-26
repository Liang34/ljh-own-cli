
module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersions
};
const urlJoin = require('url-join');
const axios = require('axios');
const semver = require('semver');
/**
 * 获取npm包信息
 * @param {*} npmName 
 * @param {*} registy 
 * @returns 
 */
function getNpmInfo(npmName, registy) {
    if(!npmName) return null;
    const registryUrl = registy || getDefaultRegistry();
    const npmInfoUrl =  urlJoin(registryUrl, npmName);
    return axios.get(npmInfoUrl).then(res => {
        if(res.status === 200) {
            return res.data;
        }
        return null;
    }).catch(err => {
        return Promise.reject(err)
    })
}
async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    const versions = Object.keys(data.versions);
    return versions
}
function getSemverVersions(baseVersion,  versions) {
    return versions.filter(version => semver.satisfies(version, `>=${baseVersion}`)).reverse()
    // return filterArr.sort((a, b) => semver.gt(b, a))// youbug

}
async function getNpmSemverVersions(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry);
    const newVersions = getSemverVersions(baseVersion, versions)
    if(newVersions && newVersions.length > 0) {
        return newVersions[0];
    }
    return null
}
function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org/' : 'https://registry.npmmirror.com/'
}