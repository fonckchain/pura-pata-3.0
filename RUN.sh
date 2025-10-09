#!/bin/bash

echo "🐕 Iniciando Pura Pata..."
echo ""

# Verificar si PostgreSQL está corriendo
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL no está corriendo en localhost:5432"
    echo ""
    echo "Opciones:"
    echo "1. Instalar PostgreSQL localmente"
    echo "2. O usar Docker: docker run --name pura-pata-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pura_pata -p 5432:5432 -d postgres:15"
    echo ""
    read -p "¿Quieres iniciar PostgreSQL con Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker run --name pura-pata-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pura_pata -p 5432:5432 -d postgres:15
        echo "⏳ Esperando a que PostgreSQL inicie..."
        sleep 5

        # Crear tablas
        echo "📊 Creando tablas..."
        PGPASSWORD=postgres psql -h localhost -U postgres -d pura_pata -f init.sql
    fi
else
    echo "✅ PostgreSQL está corriendo"

    # Verificar si la base de datos existe
    if ! PGPASSWORD=postgres psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw pura_pata; then
        echo "📊 Creando base de datos pura_pata..."
        PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE pura_pata;"
        PGPASSWORD=postgres psql -h localhost -U postgres -d pura_pata -f init.sql
    fi
fi

echo ""
echo "🚀 Iniciando servicios..."
echo ""

# Terminal 1: Backend
gnome-terminal --tab --title="Backend" -- bash -c "
cd backend
source venv/bin/activate
echo '🔧 Backend iniciando en http://localhost:8000'
echo '📖 API Docs: http://localhost:8000/docs'
echo ''
uvicorn app.main:app --reload
" &

# Esperar un poco
sleep 2

# Terminal 2: Frontend
gnome-terminal --tab --title="Frontend" -- bash -c "
cd frontend
echo '⚛️  Frontend iniciando en http://localhost:3000'
echo ''
npm run dev
" &

echo "✅ Servicios iniciados!"
echo ""
echo "📱 Abrir en el navegador:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Para detener: Ctrl+C en cada terminal"
