// ----------------------- 2.3 Aparitie treptata titlu -------------------------------
window.onload = function(){
    
  // ----------------------- 2.3 Aparitie treptata titlu -------------------------------
  document.getElementsByTagName("title")[0].setAttribute("id","titlu");
  var titlu = document.getElementById("titlu");
  var txt = titlu.innerHTML;
  titlu.innerHTML = "";
  var txt1 = "";
  var txt2 = "";
  var start = 0;
  var final = txt.length - 1;
  //alert(txt.toString()[start]);
  function ApareTreptat(){
      if(start<final){
          txt1 += txt.charAt(start);
          txt2 = txt.charAt(final) + txt2;
          titlu.innerHTML = txt1 + "" + txt2;
          start++;
          final--;
          setTimeout(ApareTreptat,100); // la fiecare 100ms se va reapela functia
      }
      else if (txt.length % 2){
          titlu.innerHTML = txt1 + txt.charAt(start) + txt2;
      }
  }
  ApareTreptat();
  
  // -------------------------------- 1.5 INVERSARE LISTA -------------------------------------
  var list = document.getElementById("listp");        // iau lista din document folosind id-ul
  var aux = list.innerHTML;                           // fac o copie auxiliara a continutului listei
  var ok = 1;                     
  list.ondblclick = function (event) {        // la dublu-click pe lista se executa functia
      if (ok == 1) {                          // daca lista nu este deja inversata
          ok = 0;
          var content = list.children;        // iau elementele din lista
          var txt = "";
          for (let i = content.length - 1; i >= 0; i--) {     // parcurg in ordine inversa elementele din lista
              var nr = i + 1;
              txt = txt + nr + "." + content[i].innerHTML + "<br>";      // concatenez la txt innerHTML-ul elementelor
          }
          list.innerHTML = txt;       // modific lista
      }
      else{           // daca lista e inversata atunci lista va lua valoarea copiei facute la inceput
          list.innerHTML = aux;   
          ok = 1;
      } 
  }
}
