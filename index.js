var express = require('express');/*include modulul express
memorand in variabila express obiectul asociat modulului(exportat de modul)*/
var path = require('path');
var formidable = require('formidable');
var session = require('express-session');
var fs = require('fs');//file system - folosim pt administrare de directoare si fisiere  (inclusiv citit+scris)
var crypto= require('crypto');
var app = express();//createServer

// pentru folosirea ejs-ului 
app.set('view engine', 'ejs');

app.use(session({
	secret: "parola_sesiune",
	resave:true,
	saveUninitialized:false
}))

//definesc faptul ca folderul resurse e folder static
//adica fisierele din el nu vor fi procesate
console.log("Director curent: "+ __dirname)
app.use(express.static( path.join(__dirname, "resurse")))

app.post('/inreg', function(req, res){
	var dateFormular= new formidable.IncomingForm()
	dateFormular.parse(req, function(err, fields, files){
		//in files o sa am campurile de tip file <input type="file"
		//in fields o sa am restul
		//campurile(proprietatile) din fields sunt valorile atributelor name (de exemplu, fields.username, pentru ca aveam un name="username") din inputurile formularului, iar valorile proprietatilor sunt ce a introdus utilizatorul in acele inputuri
		var textFisier= fs.readFileSync("useri.json") //cale relativa la index.js
		var objson=JSON.parse(textFisier);
		var parolaCriptata;
		var algCriptare=crypto.createCipher("aes-128-cbc", "cheie_de_criptare")
		parolaCriptata=algCriptare.update(fields.parola, "utf8", "hex");
		parolaCriptata+=algCriptare.final("hex");
		if(fields.tip){
            console.log(fields.tip.length)
            sird=fields.tip
        }
        else sird=""
		var utilizatorNou={
			id:objson.lastId,
			username:fields.username,
			nume:fields.nume,
			email:fields.email,
			parola:parolaCriptata,
			dataInreg: new Date(),
			rol: "user",
			constelatii:fields.constelatii,
			fenomene:fields.fenomene,
			tip: fields.tip
		}
		objson.useri.push(utilizatorNou)
		objson.lastId += 1

			//stringify trece de la obiect la sir (opusul lui JSON.parse)
		var jsonNou=JSON.stringify(objson);
		fs.writeFileSync("useri.json", jsonNou);
		res.render("html/index");
	});
}) 

app.post('/login', function(req, res){
	var dateFormular= new formidable.IncomingForm()
		dateFormular.parse(req, function(err, fields, files){    
			var textFisier= fs.readFileSync("useri.json") //cale relativa la index.js
			var objson=JSON.parse(textFisier);
			var parolaCriptata;
			var algCriptare=crypto.createCipher("aes-128-cbc", "cheie_de_criptare")
			parolaCriptata=algCriptare.update(fields.parola, "utf8", "hex");
			parolaCriptata+=algCriptare.final("hex");
			
			//user e null daca nu gaseste un utiliz cu acea conditie
			var user=objson.useri.find(function(el){
				return el.username == fields.username && el.parola == parolaCriptata
			})
			if(user){
				console.log("S-a logat un user!");
				req.session.utilizator=user;
				res.render("html/index", {username: user.username});
			}
		}); 
  }) 

// cand se face o cerere get catre pagina de index 
// app.get('/', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/index');
// });
// app.get('/index', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/index');
// });
// app.get('/Corpuri', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/Corpuri');
// });
// app.get('/Fenomene', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/Fenomene');
// });
// app.get('/Expeditii', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/Expeditii');
// });
// app.get('/Q&A', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/Q&A');
// });
// app.get('/inreg', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
//     res.render('html/inreg');
// });

// app.get('/ceva', function(req, res) {
// 	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
// 		console.log("A intrat un student!");
//     res.setHeader("Content-Type","text/html");
// 		x=Math.random()//asta tine loc de procesare
// 		res.write("<html><body><p>");
// 		if(x<0.5){
// 			res.write("Salut!!!");
// 		}
// 		else{
// 			res.write("Pa! Pa!");
// 		}
// 		res.write("</p></body></html>");
// 		res.end();
// });
//if you are here, nu se gaseste ce cauti
app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect("/");
})
app.get('/*', function(req, res){

	var u=(req.session? (req.session.utilizator? req.session.utilizator.username: null) :null);
  res.render('html' + req.url,{username:u}, function(err, rezRandare){
		if(err){
				if(err.message.indexOf("Failed to lookup view")!=-1){
					res.status(404).render("html/404", {username:u})
        
				}
        else throw err
		}
    else res.send(rezRandare)
	});
});

// app.use(function(req, res) {
// 	res.status(404).render("html/404");
// })

app.listen(8080);
console.log('Aplicatia se va deschide pe portul 8080.');



