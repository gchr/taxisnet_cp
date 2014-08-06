// ==UserScript==
// @name Rearrange TaxisNET
// @description Rearranges TaxisNet Debts for easier copy paste
// @homepageURL https://github.com/gchr/taxisnet_cp/blob/master/README.md
// @updateURL https://github.com/gchr/taxisnet_cp/blob/master/taxisnet_easy_cp.user.js
// @author GChr
// @version 0.2
// @date 2014-08-06
// @namespace http://brainworks.gr
// @include https://www1.gsis.gr/taxisnet/info/protected/displayDebtInfo.htm
// @match https://www1.gsis.gr/taxisnet/info/protected/displayDebt*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @run-at document-end
// @license MIT License
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAB3RJTUUH2wMOCgIoGUYEAQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAARnQU1BAACxjwv8YQUAAAGSUExURfi/JO/v797e3sbGxq2traWlpZSUlJycnNbW1oyEhIRaWow5OZQhIZwYGKUQEKUICK0ICJQxMYxKSoxzc4x7e4RCQpQYGKUAAK0AALUAAL0AAK0QEIxra5QpKa0YGIxSUsYAAKUhIZR7e87Ozr0ICJRSUr29vYxjY6U5OaUpKa0hIb21tZwAALUICO/Ozu/GxqUxMZSEhLUYGO/W1r0YGKVCQpQQEL0pKffe3vfW1pxra5Q5OcZCQvfn585CQr2trZx7e8ZSUs5SUq05Oc5jY9ZjY84AAKWMjM5zc957e60pKdaMjOelpbWcnLWUlLVCQsYYGMYICNbOzpQICMYhIbV7e5xaWt6cnPfv79bGxt6lpe+9vc5KSs6lpb0xMc6EhM69vbUxMbUhIb1aWs61tcZaWuecnMYxMb1KSsZjY96UlNa1td7W1r17e9a9vZwQEN6trb1jY8YQENZra+fOzr1zc85aWufe3t6MjMY5OdZaWt61tdZ7e+/n5+e9vc6MjMZra+/e3ue1tdalpd7GxrUpKalL4aAAAAABdFJOUwBA5thmAAACxklEQVR42uXX/1/SQBgH8NuAoEQ2ijgbBivJLznBAiUUKiyJSgOVAk0tKZKw75mRRt/7v4MBY8ezjW39Vs8v8rqHz/u1jbvbidC/XL8KmcpOqVT6nSjXjooGw8WfFd+QWGfE4oLbtbr++PdMOy0BDYLjEj/0xevfWIyVAI7b/aIj/9WHsRrA8Yf9bqSexVgD4Lic9kWE/LgPwPGfNfJHDO4P8Iuq+S2M9QD8oUp+nxEAcFCtfgIA/14x/9ElAKDQbNQAwN9VAiYEABy0OgsAWAnB/AcBAtVWawkAfJ4CD0BQADZavYcQgI9h3CCQjpD5PcEgwG+SwLRhIL0vz78SjAPEU3hrHODfyX4I6rUJIP0G3oExoNwFXpoB+HwXmDEFpF9IwKA5YK+Tp9fMAdUOsC6YA553gKcmgdTfAhV1oMQqADndQDmJ0AZLAsFnCIV3VYDHJLAjDkZKciAaFz/lCeBJB1glgXBrNLndBWLJ9uZGAI+keTBLANL8SnWAzWRniAC2pG+6lQF0hfjTqCIBrEvjDwiggFSLuIUoLY0vEwAbUcsnc/LlnO02HGvEz+hXEeJ5Yj+4L2vNkxOJDSnlQzliIq2synr3embiUBjmw0FyU83KX04Ob+9aAK/Ppd5deZloz4HFlCHzt3sX0x2a6LcvQb4ab8r7i+DVdqvnCq/D5ZzqdhfAcr5B9wD0PNwPEu0ZnLwK9oPgNfCQJ2fhhhITJ3E8BjeUOXA+QNQlBh5xLjemVCgKjzgzNIJFjWF4yJoKhafgIWt6VHGmjgR0HvMuTipPdWQJ6AImbBRSE8aY/sC4er5xFx5vHyB4YRRpFWUf0AL4c+dHkHZRFo9TDeB9Aa3Llwjr8FlFwB+wO/rHm0VbPae9mPini/O5h/XGxatw2I6fGHAOuhiGZVxO98lTdgutP94yaIvVdqxZdpvFYTT9X9UfqQQlTXlm8wkAAAAASUVORK5CYII=
// ==/UserScript==

(function () {
    var oDebts = {
        mode:"idle",
        c:null,
        req:null,
        aDebts : []
    };    
    start(oDebts);
    
    function start(oDebts) {
        var pagecontainer=document.getElementById('tablefullheight');
        if (!pagecontainer) return;
        
        initgui();
        run();
        
    }
    function initgui(){
        var buttonElement=document.createElement('button');
        buttonElement.setAttribute('id', "gc-but-reset");
        buttonElement.setAttribute('type', 'button');
        buttonElement.setAttribute('role', 'button');
        buttonElement.addEventListener('click', function(){reset();return false;}, false);  
        buttonElement.appendChild(document.createTextNode('Reset'))
        // add the button
        var elPos=$('.contenttd').find("table > tbody > tr").first()
        $(elPos).after(buttonElement);
        
        var buttonElement=document.createElement('button');
        buttonElement.setAttribute('id', "gc-but-begin");
        buttonElement.setAttribute('type', 'button');
        buttonElement.setAttribute('role', 'button');
        buttonElement.addEventListener('click', function(){begin(oDebts);return false;}, false);  
        buttonElement.appendChild(document.createTextNode('Start'))
        // add the button
        var elPos=$('.contenttd').find("table > tbody > tr").first()
        $(elPos).after(buttonElement);
        
    }        
    function reset() {
        unsafeWindow.name = "";
        location.href='displayDebtInfo.htm'
        
    }
    
    function begin(oDebts){
        oDebts.mode = "run";
        unsafeWindow.name = JSON.stringify(oDebts);
        run();
    }
    
    function cleanup(){
        var par = $("#installLine").parent()[0];
        $(par).find(".gc-debt-row > td > .navbtn").parent().remove();
        $(par).find(".gc-debt-row > td > input[type='radio'] ").parent().remove();
        debugger;
        $("tr.tblHeader").first().children()[10].remove();
        
    }
    
    function run() {
        //console.log("Starting");
        var isDebtInfoPage = $("#installLine").length > 0 ? true : false;
        var isDebtCodePage = $("#amnt1").length > 0 ? true : false;
        
        if (unsafeWindow.name == ""){//for the first time
            return
        }         
        
        oDebts = JSON.parse(window.name)
        if (oDebts.mode !="run") return;
        
        if (isDebtInfoPage)
        {
            var par = $("#installLine").parent()[0];
            var debts = $(par).find("tr.tblRow1, tr.tblRow2");
            var debtsCount = debts.length;
            oDebts.c = debtsCount;
            
            //find first debt code button
            for (var i=0;i<oDebts.c;i++) {
                if (oDebts.aDebts[i] === undefined){
                    var theBut = $(debts[i]).find(".navbtn")
                    $(theBut).css("background-color","red")
                    oDebts.req = i;
                    unsafeWindow.name = JSON.stringify(oDebts);
                    window.setTimeout(function(){theBut.click();}, 1000);
                    return;
                }
            }
            
            rearrange(debts,oDebts);
            cleanup();
            
        }
        
        /* get debt code and go back */
        if (isDebtCodePage){
            var debtCode = $("#amnt1").next().next().children(0).next().text();
            
            oDebts.aDebts[oDebts.req] = debtCode;
            unsafeWindow.name = JSON.stringify(oDebts);
            location.href='displayDebtInfo.htm'
            return;
        }
        
    }
    function rearrange(debts,oDebts) {
        var doseis = null
        for (var i=0;i<debts.length;i++) {
            $(debts).removeClass("tblRow2").addClass("tblRow1").addClass("gc-debt-row");
            
            oDebts.aDebts[i] = "'" + oDebts.aDebts[i].replace(/\s/g,"");
            $(debts[i]).children().last().before("<td>"+oDebts.aDebts[i]+"</td>")
            
            doseis = null
            doseis = $("#installmentInfo_"+i).first();
            doseis = $(doseis).find("tr").clone().show();
            
            $(debts[i]).after( doseis );
            $(debts[i]).before( $("<tr><td>&nbsp;</td></tr>") );
            if (i>0){
                $(debts[i]).before( $("<tr><td>&nbsp;</td></tr>") );
                $(debts[i]).before( $("<tr><td>&nbsp;</td></tr>") );
            }
        }
        
        $("#generalTitle").next().remove();
        $("#generalTitle").next().remove();
        $("#generalTitle").next().remove();
        $("#generalTitle").next().remove();
        $("#generalTitle").next().remove();
        $("#generalTitle").remove();
        
        for (var i=0;i<debts.length;i++) {
            var url
            //var win = window.open(url);
            }
        
    }
    
})();