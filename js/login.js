"use strict";

function login() {
    var id = document.querySelector('#id');
    var pw = document.querySelector('#pw');

    if(id.value == "" || pw.value == "") {
        alert("ID 또는 Password를 확인해주세요.")
    }
    else {
        location.href = "index.html";
    }
}
