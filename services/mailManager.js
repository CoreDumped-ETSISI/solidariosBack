'use strict';

const sgMail = require('@sendgrid/mail');
const services = require('../services/index');

function sendWelcomeEmail(email, name, token) { //TODO Catch errors and add url for email verification
    const encodeEmail = services.encrypt(email);
    const link = `http://test/verifyEmail?token=${encodeEmail}/${token}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.setSubstitutionWrappers('{{', '}}');
    const msg = {
        to: email,
        from: process.env.SENDGRID_ORIGIN_ACCOUNT,
        subject: 'a',
        text: 'b',
        html: 'c',
        templateId: '20cddb25-1cfe-4c22-9019-62c8524167a4',
        substitutions: {
            name: name,
            link: link
        },
    };
    sgMail.send(msg);
}

function sendPasswordEmail(email, name, token) { //TODO Catch errors
    const encodeEmail = services.encrypt(email);
    const link = `http://test/resetPassword?token=${encodeEmail}/${token}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.setSubstitutionWrappers('{{', '}}');
    const msg = {
        to: email,
        from: process.env.SENDGRID_ORIGIN_ACCOUNT,
        subject: 'a',
        text: 'b',
        html: 'c',
        templateId: '37b39a0e-4a34-4eee-97ec-ac1d10ce9d64',
        substitutions: {
            name: name,
            link: link
        },
    };
    sgMail.send(msg);
}

module.exports = {
    sendWelcomeEmail,
    sendPasswordEmail
};
