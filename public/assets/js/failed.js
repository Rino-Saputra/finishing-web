let getRegister=document.querySelector(".failed-message .register");
let getContaier=document.querySelector('.failed-login');
let btn=document.querySelector('.failed-login button');
let getClose=document.querySelector('#close-txt');
console.log(getClose);
console.log(btn);

//active modal bx
getRegister.addEventListener('click',function(e){
    e.preventDefault();
    let modal_=document.querySelector(".modal-box");
    getContaier.style.display='none';
    modal_.style.display="flex";
});

//close modalbx
btn.addEventListener('click',()=>getContaier.style.display='none');
getClose.addEventListener('click',()=>getContaier.style.display='none');