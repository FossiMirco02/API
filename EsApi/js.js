class Employer { //costruttore per ogni lavoratore
    constructor(name, email, address, phone) {
        this.name = name; //nome
        this.email = email; //email
        this.address = address; //indirizzo dove abita
        this.phone = phone; //telefono
    }
};

var IdEmployer; //variabile per sapere l'Id di ogni persona che viene aggiunta

function CaricaPagina() { //funzione che si avvia al caricamento della pagina, fa vedere un solo form
    document.getElementById("form").style.display = "block";
    document.getElementById("newform").style.display = "none";
    richiestaelementi();
}

function richiestaelementi() { //richiese gli elementi da inserire nella pagina attraverso le API
    var richiesta = new XMLHttpRequest(); //richiesta in xml
    richiesta.onreadystatechange = function() {
        if (this.status == 200) // se lo stato è 200, quindi una risposta andata a buon fine 
        {
            risposta(this.responseText);
        }
    };
    richiesta.open("GET", "http://localhost:8080/api/tutorial/1.0/employees", true);
    richiesta.setRequestHeader("Accept", "*/*");
    richiesta.send();
}

function risposta(json) { //risposta del sito dopo la richiesta
    var lavoratore = JSON.parse(json); //risposta in json
    for (var i = 0; i < lavoratore.length; i = i + 1) { //for per aggiungere tutti i lavoratori
        idultimo = lavoratore[i].employeeId;
        aggiungialform(lavoratore[i], lavoratore[i].employeeId);
    }
}

function aggiungialform(employer, lavoratore) { //funzione per aggiungere al form, o alla pagina, i lavoratori
    // variabile per l'html
    var html = '<td><input type="checkbox" name="checkbox" style="margin-left: 1%" id="' + lavoratore + '"></td><td id="' + lavoratore + '" name="name"><p>' + employer.name + '</p></td><td id="' + lavoratore + '" name="email"><p>' + employer.email + '</p></td><td id="' + lavoratore + '" name="address"><p>' + employer.address + '</p></td><td id="' + lavoratore + '" name="phone"><p>' + employer.phone + '</p></td>';
    html += '<td style="width: 1%"><img onclick="aggiungi(this.id)" src="modifica.png" style="width: 30px; height: 30px;" id="' + lavoratore + '"></td>';
    html += '<td><img onclick="rimuovi(this.id)" src="rimuovi.png" style="width: 30px; height: 30px;" id="' + lavoratore + '"></td>';
    //variabile per creare la riga 
    var elem = document.createElement('tr');
    elem.id = (lavoratore);
    elem.innerHTML = html;
    document.getElementById('tabellapersone').appendChild(elem);
    lavoratore++;
}

function aggiungi(lavoratore) // aggiungere un impiegato
{
    try {
        if (lavoratore == null) //se non si vuole aggiungere nessun lavoratore lo schermo rimane come è
        {
            document.getElementById("form").style.display = "none";
            document.getElementById("newform").style.display = "block";
        } else {
            alert(lavoratore);
            var employer = new Employer;
            employer.name = prompt("Name: ");
            employer.email = prompt("Email: ");
            employer.address = prompt("Address: ");
            employer.phone = prompt("Phone: ");
            aggiungiinserito(employer, lavoratore); //chiama altra funzione
        }
    } catch (Exception) {
        //errore nell'aggiunta di una persona, riprova e cerca di inserire tutto senza errori
    }
}

function aggiungiinserito(employer, id) //funzione per inserire il lavoratore nel database delle APi con il metodo PUT 
{
    var dati = {
        "idemployee": id,
        "name": employer.name,
        "email": employer.email,
        "address": employer.address,
        "phone": employer.phone
    };
    $.ajax({ //richiesta da fare al "sito"
        url: 'http://localhost:8080/api/tutorial/1.0/employees/' + id,
        type: 'put',
        data: JSON.stringify(dati),
        contentType: 'application/json',
        success: function(data, textstatus, jQxhr) {
            location.reload();
        }
    });
}

function aggiungipersona() //aggiungere un lavoratore al database quando lo vogliamo inserire con metodo POST
{
    IdEmployer++;
    var dati = {
        "employeeId": idultimo,
        "name": document.getElementById("namepersona").value,
        "email": document.getElementById("emailpersona").value,
        "address": document.getElementById("addresspersona").value,
        "phone": document.getElementById("phonepersona").value
    };
    $.ajax({ //richiesta al sito
        url: 'http://localhost:8080/api/tutorial/1.0/employees/',
        type: 'post',
        data: JSON.stringify(dati),
        contentType: 'application/json',
        success: function(data, textstatus, jQxhr) {
            location.reload();
        }
    });
}

function rimuovi(lavoratoreid) //rimuovere un lavoratore, o più di uno 
{
    try {
        if (lavoratoreid == null) //se non è stato selezionato nessun lavoratore va a controllare quelli selezionati  per trovare l'id di quelli selezionati
        {
            var selezionati = document.getElementsByName('checkbox');
            var n = selezionati.length;
            for (var i = 0; i < n; i++)
                if (selezionati[i].checked == true) {
                    rimuoviselezionato(selezionati[i].id);
                }
            location.reload();
        } else //se sa quale è quello selezionato 
        {
            if (confirm("rimuovo quelli selezionati...")) {
                rimuoviselezionato(lavoratoreid);
                location.reload();
            }
        }
    } catch (Exception) {
        //errore in qualcosa, provare a ricaricare la pagina e a rimuovere nuovamente
    }
}

function rimuoviselezionato(id) { //rimuovere una persona selezionata metodo DELETE
    $.ajax({
        url: "http://localhost:8080/api/tutorial/1.0/employees/" + id,
        type: 'delete',
        contentType: 'String',
        success: function(data, textstatus, jQxhr) {
            location.reload();
        }
    });
}

function selezionaticheckbox(selected) //selezionare la riga in cui viene selezionata una checkbox nella pagina
{
    var checkbox = document.getElementsByName('checkbox');
    for (var i = 0, n = checkbox.length; i < n; i++) {
        checkbox[i].checked = selected.checked;
    }
}