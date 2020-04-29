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
    }
})
