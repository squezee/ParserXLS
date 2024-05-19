async function init(){
    const response = await fetch("api/init.php", {
        method: "GET"
    });
    if(response.ok){
        
        const responseData = await response.json();
        console.log(responseData);
        console.log(responseData.msg=="success");
        if(responseData.msg=="success"){
            window.location.href="parser.html";
        }else{
            window.location.href="auth.html";
        }
    }
    
}
init();