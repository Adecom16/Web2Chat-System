const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendGroupInviteEmail = async (email, group) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Group Invitation',
    text: `You have been invited to join the group: ${group.name}.`,
  };

  await transporter.sendMail(mailOptions);
};
