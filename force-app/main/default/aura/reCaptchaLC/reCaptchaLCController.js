({
    doInit : function(component, event, helper) {
        
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

            // CALL OF APEX CONTROLLER
            try {
                let action = component.get('c.NewCase');
                action.setParams({
                    'firstName': firstName, 
                    'lastname': lastName, 
                    'scndLastName': secondLastName, 
                    'newCorreo': email,
                    'companyName': companyName, 
                    'phNumber': phoneNumber, 
                    'TypeCase': caseSelectedType, 
                    'CaseSubject': caseSubject, 
                    'CaseDescription': caseDescription
                });

                let validateEmail = component.get('c.validateEmail');
                let validEmail = $A.enqueueAction(validateEmail);

                if(validEmail) {
                    //DEFINE WHAT SHOULD HAPPEN AFTER SERVER-SIDE CALL RETURNS
                    action.setCallback(this, function(response) {
                        var state = response.getState();

                        if(component.isValid() && state === "SUCCESS") {
                            console.log('New Case created successfully!');
                            window.location = "/donaciones/s/thank-you-for-contacting-us";
                        }
                        else 
                            console.log('Failed to create new Case');
                    });

                    //DON'T FORGET TO ENQUEUE YOUR ACTION
                    $A.enqueueAction(action);
                }
                
            } catch (error) {
                console.log(error);
            }

        } else {
            alert("Captcha Challenge Not Resolved");
            // TO-DO -> Draw in user interface they're trying to skip the reCaptcha button. 
            //      Could be done instead of the alert.
        }
        
    },
    //Check Email Validity
    validateEmail : function(component, event, helper) {
        let emailValid = false;
        let email = component.get("v.newContact.Email");

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) { // Test if email is a valid email with a Regex.
            component.find('caseformEmail').showHelpMessageIfInvalid();
            return emailValid;
        }

        emailValid = true;
        
        return emailValid;
    }
})
