;(function() {
  'use strict';

  //создаем БД для работы с поиском
  const searchBase = [];
  const searchInput = document.querySelector('#search-input');
  const closeBtn = document.querySelector('.search-close');


  fillUpDB(); //вытаскиваем из общей БД все группы, подгруппы и марки товара и ложим в БД поиска

  //отслеживаем изменение поиска
  searchInput.oninput = function(){
    const searchItems = document.querySelectorAll('.search-link');
    const val = this.value.trim().toLowerCase()

    if(val !== '' && val.length>1) {  //если поле поиска не пустое

      searchItems.forEach(function(elem){
        const aValue = elem.innerText.toLowerCase()
        const pos = aValue.search(val)
  
        if(pos == -1) { //нет совпадений
          elem.innerHTML = elem.innerText;     //очищаем на всякий случай тег mark
          elem.parentElement.style.display="none";
        }
        else { //есть совпадения
          elem.parentElement.style.display="block";
          let str = elem.innerText;
          elem.innerHTML = insertMark(str, pos, val.length);
        } 
      })
      closeBtn.style.display="block"
    }
    else {  //если поле очищено
      searchItems.forEach(function(elem){
        elem.parentElement.style.display="none";
        elem.innerHTML = elem.innerText;//убираем все теги mark
        closeBtn.style.display="none"//прячем кнопку
      })
    }
  }

    //отрисовываем лист поиска
    View.getSearchList(searchBase);


    // закрытие поиска по кнопке
    closeBtn.addEventListener("click", function(){
      const searchItems = document.querySelectorAll('.search-link');

      searchInput.value ='';
      for (let i=0; i < searchItems.length; i++) {
        const item = searchItems[i]
        item.innerHTML = item.innerText;
        item.parentElement.style.display="none";
      }
      closeBtn.style.display="none";
    })
 
    //закрытие поиска при переходе по ссылке
    const searchLiItems = document.querySelectorAll('.search-item');
    for(const item of searchLiItems) {
      item.addEventListener('click', function(){
        for(const li of searchLiItems) {
          const link = li.querySelectorAll('.search-link')
          li.style.display="none";
          link.innerHTML = link.innerText;
          searchInput.value ='';
          closeBtn.style.display="none";
        }
      })
    }

  pressEnter();

    
  function pressEnter(){
    searchInput.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    });
  }
  function fillUpDB() {
    const products = Model.getProducts();

    for(const product of products) {
      const array = [];
      array.push(product.group);
      array.push('catalog.html');
      array.push(product.anchor);//пушим якорь
      searchBase.push(array)
  
      for(const item of product.options) {
        const arr = [];
        arr.push(item.title);
        arr.push(`products.html?id=${item.id}`);
        arr.push(item.anchor);
        searchBase.push(arr)
  
        if(item.variety) {
          for(const i of item.variety) {
            const arr = [];
            arr.push(i.subtitle)
            arr.push(`products.html?id=${item.id}`);
            arr.push(i.anchor);
            searchBase.push(arr)
          }
        }
      }
    }
  }
  function insertMark(string,pos,len){
    return string.slice(0, pos)+'<mark>'+string.slice(pos, pos+len)+'</mark>'+string.slice(pos+len);
  }

})();