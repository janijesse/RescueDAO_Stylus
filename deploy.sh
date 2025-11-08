#!/bin/bash

# Script de deploy para Stylus
# Asegúrate de tener ETH en Arbitrum Sepolia en tu wallet

echo "🚀 Iniciando deploy de contrato Stylus..."

# Verificar que existe el archivo de clave privada
if [ ! -f "private_key.txt" ]; then
    echo "❌ Error: No se encuentra private_key.txt"
    echo "Por favor crea el archivo con tu clave privada (sin 0x):"
    echo "echo 'TU_CLAVE_PRIVADA' > private_key.txt"
    exit 1
fi

echo "🔍 Compilando contrato..."
cargo stylus check --endpoint=https://sepolia-rollup.arbitrum.io/rpc

if [ $? -ne 0 ]; then
    echo "❌ Error en compilación. Revisa los errores arriba."
    exit 1
fi

echo "✅ Contrato compilado exitosamente!"
echo "📡 Deploying a Arbitrum Sepolia..."

# Deploy del contrato
cargo stylus deploy \
  --endpoint=https://sepolia-rollup.arbitrum.io/rpc \
  --private-key-path=./private_key.txt \
  --estimate-gas

echo "🎉 Deploy completado!"
echo "💡 Guarda la dirección del contrato que aparece arriba"
echo "💡 Puedes verificarlo en: https://sepolia.arbiscan.io/"