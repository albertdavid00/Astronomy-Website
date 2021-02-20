 window.onload = function () {

    AparitieCuvinte();  // task 2.2
    Intrebare(); // task 2.8
    ChangeImages() // task 1.8

}
    // ------------------------------- 2.2 Aparitie treptata cuvant ----------------------------------------------
function AparitieCuvinte(){
    var start = 0;
    var txt = "";
    var p1= document.getElementById("p1");
    var aux = p1.textContent.split(" ");
    p1.textContent = "";
    function ApareTreptat(){
        if(start < aux.length){
            txt = txt + " " + aux[start];
            p1.textContent = txt;
            start++;
            setTimeout(ApareTreptat,333);
        }
    }
    ApareTreptat();
    var start2 = 0;
    var txt2 = "";
    var p2= document.getElementById("p2");
    var aux2 = p2.textContent.split(" ");
    p2.textContent = "";
    function ApareTreptat2(){
        if(start2 < aux2.length){
            txt2 = txt2 + " " + aux2[start2];
            p2.textContent = txt2;
            start2++;
            setTimeout(ApareTreptat2,333);
        }
    }
    ApareTreptat2();
}

// --------------------------------- 2.8 Intrebare in timp limita --------------------------------

function Intrebare(){
    var divInput = document.createElement("div");
    document.getElementById("idFundal").insertBefore(divInput, document.getElementById("idFundal").childNodes[8]);
    divInput.style.margin= "10px 300px 30px 300px";
		divInput.style.backgroundColor = "darkmagenta";
		divInput.style.padding = "5px";
		divInput.style.borderRadius = "15px";
		divInput.style.border = "1px solid white";
        divInput.style.textAlign = "center";
    var input = document.createElement("input");
    var intrebare = document.createElement("p");
    intrebare.innerHTML = "Ce credeau oamenii in trecut ca se afla in centrul universului?";
    divInput.appendChild(intrebare);
    divInput.appendChild(input);
    var buton = document.createElement("button");
    buton.innerHTML = "Submit";
    divInput.appendChild(buton);
    var ok = 1;
    var ok2 = 1; 
    input.onclick = function(){
            setTimeout(function(){
                if(ok==1){          // daca inca nu am apasat pe buton
                    input.setAttribute("disabled", true);
                    alert("Timpul a expirat!");
                    ok2 = 0;           // daca timpul a expirat sa nu se mai intample nimic cand apas pe buton
                }
            }, 3000);
    }
    buton.onclick = function(){
        ok = 0;
        if(ok2 == 1){           // verific daca nu a expirat timpul
            var par = document.createElement("p");
            divInput.appendChild(par);
            if(input.value == "Pamantul"){
                par.innerHTML = "Felicitari!";
                ok2 = 0;
            }
            else{
                ok2 = 0;
                par.innerHTML = "Ai gresit!";
                intrebare.innerHTML = "";
            }
        }
    }
}

//-------------------------------------- 1.8 Ascunde/Afiseaza imagini ---------------------------------
function ChangeImages(){
    var butonImg = document.createElement("button");
    butonImg.innerHTML = "Ascunde imagini";
    butonImg.style.marginLeft= "60px";
    document.getElementById("idFundal").insertBefore(butonImg, document.getElementById("idFundal").childNodes[0]);
    butonImg.onclick = function(){
        var images = document.getElementsByTagName("img");
        if(butonImg.innerHTML == "Ascunde imagini"){
            butonImg.innerHTML = "Afiseaza imagini";
            for(let image of images)
                image.style.visibility = "hidden";
        }
        else{
            butonImg.innerHTML = "Ascunde imagini";
            for(let image of images)
                image.style.visibility = "visible";
        }

    }
}