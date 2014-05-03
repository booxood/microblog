exports = module.exports = function() {
    return function viewHelpers(req, res, next) {
        res.locals.errorF = function() {
            var err = req.flash('error');
            if (err.length)
                return err;
            else
                return null;
        };
        res.locals.successF = function() {
            var succ = req.flash('success');
            if (succ.length)
                return succ;
            else
                return null;
        };
        next();
    }
}