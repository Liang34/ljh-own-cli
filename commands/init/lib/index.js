
const Command = require('@ljh-own-cli/command');
const log = require('@ljh-own-cli/log');
class initCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force
        log.verbose('projectName', this.projectName);
        log.verbose('force', this.force)
    }
}


function init(...argv) {
    return new initCommand(argv);
}
module.exports = init
module.exports.initCommand = initCommand;