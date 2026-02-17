# Multi-stage build
FROM eclipse-temurin:11-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/banking-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]