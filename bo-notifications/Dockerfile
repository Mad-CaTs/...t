FROM openjdk:17.0.1-jdk-slim as build

# Instalar dependencias y Maven
RUN apt-get update && apt-get install -y \
    ca-certificates-java \
    wget \
    libtcnative-1 \
    && rm -rf /var/lib/apt/lists/*

# Configurar Maven
ENV MAVEN_VERSION 3.8.1
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $MAVEN_HOME/bin:$PATH

# Descargar e instalar Maven
RUN wget http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    tar -zxvf apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    rm apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    mv apache-maven-${MAVEN_VERSION} ${MAVEN_HOME}

# Configurar certificados Java
RUN find $JAVA_HOME/lib/security/ -name "cacerts" -exec keytool -import -trustcacerts \
    -keystore {} -storepass changeit -noprompt -file /etc/ssl/certs/java/cacerts \; || true && \
    keytool -list -keystore $JAVA_HOME/lib/security/cacerts --storepass changeit

WORKDIR /workspace/app

# Copiar archivos de configuración Maven primero (para optimizar cache)
COPY pom.xml .
COPY settings.xml .

# Descargar dependencias (aprovecha cache de Docker)
RUN --mount=type=cache,target=/root/.m2 mvn -gs settings.xml dependency:resolve

# Copiar código fuente
COPY src src

# Compilar aplicación
RUN --mount=type=cache,target=/root/.m2 mvn -gs settings.xml clean install -DskipTests

# Extraer JAR para optimizar imagen final
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Etapa final - imagen de runtime
FROM openjdk:17.0.1-jdk-slim

# Instalar dependencias runtime
RUN apt-get update && apt-get install -y \
    libfreetype6 \
    fontconfig \
    libtcnative-1 \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN groupadd -r appuser && useradd -r -g appuser appuser

ARG DEPENDENCY=/workspace/app/target/dependency

# Copiar aplicación compilada desde la etapa de build
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Cambiar ownership y permisos
RUN chown -R appuser:appuser /app

# Cambiar a usuario no-root
USER appuser

ENTRYPOINT ["java","-cp","app:app/lib/*","world.inclub.appnotification.AppnotificationApplication"]
EXPOSE 8777