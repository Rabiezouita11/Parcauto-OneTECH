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
            helper.addAttachment("document.pdf", pdfResource);

            // Envoyer l'email
            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public byte[] generatePDFContent(String usernameConnectedFirstname, String usernameConnectedlastname,  String firstname, String lastname , String startDate, String endDate , Vehicle vehicle) throws IOException {
        // Contenu du PDF avec les variables dynamiques
        String pdfContent = "Je soussigné, " + usernameConnectedFirstname  + usernameConnectedlastname + " de la société Onetech Business Solutions,\n" +
                "sise au 16 Rue des entrepreneurs Z.I Charguia II, déclare que " + firstname + lastname + ",\n" +
                "est(sont) chargé(s) d'effectuer une mission   "    + ",\n" +    " à et ce à partir du " + startDate + " au " + endDate + " dans le cadre du projet."+
                 ",\n" +  "Détails du véhicule:\n" +
                "Marque: " + vehicle.getMarque() + "\n" +
                "Modèle: " + vehicle.getModele() + "\n" +
                "Année: " + vehicle.getAnnee() + "\n" +
                "Numéro de série: " + vehicle.getNumeroSerie() + "\n" +
                "Statut: " + vehicle.getStatut() + "\n" +
                "Localisation: " + vehicle.getLocalisation() + "\n" +
                "Kilométrage: " + vehicle.getKilometrage() + "\n" +
                "Historique des réservations: " + vehicle.getHistoriqueReservation() + "\n" +
                "Type: " + vehicle.getType() + "\n" +
                "Disponibilité: " + (vehicle.isDisponibilite() ? "Disponible" : "Non disponible");

        // Créer un document PDF en utilisant PDFBox
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
            String[] lines = pdfContent.split("\n");
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
}
