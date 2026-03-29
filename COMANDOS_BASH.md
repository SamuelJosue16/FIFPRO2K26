# 🔧 Comandos Bash - Referencia Rápida

## ⚠️ IMPORTANTE
Todos estos comandos deben ejecutarse en **Git Bash**. NO usar PowerShell ni CMD.

---

## 📦 Inicialización del Proyecto

### Backend
```bash
# Crear y entrar a carpeta backend
mkdir backend
cd backend

# Inicializar npm
npm init -y

# Instalar dependencias principales
npm install express prisma @prisma/client cors dotenv helmet express-validator

# Instalar dependencias de desarrollo
npm install -D nodemon

# Inicializar Prisma con SQLite
npx prisma init --datasource-provider sqlite

# Volver a raíz
cd ..
```

### Frontend
```bash
# Crear proyecto Vite con React
npm create vite@latest frontend -- --template react

# Entrar a frontend
cd frontend

# Instalar dependencias base
npm install

# Instalar TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar dependencias del proyecto
npm install @tanstack/react-query axios @emotion/react @emotion/styled framer-motion

# Instalar utilidades adicionales
npm install lucide-react react-router-dom

# Volver a raíz
cd ..
```

---

## 🗄️ Comandos Prisma

```bash
cd backend

# Generar Prisma Client después de modificar schema.prisma
npx prisma generate

# Crear migración (desarrollo)
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones (producción)
npx prisma migrate deploy

# Abrir Prisma Studio (interfaz visual de BD)
npx prisma studio

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset

# Ejecutar seed
npx prisma db seed

# Formatear schema.prisma
npx prisma format

cd ..
```

---

## 🚀 Ejecutar Proyectos

### Backend (Modo Desarrollo)
```bash
cd backend
npm run dev
# Server corriendo en http://localhost:3000
```

### Frontend (Modo Desarrollo)
```bash
cd frontend
npm run dev
# App corriendo en http://localhost:5173
```

### Ejecutar Ambos Simultáneamente
```bash
# Opción 1: Dos terminales Git Bash separadas
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# Opción 2: Usar && para encadenar (NO recomendado para desarrollo)
# cd backend && npm run dev & cd ../frontend && npm run dev
```

---

## 📁 Gestión de Archivos y Carpetas

```bash
# Crear carpeta
mkdir nombre_carpeta

# Crear múltiples carpetas anidadas
mkdir -p backend/src/controllers/players

# Crear archivo vacío
touch archivo.js

# Crear múltiples archivos
touch file1.js file2.js file3.js

# Listar contenido del directorio
ls
ls -la  # Con detalles y archivos ocultos

# Ver árbol de directorios (si está instalado tree)
tree
tree -L 2  # Solo 2 niveles de profundidad

# Cambiar directorio
cd nombre_carpeta
cd ..  # Subir un nivel
cd ~   # Ir a home
cd -   # Volver al directorio anterior

# Ver directorio actual
pwd

# Copiar archivo
cp origen.js destino.js

# Copiar carpeta recursivamente
cp -r carpeta_origen carpeta_destino

# Mover/Renombrar
mv origen.js destino.js
mv archivo.js nueva_carpeta/

# Eliminar archivo
rm archivo.js

# Eliminar carpeta (CUIDADO)
rm -rf carpeta_nombre

# Ver contenido de archivo
cat archivo.js
less archivo.js  # Navegable
head archivo.js  # Primeras líneas
tail archivo.js  # Últimas líneas
```

---

## 🔍 Búsqueda

```bash
# Buscar archivos por nombre
find . -name "*.js"
find src -name "Player*"

# Buscar texto dentro de archivos (grep)
grep "función" archivo.js
grep -r "import React" src/  # Recursivo en carpeta
grep -i "error" server.js    # Case insensitive
```

---

## 📝 Git Comandos

```bash
# Inicializar repositorio
git init

# Ver estado
git status

# Agregar archivos
git add .                    # Todos los archivos
git add archivo.js           # Archivo específico
git add src/                 # Carpeta específica

# Commit
git commit -m "mensaje del commit"
git commit -am "mensaje"     # Add + commit (solo tracked files)

# Ver historial
git log
git log --oneline
git log --graph --oneline --all

# Crear rama
git branch nombre_rama
git checkout -b nombre_rama  # Crear y cambiar

# Cambiar de rama
git checkout nombre_rama
git switch nombre_rama       # Comando más nuevo

# Merge
git merge nombre_rama

# Ver diferencias
git diff
git diff archivo.js
git diff --staged

# Deshacer cambios
git checkout -- archivo.js   # Deshacer cambios no staged
git reset HEAD archivo.js    # Unstage archivo
git reset --soft HEAD~1      # Deshacer último commit (mantiene cambios)
git reset --hard HEAD~1      # Deshacer último commit (BORRA cambios)

# Remoto
git remote add origin <url>
git push -u origin main
git pull origin main
git clone <url>

# Ver cambios remotos
git fetch
git remote -v

# Stash (guardar cambios temporalmente)
git stash
git stash pop
git stash list
git stash apply
```

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test
npm run test:watch  # Modo watch

# Frontend
cd frontend
npm test
npm run test:coverage  # Con coverage
```

---

## 🏗️ Build

```bash
# Frontend - Build para producción
cd frontend
npm run build
# Genera carpeta dist/

# Preview del build
npm run preview

# Backend - Si hay build script
cd backend
npm run build
```

---

## 🔧 Utilidades

```bash
# Ver versión de Node.js
node --version
node -v

# Ver versión de npm
npm --version
npm -v

# Limpiar caché de npm
npm cache clean --force

# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install

# Ver paquetes instalados
npm list
npm list --depth=0  # Solo primeros niveles

# Ver paquetes desactualizados
npm outdated

# Actualizar paquetes
npm update
npm install paquete@latest

# Ver scripts disponibles
npm run

# Ejecutar script con variables de entorno
NODE_ENV=production npm run build

# Ver procesos de Node corriendo
ps aux | grep node

# Matar proceso por puerto
npx kill-port 3000
```

---

## 📊 Análisis

```bash
# Ver tamaño de carpetas
du -sh */
du -sh node_modules/

# Contar líneas de código
find src -name "*.js" -o -name "*.jsx" | xargs wc -l

# Ver uso de disco
df -h
```

---

## 🌍 Variables de Entorno

```bash
# Ver variables de entorno
printenv
echo $PATH

# Exportar variable temporal
export NODE_ENV=development

# Usar en comando
NODE_ENV=production npm run build
```

---

## 🔐 Permisos (Si fuera necesario)

```bash
# Ver permisos
ls -la

# Cambiar permisos
chmod +x script.sh  # Hacer ejecutable
chmod 755 archivo
```

---

## 💡 Tips Útiles

```bash
# Limpiar terminal
clear
# O: Ctrl + L

# Abrir VS Code en carpeta actual
code .

# Abrir archivo en VS Code
code archivo.js

# Historial de comandos
history

# Repetir último comando
!!

# Repetir comando anterior con sudo
sudo !!

# Buscar en historial
# Ctrl + R y escribir

# Autocompletar
# Tab (una vez)
# Tab Tab (ver opciones)

# Cancelar comando
# Ctrl + C

# Salir de proceso
# Ctrl + D
```

---

## 🚨 Comandos de Emergencia

```bash
# Detener servidor que no responde
# Ctrl + C (en la terminal donde corre)

# Si no funciona, encontrar proceso
lsof -i :3000  # Ver qué usa el puerto 3000
kill -9 <PID>  # Matar proceso por ID

# Liberar puerto en Windows (desde Git Bash)
netstat -ano | findstr :3000
taskkill //PID <PID> //F

# Limpiar todo y empezar de nuevo
rm -rf node_modules package-lock.json
npm install
```

---

## 📌 Alias Útiles (Agregar a ~/.bashrc)

```bash
# Editar .bashrc
nano ~/.bashrc

# Agregar estas líneas:
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline'
alias npmr='npm run'
alias npmi='npm install'
alias cls='clear'
alias ..='cd ..'
alias ...='cd ../..'

# Recargar .bashrc
source ~/.bashrc
```

---

**Consultar este archivo cada vez que necesites ejecutar comandos por terminal.**
**RECORDATORIO: Solo Git Bash, nunca PowerShell ni CMD.**
