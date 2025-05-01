package com.login.utils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.Random;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.properties.HorizontalAlignment;
import org.springframework.stereotype.Component;

@Component
public class BonafideCertificateGenerator {
    private static final String PDF_DIR = "Backend/assets/pdf";
    private static final Random random = new Random();

    private String generateCertificateNumber() {
        SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
        String currentYear = yearFormat.format(new Date());
        
        // Generate 8-digit hex number using two 4-digit numbers
        String hex1 = String.format("%04x", random.nextInt(0x10000));
        String hex2 = String.format("%04x", random.nextInt(0x10000));
        String hex = hex1 + hex2;
        
        // Format: BON/PUBLISHINGYEAR/8DIGITHEX
        return String.format("BON/%s/%s", currentYear, hex.toUpperCase());
    }

    private String generateDigitalSignature(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(content.getBytes());
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return hexString.toString().toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "ERROR_GENERATING_SIGNATURE";
        }
    }

    public String generateCertificate(String studentName, String enrollmentNumber, String course, 
            String semester, String purpose, String date) {
        try {
            // Create pdf directory if it doesn't exist
            Path pdfDir = Paths.get(PDF_DIR);
            if (!Files.exists(pdfDir)) {
                Files.createDirectories(pdfDir);
            }

            // Generate timestamp for unique filename
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String filename = PDF_DIR + "/" + studentName.replaceAll("\\s+", "_") + "_" + timestamp + "_" + 
                UUID.randomUUID().toString().substring(0, 8) + ".pdf";

            PdfWriter writer = new PdfWriter(new FileOutputStream(filename));
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Add college logo
            try {
                Image logo = new Image(ImageDataFactory.create("Backend/assets/logo.png"));
                logo.setWidth(100); 
                logo.setHeight(100);
                logo.setHorizontalAlignment(HorizontalAlignment.CENTER);
                document.add(logo);
            } catch (Exception e) {
                System.out.println("Logo image not found, proceeding without logo");
            }

            // Header and formatted content
            // document.add(new Paragraph("भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ").setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Indian Institute of Information Technology, Lucknow").setBold().setFontSize(12).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("(An Institute of National Importance by Act of Parliament, under PPP Mode)").setFontSize(10).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Chak Ganjaria (C G City), Mastemau, Lucknow - 226002 (U.P.) INDIA").setFontSize(10).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Email: contact@iiitl.ac.in    website: iiitl.ac.in").setFontSize(10).setTextAlignment(TextAlignment.CENTER));
            
            // Certificate number
            String certNumber = "Certificate No: " + generateCertificateNumber();
            document.add(new Paragraph(certNumber).setFontSize(10).setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Date: " + date).setTextAlignment(TextAlignment.RIGHT));

            document.add(new Paragraph("\nTo whom it May Concern").setBold().setFontSize(13).setTextAlignment(TextAlignment.CENTER));

            String line1 = "This is to certify that Mr./Ms. " + studentName + " bearing";
            String line2 = "Enrollment Number " + enrollmentNumber.toUpperCase() + " is a bonafide student of B.Tech. (" + course + ")";
            String line3 = "Currently he/she is a student of " + semester + " Semester.";
            String line4 = "This certificate is being issued for the purpose of " + purpose + ".";

            document.add(new Paragraph("\n" + line1));
            document.add(new Paragraph(line2));
            document.add(new Paragraph(line3));
            document.add(new Paragraph(line4));

            // Generate digital signature
            String contentToSign = String.join("\n", 
                studentName, enrollmentNumber, course, semester, purpose, date, certNumber);
            String digitalSignature = generateDigitalSignature(contentToSign);

            document.add(new Paragraph("\n\n\n").setFontSize(10));
            document.add(new Paragraph("Digital Signature: " + digitalSignature).setFontSize(8));
            document.add(new Paragraph("V. Singh").setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Assistant Registrar").setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Academic").setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("IIIT, Lucknow").setTextAlignment(TextAlignment.RIGHT));

            document.close();
            System.out.println("Certificate generated: " + filename);
            return filename;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // testing
    // public static void main(String[] args) {
    //     Scanner scanner = new Scanner(System.in);
    //     System.out.print("Enter student's email ID: ");
    //     String email = scanner.nextLine();

    //     System.out.print("Enter student's full name: ");
    //     String name = scanner.nextLine();

    //     System.out.print("Enter course name: ");
    //     String course = scanner.nextLine();

    //     String date = java.time.LocalDate.now().toString();

    //     String enrollmentNumber = email.split("@")[0];

    //     BonafideCertificateGenerator generator = new BonafideCertificateGenerator();
    //     generator.generateCertificate(name, enrollmentNumber, course, date);
    // }
}
