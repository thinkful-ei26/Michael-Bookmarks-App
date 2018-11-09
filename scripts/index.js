$.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    },

  });

$(document).ready(function() {
    manager.bindEventListeners();
    api.getBookmarks((items) => {
        console.log(items);
        items.forEach((item) => {
            const desItem = Object.assign(item,{'details': false},{'edit': false}) 
            store.addBookmark(desItem)
        });
        manager.render();
    })
    
});