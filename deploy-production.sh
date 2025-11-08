#!/bin/bash

# RescueDAO Production Deployment Script
echo "🚀 RescueDAO - Preparando para Producción"

# Verificar Node.js version
echo "📋 Verificando versión de Node.js..."
node_version=$(node -v)
echo "Node.js: $node_version"

# Verificar npm version
npm_version=$(npm -v)
echo "NPM: $npm_version"

# Cambiar al directorio frontend
cd frontend

# Verificar variables de entorno
echo "🔧 Verificando variables de entorno..."
if [ -f .env.local ]; then
    echo "✅ Archivo .env.local encontrado"
    if grep -q "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID" .env.local; then
        echo "✅ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID configurado"
    else
        echo "❌ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID faltante en .env.local"
        exit 1
    fi
else
    echo "❌ Archivo .env.local no encontrado"
    echo "Crea el archivo .env.local con NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
    exit 1
fi

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf .next

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar build
echo "🔨 Construyendo aplicación..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    
    # Verificar archivos de build
    if [ -d ".next" ]; then
        echo "✅ Directorio .next generado"
        
        # Mostrar tamaño del build
        build_size=$(du -sh .next | cut -f1)
        echo "📊 Tamaño del build: $build_size"
        
        # Ejecutar en modo producción
        echo "🚀 Iniciando servidor de producción en puerto 3001..."
        PORT=3001 npm start
    else
        echo "❌ Error: Directorio .next no generado"
        exit 1
    fi
else
    echo "❌ Error en el build"
    exit 1
fi