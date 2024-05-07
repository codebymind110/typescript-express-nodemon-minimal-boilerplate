export const verifyEmailFormat  = (email:string)=>{
     // Regular expression for email validation
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

     // Test the email against the regular expression
     return emailRegex.test(email);
}