(()=>{"use strict";document.getElementById("form__login"),document.getElementById("form__register");const e=document.querySelectorAll(".form"),t=document.getElementById("form__login--btn__appear"),o=document.getElementById("form__register--btn__appear"),s=document.getElementById("forms__container--backup");e.forEach((c=>{c.addEventListener("click",(function(c){const n=c.target;console.log("clickedElem",n),console.log("this",this),"BUTTON"===n.tagName&&((e=>{switch(e){case t:s.classList.remove("shifted__right");break;case o:s.classList.add("shifted__right")}})(n),this,e.forEach((e=>e.classList.add("notactive"))),this.classList.remove("notactive"))}))}))})();