/**
 * @description Main Controller
 */
exports.main = function(req, res, next){
	res.render('index', { title: 'Haiku Experience' });
};
