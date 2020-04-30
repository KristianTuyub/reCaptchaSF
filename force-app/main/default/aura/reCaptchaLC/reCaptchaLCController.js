({
    doInit : function(component, event, helper) {
        // 
        let vfOrigin = window.location.href;

        window.addEventListener("message", function(event) {
            // this.console.log(event.data); // event.data = 'locked' || 'unclocked'

            /*
            if(event.origin != vfOrigin) {
                return;
            }
            */
            if(event.data === "unlock") {
                // Access helper variable to mark that reCaptcha component gave access to the user to send data to the backend.
                helper.reCaptchaUsed = event.data;

                // Enable the Submit button
                let button = component.find("submitButton");
                button.set('v.disabled', false);
            }
        }, false);
    },

    doSubmit : function(component, event, helper) {

        if(helper.reCaptchaUsed === "unlock") {
            // Get Contact Attributes from Form
            
            let firstName = component.get("v.newContact.FirstName");
            let lastName = component.get("v.newContact.LastName");
            let secondLastName = component.get("v.newContact.SecondLastName");
            let email = component.get("v.newContact.Email");
            let companyName = component.get("v.newContact.CompanyName");
            let phoneNumber = component.get("v.newContact.PhoneNumber");

            // Get Case Attributes from Form
            let caseSubject = component.get("v.newCase.Subject");
            let caseSelectedType = component.find("caseType").get("v.value"); // Find using the aura:id identifier
            let caseDescription = component.get("v.newCase.Description");

            alert("FN: " + firstName + "\n" + 
                "LN: " + lastName + "\n" +
                "SLN: " + secondLastName + "\n" +
                "EM: " + email + "\n" +
                "CN: " + companyName + "\n" +
                "PN: " + phoneNumber + "\n" +
                "CS: " + caseSubject + "\n" +
                "Type of case? : " + caseSelectedType + "\n" +
                "CD: " + caseDescription
                );           
            // TO-DO CALL APEX CODE NOT BUILT YET
        } else {
            alert("You have to prove first you're not a bot in order to submit your case");
            // TO-DO -> Draw in user interface they're trying to skip the reCaptcha button. 
            //      Could be done instead of the alert.
        }
        
    }
})
