
const inputtitle = document.getElementById("inputtitle");
const inputdesc = document.getElementById("inputdesc");
const submit = document.getElementById("submit");


let { title, desc } = Qs.parse(location.search.slice(1));
console.log(title, desc)

// set data to localStorage
if (title == undefined || desc == undefined) {
    alert("undefined")
}
else {

    if (localStorage.getItem("item") == null) {
        let arr = [];
        arr.push([title, desc]);
        localStorage.setItem("item", JSON.stringify(arr))

    }
    else {

        arr = JSON.parse(localStorage.getItem("item"));
        arr.push([title, desc]);
        localStorage.setItem("item", JSON.stringify(arr))

    }
}


function update() {

    // get all item from localstorage

    let allCard = document.querySelector(".allCard");

    // console.log(arr)

    let str = "";
    arr = JSON.parse(localStorage.getItem("item"));
    arr.forEach(function (elem, ind) {
        str += `
    <div class="card">
    <div class="title">
        <h3><b>title:</b></h3>
        <p>${elem[0]}.</p>
    </div>
    <div class="desc">
        <h3><b>desc:</b></h3>
        <p>${elem[1]}.</p>
    </div>
    <div class="btn">
        <button class="Delete" onClick="DeleteOne(${ind})"><img class="event" src="./image/delete.png"></button>
        <button class="Edit "><a href="/add"><img class="event" src="./image/edit.png"></a></button>
    </div>
    </div>
    `
    });
    allCard.insertAdjacentHTML("afterbegin", str)

    // alert("update")
}
// define Delete button
function DeleteOne(index) {

    let arr = JSON.parse(localStorage.getItem("item"));

    arr.splice(index, 1);

    localStorage.setItem("item", JSON.stringify(arr))

    update();

}

update();


