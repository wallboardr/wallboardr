if (!me || me.role !== 'admin') {
    cancel('Only an admin can create a screen', 401);
}
this._creator = me.id;
this._creatorName = me.username;
this._created = Date.now();