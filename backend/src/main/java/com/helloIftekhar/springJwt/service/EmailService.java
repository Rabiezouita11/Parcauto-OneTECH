package com.helloIftekhar.springJwt.service;

import com.helloIftekhar.springJwt.model.Vehicle;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendEmailWithPDFAttachment(String to, String subject, String text, byte[] pdfContent) {
        try {
            // Créer MimeMessage et MimeMessageHelper
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Définir les détails de l'email
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            // Créer une Resource à partir du contenu PDF
            Resource pdfResource = new ByteArrayResource(pdfContent);

            // Ajouter la pièce jointe PDF en utilisant la Resource
            helper.addAttachment("Reservation.pdf", pdfResource);

            // Envoyer l'email
            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public byte[] generatePDFContent(String usernameConnectedFirstname, String usernameConnectedlastname, String firstname, String lastname, String startDate, String endDate, Vehicle vehicle, String destination, String accompagnateur , String montant) throws IOException {
        // Base content of the PDF
        StringBuilder pdfContent = new StringBuilder();
        pdfContent.append("Je soussigné, ").append(usernameConnectedFirstname).append(" ").append(usernameConnectedlastname).append(" de la société Onetech Business Solutions,\n")
                .append("sise au 16 Rue des entrepreneurs Z.I Charguia II, déclare que ").append(firstname).append(" ").append(lastname).append(",\n")
                .append("est(sont) chargé(s) d'effectuer une mission   ").append(",\n")
                .append("à ").append(destination).append(" et ce à partir du ").append(startDate).append(" au ").append(endDate).append(" dans le cadre du projet.\n");

        // Include the accompagnateur line only if accompagnateur is not null
        if (accompagnateur != null && !accompagnateur.isEmpty()) { // Check if accompagnateur is not null and not empty
            pdfContent.append("Avec l'accompagnateur ").append(accompagnateur).append(" qui va accompagner lors de cette mission\n");
        }
        pdfContent.append("\nDétails du véhicule:\n")
                .append("Marque: ").append(vehicle.getMarque()).append("\n")
                .append("Modèle: ").append(vehicle.getModele()).append("\n")
                .append("Année: ").append(vehicle.getAnnee()).append("\n")
                .append("Numéro de série: ").append(vehicle.getNumeroSerie()).append("\n")
                .append("Kilométrage: ").append(vehicle.getKilometrage()).append("\n")
                .append("montant de carburant: ").append(montant).append("\n");
        // Create a PDF document using PDFBox
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.setLeading(14.5f); // Set the line spacing

            // Start at a position on the page
            float margin = 50;
            float width = page.getMediaBox().getWidth() - 2 * margin;
            float startX = page.getMediaBox().getLowerLeftX() + margin;
            float startY = page.getMediaBox().getUpperRightY() - margin;

            contentStream.newLineAtOffset(startX, startY);

            // Split the content into lines
            String[] lines = pdfContent.toString().split("\n");
            for (String line : lines) {
                // Center text
                float textWidth = PDType1Font.HELVETICA.getStringWidth(line) / 1000 * 12;
                float offsetX = (width - textWidth) / 2;
                contentStream.newLineAtOffset(offsetX, 0);
                contentStream.showText(line);
                contentStream.newLineAtOffset(-offsetX, 0); // Reset offset for next line
                contentStream.newLine(); // Move to the next line
            }

            contentStream.endText();
        }

        document.save(baos);
        document.close();
        return baos.toByteArray();
    }
    public void sendEmail(String to, String subject, String text) {
        try {
            // Create MimeMessage and MimeMessageHelper
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Set email details
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            // Send the email
            emailSender.send(message);

            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            System.out.println("Failed to send email. Error: " + e.getMessage());
        }
    }



}
