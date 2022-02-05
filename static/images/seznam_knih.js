function myFunction(){

//nejprve smaz celou tabulku
//spocitej radky v tabulce
var pocet_radku = document.getElementById("seznam").rows.length;

//maz jeden po druhem
for(var i = document.getElementById("seznam").rows.length; i > 0;i--)
{
document.getElementById("seznam").deleteRow(i -1);
}

  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET", "seznam_knih2.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

//zjisteni poctu knih
var velikost_xml = xmlDoc.getElementsByTagName('book').length;

var seznam = [];

//hodnota z vyberu
var x = document.getElementById("myForm").elements[0].value;

//prochazeni seznamu a ukladani hodnot
for (i = 0; i < velikost_xml; i++) {
  var jmeno = xmlDoc.getElementsByTagName("first_name")[i].childNodes[0].nodeValue;

  var prijmeni = xmlDoc.getElementsByTagName("last_name")[i].childNodes[0].nodeValue;

  var titul = xmlDoc.getElementsByTagName("name")[i].childNodes[0].nodeValue;
  if(xmlDoc.getElementsByTagName("genre")[i].childNodes[0] == null){
    var zanr = "Nezname";  
  }else{
  var zanr = xmlDoc.getElementsByTagName("genre")[i].childNodes[0].nodeValue;
  
  }
  //var zanr = xmlDoc.getElementsByTagName("genre")[i].childNodes[0].nodeValue;
  var publikovani = xmlDoc.getElementsByTagName("publication_year_cz")[i].childNodes[0].nodeValue;
  var vlozeni = xmlDoc.getElementsByTagName("date_insert")[i].childNodes[0].nodeValue;
  if(xmlDoc.getElementsByTagName("recent")[i].childNodes[0] == null){
    var recenze = "Nezname";
  }else{
    var recenze = xmlDoc.getElementsByTagName("recent")[i].childNodes[0].nodeValue; 
  }
  

      //pokud je vybrano razeni podle jmena, tak to uloz do
      //pole i s jeho poradim v seznamu, pak cely seznam
      //serad

  switch (x) {
    case "name":
        var xyz = [titul, i];
        seznam.push(xyz);
        break;
    case "rok_vydani":
        var xyz = [publikovani, i];
        seznam.push(xyz);
        break;
    case "zanr":
        var xyz = [zanr, i];
        seznam.push(xyz);
        break;
    case "datum_pridani":
        var xyz = [vlozeni, i];
        seznam.push(xyz);
        
        break;
    case "autor_name":
        var xyz = [jmeno, i];
        seznam.push(xyz);
        break;
    case "autor_surname":
        var xyz = [prijmeni, i];
        seznam.push(xyz);
        break;

}
 
}
  seznam = seznam.sort();

//vytvarej radky tabulky a jejich bunky a doplnuj do nich hodnoty
for (i = 0; i < velikost_xml; i++) {
    var table = document.getElementById("seznam");
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(i);
    var index = i;
  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);


    var poradi_v_xml = seznam[index][1];
    if(xmlDoc.getElementsByTagName("recent")[i].childNodes[0] == null){
      var odkaz = "Nezname";
    }else{
      var href = xmlDoc.getElementsByTagName("recent")[i].childNodes[0].nodeValue;
      var odkaz = "<a href="+href+" target=\"_blank\" name=\"recenze\" title=\"Recenze\">Recenze</a>"; 
    }
    if(xmlDoc.getElementsByTagName("genre")[i].childNodes[0] == null){
      var zanr = "Nezname";  
    }else{
      var zanr = xmlDoc.getElementsByTagName("genre")[i].childNodes[0].nodeValue;
  
    }
    //var href = xmlDoc.getElementsByTagName("recent")[poradi_v_xml].childNodes[0].nodeValue;
    //var odkaz = "<a href="+href+" target=\"_blank\" name=\"recenze\" title=\"Recenze\">Recenze</a>";
    cell1.innerHTML =  xmlDoc.getElementsByTagName("name")[poradi_v_xml].childNodes[0].nodeValue;
    cell5.innerHTML =  xmlDoc.getElementsByTagName("publication_year_cz")[poradi_v_xml].childNodes[0].nodeValue;
    cell4.innerHTML =  zanr;
    cell6.innerHTML =  xmlDoc.getElementsByTagName("date_insert")[poradi_v_xml].childNodes[0].nodeValue;
    cell2.innerHTML =  xmlDoc.getElementsByTagName("first_name")[poradi_v_xml].childNodes[0].nodeValue;
    cell3.innerHTML =  xmlDoc.getElementsByTagName("last_name")[poradi_v_xml].childNodes[0].nodeValue;
    cell7.innerHTML =  odkaz;

}}
