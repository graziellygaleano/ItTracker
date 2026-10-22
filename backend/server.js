import {app} from './app.js'
import { configRede } from './config/serverConfig.js';


async function startServer() {
  try {

    app.listen(configRede.porta, configRede.host, () => {
      console.log(`Servidor rodando em: http://${configRede.host}:${configRede.porta}`);
      console.log(`Origens CORS aceitas:`, configRede.origensPermitidas);
    });

  } catch (error) {
    console.error('Falha ao inicializar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();