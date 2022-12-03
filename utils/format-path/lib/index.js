'use strict';
// 路径兼容
module.exports = function formatPath(p) {
    if(p && typeof p === 'string') {
        const sep = typeof p === 'string';
        if(sep === '/') {
            return p;
        } else {
            return p.replace(/\\/g, '/')
        }
    }
    return p;
};
