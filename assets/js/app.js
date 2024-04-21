let cl = console.log;

const loginForm = document.getElementById("loginForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const postContainer = document.getElementById("postContainer");
const loader = document.getElementById("loader");

const baseUrl = `https://jsonplaceholder.typicode.com`;

const postUrl = `${baseUrl}/posts`;

const snackBarMsg = (msg,iconName,timer) => {
     Swal.fire({
        title : msg,
        icon : iconName,
        timer : timer
    })
}

const templating = (arr) => {
    postContainer.innerHTML = arr.map(obj => {
        return`
                <div class="card mb-4" id="${obj.id}">
                    <div class="card-header bg-info text-white">
                        <h3>${obj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                </div>
        
        `
    }).join("");
}

const addCard = (ele) => {
    let card = document.createElement("div");
    card.id = ele.id;
    card.className = `card mb-4`;
    card.innerHTML = `
    
                    <div class="card-header bg-info text-white">
                        <h3>${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${ele.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
    `
    postContainer.prepend(card);
}
const makeApiCall = (methodName,apiUrl,msgBody) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodName,apiUrl);
    xhr.setRequestHeader(`Content-type`, "application/json");
    xhr.setRequestHeader(`Authrization`,"Brear Token from Local Storage");
    xhr.send(JSON.stringify(msgBody));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response)
            let res = JSON.parse(xhr.response);
            cl(res)
            if(methodName === "GET"){
                if(Array.isArray(res)){
                    templating(res)
                }else{
                    titleControl.value = res.title;
                    contentControl.value = res.body;
                    userIdControl.value = res.userId;
                    updateBtn.classList.remove("d-none");
                    submitBtn.classList.add("d-none");
                    loader.classList.add("d-none");
                    window.scrollTo(0,0);
                }
            }if(methodName === "POST"){
              
                msgBody.id = res.id;
                cl(msgBody)
                addCard(res);
                loginForm.reset();
                loader.classList.add("d-none");
                snackBarMsg(`New Post ${res.title} is Added Successfully..!!`,`success`,1500);
               
            }if(methodName === "PATCH"){
                loginForm.reset();
                updateBtn.classList.add("d-none");
                submitBtn.classList.remove("d-none");
                let card = [...document.getElementById(res.id).children];
                card[0].innerHTML = ` <h3>${res.title}</h3>`;
                card[1].innerHTML = ` <p>${res.content}</p>`;
                cl(card);
                loader.classList.add("d-none");
                snackBarMsg(`The Post ${res.title} is Updated Successfully..!!`,`success`,1500);
            }else if(methodName === "DELETE"){
                let id = localStorage.getItem("deleteId");
                document.getElementById(id).remove();
                loader.classList.add("d-none");
                snackBarMsg(`Post deleted successfully..!!`,`success`,1500)
               
                
            }
        }
    }
}

makeApiCall("GET",postUrl)

const onAdd = (ele) => {
    ele.preventDefault();
    let newObj = {
        title : titleControl.value,
        content : contentControl.value,
        userId : userIdControl.value
    }
    cl(newObj)
    loader.classList.remove("d-none");
    makeApiCall("POST",postUrl,newObj);
  
}

const onEdit = (ele) => {
    let editId = ele.closest(".card").id;
    cl(editId);
    localStorage.setItem("editId",editId)
    let editUrl = `${baseUrl}/posts/${editId}`;
    cl(editUrl);
    loader.classList.remove("d-none");
    makeApiCall("GET",editUrl)
    // loader.classList.add("d-none");
}

const onUpdate = (ele) => {
    let updatedId = localStorage.getItem("editId");
    cl(updatedId);
    let updatedUrl = `${baseUrl}/posts/${updatedId}`;
    cl(updatedUrl);
    let updatedObj = {
        title : titleControl.value,
        content : contentControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj);
    loader.classList.remove("d-none");
    makeApiCall("PATCH",updatedUrl,updatedObj);
    
}

const onDelete = (ele) => {
    let deletId = ele.closest(`.card`).id;
    localStorage.setItem("deleteId",deletId);
    let deleteUrl = `${baseUrl}/posts/${deletId}`;
   
   
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            loader.classList.remove("d-none");
            makeApiCall("DELETE",deleteUrl);
        }
      });
      loader.classList.add("d-none");
}

loginForm.addEventListener("submit",onAdd);
updateBtn.addEventListener("click",onUpdate);