var ret, totalPost;
var FHIRrootURL = "http://203.64.84.213:8080/fhir"; //"http://hapi.fhir.org/baseR4"; 
//Get FHIR data
function HTTPGetData(urlStr) {
    var HttpObj = new XMLHttpRequest();   
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
            callBack(ret);
			//alert("data retrieved");
        }
    }
	HttpObj.open("GET", urlStr, true);
    HttpObj.send();
}

//Upload FHIR data
function HTTPPostData(urlStr, dataStr ) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("POST", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    //HttpObj.setRequestHeader("Content-type", "application/xml+fhir");
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
			totalPost--;
			if (totalPost>0) HTTPPostData(urlStr, dataStr ); 
        }
    }
    HttpObj.send(dataStr);
}

//Update FHIR data
function HTTPPutData(urlStr, dataStr) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("PUT", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onload = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
			alert(ret);
        }
    }
    HttpObj.send(dataStr);
}