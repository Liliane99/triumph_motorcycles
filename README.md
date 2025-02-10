# Triumph motorcycles
Cette application est un site de gestion de flotte pour les gestionnaires/concessionnaires (gestion des motos, locations, entretiens, incidents, etc).

Il a été conçu avec une structure qui respecte la clean architecture  + cqrs et event sourcing.

L'application tourne sous 2 technologie Backend (NestJs + Epress) et une technologie Frontend (react avec Next.Js). Les données sont stockés sur 2 bases de données ; SQL et NOSQL. 

Les données relatives aux Uses Cases de l'application sont sur Postgresql (SQL), tant dis que l'écriture de l'event sourcing se fait sur MongoDB (NOSQL)

L'application n'a pas été mise en production. 
Pour l'allumer en local, il faut : 
- Allumer les 2 Backend : 
```npm run start:nest``` & ```npm run start:express``` 
- Allumer le Frontend : 
```npm run dev```

URL NestJS  : http://localhost:4002.

URL Express : http://localhost:4001.

URL Frontend : http://localhost:3000.

## Partage de tâche: 

### Ines Hadidi 
- Trials CRUD (Front + Back).
- Dashboard Interface.
- Login (Front + Back).
- Sidebar.
- Users CRUD (Back + Front).
- Maintenance CRUD (Front + Back).
- Clients interface.
- Change password Interface.
- Orders Management (Front + Back).
- Role management (user, manager, admin).
- Spare parts CRUD (Back + Front).
- Mail Alert for low stock.
- Incidents CRUD (Front + Back).
- Motorcycle - Link front.
- Architectural structure.
- Docker.
- UML

### Liliane Mezani
- Motorcycle CRUD (Back + Front).
- Rental Crud (Back).
- Incident Crud (Back).
- Maintenance Crud (Back).
- Dashboard interface (motorcycle, rental, incidents)
- Navbar.
- About(client).
- Moto (client)
- Moto details (client).
- Trial(interface client).
- Alert mail maintenance intervall.
- Architectural strcture.
- UML.
- Schèma Clean archi + CQRS.

### Cheick Lanikpekoun
- Landing page.
- Profil interface.
- Trial interface(admin).
- Driver CRUD (Back)
- Link rental(Front)
- Link Driver.(Front+ back)
- Front architecture
- Navbar 

  ## Schèma clean archi , cqrs + event sourcing :

<img width="758" alt="Capture d’écran 2025-02-10 à 01 20 22" src="https://github.com/user-attachments/assets/a22a7d2b-25ac-4938-b890-7d6b0a6faeda" />

<img width="725" alt="Capture d’écran 2025-02-10 à 01 20 49" src="https://github.com/user-attachments/assets/5eb07248-e970-47d0-8e9a-b54e8e60769d" />

<img width="725" alt="Capture d’écran 2025-02-10 à 01 21 12" src="https://github.com/user-attachments/assets/d045c05f-8979-4bd0-a5ec-ac845b1faac1" />



## Login 

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 46 14" src="https://github.com/user-attachments/assets/efcb587c-c62d-4bfc-870a-6a2647544e31" />


## Landing page :

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 47 38" src="https://github.com/user-attachments/assets/1dcfed41-6e06-48b5-b02c-ba8bfdb664d7" />


## Moto 

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 48 11" src="https://github.com/user-attachments/assets/536228d0-4e82-4796-858a-75de12a183c6" />

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 48 39" src="https://github.com/user-attachments/assets/0941ffe8-9193-456f-afcf-41dd70473dcb" />

## Essai

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 48 53" src="https://github.com/user-attachments/assets/257967c9-67c7-47e9-b539-cae45ecf2569" />

## Apropos

<img width="1470" alt="Capture d’écran 2025-02-09 à 19 49 19" src="https://github.com/user-attachments/assets/8833ad5a-b98f-4b89-a257-1fd7d0848946" />

### Dashboard
<img width="1468" alt="Capture d’écran 2025-02-10 à 01 27 52" src="https://github.com/user-attachments/assets/457b7fda-4cfe-4cc7-a92f-ee4b93ef6bde" />

## Schéma CQRS :

  ![image](https://github.com/user-attachments/assets/0d458bd7-4c87-491f-8138-6f518cbc00b6)

