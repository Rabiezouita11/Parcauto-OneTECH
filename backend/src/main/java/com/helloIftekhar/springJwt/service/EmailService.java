package com.helloIftekhar.springJwt.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendEmailWithPDFAttachment(String to, String subject, String text) {
        try {
            // Generate PDF content
            byte[] pdfContent = generatePDFContent();

            // Create MimeMessage and MimeMessageHelper
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set email details
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            // Create a Resource from the PDF content
            Resource pdfResource = new ByteArrayResource(pdfContent);

            // Add the PDF attachment using the Resource
            helper.addAttachment("document.pdf", pdfResource, "application/pdf");

            // Send email
            emailSender.send(message);
        } catch (IOException e) {
            // Log and handle exceptions
            e.printStackTrace();
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    private byte[] generatePDFContent() throws IOException {
        // Generate PDF content here
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Example content (replace with your actual PDF generation logic)
        baos.write("PDF content goes here...".getBytes());
        return baos.toByteArray();
    }
}
