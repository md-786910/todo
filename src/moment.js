const moment = require('moment')

function timeDateFormat() {

    return {
        time: moment().startOf("hours").fromNow(),
        date: moment().format("MMM Do YY")
    }


}
module.exports = timeDateFormat