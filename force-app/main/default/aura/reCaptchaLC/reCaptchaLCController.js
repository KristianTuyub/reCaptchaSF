({
    doInit : function(component, event, helper) {
        // 
        let vfOrigin = window.location.href;

        window.addEventListener("message", function(event) {
            this.console.log(event.data);

            /*
            if(event.origin != vfOrigin) {
                return;
            }
            */
            if(event.data === "unlock") {
                let button = component.find("submitButton");
                button.set('v.disabled', false);
            }
        }, false);
    },

    doSubmit : function(component, event, helper) {
        alert("Do Submit"); // TO-DO CALL APEX CODE NOT BUILT YET
    }
})
