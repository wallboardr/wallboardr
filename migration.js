db.copyDatabase('wallboardr', 'bkpwallboardr');
db.screens.find().forEach(function(doc){ var id=doc._id; if(id.str){doc._id=id.str; db.screens.insert(doc); db.screens.remove({_id:id})} });
db.boards.find().forEach(function(doc){ var id=doc._id; if(id.str){doc._id=id.str; db.boards.remove({_id:id}); db.boards.insert(doc);} });