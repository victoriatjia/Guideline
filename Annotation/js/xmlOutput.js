var obsID='';
function formInputsToXML(type, URL, uid, svgBase64, vw, vh, sx, sy, sw, sh, wc, ww, pixelData, index) {
	var output= '';
	output+= '<Observation xmlns="http://hl7.org/fhir">';
	output+= '<identifier><system value="' + URL + '"/><value value="' + uid + '"/></identifier>';
	output+= '<status value="preliminary"/><category><coding><system value="http://hl7.org/fhir/observation-category"/><code value="imaging"/></coding></category><code><coding><system value="https://www.dicom.org.tw/cs/imaging"/>';
	output+= '<code value="' + type + '"/><display value="' + type + '"/></coding></code>'; 
	output+= '<focus><reference value="http://203.64.84.218:83/Study1/ImagingStudy/CT_A.jpg" /></focus>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/SVG"/><display value="SVG Annotation"/></coding></code><valueString value="' + svgBase64 + '"></valueString></component>'; 
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_vw"/><display value="viewPort.vw"/></coding></code><valueString value="' + vw + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_vh"/><display value="viewPort.vh"/></coding></code><valueString value="' + vh + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_sx"/><display value="viewPort.sx"/></coding></code><valueString value="' + sx + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_sy"/><display value="viewPort.sy"/></coding></code><valueString value="' + sy + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_sw"/><display value="viewPort.sw"/></coding></code><valueString value="' + sw + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DICOM_ViewPort_sh"/><display value="viewPort.sh"/></coding></code><valueString value="' + sh + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/WindowCenter"/><display value="WindowCenter"/></coding></code><valueString value="' + wc + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/WindowWidth"/><display value="WindowWidth"/></coding></code><valueString value="' + ww + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/PixelData"/><display value="PixelData"/></coding></code><valueString value="' + pixelData + '"></valueString></component>';
	output+= '<component><code><coding><system value="https://www.dicom.org.tw/"/><code value="https://www.dicom.org.tw/cs/DCM File"/><display value="DCM File"/></coding></code><valueString value="' + index + '"/></component></Observation>'; 
	//alert(output);
	return output;
}

// function formInputsToXML(svgBase64, pngSrc, sx, sy, sw, sh, wc, ww, index) {
	// var output= '';
	// output+= '<svg value="' + svgBase64 + '"/>'; 
	// output+= '<pngSrc value="' + pngSrc + '"/>'; 
	// output+= '<sx value="' + sx + '"/>'; 
	// output+= '<sy value="' + sy + '"/>'; 
	// output+= '<sw value="' + sw + '"/>'; 
	// output+= '<sh value="' + sh + '"/>'; 
	// output+= '<wc value="' + wc + '"/>'; 
	// output+= '<ww value="' + ww + '"/>'; 
	// output+= '<index value="' + index + '"/>'; 
	// return output;
// }

function mammoXML(formID, formCode){
	//mass(id, code, pid, LorR1, LorR2, loc1, loc2, loc3, loc4, size1, size2, shape1, shape2, margin1, margin2, dense1, dense2)
	//clacifications(id, code, pid, LorR1, LorR2, loc1, loc2, loc3, loc4, distribution1, distribution2, morphology1, morphology2, '', '', '', '')
	//asymmetry(id, code, pid, asymmetry1, asymmetry2, loc1, loc2, loc3, loc4,'','','','','','','','')
	//architecturalDistortion(id, code, pid, LorR1, LorR2, loc1, loc2, loc3, loc4,'','','','','','','','')
	var thisform = document.getElementById(formID);
    var elements = thisform.elements;
	var p= new Array(15), count=1;
	p[0]="112441";
	for (i = 0; i < elements.length; i++) {
			var form_elem = elements[i];
			if (form_elem.checked == true){
				p[count]= form_elem.id;
				count++;
				p[count]= form_elem.value;
				count++;
			}
	}
	var output="";
	//derivedFrom
	output+= '<?xml version="1.0" encoding="UTF-8"?><Observation xmlns="http://hl7.org/fhir" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://hl7.org/fhir fhir-all-xsd/observation.xsd"><id value="' + formID + '"/><status value="final"/><code><coding><system value="http://www.radlex.org"/><code value="' + formCode + '"/></coding></code><subject><reference value="Patient/' + p[0] + '"></reference></subject><derivedFrom>' + getCookie("obs_id") + '</derivedFrom><valueCodeableConcept><coding><system value="http://misat.org.tw/CodeSystem/RtOrLt"></system><code value="' + p[1] + '"></code><display value="' + p[2] + '"></display></coding></valueCodeableConcept><component><code><coding><system value="http://misat.org.tw/CodeSystem/BreastSiteCS"/><code value="' + p[3] + '"/><display value="' + p[4] + '"/></coding><!-- One view Only --><coding><system value="http://misat.org.tw/CodeSystem/HemsphereViewCS"/><code value="' + p[5] + '"/><display value="' + p[6];
	if(formID=='mass')
		output+= '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/SizeCS"/><code value="' + p[7] + '"/><display value="' + p[8] + '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/ShapeCS"/><code value="' + p[9] + '"/><display value="' + p[10] + '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/MarginCS"/><code value="' + p[11] + '"/><display value="' + p[12] + '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/DensityCS"/><code value="' + p[13] + '"/><display value="' + p[14] + '"/></coding></code></component></Observation>';
	if(formID=='calcifications')
		output+= '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/DistributionCS"/><code value="' + p[7] + '"/><display value="' + p[8] + '"/></coding></code></component><component><code><coding><system value="http://misat.org.tw/CodeSystem/MorphologyCS"/><code value="' + p[9] + '"/><display value="' + p[10] + '"/></coding></code></component></Observation>';
	if(formID=='asymmetry')
		output+= '"/></coding></code></component></Observation>';
	if(formID=='architecturalDistortion')
		output+= '"/></coding></code></component></Observation>';
	alert(output);
	postReportData(output, "Observation", formID);
}

function diagnosisXML(){
	var i, j, p1, p2, p3, p4, p5, p6, p7, p8, p9="", len, temp, str='', str2='', output='';
	p1= document.getElementById("pId").value;
	p2= document.getElementById("pName").value;
	p3= document.getElementById("birthDate").value;
	p4= "Patient/112441"
	p5= document.getElementById("examineDate").value;
	p6= "Practitioner/AJN0050605011970N1"
	p7= document.getElementById("radiologistName").value;
	temp= document.getElementsByName("category");
	for(i=0;i<temp.length;i++){
		if(temp[i].checked==true){
			p8= temp[i].value;;
			if(i==2){
				temp= document.getElementsByName("suspicion");
				for(j=0;j<temp.length;j++){
					if(temp[j].checked==true){
						p8+= temp[j].value + '"/></DiagnosticReport>';
					}
				}
			}
			if(i!=2){
				p8 += '"/></DiagnosticReport>'
			}
			break;
		}
	}

	if(document.getElementById("Q1").checked==true){
		if(document.getElementById("Q1_rt").checked==true)
			p9= document.getElementById("Q1_rt").value;
		if(document.getElementById("Q1_lt").checked==true)
			p9+= document.getElementById("Q1_lt").value;
		str+= '<result><identifier><system value="http://www.radlex.org"/><value value="RID28509_' + p9 + '"/></identifier></result>';
	}
	if(document.getElementById("Q2").checked==true){
		if(document.getElementById("Q2_rt").checked==true)
			p9= document.getElementById("Q1_rt").value;
		if(document.getElementById("Q2_lt").checked==true)
			p9+= document.getElementById("Q1_lt").value;
		str+= '<result><identifier><system value="http://www.radlex.org"/><value value="RID1357_' + p9 + '"/></identifier></result>';
	}
	if(document.getElementById("Q3").checked==true){
		if(document.getElementById("Q3_rt").checked==true)
			p9= document.getElementById("Q1_rt").value;
		if(document.getElementById("Q3_lt").checked==true)
			p9+= document.getElementById("Q1_lt").value;
		str+= '<result><identifier><system value="http://www.radlex.org"/><value value="RID49972_' + p9 + '"/></identifier></result>';
	}
	if(document.getElementById("Q4").checked==true){
		if(document.getElementById("Q4_rt").checked==true)
			p9= document.getElementById("Q1_rt").value;
		if(document.getElementById("Q4_lt").checked==true)
			p9+= document.getElementById("Q1_lt").value;
		str+= '<result><identifier><system value="http://www.radlex.org"/><value value="RID34317_' + p9 + '"/></identifier></result>';
	}
	if(document.getElementById("Q5").checked==true){
		str+= '<result><identifier><system value="http://www.snomed.org"/><value value="74964007_' + document.getElementById("Q5_answer").value + '"/></identifier></result>';
	}

	for(i=0;i<cmass[0];i++){
		str2+= '<result><reference value="Observation/' + cmass[i+1] + '"/><identifier><system value="http://www.radlex.org"/><value value="RID39055"/></identifier></result>';
	}
	for(i=0;i<ccal[0];i++){
		str2+= '<result><reference value="Observation/' + ccal[i+1] + '"/><identifier><system value="http://www.radlex.org"/><value value="RID34642"/></identifier></result>';
	}
	for(i=0;i<casym[0];i++){
		str2+= '<result><reference value="Observation/' + casym[i+1] + '"/><identifier><system value="http://www.radlex.org"/><value value="RID34265"/></identifier></result>';
	}
	for(i=0;i<cdistort[0];i++){
		str2+= '<result><reference value="Observation/' + cdistort[i+1] + '"/><identifier><system value="http://www.radlex.org"/><value value="RID34261"/></identifier></result>';
	}

	output+= '<?xml version="1.0" encoding="UTF-8"?><DiagnosticReport xmlns="http://hl7.org/fhir" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://hl7.org/fhir fhir-all-xsd/diagnosticreport.xsd">';
	output+= '<Patient><id value="' + p1 + '"/><text><status value="generated"/><div xmlns="http://www.w3.org/1999/xhtml"><h1>病患資料顯示</h1></div></text><active value="true"/><name><use value="usual"/><text value="' + p2 + '"/></name><gender value="female"/><birthDate value="' + p3 + '"/></Patient>';
	output+= '<status value="final"/><code><coding><system value="http://loinc.org"/><code value="24606-6"/></coding><text value="MG Breast Screening"/></code><subject><reference value="' + p4 + '"/></subject><effectiveDateTime value="' + p5 + '"/>';
	output+= '<performer><role><coding><system value="http://hl7.org/fhir/ValueSet/performer-role"/><code value="41904004"/><display value="Medical X-ray technician"/></coding></role><actor><reference value="' + p6 + '"/><display value="' + p7 + '"/></actor></performer>';
	output+= str2 + str + '<conclusion value="' + p8;
	
	alert(output);
	postData(output, "DiagnosticReport", "");
}

function postData(xmlString) {
    var xhttp = new XMLHttpRequest();
	var url= "http://hapi.fhir.org/baseR4/Observation";	//'https://hapi.fhir.tw/fhir/Observation';	//'http://hapi.fhir.org/baseDstu3/Observation';
	xhttp.open("POST", url, false);
	xhttp.setRequestHeader("Content-type", 'text/xml');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) // && this.status == 201) 
        {
            ret=this.responseText;	
			//alert(ret);
			var str = ret.split('<id value="');
			var str2 = str[1].split('"/');
			obsID= str2[0];
			alert("FHIR Observation ID: " + obsID);
        }
    };
    var postData;
    postData = xmlString;
    xhttp.send(postData);
}

function postReportData(xmlString, type, formID) {
    var xhttp = new XMLHttpRequest();
	xhttp.open("POST", 'http://hapi.fhir.org/baseDstu3/' + type, true);
	xhttp.setRequestHeader("Content-type", 'text/xml');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) // && this.status == 201) 
        {
            ret=this.responseText;	
			alert(ret);
			var str = ret.split('<id value="');
			var str2 = str[1].split('"/');
			//alert(str2[0]);
			if(formID=='mass')
				cmass[cmass[0]]= str2[0];
			if(formID=='calcifications')
				ccal[ccal[0]]= str2[0];
			if(formID=='asymmetry')
				casym[casym[0]]= str2[0];
			if(formID=='architecturalDistortion')
				cdistort[cdistort[0]]= str2[0];
        }
    };
    var postData;
    postData = xmlString;
    xhttp.send(postData);
}

function setCookie(cname, cvalue, exmin) {
			var d = new Date();
			d.setTime(d.getTime() + (exmin * 60 * 1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
		
// function HTTPPostData(urlStr, dataStr ) {
    // var rawFile = new XMLHttpRequest();
    // rawFile.open("POST", urlStr, true);
  
    // rawFile.onreadystatechange = function () {
        // if (rawFile.readyState === 4) {
            // ret = rawFile.responseText;
            // alert(ret);
        // }
    // }
    // rawFile.send(dataStr);
// }

// function HTTPGetData(urlStr) {
	// var xhttp = new XMLHttpRequest();

    // xhttp.open('GET', urlStr, true);
    // xhttp.onreadystatechange = function () {
		// if (xhttp.readyState == 4) {
			 // getValue(this);
		// }
	// }
    // xhttp.send();
// }

// function  getValue(xml) {
    // var x = xml.responseXML.getElementsByTagName("DicomAttribute");
        // var value, keyword, i, y;
            // for (i = 0; i < x.length; i++) {
                // //y= x[i].childNodes[0].nodeName;
                // keyword = x[i].getAttribute('keyword');
                // if (keyword == 'WindowCenter') 
                    // readwc = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
                // if (keyword == 'WindowWidth')
                    // readww = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
                // if (keyword == 'Rows')
                    // readrow = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
                // if (keyword == 'Columns')
                    // readcol = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'SVG')
                    // readsvg = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'sx')
                    // viewPort.sx = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'sy')
                    // viewPort.sy = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'sw')
                    // viewPort.sw = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'sh')
                    // viewPort.sh = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
				// if (keyword == 'index')
                    // readindex = x[i].getElementsByTagName('Value')[0].childNodes[0].nodeValue;
                // if (keyword == 'PixelData')
					// readoffset = x[i].getAttribute('offset');
            // }
// }