A continuación tenés **dos entregables**:

1️⃣ **Política de Privacidad completa con alcance internacional** (Argentina + estándares tipo GDPR).
2️⃣ **Instructivo técnico detallado** para que un asistente de desarrollo implemente correctamente la página y el manejo de datos.

La redacción está pensada para un **sitio institucional con formulario de contacto**, desplegado en **Vercel**, con posible acceso desde distintos países.

---

# 1. Política de Privacidad — Versión completa (Internacional)

Podés usarla directamente en una página:

```
/politica-de-privacidad
```

---

## Política de Privacidad

Última actualización: [FECHA]

La presente Política de Privacidad describe cómo recopilamos, utilizamos y protegemos la información personal de los usuarios que visitan este sitio web.

Al utilizar este sitio web o completar cualquier formulario disponible en él, el usuario acepta las prácticas descritas en esta política.

---

## 1. Responsable del tratamiento de los datos

El responsable del tratamiento de los datos personales recopilados a través de este sitio es:

**[Nombre legal de la empresa]**
Domicilio: [Dirección]
Correo electrónico de contacto: [Email de contacto]
País: Argentina

Para cualquier consulta relacionada con privacidad o tratamiento de datos personales, los usuarios pueden comunicarse a través del correo electrónico indicado.

---

## 2. Información que recopilamos

Podemos recopilar información personal cuando los usuarios interactúan con nuestro sitio web, especialmente al completar formularios de contacto.

Los datos que pueden recopilarse incluyen:

* Nombre y apellido
* Dirección de correo electrónico
* Número de teléfono (opcional)
* Tipo de consulta
* Mensaje enviado
* Dirección IP
* Información técnica del dispositivo y navegador
* Fecha y hora de la solicitud

Esta información se recopila únicamente cuando el usuario la proporciona voluntariamente.

---

## 3. Finalidad del tratamiento de los datos

Los datos personales recopilados serán utilizados exclusivamente para las siguientes finalidades:

* Responder consultas o solicitudes enviadas por los usuarios
* Mantener comunicaciones relacionadas con la consulta realizada
* Mejorar la calidad del servicio y la experiencia del usuario en el sitio
* Prevenir usos indebidos o fraudulentos del formulario

No utilizamos los datos personales para la toma de decisiones automatizadas ni para la elaboración de perfiles comerciales.

---

## 4. Base legal para el tratamiento

El tratamiento de los datos personales se realiza sobre la base del **consentimiento libre, expreso e informado del usuario**, otorgado mediante la aceptación de esta Política de Privacidad al momento de enviar el formulario.

En jurisdicciones donde aplique el Reglamento General de Protección de Datos (GDPR) u otras normativas similares, el consentimiento del usuario constituye la base legal para el tratamiento.

---

## 5. Conservación de los datos

Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir con las finalidades para las cuales fueron recopilados.

Una vez cumplida dicha finalidad, los datos podrán ser eliminados o anonimizados, salvo que exista una obligación legal de conservarlos por un período mayor.

---

## 6. Compartición de datos con terceros

No vendemos, alquilamos ni comercializamos datos personales.

Sin embargo, algunos datos pueden ser procesados por proveedores tecnológicos que nos brindan servicios necesarios para el funcionamiento del sitio web, tales como:

* servicios de alojamiento web
* servicios de infraestructura tecnológica
* sistemas de seguridad o prevención de spam

Estos proveedores actúan únicamente como **encargados del tratamiento**, siguiendo nuestras instrucciones y bajo obligaciones de confidencialidad.

---

## 7. Transferencias internacionales de datos

Debido a la naturaleza global de Internet y al uso de infraestructura tecnológica internacional, los datos pueden ser procesados o almacenados en servidores ubicados fuera del país de residencia del usuario.

En todos los casos, se adoptarán medidas razonables para garantizar un nivel adecuado de protección de los datos personales.

---

## 8. Seguridad de la información

Adoptamos medidas técnicas y organizativas razonables para proteger los datos personales contra:

* acceso no autorizado
* pérdida o destrucción
* alteración o divulgación indebida

Entre estas medidas se incluyen controles de acceso, uso de conexiones seguras (HTTPS), y prácticas de desarrollo seguro.

No obstante, ningún sistema de transmisión o almacenamiento de datos en Internet puede garantizar una seguridad absoluta.

---

## 9. Derechos de los usuarios

Los usuarios tienen derecho a:

* acceder a sus datos personales
* solicitar la rectificación de datos incorrectos
* solicitar la actualización de información
* solicitar la eliminación de sus datos personales
* oponerse al tratamiento de sus datos

Para ejercer cualquiera de estos derechos, el usuario puede enviar una solicitud a:

**[email de contacto]**

La solicitud deberá incluir información suficiente para verificar la identidad del solicitante.

---

## 10. Autoridad de control

En la República Argentina, la **Agencia de Acceso a la Información Pública (AAIP)** es la autoridad de control encargada de la aplicación de la Ley 25.326 de Protección de Datos Personales.

Los titulares de datos personales pueden presentar reclamos ante dicha autoridad si consideran que sus derechos han sido vulnerados.

---

## 11. Uso de cookies

Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento.

En caso de implementarse herramientas de analítica o marketing que utilicen cookies adicionales, se informará oportunamente a los usuarios mediante el correspondiente aviso de cookies.

---

## 12. Cambios en la política de privacidad

Podremos actualizar esta Política de Privacidad periódicamente para reflejar cambios legales, técnicos o operativos.

La versión vigente será siempre la publicada en esta página, junto con la fecha de última actualización.

---

# 2. Texto para el checkbox del formulario

Debe aparecer junto al botón enviar.

Texto recomendado:

> Acepto la Política de Privacidad y autorizo el tratamiento de mis datos personales conforme a lo establecido en la misma.

Debe enlazar a:

```
/politica-de-privacidad
```

---

# 3. Instructivo técnico para la IA de desarrollo

Este bloque lo podés pegar directamente en el asistente de desarrollo.

---

## Implementación de Política de Privacidad y Consentimiento

### 1. Crear página de política

Crear ruta:

```
/politica-de-privacidad
```

Implementación:

* página estática
* accesible desde footer
* accesible desde formulario
* SEO indexable

Metadata:

```
title: Política de Privacidad
description: Información sobre el tratamiento de datos personales
```

---

### 2. Implementar consentimiento en el formulario

Agregar checkbox obligatorio:

```
name="privacyConsent"
type="checkbox"
required
```

Texto:

```
Acepto la Política de Privacidad
```

con enlace a:

```
/politica-de-privacidad
```

---

### 3. Validación frontend

Antes de enviar el formulario:

```
if (!privacyConsent) {
 showError("Debes aceptar la política de privacidad")
}
```

---

### 4. Validación backend obligatoria

En el endpoint del formulario verificar:

```
privacyConsent === true
```

Si no:

```
return 400
```

---

### 5. Datos que deben almacenarse

Guardar en base de datos:

```
{
 name
 email
 phone
 message
 inquiryType
 consent: true
 ip
 userAgent
 createdAt
}
```

Esto sirve como **prueba de consentimiento**.

---

### 6. Seguridad recomendada

Implementar:

#### Rate limiting

Evitar spam:

```
max 5 requests / minuto por IP
```

---

#### Honeypot field

Campo oculto:

```
company
```

Si se completa → bloquear.

---

#### Captcha

Usar:

```
Cloudflare Turnstile
```

o

```
hCaptcha
```

---

### 7. Eliminación de datos

Crear endpoint administrativo:

```
DELETE /api/contact/:id
```

Para permitir borrar datos si el usuario lo solicita.

---

### 8. Logs

Registrar:

```
timestamp
ip
requestId
```

Pero **no guardar logs con mensajes completos** si no es necesario.

---

### 9. Protección de datos

Requisitos:

* HTTPS obligatorio
* Sanitizar inputs
* Evitar inyección de scripts
* Limitar tamaño de mensajes

---

### 10. Ubicación del enlace de privacidad

Debe aparecer en:

* Footer del sitio
* Formulario de contacto
* Página de registro (si existiera)

---

# Recomendación profesional

Para un sitio institucional como este:

✔ política publicada
✔ checkbox obligatorio
✔ consentimiento almacenado
✔ captcha
✔ rate limiting

Eso cumple estándares legales y técnicos internacionales.

---

Si querés, en el próximo paso puedo darte también:

**la Política de Cookies + banner de cookies (que hoy es el otro requisito legal importante)**
y el **prompt técnico para implementarlo correctamente en Next.js / Vercel.**
