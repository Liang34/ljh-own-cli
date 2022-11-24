'use strict';


const log = require('npmlog');
log.heading = 'LJH';// 修改前缀
// log.headingStyle = { fg: 'red', bg: 'ye'}
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"// 判断debugger
log.addLevel('success', 2000, {fg: 'blue', bg: 'green'})// 添加自定义命令
module.exports = log;