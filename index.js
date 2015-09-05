var serand = require('serand');
var navigation = require('navigation');

var nav;

var render = function () {
    $.ajax({
        url: '/apis/v/menus/1',
        headers: {
            'x-host': 'hub.serandives.com:4000'
        },
        dataType: 'json',
        success: function (data) {
            serand.emit('navigation', 'render', data);
        },
        error: function () {

        }
    });
};

module.exports = function (sandbox, fn, options) {
    navigation(sandbox, fn, options);
    render();
};

serand.on('user', 'logged in', function (usr) {
    render();
});

serand.on('user', 'logged out', function (usr) {
    render();
});