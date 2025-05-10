const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com', 
//     port: 587,
//     secure: false, 
//     auth: {
//       user: 'rakeshbarikquotus@gmail.com', 
//       pass: 'Rakesh@quotus' 
//     }
//   });

//   function sendWelcomeEmail(email){

//     const mailOptions = {
//         from: '"Rakesh Barik" <rakeshbarikquotus@gmail.com>', 
//         to: `${email}`, 
//         subject: 'Welcome to Our Website!', 
//         text: 'Hello and welcome! Thank you for signing up. We are excited to have you on board.',
//         html: `<p>Hello and welcome!</p>
//                <p>Thank you for signing up. We are excited to have you on board.</p>
//                <p>Best regards`
//       };

//    return transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);        }
//       });
//   }



  let counter = 0;

  async function letsTest(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        counter++;
        const shouldFail = counter % 2 === 0; // Fail every 2nd call
        console.log(`Processing ${email}. Should fail? ${shouldFail}`);
        resolve(!shouldFail); // true if successful
      }, 1000);
    });
  }


  module.exports = {letsTest};