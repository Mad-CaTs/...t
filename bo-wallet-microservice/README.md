# bo-wallet-microservice
## Pipeline de despligue con Jenkins
### 🧾 Visión General del Pipeline
- Este flujo de despliegue de Jenkins automatiza el despligue del microservicio. Ha sido diseñado para ser generico y reutilizable en los diferentes microservicios.
- Se tienen dos scripts de pipeline distintos :
    - Uno orientado a los entornos de desarrollo (./jenkins/develop/Jenkinsfile)
    - Otro dedicado exclusivamente al entorno de producción (./jenkins/main/Jenkinsfile)
- Ambos scripts siguen la misma estructura general, pero pueden difererir en los valores de variables especificas, por el hecho de que estan destinados para diferentes entornos.
- Es importante destacar que todos los comandos que conforman el proceso del pipeline se ejecutan de forma remota vía SSH en un servidor dedicado.

---

### 🚀 Flujo del Pipeline

1. **Definición de Variables Calculadas**  
   Se generan rutas dinámicas y nombres de recursos basados en el microservicio, entorno y rama.

2. **Preparación del Repositorio**
    - Se clona o actualiza el repositorio correspondiente.
    - Se realiza checkout al commit especificado (`COMMIT_HASH`) o al último commit de la rama configurada.

3. **Construcción de la Imagen Docker**  
   Se construye una imagen del microservicio a partir del `Dockerfile`.

4. **Publicación de la Imagen**  
   La imagen se etiqueta y publica en un **registro de contenedores privado**.

5. **Despliegue en Kubernetes**
    - Se actualizan los `Secrets` necesarios para el entorno.
    - Se aplica el manifiesto (`deployment.yaml`), para desplegar el microservidio en k8s.

---

### ⚠️ Consideraciones Importantes

- Debe existir un archivo con las variables sensibles necesarias para el despliegue en el servidor remoto, la ruta del archivo se especifica en la variable `SECRETS_FILE_PATH`
- Cuando configures el pipeline en Jenkins, asegúrate de que el campo "Branch Specifier" esté configurado con el nombre exacto de la rama (por ejemplo, `develop` o `main`) y no un patrón como `*/develop`. Esto es importante, ya que el valor de la rama se usa directamente en el script del pipeline para construir rutas y hacer `checkout`.
