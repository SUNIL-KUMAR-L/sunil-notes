```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

@SpringBootApplication
@RestController
public class Master {
    private final String apiUrl;
    private final int numWorkers;
    private final List<Worker> workers;
    private final BlockingQueue<RequestResult> resultsQueue;

    public Master(String apiUrl, int numWorkers) {
        this.apiUrl = apiUrl;
        this.numWorkers = numWorkers;
        this.workers = new ArrayList<>();
        this.resultsQueue = new LinkedBlockingQueue<>();
    }

    public void startPerformanceTest(int requestsPerSecond, int duration) throws InterruptedException {
        int requestsPerWorker = requestsPerSecond / numWorkers;

        ExecutorService executorService = Executors.newFixedThreadPool(numWorkers);

        for (int i = 0; i < numWorkers; i++) {
            Worker worker = new Worker(apiUrl, requestsPerWorker, duration, resultsQueue);
            workers.add(worker);
            executorService.submit(worker);
        }

        executorService.shutdown();
        executorService.awaitTermination(duration + 5, TimeUnit.SECONDS);

        summarizeResults();
    }

    private void summarizeResults() {
        List<RequestResult> allResults = new ArrayList<>();
        resultsQueue.drainTo(allResults);

        int totalRequests = allResults.size();
        long successfulRequests = allResults.stream().filter(RequestResult::isSuccess).count();
        long failedRequests = totalRequests - successfulRequests;

        double[] responseTimes = allResults.stream()
                .mapToDouble(RequestResult::getResponseTime)
                .sorted()
                .toArray();

        double avgResponseTime = Arrays.stream(responseTimes).average().orElse(0);
        double maxResponseTime = responseTimes[responseTimes.length - 1];
        double minResponseTime = responseTimes[0];

        Map<Integer, Integer> statusCodes = new HashMap<>();
        for (RequestResult result : allResults) {
            if (result.getStatusCode() != null) {
                statusCodes.merge(result.getStatusCode(), 1, Integer::sum);
            }
        }

        System.out.println("\nPerformance Test Summary:");
        System.out.printf("Total Requests: %d%n", totalRequests);
        System.out.printf("Successful Requests: %d%n", successfulRequests);
        System.out.printf("Failed Requests: %d%n", failedRequests);
        System.out.printf("Average Response Time: %.4f seconds%n", avgResponseTime);
        System.out.printf("Max Response Time: %.4f seconds%n", maxResponseTime);
        System.out.printf("Min Response Time: %.4f seconds%n", minResponseTime);
        System.out.printf("70th Percentile: %.4f seconds%n", percentile(responseTimes, 70));
        System.out.printf("80th Percentile: %.4f seconds%n", percentile(responseTimes, 80));
        System.out.printf("90th Percentile: %.4f seconds%n", percentile(responseTimes, 90));
        System.out.printf("95th Percentile: %.4f seconds%n", percentile(responseTimes, 95));
        System.out.printf("99th Percentile: %.4f seconds%n", percentile(responseTimes, 99));
        System.out.println("\nStatus Code Distribution:");
        statusCodes.forEach((code, count) -> System.out.printf("  %d: %d%n", code, count));
    }

    private double percentile(double[] latencies, double percentile) {
        int index = (int) Math.ceil(percentile / 100.0 * latencies.length) - 1;
        return latencies[index];
    }

    private static class Worker implements Runnable {
        private final String apiUrl;
        private final int requestsPerSecond;
        private final int duration;
        private final HttpClient httpClient;
        private final BlockingQueue<RequestResult> resultsQueue;

        public Worker(String apiUrl, int requestsPerSecond, int duration, BlockingQueue<RequestResult> resultsQueue) {
            this.apiUrl = apiUrl;
            this.requestsPerSecond = requestsPerSecond;
            this.duration = duration;
            this.resultsQueue = resultsQueue;
            this.httpClient = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();
        }

        @Override
        public void run() {
            long startTime = System.currentTimeMillis();
            int requestCount = 0;

            while ((System.currentTimeMillis() - startTime) < duration * 1000L) {
                List<CompletableFuture<RequestResult>> tasks = new ArrayList<>();

                for (int i = 0; i < requestsPerSecond; i++) {
                    tasks.add(makeRequest());
                }

                CompletableFuture.allOf(tasks.toArray(new CompletableFuture[0])).join();
                tasks.forEach(task -> {
                    try {
                        resultsQueue.put(task.join());
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
                requestCount += requestsPerSecond;

                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }

            System.out.printf("Worker completed %d requests in %d seconds%n", requestCount, duration);
        }

        private CompletableFuture<RequestResult> makeRequest() {
            long startTime = System.currentTimeMillis();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .GET()
                    .build();

            return httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                    .thenApply(response -> new RequestResult(
                            response.statusCode() >= 200 && response.statusCode() < 300,
                            (System.currentTimeMillis() - startTime) / 1000.0,
                            response.statusCode()))
                    .exceptionally(ex -> new RequestResult(false, (System.currentTimeMillis() - startTime) / 1000.0, null));
        }
    }

    private static class RequestResult {
        private final boolean success;
        private final double responseTime;
        private final Integer statusCode;

        public RequestResult(boolean success, double responseTime, Integer statusCode) {
            this.success = success;
            this.responseTime = responseTime;
            this.statusCode = statusCode;
        }

        public boolean isSuccess() {
            return success;
        }

        public double getResponseTime() {
            return responseTime;
        }

        public Integer getStatusCode() {
            return statusCode;
        }
    }

    private static Master instance;

    @PostMapping("/start_test")
    public Map<String, String> startTest(@RequestBody Map<String, Object> request) throws InterruptedException {
        String apiUrl = (String) request.get("api_url");
        int numWorkers = (Integer) request.get("num_workers");
        int requestsPerSecond = (Integer) request.get("requests_per_second");
        int duration = (Integer) request.get("duration");

        instance = new Master(apiUrl, numWorkers);
        instance.startPerformanceTest(requestsPerSecond, duration);

        return Collections.singletonMap("message", "Test started successfully");
    }

    @GetMapping("/get_results")
    public Map<String, Object> getResults() {
        if (instance == null) {
            return Collections.singletonMap("error", "No test has been run yet");
        }
        return instance.getSummary();
    }

    private Map<String, Object> getSummary() {
        List<RequestResult> allResults = new ArrayList<>();
        resultsQueue.drainTo(allResults);

        int totalRequests = allResults.size();
        long successfulRequests = allResults.stream().filter(RequestResult::isSuccess).count();
        long failedRequests = totalRequests - successfulRequests;

        double[] responseTimes = allResults.stream()
                .mapToDouble(RequestResult::getResponseTime)
                .sorted()
                .toArray();

        double avgResponseTime = Arrays.stream(responseTimes).average().orElse(0);
        double maxResponseTime = responseTimes[responseTimes.length - 1];
        double minResponseTime = responseTimes[0];

        Map<Integer, Integer> statusCodes = new HashMap<>();
        for (RequestResult result : allResults) {
            if (result.getStatusCode() != null) {
                statusCodes.merge(result.getStatusCode(), 1, Integer::sum);
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("total_requests", totalRequests);
        summary.put("successful_requests", successfulRequests);
        summary.put("failed_requests", failedRequests);
        summary.put("avg_response_time", avgResponseTime);
        summary.put("max_response_time", maxResponseTime);
        summary.put("min_response_time", minResponseTime);

        Map<String, Double> percentiles = new HashMap<>();
        percentiles.put("70", percentile(responseTimes, 70));
        percentiles.put("80", percentile(responseTimes, 80));
        percentiles.put("90", percentile(responseTimes, 90));
        percentiles.put("95", percentile(responseTimes, 95));
        percentiles.put("99", percentile(responseTimes, 99));
        summary.put("percentiles", percentiles);

        summary.put("status_code_distribution", statusCodes);

        return summary;
    }

    public static void main(String[] args) {
        SpringApplication.run(Master.class, args);
    }
}
```
