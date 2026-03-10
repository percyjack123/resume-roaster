package com.resumeroaster.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;

@Service
public class RoastService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> roastResume(String resumeText) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        String prompt = """
            You are a brutally honest, witty, and savage resume roaster.
            Analyze this resume and respond in EXACTLY this format with no extra text:
            
            SCORE: [number from 1-10]
            ROAST: [your brutal roast here, max 300 words, funny and harsh but with useful feedback at the end]
            
            Resume:
            """ + resumeText;

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            List<Map> candidates = (List<Map>) response.getBody().get("candidates");
            Map content = (Map) candidates.get(0).get("content");
            List<Map> parts = (List<Map>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            // Parse SCORE and ROAST
            String score = "5";
            String roast = text;

            if (text.contains("SCORE:") && text.contains("ROAST:")) {
                for (String line : text.split("\n")) {
                    if (line.startsWith("SCORE:")) {
                        score = line.replace("SCORE:", "").trim().replaceAll("[^0-9]", "");
                    }
                }
                int roastIndex = text.indexOf("ROAST:");
                if (roastIndex != -1) {
                    roast = text.substring(roastIndex + 6).trim();
                }
            }

            return Map.of("score", score, "roast", roast);

        } catch (Exception e) {
            return Map.of("score", "0", "roast", "Roast failed: " + e.getMessage());
        }
    }
}