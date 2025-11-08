/**
 * Script para limpiar protectoras de prueba del localStorage
 * Ejecutar en la consola del navegador
 */

function cleanupTestShelters() {
  console.log("🧹 Limpiando protectoras de prueba...");
  
  // Obtener configuración actual
  const saved = localStorage.getItem("donationSystemRoles");
  if (!saved) {
    console.log("❌ No se encontró configuración de roles");
    return;
  }
  
  try {
    const config = JSON.parse(saved);
    const originalCount = Object.keys(config.protectoras || {}).length;
    
    console.log(`📊 Protectoras encontradas: ${originalCount}`);
    
    // Filtrar protectoras válidas
    const validShelters = Object.fromEntries(
      Object.entries(config.protectoras || {}).filter(([address, info]) => {
        const name = info.nombre.toLowerCase();
        const isValid = !name.includes('refugio') && 
                       !name.includes('test') && 
                       !name.includes('demo') && 
                       !name.includes('ejemplo') &&
                       name !== 'protectora';
        
        if (!isValid) {
          console.log(`🗑️ Removiendo: ${info.nombre} (${address})`);
        }
        
        return isValid;
      })
    );
    
    // Actualizar configuración
    const newConfig = {
      ...config,
      protectoras: validShelters
    };
    
    localStorage.setItem("donationSystemRoles", JSON.stringify(newConfig));
    
    const newCount = Object.keys(validShelters).length;
    console.log(`✅ Limpieza completada!`);
    console.log(`📊 Protectoras restantes: ${newCount}`);
    console.log(`🗑️ Protectoras removidas: ${originalCount - newCount}`);
    
    if (newCount > 0) {
      console.log("\n📋 Protectoras válidas restantes:");
      Object.entries(validShelters).forEach(([address, info]) => {
        console.log(`  - ${info.nombre}: ${address}`);
      });
    }
    
    console.log("\n🔄 Recarga la página para ver los cambios");
    
  } catch (error) {
    console.error("❌ Error al limpiar protectoras:", error);
  }
}

// Ejecutar limpieza
cleanupTestShelters();