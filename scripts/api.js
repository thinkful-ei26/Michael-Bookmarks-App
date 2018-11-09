const api = (function () {
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michael/bookmarks';
    const addBookmark = function (newItem, callback) {
        $.ajax({
        url: BASE_URL,
        contentType: 'application/json',
        method: 'POST',
        data: newItem,
        success: callback,
        error: () => { 
            if(JSON.parse(newItem).title.length > 0){
                console.log('good title');
            }else{
                store.saveError('Title must be vaild');
            } 
            if(JSON.parse(newItem).url.length > 5 && JSON.parse(newItem).url.indexOf('http') > -1){
                console.log('legal url');
            }else{
                store.saveError('url must have http(s):// at the beginning');
            }
            manager.render();
        }
     })   
    }
    const deleteBookmark = function (itemID, callback) {
        $.ajax({
            url: `${BASE_URL}/${itemID}`,
            contentType: 'application/json',
            method: 'DELETE', 
            success: callback,
            error: () => store.saveError("Error the delete method has crashed please contact a system admin.")
         })
    }
    const updateBookmark = function (itemID, newData, callback) {
        console.log(newData);
        $.ajax({            
            url: `${BASE_URL}/${itemID}`,
            contentType: 'application/json',
            method: 'PATCH',
            data: JSON.stringify(newData),
            success: callback,
            error: () => store.saveError("Error the updated information was invalid")
         })
    }
    const getBookmarks = function (callback) {
        $.ajax({
            url: BASE_URL,
            contentType: 'application/json',
            method: 'GET',
            success: callback,
            error: () => store.saveError("Error when retrieving bookmark list")
         })
    }

    return{addBookmark, deleteBookmark,  getBookmarks, updateBookmark}

}());