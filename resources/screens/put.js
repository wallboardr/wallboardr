if (!me || me.role !== 'admin') {
    cancel('Only an admin can update a screen', 401);
}
if (this._creatorName === me.username) {
    this._creator = me.id;
} else {
    protect('_creator');
}
protect('_creatorName');
protect('_created');