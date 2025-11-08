#!/bin/bash

# Script de deploy para Stylus en Arbitrum Sepolia SIN Docker
echo "🚀 Iniciando deploy de contrato Stylus en Arbitrum Sepolia (sin Docker)..."

# Verificar que existe el archivo de clave privada
if [ ! -f "private_key.txt" ]; then
    echo "❌ Error: No se encuentra private_key.txt"
    echo "Por favor crea el archivo con tu clave privada (sin 0x):"
    echo "echo 'TU_CLAVE_PRIVADA' > private_key.txt"
    exit 1
fi

echo "🔍 Compilando contrato..."

# Deploy del contrato SIN Docker (más rápido)
cargo stylus deploy \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc \
  --private-key-path=./private_key.txt \
  --estimate-gas \
  --no-verify

echo "🎉 Deploy completado en Arbitrum Sepolia!"
echo "💡 Guarda la dirección del contrato que aparece arriba"
echo "💡 Puedes verificarlo en: https://sepolia.arbiscan.io/"