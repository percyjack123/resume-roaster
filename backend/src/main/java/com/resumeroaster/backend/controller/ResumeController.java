package com.resumeroaster.backend.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.resumeroaster.backend.RoastService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeController {

    @Autowired
    private RoastService roastService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) {

        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("status", "error");
            response.put("message", "No file uploaded!");
            return ResponseEntity.badRequest().body(response);
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            response.put("status", "error");
            response.put("message", "Only PDF files allowed!");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            PDDocument document = Loader.loadPDF(file.getBytes());
            PDFTextStripper stripper = new PDFTextStripper();
            String resumeText = stripper.getText(document);
            document.close();

            System.out.println("===== RESUME TEXT =====");
            System.out.println(resumeText);
            System.out.println("=======================");

            // 🔥 Roast it!
            Map<String, String> roastResult = roastService.roastResume(resumeText);

            response.put("status", "success");
            response.put("message", "Resume roasted successfully! 🔥");
            response.put("fileName", fileName);
            response.put("characters", String.valueOf(resumeText.length()));
            response.put("preview", resumeText.substring(0, Math.min(200, resumeText.length())));
            response.put("roast", roastResult.get("roast"));
            response.put("score", roastResult.get("score"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to read PDF: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> res = new HashMap<>();
        res.put("status", "alive");
        res.put("message", "Resume Roaster is running! 🚀");
        return ResponseEntity.ok(res);
    }
}