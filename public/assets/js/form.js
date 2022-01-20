let tag_paragraph=document.querySelectorAll('p');
tag_paragraph.forEach(tag=>tag.classList.add('deactive-blur'));

function submitData(){
   let name=document.getElementById("name").value;
   let email=document.getElementById("email").value;
   let phone=document.getElementById("phone").value;
   let sub=document.getElementById("sub").value;
   let text=document.getElementById("text").value;
   
   console.log(name);
   console.log(email);
   console.log(phone);
   console.log(sub);
   console.log(text);

   if(name==''||email==''||phone==''||sub==''||text==''){
       alert("semuanya wajib diisi")
       return
   }
   if(!isValid(name,"name")){return;}
   if(!isValid(email,"email")){return;}
   if(!isValid(phone,"phone")){return;}

   let a=document.createElement('a');
   a.href=`mailto:${email}?subject=${sub}&body=my name is ${name} ${text} please contact ${phone}`;
   a.click();
}

function isValid(value,typeValue){
   let success=false;//for name

   for(let i=0;i<value.length;i++){
      if( (typeValue=="name") && (value[i]>="0" && value[i]<="9")){
         alert("nama tidak boleh mengandung angka");
         success=false;
         return success;

      } else if((typeValue=="email")&&(value[i]=="@")){
         for(let j=i;j<value.length;j++){
            if(value[j]=="."){//get start point
               let subString='';
               for(let k=j+1;k<value.length;k++){//take character after dot char
                  subString+=value[k];
               }
               if(subString=="com"||subString=="co"||subString=="id"||subString=="co.id"){//compare word
                  success=true;
                  return success;
               } else{
                  alert("email tidak valid");
                  success=false;
                  return success;
               }
            }
         }

      } else if(typeValue=="phone"){
         let subNumber='';
         if(value.length>13 || value.length<10){
            alert("nomor hp tidak valid");
            return false;
         }
         for(let z=0;z<2;z++){
            subNumber+=value[z];
         }
         if(subNumber=="08"){
            success=true;
            return success;
         } else {
            alert("nomor hp tidak valid");
            return false;
         }
      }
      success=true//for return succes if there is no exception
   }

   if(typeValue=="email"){
      alert("@ karakter tidak ada");
      return false;
   }

   return success;//for name value  
}