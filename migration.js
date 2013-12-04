db.copyDatabase('wallboardr', 'bkpwallboardr');
db.screens.find().forEach(function(doc){ var id=doc._id; if(id.str){doc._id=id.str; db.screens.insert(doc); db.screens.remove({_id:id})} });
db.boards.find().forEach(function(doc){ var id=doc._id; if(id.str){doc._id=id.str; db.boards.remove({_id:id}); db.boards.insert(doc);} });
db.screens.update({type:'local'},{$set:{type:'message'}},{multi:true});
db.users.find().forEach(function(doc){db.users.remove(doc);});
db.screens.find({type:'message'}).forEach(function(doc){db.screens.update({_id:doc._id},{$set:{data:{message:doc.message}}})});
db.screens.find().forEach(function(doc){db.screens.update({_id:doc._id},{$unset:{message:''}})});