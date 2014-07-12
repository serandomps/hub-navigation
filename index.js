var navigation = require('navigation');

var nav;

module.exports = function (sandbox, fn, options) {
    $.ajax({
        url: '/apis/v/menus/1',
        headers: {
            'x-host': 'hub.serandives.com:4000'
        },
        dataType: 'json',
        success: function (data) {
            navigation(sandbox, fn, data);
        },
        error: function () {
            fn(true, function () {

            });
        }
    });
};

//TODO: add wraper div to the layout and pass that as the sandbox