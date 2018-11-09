




const manager = (function () {

  function generateAddView(){
    $('.addView').html(`
    <form class="addForm">
    <label for="title">Title</label>
    <br>
    <input aria-label="Enter title of bookmark to add" type="text" name="title">
    <br>
    <label for="url">URL</label>
    <br>
    <input aria-label="Enter u r l of bookmark to add" type="text" name="url">
    <br>
    <label for="desc">Description</label>
    <br>
    <input aria-label="Enter description of bookmark to add" type="text" name="desc" value="description">
    <br>
    <label for="rating">Rating</label>
    <br>
    <input aria-label="Enter rating of bookmark to add" type="text" name="rating" value="1">
    <br>
    <button aria-label="submit bookmark form" type="submit" >Submit</button>
    </form>`);
  }

  const filterStars = function () {
    $('.select-filter').change(()=> {
      render();
    })
  }

  function resetView(){
    $('.addView').html(`
    <form>
    </form>`);
  }

  function starGenerator(number) {
    const temp = [];
    for (let index = 0; index < number; index++) {
      temp[index] = '<img class="js-edit-rating" src="star.png" width="40" hieght="40" alt="star"></img>'
    }
    return temp.join('');
  } 

  function generateBookElement(bookmark) {
    if(bookmark.rating < $('.select-filter').val()){
      return ' '
    }
    let bookmarkDescription = bookmark.desc;
    let ratingDescription = starGenerator(bookmark.rating);
    if (bookmark.edit) {
      bookmarkDescription = `
        <form class="js-edit-desc">
          <input aria-label="Editing Active: edit description and press enter or reclick the edit button to cancel" class="bookmark-desc" type="text" value="${bookmark.desc}" />
        </form>
      `;
      ratingDescription = `<form class="js-edit-rating">
      <input aria-label="Editing Active: edit rating and press enter or reclick the edit button to cancel" class="bookmark-rating" type="text" value="${bookmark.rating}" />
    </form>`;
    }


    const checkedClass = bookmark.details ? `<h3>Details: </h3><span>${bookmarkDescription}</span> ` : '';
    const moreInfo = bookmark.details ? `<h3>Visit Site: </h3><span>${bookmark.url}</span>` : '';
    const editButton = bookmark.details ? `<button aria-label="Edit bookmark" class="bookmark-item-edit">
    <span class="button-label">Edit</span>
    </button><button aria-label="Delete bookmark" class="bookmark-item-delete">
    <span class="button-label">Delete</span>
    </button><img class="bookImg" alt="book cover" src="https://timedotcom.files.wordpress.com/2015/06/521811839-copy.jpg">` : '';

    return `
    <li aria-label="${bookmark.title}" class="bookmark-element" data-item-id="${bookmark.id}">
      <h2>${bookmark.title}</h2>
      ${ratingDescription}
      <div class="bookmark-item-controls">
        <button aria-label="Expand bookmark to show the description plus edit and delete functions" class="bookmark-item-toggle">
          <span class="button-label">Details</span>
        </button>
        <br>
        <br>
        ${editButton}
        <br>
        ${checkedClass}
        <br>
        ${moreInfo} 
      </div>
    </li>`;
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.bookmark-element')
      .data('item-id');
  }

  const handleNewBookmark = function () {
    $('.addView').on('submit' , '.addForm', event => {
      event.preventDefault();
      let temp = $(event.target).serializeJson();
      const revamp = JSON.parse(temp);
      if(!revamp.rating){
        revamp.rating = 1;
        temp = JSON.stringify(revamp);
      }
      if(revamp.rating > 5){
        revamp.rating = 5;
        temp = JSON.stringify(revamp);
      }
      api.addBookmark(temp, response => {
        store.addBookmark(response);
        render();
      })
    });
  }

  const handleViewChange = function (){
    $('.addViewButton').click(event => {
      store.addView = !store.addView;
      render();
    }); 
  }

  const handleEditBookmark = function () {
    //listen
    $('.bookmark-list').on('click', '.bookmark-item-edit', event => {
      const id = getItemIdFromElement(event.currentTarget);
      store.setEdit(id);
      render();
    })
  }

  const handleSubmitEdits = function () {
    $('.bookmark-list').on('submit', '.js-edit-desc', event => { 
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      api.updateBookmark(id, {'desc': $(event.currentTarget).find('.bookmark-desc').val() , 'rating': $('.bookmark-list').find('.bookmark-rating').val()}, () => {
        store.updateBookmark(id, {'desc': $(event.currentTarget).find('.bookmark-desc').val() , 'rating': $('.bookmark-list').find('.bookmark-rating').val()});
        store.setEdit(id);
        render();
      } )
    });
    $('.bookmark-list').on('submit', '.js-edit-rating', event => { 
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      api.updateBookmark(id, {'desc': $('.bookmark-list').find('.bookmark-desc').val() , 'rating': $(event.currentTarget).find('.bookmark-rating').val()}, () => {
        store.updateBookmark(id, {'desc': $('.bookmark-list').find('.bookmark-desc').val() , 'rating': $(event.currentTarget).find('.bookmark-rating').val()});
        store.setEdit(id);
        render();
      } )
    });
  }

  const handleDetailsBookmark = function () {
    
    $('.bookmark-list').on('click', '.bookmark-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      store.detailBookmark(id);
      render();
    })

  }

  const handleDeleteBookmark = function () {
    //listen
    $('.bookmark-list').on('click', '.bookmark-item-delete', event => {
      const id = getItemIdFromElement(event.currentTarget);
      api.deleteBookmark(id, ()=>{
        store.findAndDelete(id);
        render();
      })
    })
  }

  const render = function () {
  //render after successfull callbacks and changes
  let bookmarks = [...store.bookmarks];
  const bookmarkListString = generateBookmarkedBooksString(bookmarks);
  $('.bookmark-list').html(bookmarkListString);
  if(store.addView === true){
    generateAddView();
  }else{
    resetView();
  }
  }

  const generateBookmarkedBooksString = function (bookmarkList) {
    const items = bookmarkList.map((item) => generateBookElement(item));
    return items.join('');
  }

  const bindEventListeners = function () {
    handleViewChange();
    handleNewBookmark();
    handleDeleteBookmark();
    handleDetailsBookmark();
    handleEditBookmark();
    filterStars();
    handleSubmitEdits();
  }
  

  return{generateBookmarkedBooksString, render, bindEventListeners}

}());

