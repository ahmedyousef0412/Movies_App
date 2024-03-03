
function isAdmin(req,res,next){

  if(!req.user.isAdmin) return res.status(403).send({message:'Access Denied'});

  next();
}

module.exports = isAdmin;