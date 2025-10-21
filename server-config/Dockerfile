#FROM openjdk:11-jdk-slim as build
FROM 486849079485.dkr.ecr.us-east-1.amazonaws.com/openjdk-11:11-jdk-slim as build

RUN apt-get update && apt-get install -y ca-certificates-java wget && rm -rf /var/cache/apt/* && \
    find /usr/lib/jvm/java-11-openjdk-amd64/lib/security/ -name "cacerts" -exec keytool -import -trustcacerts \
    -keystore {} -storepass changeit -noprompt -file /etc/ssl/certs/java/cacerts \; && \
    keytool -list -keystore /usr/lib/jvm/java-11-openjdk-amd64/lib/security/cacerts --storepass changeit

ENV MAVEN_VERSION 3.8.1
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $MAVEN_HOME/bin:$PATH
RUN wget http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    tar -zxvf apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    rm apache-maven-$MAVEN_VERSION-bin.tar.gz && \
    mv apache-maven-$MAVEN_VERSION /usr/lib/mvn

WORKDIR /workspace/app

COPY pom.xml .
COPY src src
RUN mvn install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM 486849079485.dkr.ecr.us-east-1.amazonaws.com/openjdk-11:11-jdk-slim
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","com.keola.server.config.ServerConfigApplication"]
EXPOSE 8777
