const store = (function () {
    const bookmarks = [];
    const addView = false;
    const addBookmark = function (data) {
        bookmarks.push(data);
    }

    const setEdit = function (id) {
        const itemIndex = bookmarks.findIndex(element => element.id === id );
        bookmarks[itemIndex].edit = !bookmarks[itemIndex].edit;
    }

    const detailBookmark = function (id) {
        const itemIndex = bookmarks.findIndex(element => element.id === id );
        bookmarks[itemIndex].details = !bookmarks[itemIndex].details; 
    }
    const updateBookmark = function (id, newData) {
        const itemIndex = bookmarks.findIndex(element => element.id === id );
        bookmarks[itemIndex] = Object.assign(bookmarks[itemIndex] ,newData);
    }
    const findAndDelete = function (id) {
        //predicate functions
        const itemIndex = bookmarks.findIndex(element => element.id === id );
        bookmarks.splice(itemIndex, 1);
    }

    return{bookmarks, addBookmark, addView,findAndDelete,detailBookmark,setEdit,updateBookmark}
}())