# Homebanking API Automation Framework

*[English](#english) | [Español](#español)*

---

## English

API test automation framework built with **Playwright + TypeScript**, targeting the mock backend API of a demo homebanking application ([homebanking-demo.onrender.com/docs](https://homebanking-demo.onrender.com/docs)).

This project complements [`homebanking-automation-playwright`](https://github.com/lhcarnibella/homebanking-automation-playwright) (UI automation for the same domain), applying the same architectural principles to API testing: client pattern (API equivalent of Page Objects), custom fixtures, centralized test data, and CI/CD integration.

![Playwright Tests](https://github.com/lhcarnibella/homebanking-api-automation-playwright/actions/workflows/playwright.yml/badge.svg)

**Status:** actively maintained as a learning project — core modules covered, with room to grow (Fixed Terms, Loans, Bill Payments).

### Tech Stack

- **Playwright** — API testing via `APIRequestContext`
- **TypeScript** — static typing
- **GitHub Actions** — CI pipeline

### Architecture

```
api-clients/    -> API Clients (one per endpoint group: Auth, Accounts, Cards, Transfers)
tests/          -> Test specs, organized by module
fixtures/       -> Authenticated request context, with automatic backend reset per test
test-data/      -> Centralized test data (users, card data, error codes)
```

#### Key design decisions

- **API Client pattern**: each group of related endpoints has its own client class exposing methods that build and execute requests, mirroring the Page Object Model used in the UI project, but without any DOM/locator concerns.
- **Authenticated fixture with automatic reset**: the `authenticatedRequest` fixture logs in once per test and calls the API's `/sistema/resetear` endpoint before yielding control, ensuring each test starts from a clean, predictable backend state — critical for a shared, stateful mock API with no per-test database isolation.
- **Structured error codes over free-text messages**: the API returns both a human-readable `mensaje` and a semantic `error` code (e.g. `CUENTA_INVALIDA`, `YA_TIENE_TARJETA`). Assertions target the error code, which is more stable than asserting on wording that could change without an actual behavior change.
- **Serial execution (`workers: 1`)**: unlike the UI project, this suite runs fully serial, both locally and in CI. Test files interact with real, shared backend data (the same handful of accounts), and running them in parallel caused race conditions — e.g., two test files creating a debit card for the same account simultaneously. Given the project's scale, prioritizing reliability over parallel speed was the pragmatic choice. This is documented inline as a comment in `playwright.config.ts`. A `test.describe.serial()` block is also kept in one file as a reference for scoping serial execution at the suite level, even though it's currently redundant given the global `workers: 1` setting.

### Running the tests

```bash
npm install
npx playwright install
npx playwright test
```

Run a specific suite:
```bash
npx playwright test tests/transfers/transfers.spec.ts
```

### Test Coverage

| Module | Scenarios |
|---|---|
| **Auth** | Successful login, invalid credentials (structured error code assertion) |
| **Accounts** | Retrieve account list for an authenticated user |
| **Cards** | Successful debit card creation, duplicate card validation |
| **Transfers** | Successful transfer between own accounts (verified against transaction amount in response), negative/invalid amount validation |

**Not covered yet** (documented as future extension, as this project intentionally stayed scoped to demonstrate the core pattern before moving on):
- Fixed Terms, Loans, Bill Payments, Virtual Cards modules
- Additional transfer validation scenarios (insufficient balance, missing destination account)
- Schema validation (e.g. with a JSON schema validator) beyond individual field assertions

### Known Issues / Limitations

**Shared, stateful backend across test runs.** This mock API has no built-in test data isolation (e.g. no per-test database, no way to spin up a fresh account). The `/sistema/resetear` endpoint helps reset balances/state, but resources like cards persist as "already exists" once created. This is why the suite resets before each test and runs serially — documented above and in code comments, rather than worked around silently.

### CI/CD

Tests run automatically on every push to `main` via GitHub Actions. Results and HTML reports are available as workflow artifacts.

### Author

Leandro Carnibella — QA Engineer transitioning into test automation.

---

## Español

Framework de automatización de tests de API construido con **Playwright + TypeScript**, apuntando a la API mock de backend de una aplicación demo de homebanking ([homebanking-demo.onrender.com/docs](https://homebanking-demo.onrender.com/docs)).

Este proyecto complementa [`homebanking-automation-playwright`](https://github.com/lhcarnibella/homebanking-automation-playwright) (automatización de UI del mismo dominio), aplicando los mismos principios de arquitectura al testing de API: patrón de clientes (equivalente API de los Page Objects), fixtures personalizados, datos de test centralizados, e integración de CI/CD.

**Estado:** proyecto de aprendizaje mantenido activamente — módulos core cubiertos, con margen para crecer (Plazos Fijos, Préstamos, Pago de Servicios).

### Stack Tecnológico

- **Playwright** — testing de API vía `APIRequestContext`
- **TypeScript** — tipado estático
- **GitHub Actions** — pipeline de CI

### Arquitectura

```
api-clients/    -> API Clients (uno por grupo de endpoints: Auth, Cuentas, Tarjetas, Transferencias)
tests/          -> Specs de test, organizados por módulo
fixtures/       -> Contexto de request autenticado, con reset automático de backend por test
test-data/      -> Datos de test centralizados (usuarios, datos de tarjeta, códigos de error)
```

#### Decisiones de diseño clave

- **Patrón de API Client**: cada grupo de endpoints relacionados tiene su propia clase cliente que expone métodos que arman y ejecutan requests, replicando el Page Object Model usado en el proyecto de UI, pero sin ninguna preocupación de DOM/locators.
- **Fixture autenticado con reset automático**: el fixture `authenticatedRequest` hace login una vez por test y llama al endpoint `/sistema/resetear` de la API antes de ceder el control, asegurando que cada test arranque desde un estado de backend limpio y predecible — crítico para una API mock compartida y con estado, sin aislamiento de base de datos por test.
- **Códigos de error estructurados sobre mensajes de texto libre**: la API devuelve tanto un `mensaje` legible como un código semántico `error` (ej. `CUENTA_INVALIDA`, `YA_TIENE_TARJETA`). Las aserciones apuntan al código de error, más estable que aseverar sobre una redacción que podría cambiar sin un cambio real de comportamiento.
- **Ejecución serial (`workers: 1`)**: a diferencia del proyecto de UI, esta suite corre completamente en serie, tanto local como en CI. Los archivos de test interactúan con datos reales y compartidos de backend (el mismo puñado de cuentas), y correrlos en paralelo generó condiciones de carrera — ej., dos archivos de test creando una tarjeta de débito para la misma cuenta simultáneamente. Dado el tamaño del proyecto, priorizar confiabilidad sobre velocidad en paralelo fue la decisión pragmática. Esto está documentado inline como comentario en `playwright.config.ts`. También se mantiene un bloque `test.describe.serial()` en un archivo como referencia de cómo delimitar ejecución serial a nivel de suite, aunque actualmente sea redundante dado el `workers: 1` global.

### Cómo correr los tests

```bash
npm install
npx playwright install
npx playwright test
```

Correr una suite específica:
```bash
npx playwright test tests/transfers/transfers.spec.ts
```

### Cobertura de Tests

| Módulo | Escenarios |
|---|---|
| **Auth** | Login exitoso, credenciales inválidas (aserción de código de error estructurado) |
| **Cuentas** | Obtener listado de cuentas de un usuario autenticado |
| **Tarjetas** | Creación exitosa de tarjeta de débito, validación de tarjeta duplicada |
| **Transferencias** | Transferencia exitosa entre cuentas propias (verificada contra el monto de la transacción en la respuesta), validación de monto negativo/inválido |

**No cubierto aún** (documentado como extensión futura, ya que este proyecto se mantuvo intencionalmente acotado para demostrar el patrón core antes de continuar):
- Módulos de Plazos Fijos, Préstamos, Pago de Servicios, Tarjetas Virtuales
- Escenarios adicionales de validación de transferencias (saldo insuficiente, cuenta destino faltante)
- Validación de schema (ej. con un validador de JSON schema) más allá de aserciones de campos individuales

### Problemas Conocidos / Limitaciones

**Backend compartido y con estado entre corridas.** Esta API mock no tiene aislamiento de datos de test incorporado (ej. no hay base de datos por test, no hay forma de levantar una cuenta nueva). El endpoint `/sistema/resetear` ayuda a resetear saldos/estado, pero recursos como tarjetas persisten como "ya existe" una vez creados. Por eso la suite resetea antes de cada test y corre en serie — documentado arriba y en comentarios de código, en vez de resolverlo de forma silenciosa.

### CI/CD

Los tests corren automáticamente en cada push a `main` vía GitHub Actions. Los resultados y reportes HTML están disponibles como artifacts del workflow.

### Autor

Leandro Carnibella — QA Engineer en transición hacia automatización de tests.
