// On GET
// /shared-screens/:boardId
var boardId = parts[0],
    where = {'shareable': true, 'board': {'$ne': boardId}};
if (!boardId) {
    cancel('No board specified');
}
dpd.screens.get(where, setResult);