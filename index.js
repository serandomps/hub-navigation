var dust = require('dust')();
var serand = require('serand');

var basic = {
    home: {
        url: '/',
        title: 'serandives.com'
    },
    menu: []
};

var main;

var ready = false;

var user;

var context;

var sandbox;

var login = function () {
    var el = $('.hub-navigation', context.sandbox);
    dust.renderSource(require('./user-logged-ui'), user, function (err, out) {
        $('.navbar-right', el).html(out);
    });
    update();
};

var anon = function () {
    var el = $('.hub-navigation', sandbox);
    dust.renderSource(require('./user-anon-ui'), {}, function (err, out) {
        $('.navbar-right', el).html(out);
    });
    update();
};

var render = function (options, done) {
    context.destroy();
    done = done || function () {};
    dust.render('hub-navigation-ui', {
        user: user,
        home: options.home,
        menu: options.menu
    }, function (err, out) {
        if (err) {
            return done(err);
        }
        var el = context.sandbox;
        el.append(out);
        $('.hub-navigation-user-ui', el).on('click', '.logout', function () {
            serand.emit('user', 'logout', user);
        });
        done();
    });
};

dust.loadSource(dust.compile(require('./template'), 'hub-navigation-ui'));

//TODO: fix navigation issue here ruchira
module.exports = function (sandbox, fn, options) {
    var destroy = function () {
        $('.hub-navigation', sandbox).remove();
    };
    context = {
        sandbox: sandbox,
        destroy: destroy
    };
    if (!ready) {
        return;
    }
    if (!user) {
        render(basic, function (err) {
            fn(err, destroy);
        });
        return;
    }
    update(function (err) {
        fn(err, destroy);
    });
};

serand.on('user', 'ready', function (usr) {
    user = usr;
    ready = true;
    if (!context) {
        return;
    }
    user ? login() : anon();
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
    if (!context) {
        return;
    }
    login();
});

serand.on('user', 'logged out', function (usr) {
    user = null;
    main = null;
    if (!context) {
        return;
    }
    anon();
});

//serand.on('hub-navigation', 'render', render);


var update = function (done) {
    $.ajax({
        url: '/apis/v/menus/0',
        dataType: 'json',
        success: function (links) {
            main = links;
            render(main, done);
        },
        error: function () {
            done(true);
        }
    });
};
