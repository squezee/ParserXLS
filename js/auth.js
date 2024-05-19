function showErrorMessage(msg){
    let errorBlock = document.querySelector('.errorBlock');
            errorBlock.innerHTML = msg;
            errorBlock.style.display = "block";
            setTimeout(() => {
                errorBlock.style.display = "none";
              }, 3000);
}

document.querySelector(".submitBtn").onclick = async function(){
    const password = document.querySelector("#password").value;
    const user = document.querySelector("#user").value;
    const response = await fetch("api/auth.php",{
        method: "POST",
        headers: {"Accept":"application/json"},
        body: JSON.stringify({
            password: password,
            user: user
        })
    });
    if(response.ok){
        const  responseData = await response.json();
        if(responseData.msg=="1045"){
            showErrorMessage("Неверные данные!");
        }else if(responseData.msg=="success"){
            window.location.href="/";
        }
    }
};