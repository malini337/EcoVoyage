import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.util.*;

public class Ecovoyage {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new StaticFileHandler());
        server.createContext("/calculate", new CalculateHandler());
        server.setExecutor(null);
        System.out.println("🌿 Ecovoyage is running at http://localhost:8080");
        server.start();
    }

    static class StaticFileHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/index.html";
            File file = new File("web" + path);
            if (!file.exists()) {
                exchange.sendResponseHeaders(404, 0);
                exchange.getResponseBody().close();
                return;
            }

            String mime = Files.probeContentType(file.toPath());
            if (mime == null) mime = "text/plain";
            exchange.getResponseHeaders().set("Content-Type", mime);
            byte[] bytes = Files.readAllBytes(file.toPath());
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();
        }
    }

    static class CalculateHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            String body = new String(exchange.getRequestBody().readAllBytes());
            Map<String, String> data = parseSimpleJSON(body);

            int days = Integer.parseInt(data.getOrDefault("days", "1"));
            int travelers = Integer.parseInt(data.getOrDefault("travelers", "1"));
            int rooms = Integer.parseInt(data.getOrDefault("rooms", "1"));
            int cuisineCost = Integer.parseInt(data.getOrDefault("cuisineCost", "0"));
            int hotelCost = Integer.parseInt(data.getOrDefault("hotelCost", "0"));
            int travelCost = Integer.parseInt(data.getOrDefault("travelCost", "0"));

            String destStr = data.getOrDefault("destinations", "");
            int destTotal = 0;
            if (!destStr.isEmpty()) {
                for (String s : destStr.split(",")) {
                    destTotal += Integer.parseInt(s.trim()) * days;
                }
            }

            int foodCost = cuisineCost * 3 * days * travelers;
            int hotelTotal = hotelCost * days * rooms;
            int travelTotal = travelCost * travelers;
            int total = destTotal + foodCost + hotelTotal + travelTotal;
            int tax = (int) (total * 0.05);
            int grandTotal = total + tax;

            String response = """
            {
              "destinations": %d,
              "food": %d,
              "hotel": %d,
              "travel": %d,
              "tax": %d,
              "total": %d
            }
            """.formatted(destTotal, foodCost, hotelTotal, travelTotal, tax, grandTotal);

            exchange.getResponseHeaders().add("Content-Type", "application/json");
            byte[] bytes = response.getBytes();
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();
        }
    }

    static Map<String, String> parseSimpleJSON(String json) {
        Map<String, String> map = new HashMap<>();
        json = json.replaceAll("[{}\" ]", "");
        for (String pair : json.split(",")) {
            if (pair.contains(":")) {
                String[] kv = pair.split(":", 2);
                map.put(kv[0], kv[1]);
            }
        }
        return map;
    }
}
