// for brger menu
let burger=document.querySelector(".burger");
let getLine=document.querySelectorAll(".burger span");
let nav=document.querySelector("nav");
burger.addEventListener('click',function(){

  burger.classList.toggle("burger-act");//for fixed position
  nav.classList.toggle("deactive-nav");//for show navbar
  getLine.forEach((elem,indeks)=>{
    elem.classList.toggle(`line${indeks+1}`);//for animate line burger
  });
});

let getImage=document.getElementById('input-blog-image');
let text=document.querySelector(".input-blog-image-group p");
getImage.addEventListener('change',function(e){
  let string=e.target.value.replace('C:\\fakepath\\','test');
  text.innerHTML=string;
})

let bs=document.getElementById('image');
bs.addEventListener('change',function(e){
  console.log(e.target.value);
})
