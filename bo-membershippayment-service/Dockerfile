FROM openjdk:17.0.1-jdk-slim as build

# Instalar dependencias y Maven
RUN apt-get update && apt-get install -y \
    ca-certificates-java \
    wget \
    libtcnative-1 \
    && rm -rf /var/cache/apt/*

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

# Copiar archivos de configuración Maven primero (para cache)
COPY pom.xml .
COPY settings.xml .

# Descargar dependencias (mejor cache)
RUN --mount=type=cache,target=/root/.m2 mvn -gs settings.xml dependency:resolve

# Copiar código fuente
COPY src src

# Compilar aplicación
RUN --mount=type=cache,target=/root/.m2 mvn -gs settings.xml install -DskipTests

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

ARG DEPENDENCY=/workspace/app/target/dependency

# Copiar aplicación compilada
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","world.inclub.membershippayment.BoMembershippaymentServiceApplication"]
EXPOSE 9095
