// объект ВХОДНЫЕ ДАННЫЕ
let inputData = {
    // варианты набора входных данных
    variantA: [ {name: "d1", value: 0, classname: "inD1", header: "d1, мм"}, 
                {name: "d2", value: 0, classname: "inD2", header: "d2, мм"}, 
                {name: "\u03B1", value: 0, classname: "inAlfa", header: "\u03B1, \u00B0"}, 
                {name: "S", value: 0, classname: "inS", header: "S, мм"}],

    variantB: [ {name: "d1", value: 0, classname: "inD1", header: "d1, мм"}, 
                {name: "\u03B1", value: 0, classname: "inAlfa", header: "\u03B1, \u00B0"}, 
                {name: "h", value: 0, classname: "inh", header: "h, мм"},
                {name: "S", value: 0, classname: "inS", header: "S, мм"}],

    variantC: [ {name: "d1", value: 0, classname: "inD1", header: "d1, мм"}, 
                {name: "d2", value: 0, classname: "inD2", header: "d2, мм"}, 
                {name: "h", value: 0, classname: "inh", header: "h, мм"}, 
                {name: "S", value: 0, classname: "inS", header: "S, мм"}],

    // флаг выбора варианта набора входных данных
    variantFlag: 'A'
}

// объект ВЫЧИСЛЕНИЕ
var computation = {
    okrugl: function  (x, y) { // округляет число X  на Y знаков после запятой
        return Math.round (x*Math.pow(10, y))/Math.pow (10, y);
    },

    cone: function  (dataSet) {
        var d1, d2, alfa, h, S, alfaRAD;
        switch (inputData.variantFlag){
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
        h1 = h + S*sinusALFA;
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
        };// конец блок рассчета
        
        
        var outData = [  
            {classname: "outh",    value: this.okrugl (h, 2)},
            {classname: "outh1",   value: this.okrugl (h1, 2)},
            {classname: "outAlfa", value: this.okrugl (alfa, 2)},
            {classname: "outFi",   value: this.okrugl (fi, 2)},
            {classname: "outR1",   value: this.okrugl (R1, 2)},
            {classname: "outR2",   value: this.okrugl (R2, 2)},
            {classname: "outA",    value: this.okrugl (A, 2)},
            {classname: "outB",    value: this.okrugl (B, 2)},
            {classname: "outB1",   value: this.okrugl (B1, 2)},
            {classname: "outH",    value: this.okrugl (H, 2)},
            {classname: "outF",    value: this.okrugl (F, 2)},
            {classname: "outM",    value: this.okrugl (M, 2)}];
        
        return outData;
    }
    
};

// объект ВВОД-ВЫВОД ДАННЫХ
var dataManager = {
    inDataTableInit: function  (inDataVar){
        var tableHead = document.getElementsByClassName ("inData__header__cell");
        var tableRow = document.getElementsByClassName ("entryField");
    
        for (var i=0; i<tableHead.length; i++){
            tableHead[i].textContent = inDataVar[i].header;
            tableRow[i].setAttribute("class", ("entryField " + inDataVar[i].classname));
            tableRow[i].value = "";
            inDataVar[i].value = 0;
        };
        
        this.displayErrorMess ("");

        var inDataHeader = document.getElementsByClassName ("inData__header__cell");
        for (var i=0; i<inDataHeader.length; i++) {
            if (inDataHeader[i].classList.contains("cell_red")) { inDataHeader[i].classList.remove("cell_red")};
        };
        var outDataRow = document.getElementsByClassName ('outData__output__cell');
        for (var i=0; i<outDataRow.length; i++) {
            outDataRow[i].textContent = "";
        };
    },

    readInput: function  (cell) {
        var inData = document.getElementsByClassName (cell);
        return inData [0].value; 
    },

    writeResult: function  (cell, dataVar) {
        var outData = document.getElementsByClassName (cell);
        outData [0].textContent = dataVar;
    },

    wrongInputData: function  (dataSet) { // проверяем полноту (ячейка ввода не пустая) и корректность входных данных (неотрицательное числовое значение)
        var inData = document.getElementsByClassName ("entryField");
        var inDataHeader = document.getElementsByClassName ("inData__header__cell");
        var wrongData = []; // массив будет собирать индексы ячеек с некорректно введенными данными
        var errCells =" ";
        for (var cellIndex=0; cellIndex<inData.length; cellIndex++) {
            if ( isNaN(inData[cellIndex].value) || inData[cellIndex].value <= 0) {
                wrongData.push (cellIndex);
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
            this.displayErrorMess ("Введите корректное значение для:" + errCells.slice(0, -2) + ".");
            return true;
        };
        for (var i=0; i<inDataHeader.length; i++) {
            if (inDataHeader[i].classList.contains("cell_red")) { inDataHeader[i].classList.remove("cell_red")};
        };
        this.displayErrorMess ("");
        return false;
    },

    displayErrorMess: function  (msg) {
        var messageArea = document.getElementsByClassName("errorMess");
        messageArea[0].textContent = msg;
    },

    clearRow: function (row) {
        var dataRow = document.getElementsByClassName (row);
        for (var i=0; i<dataRow.length; i++) {
            dataRow[i].textContent = "";
        };
    }
};


/**
 *функция инициализации приложения
 *
 */
function init () {

    const calcBtn = document.querySelector (".buttCalculate");
    calcBtn.addEventListener('click', handleCalculate);

    const radioBtns = document.querySelectorAll (".inDataChoice");
    radioBtns.forEach((btn) => {
        btn.addEventListener('click', handleChoice);
    });
}

function handleChoice(eventObj) {
    var guess = eventObj.target;
    switch (guess.value){
        case "A":
            dataManager.inDataTableInit (inputData.variantA);
            inputData.variantFlag = 'A';
            break;
        case "B":
            dataManager.inDataTableInit (inputData.variantB);
            inputData.variantFlag = 'B';
            break;
        case "C":
            dataManager.inDataTableInit (inputData.variantC);
            inputData.variantFlag = 'C';
            break;
        default:
        // сообщение об ошибке
        console.log ('error SWITCH in handleChoice');
    };
};

function handleCalculate () {
    var inData = [];
    switch (inputData.variantFlag){
        case "A":
            inData = inputData.variantA;
            break;
        case "B":
            inData = inputData.variantB;
            break;
        case "C":
            inData = inputData.variantC;
            break;
        default:
        // сообщение об ошибке
        console.log ('error SWITCH in handleCalculate');
    };
    for (var i=0; i<inData.length; i++) {
        inData[i].value = dataManager.readInput (inData[i].classname);
    };
    if (dataManager.wrongInputData(inData)) { //очищаем строку с результатами и выходим
        dataManager.clearRow('outData__output__cell');
        return;
    };        
    var calcResults = computation.cone (inData);
    for (var i=0; i<calcResults.length; i++){
            dataManager.writeResult (calcResults[i].classname, calcResults[i].value);
    };
};

init ();