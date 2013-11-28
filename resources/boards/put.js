if (!me || me.role !== 'admin') {
    cancel('Only an admin can update a board', 401);
}
protect('_creator');
protect('_creatorName');
protect('_created');