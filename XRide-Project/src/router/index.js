import { defineRouter } from '#q-app/wrappers';  // Importation spécifique à Quasar
import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router';  // Imports Vue Router
import routes from './routes';  // Importation des routes définies précédemment

/*
 * Le mode d'historique dépend de l'environnement de build.
 * On choisit un mode d'historique basé sur l'environnement (SSR ou non).
 * Si le serveur est activé, on utilise `createMemoryHistory`, sinon on choisit entre `createWebHistory` ou `createWebHashHistory`.
 */
export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory  // Utilisé en SSR (Server-Side Rendering)
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);  // Choix du mode d'historique

  // Configuration du routeur
  const Router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),  // Utilisation du mode d'historique choisi
    routes,  // Définition des routes
    scrollBehavior: () => ({ left: 0, top: 0 })  // Réinitialisation du scroll à chaque changement de route
  });

  return Router;
});
