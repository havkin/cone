// объект ВХОДНЫЕ ДАННЫЕ
let inputData = {
    // варианты набора входных данных
    variantA: ["inD1", "inD2", "inAlfa", "inS"],

    variantB: ["inD1", "inAlfa", "inh", "inS"],

    variantC: ["inD1", "inD2", "inh", "inS"],

    variantFlag: 'variantA'
};

const headers = {
    'inD1': "d1, мм",
    'inD2': "d2, мм",
    'inAlfa': "\u03B1, \u00B0",
    'inS': "S, мм",
    'inh': "h, мм"
};


// объект ВЫЧИСЛЕНИЕ
let computation = {

    cone: function (dataSet) {

        let d1 = +dataSet[0];
        let S = +dataSet[3];
        let d2, alfa, h, alfaRAD;

        switch (inputData.variantFlag) {
            case "variantA":
                d2 = +dataSet[1];
                alfa = +dataSet[2];
                alfaRAD = alfa * (Math.PI / 180);
                h = (d2 - d1) / (2 * Math.tan(alfaRAD));
                break;
            case "variantB":
                alfa = +dataSet[1];
                h = +dataSet[2];
                alfaRAD = alfa * (Math.PI / 180);
                d2 = d1 + 2 * h * Math.tan(alfaRAD);
                break;
            case "variantC":
                d2 = +dataSet[1];
                h = +dataSet[2];
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
    inDataTableInit: function () {
        let tableHead = document.querySelectorAll(".inData__header_cell");
        let tableRow = document.querySelectorAll(".entryField");
        let inDataVar = inputData[inputData.variantFlag];

        for (let i = 0; i < tableHead.length; i++) {

            tableHead[i].textContent = headers[inDataVar[i]];

            tableRow[i].setAttribute("class", ("entryField " + inDataVar[i]));
            tableRow[i].value = "";
        }

        let outDataRow = document.querySelectorAll('.outData__output_cell');
        outDataRow.forEach((cell) => {
            cell.textContent = "";
        });

        const calcBtn = document.querySelector(".buttCalculate");
        calcBtn.setAttribute('disabled', 'disabled');
    },

    
    /**
     *метод считывает введенные данные
     *
     * @returns {Array} возвращает массив значений
     */
    readInput () {

        let inData = [...document.querySelectorAll('.entryField')];
        return inData.map((cell) => cell.value);
    },


    /**
     *метод выводит результаты на экран
     *
     * @param {Object} results - объект с результатами вычислений
     */
    writeResult(results) {

        for (let name in results) {
            let outData = document.querySelector(`.${name}`);
            outData.textContent = results[name];
        }
    },
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

    const entryFields = document.querySelectorAll(".entryField");
    entryFields.forEach((cell) => {
        cell.addEventListener('keypress', inDataCheck);
        cell.addEventListener('input', completeDataCheck);
    });
}


/**
 *функция позволяет вводить только цифры и одну разделительную точку
 *
 * @param {*} event
 */
function inDataCheck(event) {
    if (!(/\d|\./).test(event.key)) {
        event.preventDefault();
    }
    if (event.key === '.' && event.target.value.includes('.')) {
        event.preventDefault();
    }
}


/**
 *функция разблокирует кнопку "Рассчитать"
 *при заполнении всех входных данных и наоборот
 */
function completeDataCheck() {
    const entryFields = [...document.querySelectorAll(".entryField")];
    const calcBtn = document.querySelector(".buttCalculate");
    if (entryFields.every((cell) => cell.value)) {
        calcBtn.removeAttribute('disabled');
    } else {
        calcBtn.setAttribute('disabled', 'disabled');
    }
}

/**
 *функция инициализирует таблицу входных данных,
 *в зависимости от выбранного варианта этих данных
 *
 * @param {} event - клик на радио кнопке
 */
function handleChoice(event) {

    inputData.variantFlag = event.target.value;
    dataManager.inDataTableInit();
}

function handleCalculate() {

    let calcResults = computation.cone( dataManager.readInput() );
    dataManager.writeResult( calcResults );
}

init();