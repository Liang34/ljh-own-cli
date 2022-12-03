
const Command = require('@ljh-own-cli/command');
class initCommand extends Command {

}


function init(...argv) {
    console.log(argv)
    return new initCommand(argv);
}
module.exports = init
module.exports.initCommand = initCommand;