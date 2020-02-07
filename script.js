// объект ВХОДНЫЕ ДАННЫЕ
let inputData = {
    // варианты набора входных данных
    variantA: [{
            name: "d1",
            value: 0,
            classname: "inD1",
            header: "d1, мм"
        },
        {
            name: "d2",
            value: 0,
            classname: "inD2",
            header: "d2, мм"
        },
        {
            name: "\u03B1",
            value: 0,
            classname: "inAlfa",
            header: "\u03B1, \u00B0"
        },
        {
            name: "S",
            value: 0,
            classname: "inS",
            header: "S, мм"
        }
    ],

    variantB: [{
            name: "d1",
            value: 0,
            classname: "inD1",
            header: "d1, мм"
        },
        {
            name: "\u03B1",
            value: 0,
            classname: "inAlfa",
            header: "\u03B1, \u00B0"
        },
        {
            name: "h",
            value: 0,
            classname: "inh",
            header: "h, мм"
        },
        {
            name: "S",
            value: 0,
            classname: "inS",
            header: "S, мм"
        }
    ],

    variantC: [{
            name: "d1",
            value: 0,
            classname: "inD1",
            header: "d1, мм"
        },
        {
            name: "d2",
            value: 0,
            classname: "inD2",
            header: "d2, мм"
        },
        {
            name: "h",
            value: 0,
            classname: "inh",
            header: "h, мм"
        },
        {
            name: "S",
            value: 0,
            classname: "inS",
            header: "S, мм"
        }
    ],

    // флаг выбора варианта набора входных данных
    variantFlag: 'variantA'
};

// объект ВЫЧИСЛЕНИЕ
let computation = {

    cone: function (dataSet) {

        let d1 = +dataSet[0].value;
        let S = +dataSet[3].value;
        let d2, alfa, h, alfaRAD;

        switch (inputData.variantFlag) {
            case "variantA":
                d2 = Number(dataSet[1].value);
                alfa = Number(dataSet[2].value);
                alfaRAD = alfa * (Math.PI / 180);
                h = (d2 - d1) / (2 * Math.tan(alfaRAD));
                break;
            case "variantB":
                alfa = Number(dataSet[1].value);
                h = Number(dataSet[2].value);
                alfaRAD = alfa * (Math.PI / 180);
                d2 = d1 + 2 * h * Math.tan(alfaRAD);
                break;
            case "variantC":
                d2 = Number(dataSet[1].value);
                h = Number(dataSet[2].value);
                alfaRAD = Math.atan((d2 - d1) / (2 * h));
                alfa = alfaRAD / (Math.PI / 180);
                break;
            default:
                // сообщение об ошибке
                console.log('error SWITСH in calculateCone');
        }

        const RO = 7.85; //плотность материала

        //блок расчета
        let sinusALFA = Math.sin(alfaRAD);
        let h1 = h + S * sinusALFA;
        let fi = 360 * sinusALFA;
        let fiRAD = fi * (Math.PI / 180);
        let R1 = d1 / (2 * sinusALFA);
        let R2 = d2 / (2 * sinusALFA);
        let A = 2 * R1 * Math.sin(fiRAD / 2);
        let B = 2 * R2 * Math.sin(fiRAD / 2);
        let F = Math.PI * (R2 * R2 - R1 * R1) * sinusALFA * Math.pow(10, -6);
        let M = RO * S * F;

        let B1, H;
        if (alfa <= 30) {
            B1 = B;
            H = R2 - R1 * Math.cos(fiRAD / 2);
        } else {
            B1 = 2 * R2;
            H = R2 * (1 + Math.sin(fiRAD / 2 - Math.PI / 2));
        }
        // конец блок расчёта


        let outData = {
            'outh': h.toFixed(2),
            'outh1': h1.toFixed(2),
            'outAlfa': alfa.toFixed(2),
            'outFi': fi.toFixed(2),
            'outR1': R1.toFixed(2),
            'outR2': R2.toFixed(2),
            'outA': A.toFixed(2),
            'outB': B.toFixed(2),
            'outB1': B1.toFixed(2),
            'outH': H.toFixed(2),
            'outF': F.toFixed(2),
            'outM': M.toFixed(2)
        };


        return outData;
    }
};

// объект ВВОД-ВЫВОД ДАННЫХ
let dataManager = {

    /**
     * функция инициализирует таблицы входных и выходных данных,
     * убирает сообщения об ошибках
     *
     * @param {Object} inDataVar - вариант набора входных данных
     */
    inDataTableInit: function (inDataVar) {
        let tableHead = document.querySelectorAll(".inData__header_cell");
        let tableRow = document.querySelectorAll(".entryField");

        for (let i = 0; i < tableHead.length; i++) {

            tableHead[i].textContent = inDataVar[i].header;
            if (tableHead[i].classList.contains("cell_red")) {
                tableHead[i].classList.remove("cell_red");
            }
            tableRow[i].setAttribute("class", ("entryField " + inDataVar[i].classname));
            tableRow[i].value = "";
            inDataVar[i].value = 0;
        }

        this.displayErrorMess("");

        let outDataRow = document.querySelectorAll('.outData__output_cell');
        outDataRow.forEach((cell) => {
            cell.textContent = "";
        });
    },

    readInput: function (cell) {
        let inData = document.getElementsByClassName(cell);
        return inData[0].value;
    },


    /**
     *метод выводит результаты на экран
     *
     * @param {Object} results - объект с результатами вычислений
     */
    writeResult (results) {
        for (let name in results) {
            let outData = document.querySelector(`.${name}`);
            outData.textContent = results[name]
        }
    },

    wrongInputData: function (dataSet) { // проверяем полноту (ячейка ввода не пустая) и корректность входных данных (неотрицательное числовое значение)
        var inData = document.getElementsByClassName("entryField");
        var inDataHeader = document.getElementsByClassName("inData__header_cell");
        var wrongData = []; // массив будет собирать индексы ячеек с некорректно введенными данными
        var errCells = " ";
        for (var cellIndex = 0; cellIndex < inData.length; cellIndex++) {
            if (isNaN(inData[cellIndex].value) || inData[cellIndex].value <= 0) {
                wrongData.push(cellIndex);
            };
        };
        if (wrongData.length > 0) {
            for (var i = 0; i < wrongData.length; i++) {
                errCells = errCells + dataSet[wrongData[i]].name + ", ";
            };
            for (var j = 0; j < inDataHeader.length; j++) {
                if (wrongData.includes(j)) {
                    if (!inDataHeader[j].classList.contains("cell_red")) {
                        inDataHeader[j].classList.add("cell_red")
                    };
                } else {
                    if (inDataHeader[j].classList.contains("cell_red")) {
                        inDataHeader[j].classList.remove("cell_red")
                    };
                }
            }
            this.displayErrorMess("Введите корректное значение для:" + errCells.slice(0, -2) + ".");
            return true;
        }
        for (let i = 0; i < inDataHeader.length; i++) {
            if (inDataHeader[i].classList.contains("cell_red")) {
                inDataHeader[i].classList.remove("cell_red")
            };
        };
        this.displayErrorMess("");
        return false;
    },


    /**
     *метод выводит сообщение об ошибке
     *
     * @param {string} msg - текст сообщения
     */
    displayErrorMess(msg) {
        let messageArea = document.querySelector(".errorMess");
        messageArea.textContent = msg;
    },

    clearRow: function (row) {
        var dataRow = document.getElementsByClassName(row);
        for (var i = 0; i < dataRow.length; i++) {
            dataRow[i].textContent = "";
        };
    }
};


/**
 *функция инициализации приложения
 *
 */
function init() {

    const calcBtn = document.querySelector(".buttCalculate");
    calcBtn.addEventListener('click', handleCalculate);

    const radioBtns = document.querySelectorAll(".inDataChoice");
    radioBtns.forEach((btn) => {
        btn.addEventListener('click', handleChoice);
    });
}


/**
 *функция инициализирует таблицу входных данных,
 *в зависимости от выбранного варианта этих данных
 *
 * @param {} event - клик на радио кнопке
 */
function handleChoice(event) {

    dataManager.inDataTableInit(inputData[event.target.value]);
    inputData.variantFlag = event.target.value;
}

function handleCalculate() {

    let inData = inputData[inputData.variantFlag];

    for (let i = 0; i < inData.length; i++) {
        inData[i].value = dataManager.readInput(inData[i].classname);
    }

    if (dataManager.wrongInputData(inData)) { //очищаем строку с результатами и выходим
        dataManager.clearRow('outData__output_cell');
        return;
    }

    let calcResults = computation.cone(inData);
    dataManager.writeResult(calcResults);
    // for (let i = 0; i < calcResults.length; i++) {
    //     dataManager.writeResult(calcResults[i].classname, calcResults[i].value);
    // }
}

init();