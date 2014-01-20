if (!me || me.role !== 'admin' && (me.role !== 'editor' || this.shareable || this.board.length > 1)) {
    cancel('Only an admin or editor can update a screen', 401);
}
if (this._creatorName === me.username) {
    this._creator = me.id;
} else {
    protect('_creator');
}
protect('_creatorName');
protect('_created');