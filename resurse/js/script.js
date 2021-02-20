window.onload=function(){
	//creez un obiect de tip XMLHttpRequest cu care pot transmite cereri catre server
	var ajaxRequest = new XMLHttpRequest();
	

	//la schimbarea starii obiectului XMLHttpRequest (la schimbarea proprietatii readyState)
	/* stari posibile:
	0 - netrimis
	1 - conexiune deschisa
	2 - s-au transmis headerele
	3 - se downleadeaza datele (datele sunt impartite in pachete si el primeste cate un stfel de pachet)
	4 - a terminat
	*/
	var obStele;
	ajaxRequest.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					//document.getElementById("afisJson").innerHTML=this.responseText;
					var obJson = JSON.parse(this.responseText);
					obStele = obJson.stele;
					//afiseajaJsonTemplate(obStele); // !!
					//DescrieriStele();
					if(!localStorage.getItem("resetBack")){
						obStele = JSON.parse(this.responseText).stele;
						localStorage.setItem("resetBack", JSON.stringify(obStele));
						localStorage.setItem("curentState", JSON.stringify(obStele));
					}
					obStele = JSON.parse(localStorage.getItem("curentState"));
					afiseajaJsonTemplate(obStele);
					DescrieriStele();
			}
	};
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "/json/stele.json", true);
	//trimit catre server cererea
	ajaxRequest.send();
	function afiseajaJsonTemplate(obStele) { 
		//in acets div voi afisa template-urile   
		localStorage.setItem("curentState", JSON.stringify(obStele));
		let container=document.getElementById("afisTemplate");

		//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
		let textTemplate ="";
		//parcurg vetorul de studenti din obJson
		for(let i=0;i<obStele.length;i++){
			//creez un template ejs (primul parametru al lui ejs.render)
			//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
			//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
			textTemplate+=ejs.render("<div class='templ_stele'>\
			<p>Id: <%= stea.id %></p>\
			<p>Nume: <%= stea.nume %></p>\
			<p>Descriere: <%= stea.descriere %> </p>\
			<p>Temperatura: <%= stea.TemperaturaKelvin %> </p>\
			<p>Supergiganta: <%= stea.supergiganta %> </p>\
			<p>Data descoperire: <%= stea.dataDescoperire %> </p>\
			</div>", 
			{stea: obStele[i]});
		} 
		//adaug textul cu afisarea studentilor in container
		container.innerHTML=textTemplate;
	}
	
	// ------------------------------ SORTARE -----------------------------------

	var SortButton = document.getElementById("sort_temp");
	SortButton.onclick= function(){		// Sortare crescatoare la click pe buton
		obStele.sort(function(x,y){
			return x.TemperaturaKelvin - y.TemperaturaKelvin;
		});
		afiseajaJsonTemplate(obStele);
	}
	SortButton.ondblclick=function(){		// Sortare descrescatoare la dublu-click pe buton
		obStele.sort(function(x,y){
			return y.TemperaturaKelvin - x.TemperaturaKelvin;
		});
		afiseajaJsonTemplate(obStele);
	}
	var SortID = document.getElementById("sort_id");
	SortID.onclick= function(){			// Sortare crescatoare la click pe buton
		obStele.sort(function(x,y){
			return x.id - y.id;
		});
		afiseajaJsonTemplate(obStele);
	}
	SortID.ondblclick= function(){		// Sortare descrescatoare la dublu-click pe buton
		obStele.sort(function(x,y){
			return y.id - x.id;
		});
		afiseajaJsonTemplate(obStele);
	}
	
	//------------------------ Task 4.3 Sortare avansata -----------------------------------
	// Sortare dupa data, temperatura, nume

	var AdvSort = document.getElementById("advanced_sort");
	AdvSort.onclick = function(){
		obStele.sort(function(x,y){
			var data1 = x.dataDescoperire.split("-");
			var data2 = y.dataDescoperire.split("-");
			for(let i = 2; i>= 0; i--){						// Sortam dupa data: an, luna, zi
				if (parseInt(data1[i]) < parseInt(data2[i]))	
					return -1;
				else if (parseInt(data1[i]) > parseInt(data2[i]))
					return 1;
			}
			if(x.TemperaturaKelvin < y.TemperaturaKelvin) 		// Sortam dupa temperatura
				return -1;
			else if (x.TemperaturaKelvin > y.TemperaturaKelvin)
				return 1;
			return	x.nume.localeCompare(y.nume);
		});
		afiseajaJsonTemplate(obStele);
	//	alert( obStele[1].dataDescoperire.split("-")[2]);
	}

	// Sortare dupa luna si apoi dupa an ex: feb 2005, feb 2006, martie 2003, martie 2004
	var SortDate = document.getElementById("sort_date");
	SortDate.onclick = function(){
		obStele.sort(function(x,y){
			var data1 = x.dataDescoperire.split("-");
			var data2 = y.dataDescoperire.split("-");
			if(parseInt(data1[1]) < parseInt(data2[1]))
				return -1;
			else if (parseInt(data1[1]) > parseInt(data2[1]))
				return 1;
			return parseInt(data1[2]) - parseInt(data2[2]);
		});
		afiseajaJsonTemplate(obStele);
	}

	// Sterge elemente duplicate
	var duplicat = document.getElementById("duplicate");
	duplicat.onclick = function(){
		for(let i = 0; i<obStele.length; i++){
			for (j = i+1; j< obStele.length-1; j++){
				if(obStele[i].nume == obStele[j].nume){
					obStele.splice(j,1);
				}
			}
		}
		afiseajaJsonTemplate(obStele);
	}


	// -------------------------------- CALCULARE ----------------------------------------

	var ButonMedie = document.getElementById("medie");
	ButonMedie.onclick = function(){
		var sum = 0;
		k = 0;
		for(let stea of obStele){
			sum += stea.TemperaturaKelvin;
			k++;
		}
		var medie = sum/k;
		alert("Temperatura medie a stelelor este: " + medie + " Kelvin.");
	}
	// console.log(typeof document);
	
	// -------------------------------- FILTRARE -----------------------------------------

	var SubmTemp = document.getElementById("SubmitTemp");
	SubmTemp.onclick = function(){
		afiseajaJsonTemplate(obStele);
		var Temp = document.getElementById("InputId").value;
		var stele = document.getElementsByClassName("templ_stele");
		var i = 0;
		while(i < stele.length){
			var tempStea = stele[i].children[3].innerHTML.split(" ")[1]; 	// <p>Temperatura: <%= stea.TemperaturaKelvin %> </p>\ despart prin spatii
			console.log(tempStea);
			if(parseInt(tempStea)  < Temp){
				stele[i].remove();
			}
			else i++;
		}
	}
	// ----------------------------------- STERGERE --------------------------------------------

	var stars = document.getElementById("afisTemplate");
	stars.onclick = function(){
		for(let i = 0; i< stars.children.length; i++){
			stars.children[i].onclick = function(e){
				var idStar = stars.children[i].children[0].innerHTML.split(" ")[1];
				for (let j = 0 ;j< obStele.length; j++){
					if(obStele[j].id == idStar && e.shiftKey){
						obStele.splice(j,1);		// incepand cu poz j sterg 1 element
						afiseajaJsonTemplate(obStele);
					}
				}
			}
		}
	}
	// ---------------------------------- RESETARE --------------------------------------------

	var ResetButton = document.getElementById("resetare");
	ResetButton.onclick = function(){
		obStele = JSON.parse(localStorage.getItem("resetBack"))
		afiseajaJsonTemplate(obStele);
	}

	// --------------------------------- SetInterval --------------------------------------

	var ButonDesc = document.getElementById("animatie");
	function DescrieriStele() {
		var descrieri = [];

		for(let stea of obStele){
			var numeStea = stea.nume;
			var descriereStea = stea.descriere;
			var txt = numeStea + ": " + descriereStea;
			descrieri.push(txt);
			console.log(descrieri);
		}
		var j = 0;
		var divDesc = document.createElement("div");
		document.getElementById("idFundal").insertBefore(divDesc, document.getElementById("idFundal").childNodes[2]);
		divDesc.style.margin= "10px 300px 30px 300px";
		divDesc.style.backgroundColor = "#900";
		divDesc.style.padding = "5px";
		divDesc.style.borderRadius = "15px";
		divDesc.style.border = "1px solid white";
		divDesc.style.textAlign = "center";
		setInterval(function(){ 
			divDesc.innerHTML = descrieri[j];
			j++;
			j = j % descrieri.length;
		}, 2500);
	  }

	// ------------------------------------ SetTimeout --------------------------------------

	var Buttons = document.getElementsByTagName("button");
	var divRange = document.getElementById("labelTemp");
	divRange.style.display = "none";
	for(let button of Buttons){
		button.style.display = "none";
	}
	setTimeout(function(){
		for(let button of Buttons){
			button.style.display = "inline-block";
		}
		divRange.style.display = "block";
	}, 3000);
}
