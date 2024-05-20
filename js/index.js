var COLS = [];
function showErrorMessage(msg){
    let errorBlock = document.querySelector('.errorBlock');
            errorBlock.innerHTML = msg;
            errorBlock.style.display = "block";
            setTimeout(() => {
                errorBlock.style.display = "none";
              }, 3000);
}
async function getCols(){
    const response = await fetch("api/getCols.php",{
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    if(response.ok){
        const responseData = await response.json();
        COLS = responseData;
        console.log(responseData);
    }
}
getCols();

class Condition{
    constructor(name, col, value) {
        this.name = name;
        this.col = col;
        this.value = value;
    }
}
class Range{
    constructor(col, left, right) {
        this.left = left;
        this.col = col;
        this.right = right;
        this.name = "range";
    }
}
document.querySelector(".findBtn").addEventListener('click',async function(e) {
    let maxSize = document.querySelector('.setMaxSize input').value;
    let isNumber = /^\d+$/.test(maxSize);

    if(isNumber){
        conditions = [];
        document.querySelectorAll(".conditionBlock").forEach(element => {
            const name = element.className.split(" ")[1];
            if(name!="range"){
                const newCondition = new Condition(
                    name,
                    element.querySelector('select').value,
                    element.querySelector('input').value
                );
                conditions.push(newCondition);
            }else{
                const newCondition = new Range(
                    element.querySelector('select').value,
                    element.querySelector('input.left').value,
                    element.querySelector('input.right').value
                );
                conditions.push(newCondition);
            }
        });
        const response = await fetch("api/parse.php", {
            method: "POST",
            headers: {"Content-Type":"application/json", "Accept": "application/json"},
            body: JSON.stringify({
                conditions: conditions,
                rowsToFind: maxSize
            })
        });
        if(response.ok){
            document.querySelector('.resultContent').innerHTML = "";
            const responseData = await response.json();
            console.log(responseData);
            responseData.forEach(element => {
                if(element[0]!=""&&element[0]!=null){
                    let items = "";
                    let i = 0;
                    element.forEach(item => {
                        
                        items = items + `
                        <div class="resultItemValueAndLabel">
                                <div class="label">${COLS[i]}:</div>
                                <div class="value">${item}</div>
                        </div>
                        `;
                        i++;
                    });
                    document.querySelector('.resultContent').innerHTML = document.querySelector('.resultContent').innerHTML + `
                        <div class="resultItem">
                        ${items}
                    </div>
                    `;
                }
                
            });
        }
    }else{
        showErrorMessage("Неккоректные данные!");
    }
    
});
var addBtns = document.querySelectorAll(".addConditionBtn");
for (var i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener('click',e => {
        let options = "";
        COLS.forEach(element => {
            options = options + `<option value="${element}">${element}</option>`;
        });
        let element = document.createElement("div");
        switch(e.target.className.split(" ")[1]){
            case "forValue":
                element.className="conditionBlock forValue";
                element.innerHTML = ` 
                
                            <div class="conditionLabel">По значению -></div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Колонка:</div>
                                <div class="conditionInput selectCols">
                                    <select name="col">
                                        ${options}
                                    </select>
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Значение:</div>
                                <div class="conditionInput value">
                                    <input type="text" placeholder="Значение">
                                </div>
                            </div>
                        
                `;
                break;
            case "range":
                element.className="conditionBlock range";
                element.innerHTML = ` 
                
                            <div class="conditionLabel">Диапазон -></div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Колонка:</div>
                                <div class="conditionInput selectCols">
                                    <select name="col">
                                    ${options}
                                    </select>
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">От:</div>
                                <div class="conditionInput smallInput value">
                                    <input class="left" type="text" placeholder="Значение">
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">до:</div>
                                <div class="conditionInput smallInput value">
                                    <input class="right" type="text" placeholder="Значение">
                                </div>
                            </div>
                        
                `;
                break;
            case "startedBy":
                element.className="conditionBlock startedBy";
                element.innerHTML = ` 
                
                            <div class="conditionLabel">Начинается на -></div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Колонка:</div>
                                <div class="conditionInput selectCols">
                                    <select name="col">
                                    ${options}
                                    </select>
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Значение:</div>
                                <div class="conditionInput value">
                                    <input type="text" placeholder="Значение">
                                </div>
                            </div>
                       
                `;
                break;
            case "endedBy":
                element.className="conditionBlock endedBy";
                element.innerHTML = ` 
                
                            <div class="conditionLabel">Заканчивается на -></div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Колонка:</div>
                                <div class="conditionInput selectCols">
                                    <select name="col">
                                    ${options}
                                    </select>
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Значение:</div>
                                <div class="conditionInput value">
                                    <input type="text" placeholder="Значение">
                                </div>
                            </div>
                        
                `;
                break;
            case "contains":
                element.className="conditionBlock contains";
                element.innerHTML = ` 
                            <div class="conditionLabel">Содержит -></div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Колонка:</div>
                                <div class="conditionInput selectCols">
                                    <select name="col">
                                    ${options}
                                    </select>
                                </div>
                            </div>
                            <div class="conditionInputAndLabel">
                                <div class="label">Значение:</div>
                                <div class="conditionInput value">
                                    <input type="text" placeholder="Значение">
                                </div>
                            </div>
                        
                `;
                break;
        }
        let btn = document.querySelector('.addBtn');
        document.querySelector(".parserQueueInner").insertBefore(element, btn);
    });
}
