package com.example.bonafide;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

public class BonafideCertificateGenerator {

    public void generateCertificate(String studentName, String enrollmentNumber, String course, String date) {
        try {
            // Generate timestamp for unique filename
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String filename = "pdf/" + studentName.replaceAll("\\s+", "_") + "_BonafideCertificate_" + timestamp + ".pdf";

            PdfWriter writer = new PdfWriter(new FileOutputStream(filename));
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header and formatted content
            document.add(new Paragraph("भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ").setBold().setFontSize(14).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));
            document.add(new Paragraph("Indian Institute of Information Technology, Lucknow").setBold().setFontSize(12).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));
            document.add(new Paragraph("(An Institute of National Importance by Act of Parliament, under PPP Mode)").setFontSize(10).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));
            document.add(new Paragraph("Chak Ganjaria (C G City), Mastemau, Lucknow - 226002 (U.P.) INDIA").setFontSize(10).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));
            document.add(new Paragraph("Email: contact@iiitl.ac.in    website: iiitl.ac.in").setFontSize(10).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));
            document.add(new Paragraph("Date: " + date).setTextAlignment(com.itextpdf.layout.property.TextAlignment.RIGHT));

            document.add(new Paragraph("\nTo whom it May Concern").setBold().setFontSize(13).setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));

            String line1 = "This is to certify that Mr./Ms. " + studentName + " bearing";
            String line2 = "Enrollment Number " + enrollmentNumber.toUpperCase() + " is a bonafide student of B.Tech. (" + course + ").";
            String line3 = "Currently he/she is a student of First Semester (Session August - December, 2024).";
            String line4 = "This certificate is being issued for the purpose of Scholarship.";

            document.add(new Paragraph("\n" + line1));
            document.add(new Paragraph(line2));
            document.add(new Paragraph(line3));
            document.add(new Paragraph(line4));

            document.add(new Paragraph("\n\n\n").setFontSize(10));
            document.add(new Paragraph("V. Singh").setTextAlignment(com.itextpdf.layout.property.TextAlignment.RIGHT));
            document.add(new Paragraph("Assistant Registrar").setTextAlignment(com.itextpdf.layout.property.TextAlignment.RIGHT));
            document.add(new Paragraph("Academic").setTextAlignment(com.itextpdf.layout.property.TextAlignment.RIGHT));
            document.add(new Paragraph("IIIT, Lucknow").setTextAlignment(com.itextpdf.layout.property.TextAlignment.RIGHT));

            document.close();
            System.out.println("Certificate generated: " + filename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter student's email ID: ");
        String email = scanner.nextLine();

        System.out.print("Enter student's full name: ");
        String name = scanner.nextLine();

        System.out.print("Enter course name: ");
        String course = scanner.nextLine();

        String date = java.time.LocalDate.now().toString();

        String enrollmentNumber = email.split("@")[0];

        BonafideCertificateGenerator generator = new BonafideCertificateGenerator();
        generator.generateCertificate(name, enrollmentNumber, course, date);
    }
}
