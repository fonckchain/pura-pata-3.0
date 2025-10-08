#!/bin/bash

echo "🐕 Instalando Pura Pata..."

# Frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Backend
echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo ""
echo "✅ Instalación completa!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configurar Supabase (ver QUICKSTART.md)"
echo "2. Copiar .env.example a .env en frontend y backend"
echo "3. Llenar las variables de entorno"
echo "4. Ejecutar: npm run dev en frontend/"
echo "5. Ejecutar: uvicorn app.main:app --reload en backend/"
echo ""
echo "📖 Ver QUICKSTART.md para más detalles"
