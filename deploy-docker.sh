#!/bin/bash

# Script de deploy para Stylus en Arbitrum Sepolia CON Docker
echo "🚀 Iniciando deploy de contrato Stylus en Arbitrum Sepolia..."

# Verificar que existe el archivo de clave privada
if [ ! -f "private_key.txt" ]; then
    echo "❌ Error: No se encuentra private_key.txt"
    echo "Por favor crea el archivo con tu clave privada (sin 0x):"
    echo "echo 'TU_CLAVE_PRIVADA' > private_key.txt"
    exit 1
fi

echo "🔍 Verificando Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose."
    echo "Por favor inicia Docker Desktop y vuelve a intentar."
    exit 1
fi

echo "✅ Docker está ejecutándose!"
echo "🔍 Compilando contrato..."

# Deploy del contrato CON Docker para reproducibilidad
cargo stylus deploy \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc \
  --private-key-path=./private_key.txt \
  --estimate-gas

echo "🎉 Deploy completado en Arbitrum Sepolia!"
echo "💡 Guarda la dirección del contrato que aparece arriba"
echo "💡 Puedes verificarlo en: https://sepolia.arbiscan.io/"