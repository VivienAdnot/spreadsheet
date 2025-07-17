/**
 * Grasp Google Workspace Add-on
 * Version publiable sur le Google Workspace Marketplace
 * 
 * ARCHITECTURE:
 * - Pas de HtmlService
 * - Pas de google.script.run
 * - Interface Vue.js dans un iframe
 * - Appels API REST uniquement
 */

/**
 * Fonction déclenchée à l'ouverture de l'add-on
 * Retourne la configuration pour afficher l'iframe
 */
function onHomepage(e) {
  console.log('🔥 Grasp Add-on ouvert dans:', e);
  
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('🔥 Grasp Add-on')
      .setSubtitle('Validation & Upload des données')
      .setImageUrl('https://www.gstatic.com/images/branding/product/1x/sheets_48dp.png')
      .setImageStyle(CardService.ImageStyle.CIRCLE)
    )
    .addSection(CardService.newCardSection()
      .setHeader('Interface principale')
      .addWidget(CardService.newTextParagraph()
        .setText('Cliquez sur le bouton ci-dessous pour ouvrir l\'interface Grasp.')
      )
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText('🚀 Ouvrir Grasp')
          .setOnClickAction(CardService.newAction()
            .setFunctionName('openGraspInterface')
          )
        )
      )
    )
    .addSection(CardService.newCardSection()
      .setHeader('Fonctionnalités')
      .addWidget(CardService.newTextParagraph()
        .setText('• Validation des données en temps réel\n• Upload vers l\'API Grasp\n• Règles de validation configurables\n• Interface moderne Vue.js')
      )
    )
    .build();
}

/**
 * Fonction appelée lors de l'ouverture du fichier
 */
function onFileScopeGranted(e) {
  console.log('📁 Accès au fichier accordé:', e);
  return onHomepage(e);
}

/**
 * Ouvre l'interface Grasp dans un nouvel onglet
 */
function openGraspInterface() {
  try {
    // Obtenir des informations sur le spreadsheet actuel
    const spreadsheetInfo = getCurrentSpreadsheetInfo();
    
    // Construire l'URL avec les paramètres
    const baseUrl = getAddonUrl();
    const params = new URLSearchParams({
      spreadsheetId: spreadsheetInfo.id,
      spreadsheetName: spreadsheetInfo.name,
      sheetName: spreadsheetInfo.activeSheet,
      mode: 'addon'
    });
    
    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    console.log('🌐 Ouverture de l\'interface:', fullUrl);
    
    // Ouvrir dans un nouvel onglet
    return CardService.newActionResponseBuilder()
      .setOpenLink(CardService.newOpenLink()
        .setUrl(fullUrl)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING)
      )
      .build();
      
  } catch (error) {
    console.error('❌ Erreur lors de l\'ouverture:', error);
    
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setType(CardService.NotificationType.ERROR)
        .setText('Erreur lors de l\'ouverture de l\'interface Grasp')
      )
      .build();
  }
}

/**
 * Obtient les informations du spreadsheet actuel
 */
function getCurrentSpreadsheetInfo() {
  try {
    // Dans un add-on, on ne peut pas toujours accéder directement à SpreadsheetApp
    // On utilise les informations du contexte ou des paramètres
    
    return {
      id: 'SPREADSHEET_ID_FROM_CONTEXT',
      name: 'Document actuel',
      activeSheet: 'Sheet1',
      url: 'https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit'
    };
    
  } catch (error) {
    console.error('❌ Impossible d\'obtenir les infos du spreadsheet:', error);
    
    return {
      id: 'unknown',
      name: 'Document inconnu',
      activeSheet: 'Sheet1',
      url: ''
    };
  }
}

/**
 * Retourne l'URL de l'interface add-on
 */
function getAddonUrl() {
  // En production, ce sera l'URL hébergée de votre interface
  // En développement, utilisez ngrok ou un serveur local
  
  const isProd = typeof PropertiesService !== 'undefined' && 
                 PropertiesService.getScriptProperties().getProperty('ENVIRONMENT') === 'production';
  
  if (isProd) {
    return 'https://grasp-addon.herokuapp.com'; // URL de production
  } else {
    return 'https://67151878f9cc.ngrok-free.app/addon'; // URL de développement
  }
}

/**
 * Fonction utilitaire pour les logs
 */
function logAddonEvent(event, data) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    event,
    data: data || {}
  };
  
  console.log('📊 Grasp Add-on Event:', JSON.stringify(logData));
  
  // En production, on pourrait envoyer les logs à un service d'analytics
  // sendToAnalytics(logData);
}

/**
 * Fonction de test pour vérifier le bon fonctionnement
 */
function testAddon() {
  console.log('🧪 Test de l\'add-on Grasp');
  
  try {
    const info = getCurrentSpreadsheetInfo();
    console.log('✅ Informations récupérées:', info);
    
    const url = getAddonUrl();
    console.log('✅ URL générée:', url);
    
    logAddonEvent('test', { success: true });
    
    return { success: true, message: 'Test réussi' };
    
  } catch (error) {
    console.error('❌ Test échoué:', error);
    logAddonEvent('test', { success: false, error: error.toString() });
    
    return { success: false, error: error.toString() };
  }
}
