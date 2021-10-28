
	function getFHIR(){
		var val= document.getElementById("fhirObsID").value;	//1611480; //1498880;//document.getElementById("fhirObsID").value;
		initialization();
		var FHIRServer= "http://203.64.84.213:8080/fhir/Observation/";//"http://hapi.fhir.org/baseR4/Observation/";	//"http://203.64.84.213:8080/fhir/" //"https://hapi.fhir.tw/fhir/"
		FHIRServer+= val;
		
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", FHIRServer, true);
		xhttp.onreadystatechange = function (){
			if (this.readyState == 4){ 
				showOutput(this.responseText);
			}
		};
		xhttp.send();
	}
	
	function showOutput(str){
		var jsonOBJ =JSON.parse(str);
		//alert(jsonOBJ);
		if (jsonOBJ.total == 0)	alert('data unexist');
		else{
			defaultSetting.samplesPerPixel=1;
			defaultSetting.storedBytes=2;
			defaultSetting.modalityType= jsonOBJ.code.coding[0].code;
			defaultSetting.UID= jsonOBJ.identifier[0].value;
			sourceImage.width= parseInt(jsonOBJ.component[1].valueString);
			sourceImage.height= parseInt(jsonOBJ.component[2].valueString);
			defaultSetting.windowCenter= parseInt(jsonOBJ.component[3].valueString);
			defaultSetting.windowWidth= parseInt(jsonOBJ.component[4].valueString);
			defaultSetting.pixelDataOffset= parseInt(jsonOBJ.component[5].valueString);
			sourceImage.dcmFile= jsonOBJ.component[6].valueString;
			var base64= jsonOBJ.component[0].valueString;
			var svg= atob(base64);
			var svgIndex=0;
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(svg,"text/xml");
			if(xmlDoc.getElementsByTagName("text")[svgIndex]!=null){
				var type= xmlDoc.getElementsByTagName("text")[svgIndex];
				var x= type.getAttribute('x');
				var y= type.getAttribute('y');
				var val= type.childNodes[0].nodeValue;
				var fontColor= type.getAttribute('fill');
				var fontSize= type.getAttribute('font-size');
				
				svgText[text][0]= parseInt(x);
				svgText[text][1]= parseInt(y);
				svgText[text][2]= val;
				svgText[text][3]= fontColor;
				svgText[text][4]= fontSize + "px Arial";
				text++;
				svgIndex++;
			}
			else if(xmlDoc.getElementsByTagName("line")[svgIndex]!=null){
				var type= xmlDoc.getElementsByTagName("line")[svgIndex];
				var x1= type.getAttribute('x1');
				var y1= type.getAttribute('y1');
				var x2= type.getAttribute('x2');
				var y2= type.getAttribute('y2');
				var strokeColor= type.getAttribute('stroke');
				var strokeWidth= parseInt(type.getAttribute('stroke-width'));
				
				svgLine[line][0]= parseInt(x1);
				svgLine[line][1]= parseInt(y1);
				svgLine[line][2]= parseInt(x2);
				svgLine[line][3]= parseInt(y2);
				svgLine[line][4]= strokeColor;
				svgLine[line][5]= parseInt(strokeWidth);
				line++;
				svgIndex++;
			}
			else if(xmlDoc.getElementsByTagName("ellipse")[svgIndex]!=null){
				var type= xmlDoc.getElementsByTagName("ellipse")[svgIndex];
				var cx= type.getAttribute('cx');
				var cy= type.getAttribute('cy');
				var rx= type.getAttribute('rx');
				var ry= type.getAttribute('ry');
				var strokeColor= type.getAttribute('stroke');
				var strokeWidth= parseInt(type.getAttribute('stroke-width'));
				
				svgEllipse[ellipse][0]= parseInt(cx);
				svgEllipse[ellipse][1]= parseInt(cy);
				svgEllipse[ellipse][2]= parseInt(rx);
				svgEllipse[ellipse][3]= parseInt(ry);
				svgEllipse[ellipse][4]= strokeColor;
				svgEllipse[ellipse][5]= strokeWidth;
				ellipse++;
				svgIndex++;
			}
			else if(xmlDoc.getElementsByTagName("rect")[svgIndex]!=null){
				var type= xmlDoc.getElementsByTagName("rect")[svgIndex];
				var x= parseInt(type.getAttribute('x'));
				var y= parseInt(type.getAttribute('y'));
				var w= parseInt(type.getAttribute('width'));
				var h= parseInt(type.getAttribute('height'));
				var strokeColor= type.getAttribute('stroke');
				var strokeWidth= parseInt(type.getAttribute('stroke-width'));
				
				svgRect[rect][0]= x;
				svgRect[rect][1]= y;
				svgRect[rect][2]= x+w;
				svgRect[rect][3]= y+h;
				svgRect[rect][4]= strokeColor;
				svgRect[rect][5]= strokeWidth;
				rect++;
				svgIndex++;
			}
			var xmlText = new XMLSerializer().serializeToString(xmlDoc);			
		}
		getDCM();
	}
	
	var minPixel = 99999, maxPixel = -99999;		
	function findMinMaxPixelValue() {
		
		for (y = 0; y < sourceImage.height; y++) {
			for (x = 0; x < sourceImage.width; x++) {
				// Get DICOM image pixel index
				if(y== 509 && x==200)
					var xxx=1;
				dicomPixelIndex = (y * sourceImage.width + x) * defaultSetting.samplesPerPixel * defaultSetting.storedBytes + defaultSetting.pixelDataOffset;
				pixelValue = dicomData.getUint16(dicomPixelIndex, true); // true for littel endian
				if (pixelValue > maxPixel) maxPixel = pixelValue;
				if (pixelValue < minPixel) minPixel = pixelValue;
			}
		}
		defaultSetting.maxPixelValue= maxPixel;
		defaultSetting.minPixelValue= minPixel;
	}
	
	var lut= new Array();
	function generateLUT() {
		let grayValue;
		defaultSetting.maxPixelValue = Math.round(defaultSetting.windowCenter + defaultSetting.windowWidth / 2);
		defaultSetting.minPixelValue = Math.round(defaultSetting.windowCenter - defaultSetting.windowWidth / 2);
		for (let storedValue = minPixel; storedValue <= maxPixel; storedValue++) {
			if (storedValue >= defaultSetting.maxPixelValue) grayValue = 255;
			else if (defaultSetting.minPixelValue > storedValue) grayValue = 0;
			else grayValue = Math.round((storedValue - defaultSetting.minPixelValue) / defaultSetting.windowWidth * 256);
			
			lut[storedValue + (-defaultSetting.minPixelValue)] = grayValue;
		}
	}
	
	function storedPixelValueToCanvas(ctx, scaleWidth, scaleHeight, pPanX, pPanY){
		let grayValue, canvasPixelIndex;
		imageData = ctx.getImageData(0, 0, scaleWidth, scaleHeight)		//seolah2 taro di canvas baru dgn size ssuai size ori image (vw & vh)
		for (y = 0; y < scaleHeight; y++) {		
			for (x = 0; x < scaleWidth; x++) {
				pixelx = parseInt(x * (sourceImage.width/ scaleWidth));
				pixely = parseInt(y * (sourceImage.height/ scaleHeight));
			
				if (pixelx >= 0 && pixelx < sourceImage.width && pixely >= 0 && pixely < sourceImage.height) {
					dicomPixelIndex = (pixely * sourceImage.width + pixelx) * defaultSetting.samplesPerPixel * defaultSetting.storedBytes + defaultSetting.pixelDataOffset;
					pixelValue = dicomData.getUint16(dicomPixelIndex, true); // true for littel endian
					grayValue = lut[pixelValue + (-defaultSetting.minPixelValue)];
				
					canvasPixelIndex = (y * scaleWidth + x) * 4;
					
					imageData.data[canvasPixelIndex] = grayValue;    
					imageData.data[canvasPixelIndex + 1] = grayValue; 
					imageData.data[canvasPixelIndex + 2] = grayValue; 
					imageData.data[canvasPixelIndex + 3] = 255;   
				}
				else {
					imageData.data[canvasPixelIndex] = 0;     // Red
					imageData.data[canvasPixelIndex + 1] = 0; // Green
					imageData.data[canvasPixelIndex + 2] = 0;  // Blue
					imageData.data[canvasPixelIndex + 3] = 255;   // Alpha
				}
			}
		}
		ctx.putImageData(imageData, pPanX, pPanY);
	}