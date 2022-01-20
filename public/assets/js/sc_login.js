let bar_span=document.querySelectorAll(".image span");
let image=document.querySelector(".image");
let burger=document.querySelector(".image ul");
let click_burger=document.querySelector(".image .menu");
let txt=document.querySelector('.text');
let lrgText=document.querySelector('.lrg-text');
bar_span[1].classList.toggle("change");
bar_span.forEach(function(e,i){
    setInterval(() => {
        e.classList.toggle("change");
        if(bar_span[0].classList.contains("change")){
            image.style.backgroundImage="url('../public/assets/image/bg1.png')";
            txt.textContent='Or try blog of';
            lrgText.textContent="Fashion";
        }
        else{
            image.style.backgroundImage="url('../public/assets/image/bg2.png')";
            txt.textContent='Try make blog history of';
            lrgText.textContent="Chinese";
        }
    }, 4000);
});

click_burger.addEventListener('click',function(){
    click_burger.classList.toggle("active");
    if(click_burger.classList.contains("active")){
        burger.style.opacity="1";
    }
    else{
        burger.style.opacity="0";
    }
});

//show pasword power
let getPassword=document.querySelector(".pw");
let getBar=document.querySelectorAll(".cont-strong span");
let passowrdStrong=0;
getPassword.addEventListener('input',function(e){
    // if(password.length<8){return 'passowrd length at least 8 chracter'}
    for(let i=0; i<e.target.value.length; i++){
        if( e.target.value[i]>='a' && e.target.value[i]<='z' ){
            getBar[0].style.backgroundColor="rgb(169, 132, 255)";
            getBar[4].style.color="rgb(169, 132, 255)";
            passowrdStrong++;
        }
        else if(e.target.value[i]>='A' && e.target.value[i]<='Z'){
            getBar[1].style.backgroundColor="rgb(169, 132, 255)";
            passowrdStrong++;
        }
        else if(e.target.value[i]>='0'&& e.target.value[i]<='9'){
            getBar[2].style.backgroundColor="rgb(169, 132, 255)";
            passowrdStrong++;
        }
        else if( (e.target.value[i]>='!' && e.target.value[i]<='/') || (e.target.value[i]>=':' && e.target.value[i]<'A') 
                (e.target.value[i]>='[' && e.target.value[i]<='`') || (e.target.value[i]>='{'&& e.target.value[i]<='~')){
            getBar[3].style.backgroundColor="rgb(169, 132, 255)";
            passowrdStrong++;
        }
    }
    if(passowrdStrong==1){
        getBar[4].innerHTML="Weak";
    }
    else if(passowrdStrong==2){
        getBar[4].innerHTML="Still Weak";
    }
    else if(passowrdStrong==3){
        getBar[4].innerHTML="Strong";
    }
    else if(passowrdStrong==4){
        getBar[4].innerHTML="Very Strong";
    }
})

//tiger modal bx
let register=document.querySelector(".clr");
register.addEventListener('click',function(){
    modal_.style.display="flex";
});

//modal bx to close
let modal_=document.querySelector(".modal-box");
let close=document.querySelector("#close");

close.addEventListener("click",function(){
    modal_.style.display='none';
});


