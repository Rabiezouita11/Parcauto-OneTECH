package com.ontech.OBS.auth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendAccountActivationConfirmation(String userEmail) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(userEmail);
        mail.setSubject("Account Activation Successful");
        mail.setText("Your account has been successfully activated.");
        javaMailSender.send(mail);
    }
}