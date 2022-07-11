var myGirlFriendApi = 'http://localhost:3000/myGirlFriend'
var listPost = document.querySelector('#list-post');
var caption = document.querySelector('input[name="caption"]');
var imageLink = document.querySelector('input[name="imagelink"]');
var createBtn = document.querySelector('#create');
function start() {
    getData(renderHTML);
    handlerCreateForm();
}
start();

//render data to html
function getData(callback) {
    fetch(myGirlFriendApi)
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}
function renderHTML(posts) {
    
    var html = posts.map(function (post) {
        return `
            <li class="caption-item-${post.id}">
                <h3>${post.caption}</h3>
                <img src="${post.imageLink}">
                <button onclick = "handleDeleteCaption(${post.id})">Xoá</button>
                <button onclick = "handleUpdateCaption(${post.id})">Chỉnh sửa</button>
            </li>
        `;
    })
    listPost.innerHTML = html.join('');
}
//END
// function create caption
function handlerCreateForm () {
// Nhận giá trị từ input ròi tạo formData gọi hàm createCaption để tạo html
    // var createBtn = document.querySelector('#create');
    createBtn.onclick = function () {
        // var caption = document.querySelector('input[name="caption"]');
        // var imageLink = document.querySelector('input[name="imagelink"]');
        var formData = {
            caption: caption.value,
            imageLink: imageLink.value
        }
        caption.value = '';
        imageLink.value = '';
// Khai báo thẻ ul là biến global rồi inner thẻ mới vào thì không cần phải gọi lại API
        createCaption(formData, function (data) {
            listPost.innerHTML += `
            <li class="caption-item-${data.id}">
                <h3>${data.caption}</h3>
                <img src="${data.imageLink}"">
                <button onclick = "handleDeleteCaption(${data.id})">Xoá</button>
                <button onclick = "handleUpdateCaption(${data.id})">Chỉnh sửa</button>
            </li>
        `
        const element = document.querySelector('.caption-item-'+data.id);
        element.scrollIntoView({behavior: "smooth"});
        })
    }
}
function createCaption (data, callback) {
    // PoST data vào json trả về data vừa post lên
    var option = {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(data)
    }
    fetch(myGirlFriendApi, option)
        .then(function (responses) { return responses.json(); })
        .then(callback);
}
// END
// function delete 
function handleDeleteCaption (id) {
    var option = {
        method : 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          }
    }
    fetch(myGirlFriendApi + '/' + id, option)
        // .then(function (responses) { return responses.json(); })
        .then(function () {
            var captionItem = document.querySelector('.caption-item-'+id);
            if(captionItem) {
                captionItem.remove();
            }
        });
}
//function update
function handleUpdateCaption (id) {
    const element = document.querySelector('.caption-item-'+id);;
    const tagH3 = element.querySelector('h3');
    const tagImg = element.querySelector('img');
    createBtn.innerText = 'Save'
    valueTagH3 = tagH3.innerText;
    srcImg = tagImg.src;
    caption.value = `${valueTagH3}`;
    imageLink.value = `${srcImg}`;
    var newValueH3,newSrcImg;
    caption.addEventListener("change", function(e) {
        newValueH3 = e.target.value;
    })
    imageLink.addEventListener('change', function(e) {
        newSrcImg = e.target.value;
    });
    createBtn.onclick = function() {
    updateCaption({
        caption: newValueH3,
        imageLink: newSrcImg
    },id,tagH3,tagImg);
}
}
function updateCaption (data,id,tagH3,tagImg) {
    var option = {
        method : 'PATCH',
        headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(data)
    }
    fetch(myGirlFriendApi+'/'+id, option)
    .then(function(response){
        return response.json()
    })
    .then (function(data) {
        tagH3.innerText = data.caption;
        tagImg.src = data.imageLink;
    })
    caption.value = '';
    imageLink.value = '';
    createBtn.innerText = 'Create'
 }