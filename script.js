// возможные входные данные
var inD1 = {name: "d1", value: 0, classname: "inD1", header: "d1, мм"};
var inD2 = {name: "d2", value: 0, classname: "inD2", header: "d2, мм"};
var inAlfa = {name: "\u03B1", value: 0, classname: "inAlfa", header: "\u03B1, \u00B0"};
var inh = {name: "h", value: 0, classname: "inh", header: "h, мм"};
var inS = {name: "S", value: 0, classname: "inS", header: "S, мм"};

// варианты набора входных данных
var inputDataVariantA = [ inD1, inD2, inAlfa, inS ];
var inputDataVariantB = [ inD1, inAlfa, inh, inS ];
var inputDataVariantC = [ inD1, inD2, inh, inS ];

// набор расчетных данных - ПЕРЕРАБОТАТЬ
var outputData = [{name: "h", value: 0, classname: "outh"},
                {name: "h1", value: 0, classname: "outh1"},
                {name: "\u03B1", value: 0, classname: "outAlfa"},
                {name: "fi", value: 0, classname: "outFi"},
                {name: "R1", value: 0, classname: "outR1"},
                {name: "R2", value: 0, classname: "outR2"},
                {name: "A", value: 0, classname: "outA"},
                {name: "B", value: 0, classname: "outB"},
                {name: "B1", value: 0, classname: "outB1"},
                {name: "H", value: 0, classname: "outH"},
                {name: "F", value: 0, classname: "outF"},
                {name: "M", value: 0, classname: "outM"}];

// флаг выбора варианта набора входных данных
var inDataVariantFlag = 'A';

function Okrugl (x, y) { // округляет число X  на Y знаков после запятой, не добавляет нули
    return Math.round (x*Math.pow(10, y))/Math.pow (10, y);
};
function init () {
    var start = document.getElementsByClassName ("buttCalculate");
    start [0].onclick = handleCalculate;
    var radio = document.getElementsByClassName ("inDataChoice");
    for (var i=0; i<radio.length; i++) {
        radio[i].onclick = handleChoice;
    };
};

function handleChoice(eventObj) {
    var guess = eventObj.target;
    switch (guess.value){
        case "A":
            inDataTableInit (inputDataVariantA);
            inDataVariantFlag = 'A';
            break;
        case "B":
            inDataTableInit (inputDataVariantB);
            inDataVariantFlag = 'B';
            break;
        case "C":
            inDataTableInit (inputDataVariantC);
            inDataVariantFlag = 'C';
            break;
        default:
        // сообщение об ошибке
        console.log ('error SWITH in handleChoice');
    };
};

function handleCalculate () {
    var inputData = [];
    switch (inDataVariantFlag){
        case "A":
            inputData = inputDataVariantA;
            break;
        case "B":
            inputData = inputDataVariantB;
            break;
        case "C":
            inputData = inputDataVariantC;
            break;
        default:
        // сообщение об ошибке
        console.log ('error SWITCH in handleCalculate');
    };
    for (var i=0; i<inputData.length; i++) {
        inputData[i].value = readInput (inputData[i].classname);
    };
    if (wrongInputData(inputData)) { //очищаем строку с результатами и выходим
        var outDataRow = document.getElementsByClassName ('outData__output__cell');
        for (var i=0; i<outDataRow.length; i++) {
            outDataRow[i].textContent = "";
        };
        return;
    };        
    calculateCone (inputData);
    for (var i=0; i<outputData.length; i++){
            writeResult (outputData[i].classname, outputData[i].value);
    };
};
function readInput (cell) {
    var inData = document.getElementsByClassName (cell);
    return inData [0].value; 
};
function writeResult (cell, dataVar) {
    var outData = document.getElementsByClassName (cell);
    outData [0].textContent = dataVar;
};
function wrongInputData (dataSet) { // проверяем полноту и корректность входных данных
    var inData = document.getElementsByClassName ("entryField");
    var inDataHeader = document.getElementsByClassName ("inData__header__cell");
    var wrongData = [];
    var errCells =" ";
    for (var i=0; i<inData.length; i++) {
        if (inData[i].value.match(/^\d+(\.\d+)?$/) == null || inData[i].value <= 0) {
            wrongData.push (i);
        };        
    };
    if (wrongData.length > 0) {
        for (var i=0; i<wrongData.length; i++) {
            errCells = errCells + dataSet[wrongData[i]].name + ", ";                     
        };
        for (var j=0; j<inDataHeader.length; j++) {
            if (wrongData.includes(j)) {
                if (!inDataHeader[j].classList.contains("cell_red")) { 
                    inDataHeader[j].classList.add("cell_red")};
            } else { 
                if (inDataHeader[j].classList.contains("cell_red")) { 
                    inDataHeader[j].classList.remove("cell_red")};
            };
        };
        displayErrorMess ("Введите корректное значение для:" + errCells.slice(0, -2) + ".");
        return true;
    };
    for (var i=0; i<inDataHeader.length; i++) {
        if (inDataHeader[i].classList.contains("cell_red")) { inDataHeader[i].classList.remove("cell_red")};
    };
    displayErrorMess ("");
    return false;
};
function displayErrorMess (msg) {
    var messageArea = document.getElementsByClassName("errorMess");
    messageArea[0].textContent = msg;
};
function calculateCone (dataSet) {
    var d1, d2, alfa, h, S, alfaRAD;
    switch (inDataVariantFlag){
        case "A":
            d1 = Number(dataSet[0].value); // может заменить на parseFloat ?
            d2 = Number(dataSet[1].value);
            alfa = Number(dataSet[2].value);
            S = Number(dataSet[3].value);
            alfaRAD = alfa*(Math.PI/180);
            h = (d2 - d1)/(2*Math.tan(alfaRAD));
            break;
        case "B":
            d1 = Number(dataSet[0].value);
            alfa = Number(dataSet[1].value);
            h = Number(dataSet[2].value);
            S = Number(dataSet[3].value); 
            alfaRAD = alfa*(Math.PI/180);
            d2 = d1 + 2 * h * Math.tan(alfaRAD); 
            break;
        case "C":
            d1 = Number(dataSet[0].value);
            d2 = Number(dataSet[1].value);
            h = Number(dataSet[2].value);
            S = Number(dataSet[3].value);
            alfaRAD = Math.atan((d2 - d1) / (2 * h));
            alfa = alfaRAD / (Math.PI/180);
            break;
        default:
        // сообщение об ошибке
        console.log ('error SWITСH in calculateCone');
    };
    var h1, fi, R1, R2, A, B, B1, H, F, M;
    const RO = 7.85 //плотность материала

    //блок расчета
    var sinusALFA = Math.sin(alfaRAD);
    h1 = h+S*sinusALFA; 
    fi = 360*sinusALFA;
    var fiRAD = fi*(Math.PI/180);
    R1 = d1/(2*sinusALFA);
    R2 = d2/(2*sinusALFA);
    A = 2*R1*Math.sin(fiRAD/2);
    B = 2*R2*Math.sin(fiRAD/2);
    F = Math.PI*(R2*R2 - R1*R1)*sinusALFA*Math.pow(10, -6);
    M = RO*S*F;
    if (alfa <= 30) {
        B1 = B;
        H = R2 - R1*Math.cos(fiRAD/2);
    } else {
        B1 = 2*R2;
        H = R2* (1 + Math.sin(fiRAD/2 - Math.PI/2));
    };
    // конец блок рассчета

    outputData[0].value = Okrugl (h, 2);
    outputData[1].value = Okrugl (h1, 2);
    outputData[2].value = Okrugl (alfa, 2);
    outputData[3].value = Okrugl (fi,2);
    outputData[4].value = Okrugl (R1,2);
    outputData[5].value = Okrugl (R2,2);
    outputData[6].value = Okrugl (A,2);
    outputData[7].value = Okrugl (B,2);
    outputData[8].value = Okrugl (B1,2);
    outputData[9].value = Okrugl (H,2);
    outputData[10].value = Okrugl (F,2);
    outputData[11].value = Okrugl (M,2);
};

function inDataTableInit (inDataVar){
    var tableHead = document.getElementsByClassName ("inData__header__cell");
    var tableRow = document.getElementsByClassName ("entryField");

    for (var i=0; i<tableHead.length; i++){
        tableHead[i].textContent = inDataVar[i].header;
        tableRow[i].setAttribute("class", ("entryField " + inDataVar[i].classname));
        tableRow[i].value = "";
        inDataVar[i].value = 0;
    };
    // выделить код ниже в отдельную функцию или нет
    // стираем строку ввода и убираем красны для заголовка
    displayErrorMess ("");
    var inDataHeader = document.getElementsByClassName ("inData__header__cell");
    for (var i=0; i<inDataHeader.length; i++) {
        if (inDataHeader[i].classList.contains("cell_red")) { inDataHeader[i].classList.remove("cell_red")};
    };
    // стираем строку вывода
    var outDataRow = document.getElementsByClassName ('outData__output__cell');
    for (var i=0; i<outDataRow.length; i++) {
        outDataRow[i].textContent = "";
    };
};

init ();